/**
 * Supabase Edge Function: update-nba-rosters
 *
 * Syncs NBA player rosters from the BallDontLie API into the Supabase database.
 * Triggered weekly (Mondays at 4 AM EST / 9 AM UTC) via pg_cron + pg_net.
 *
 * To deploy:
 *   Copy this file's content to the Supabase Dashboard Edge Function editor,
 *   or use the Supabase CLI / MCP deploy tool.
 *
 * Key behaviors:
 *   - Existing players: only team_id, bdl_id, and is_active are updated.
 *     origin_id is NEVER overwritten, so manual corrections are always safe.
 *   - New players: origin resolved via scored fuzzy matching against the
 *     origins table. Ambiguous matches are logged for manual review.
 *   - Inactive players: soft-deleted (is_active = false) when they no longer
 *     appear in the BDL active response.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient, SupabaseClient } from "jsr:@supabase/supabase-js@2";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BDLPlayer {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  height: string;
  weight: string;
  jersey_number: string;
  college: string;
  country: string;
  draft_year: number | null;
  draft_round: number | null;
  draft_number: number | null;
  team: {
    id: number;
    conference: string;
    division: string;
    city: string;
    name: string;
    full_name: string;
    abbreviation: string;
  };
}

interface BDLResponse {
  data: BDLPlayer[];
  meta: { next_cursor?: number; per_page: number };
}

interface DBPlayer {
  id: number;
  name: string;
  team_id: number | null;
  origin_id: number | null;
  bdl_id: number | null;
  is_active: boolean;
}

interface Origin {
  id: number;
  name: string;
  type: number;
}

interface SyncError {
  type: string;
  message: string;
  details?: unknown;
}

interface AmbiguousOrigin {
  player: string;
  bdl_college: string;
  chosen: string;
  candidates: string[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BDL_BASE = "https://api.balldontlie.io/nba/v1";
const PAGE_SIZE = 100;

// ---------------------------------------------------------------------------
// BDL API – paginated fetch of all active players
// ---------------------------------------------------------------------------

async function fetchAllActivePlayers(apiKey: string): Promise<BDLPlayer[]> {
  const all: BDLPlayer[] = [];
  let cursor: number | undefined = 0;

  while (cursor !== undefined) {
    const url = `${BDL_BASE}/players/active?per_page=${PAGE_SIZE}&cursor=${cursor}`;
    const res = await fetch(url, { headers: { Authorization: apiKey } });

    if (!res.ok) {
      throw new Error(`BDL API ${res.status}: ${res.statusText}`);
    }

    const body: BDLResponse = await res.json();
    all.push(...body.data);
    cursor = body.meta.next_cursor;
  }

  return all;
}

// ---------------------------------------------------------------------------
// Name normalisation for fuzzy matching
// ---------------------------------------------------------------------------

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[.\-\u2018\u2019''`]/g, "") // strip periods, hyphens, curly/straight quotes
    .replace(/\s+/g, " ")
    .trim();
}

// ---------------------------------------------------------------------------
// Origin / college resolution
//
// NOTE: origin_id is ONLY set during initial player INSERT. The sync never
// updates origin_id for existing players, so manual corrections are safe.
// ---------------------------------------------------------------------------

/**
 * Score how well a candidate origin name matches the BDL college name.
 * Higher score = better match. Used to pick the best among ILIKE results.
 *
 * Scoring priorities (highest first):
 *  4 - Exact case-insensitive match ("Duke" == "Duke")
 *  3 - Origin is the "University of {college}" pattern
 *  2 - Origin name starts with the college name ("Arizona State University")
 *  1 - College name appears as a word boundary match in the origin
 *  0 - Generic contains match (fallback)
 *
 * Ties broken by shorter name (more specific).
 */
function scoreOriginMatch(originName: string, collegeName: string): number {
  const oLower = originName.toLowerCase();
  const cLower = collegeName.toLowerCase();

  // Exact match
  if (oLower === cLower) return 4;

  // "University of {college}" pattern — most common BDL shorthand
  // e.g. "Arizona" -> "University of Arizona", "Kentucky" -> "University of Kentucky"
  if (oLower.startsWith(`university of ${cLower}`)) return 3;

  // Origin starts with the college name
  // e.g. "Arizona State" -> "Arizona State University (ASU)"
  if (oLower.startsWith(cLower)) return 2;

  // Word-boundary match — college name appears as a distinct word
  const wordBoundary = new RegExp(
    `\\b${cLower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
  );
  if (wordBoundary.test(oLower)) return 1;

  // Generic contains
  return 0;
}

async function resolveOrigin(
  supabase: SupabaseClient,
  college: string | null,
  country: string | null,
  originsByName: Map<string, number>,
  cache: Map<string, number | null>,
  ambiguousMatches: AmbiguousOrigin[],
  playerName: string,
): Promise<number | null> {
  const collegeName = college?.trim() || null;
  const countryName = country?.trim() || null;

  // --- College path ---
  if (collegeName) {
    if (cache.has(collegeName)) return cache.get(collegeName)!;

    // 1. Exact match
    if (originsByName.has(collegeName)) {
      const id = originsByName.get(collegeName)!;
      cache.set(collegeName, id);
      return id;
    }

    // 2. Fuzzy ILIKE match ("Kentucky" -> "University of Kentucky")
    const { data: fuzzy } = await supabase
      .from("origins")
      .select("id, name")
      .eq("type", 1)
      .ilike("name", `%${collegeName}%`)
      .limit(10);

    if (fuzzy && fuzzy.length > 0) {
      const candidates = fuzzy as Origin[];

      // Score each candidate and pick the best
      const scored = candidates
        .map((c) => ({ ...c, score: scoreOriginMatch(c.name, collegeName) }))
        .sort((a, b) => {
          // Higher score first, then shorter name for ties
          if (b.score !== a.score) return b.score - a.score;
          return a.name.length - b.name.length;
        });

      const best = scored[0];

      // Flag ambiguous matches (multiple candidates with the same top score)
      const tiedCandidates = scored.filter((c) => c.score === best.score);
      if (tiedCandidates.length > 1 || candidates.length > 1) {
        ambiguousMatches.push({
          player: playerName,
          bdl_college: collegeName,
          chosen: best.name,
          candidates: scored.map((c) => `${c.name} (score=${c.score})`),
        });
        console.warn(
          `[sync] Ambiguous origin for "${playerName}": BDL college="${collegeName}" -> chose "${best.name}" from ${candidates.length} candidates: ${scored.map((c) => `"${c.name}"(${c.score})`).join(", ")}`,
        );
      }

      cache.set(collegeName, best.id);
      return best.id;
    }

    // 3. Create new college origin
    const { data: created } = await supabase
      .from("origins")
      .insert({ name: collegeName, type: 1 })
      .select("id")
      .single();

    const id = created?.id ?? null;
    cache.set(collegeName, id);
    return id;
  }

  // --- International player path (no college, non-USA country) ---
  if (countryName && countryName !== "USA") {
    if (cache.has(countryName)) return cache.get(countryName)!;

    if (originsByName.has(countryName)) {
      const id = originsByName.get(countryName)!;
      cache.set(countryName, id);
      return id;
    }

    const { data: match } = await supabase
      .from("origins")
      .select("id, name")
      .eq("type", 3)
      .ilike("name", `%${countryName}%`)
      .limit(1);

    if (match && match.length > 0) {
      cache.set(countryName, match[0].id);
      return match[0].id;
    }

    const { data: created } = await supabase
      .from("origins")
      .insert({ name: countryName, type: 3 })
      .select("id")
      .single();

    const id = created?.id ?? null;
    cache.set(countryName, id);
    return id;
  }

  return null;
}

// ---------------------------------------------------------------------------
// Resolve the BDL API key from env or request body
// ---------------------------------------------------------------------------

async function resolveBdlKey(req: Request): Promise<string | null> {
  // Prefer the secret/env variable (used by pg_cron automated runs)
  const fromEnv = Deno.env.get("BALLDONTLIE_API_KEY");
  if (fromEnv) return fromEnv;

  // Fallback: accept from request body (for manual/initial invocations)
  try {
    const body = await req.clone().json();
    if (body?.bdl_api_key) return body.bdl_api_key;
  } catch {
    /* not JSON or missing field */
  }

  return null;
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

Deno.serve(async (req: Request) => {
  const t0 = Date.now();

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const bdlKey = await resolveBdlKey(req);

  if (!bdlKey) {
    return jsonResponse(
      {
        error:
          'BALLDONTLIE_API_KEY not configured. Set as Edge Function secret or pass {"bdl_api_key": "..."} in request body.',
      },
      500,
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // -- Create sync-log row --------------------------------------------------
  const { data: logRow, error: logErr } = await supabase
    .from("sync_log")
    .insert({ status: "running" })
    .select("id")
    .single();

  if (logErr || !logRow) {
    return jsonResponse(
      { error: "Failed to create sync_log", details: logErr },
      500,
    );
  }

  const logId: number = logRow.id;
  const errors: SyncError[] = [];

  try {
    // 1. Fetch all active players from BDL ---------------------------------
    console.log("[sync] Fetching active players from BDL...");
    const activePlayers = await fetchAllActivePlayers(bdlKey);
    console.log(`[sync] Fetched ${activePlayers.length} active players`);

    // 2. Load lookup maps --------------------------------------------------
    const { data: teams } = await supabase
      .from("nba_teams")
      .select("id, abbreviation");
    const teamMap = new Map<string, number>();
    for (const t of teams ?? []) teamMap.set(t.abbreviation, t.id);

    const { data: origins } = await supabase
      .from("origins")
      .select("id, name, type");
    const originsByName = new Map<string, number>();
    for (const o of (origins ?? []) as Origin[])
      originsByName.set(o.name, o.id);

    const { data: dbPlayers } = await supabase
      .from("players")
      .select("id, name, team_id, origin_id, bdl_id, is_active");

    const playersByBdlId = new Map<number, DBPlayer>();
    const playersByName = new Map<string, DBPlayer>();
    for (const p of (dbPlayers ?? []) as DBPlayer[]) {
      if (p.bdl_id) playersByBdlId.set(p.bdl_id, p);
      if (p.name) playersByName.set(normalizeName(p.name), p);
    }

    console.log(
      `[sync] Maps loaded: ${teamMap.size} teams, ${originsByName.size} origins, ${(dbPlayers ?? []).length} DB players`,
    );

    // 3. Process each BDL active player ------------------------------------
    //
    // IMPORTANT: For existing players, the sync only updates team_id, bdl_id,
    // and is_active. It NEVER touches origin_id, so manual origin corrections
    // are always preserved.
    //
    const activeBdlIds = new Set<number>();
    const updates: Array<{
      id: number;
      team_id: number | null;
      bdl_id: number;
      is_active: true;
    }> = [];
    const inserts: Array<{
      name: string;
      team_id: number | null;
      origin_id: number | null;
      bdl_id: number;
      is_active: true;
    }> = [];
    const originCache = new Map<string, number | null>();
    const ambiguousOrigins: AmbiguousOrigin[] = [];
    const unmatchedBdl: string[] = []; // names of BDL players with no DB match

    for (const bp of activePlayers) {
      activeBdlIds.add(bp.id);
      const fullName = `${bp.first_name} ${bp.last_name}`;
      const normName = normalizeName(fullName);
      const teamId = teamMap.get(bp.team.abbreviation) ?? null;

      // Match: bdl_id first (fast), then normalised name
      const existing =
        playersByBdlId.get(bp.id) ?? playersByName.get(normName);

      if (existing) {
        // Only update team, bdl_id, and active status – NEVER origin_id
        const needsUpdate =
          existing.team_id !== teamId ||
          !existing.bdl_id ||
          existing.is_active !== true;

        if (needsUpdate) {
          updates.push({
            id: existing.id,
            team_id: teamId,
            bdl_id: bp.id,
            is_active: true,
          });
        }

        // Keep in-memory bdl_id up to date for deactivation logic
        if (!existing.bdl_id) {
          existing.bdl_id = bp.id;
          playersByBdlId.set(bp.id, existing);
        }
      } else {
        // New player – resolve origin and insert
        unmatchedBdl.push(`${fullName} (${bp.team.abbreviation})`);
        const originId = await resolveOrigin(
          supabase,
          bp.college,
          bp.country,
          originsByName,
          originCache,
          ambiguousOrigins,
          fullName,
        );
        inserts.push({
          name: fullName,
          team_id: teamId,
          origin_id: originId,
          bdl_id: bp.id,
          is_active: true,
        });
      }
    }

    // 4. Apply updates (team/bdl_id/is_active only – never origin) ---------
    console.log(`[sync] Applying ${updates.length} updates...`);
    let updatedCount = 0;
    for (const u of updates) {
      const { error } = await supabase
        .from("players")
        .update({ team_id: u.team_id, bdl_id: u.bdl_id, is_active: true })
        .eq("id", u.id);
      if (error) {
        errors.push({
          type: "update",
          message: `player id=${u.id}`,
          details: error,
        });
      } else {
        updatedCount++;
      }
    }

    // 5. Apply inserts (batches of 50) -------------------------------------
    console.log(`[sync] Inserting ${inserts.length} new players...`);
    let insertedCount = 0;
    for (let i = 0; i < inserts.length; i += 50) {
      const batch = inserts.slice(i, i + 50);
      const { error } = await supabase.from("players").insert(batch);
      if (error) {
        errors.push({
          type: "insert",
          message: `batch at index ${i}`,
          details: error,
        });
      } else {
        insertedCount += batch.length;
      }
    }

    // 6. Deactivate players not in active list -----------------------------
    console.log("[sync] Checking for players to deactivate...");
    const toDeactivate = ((dbPlayers ?? []) as DBPlayer[]).filter(
      (p) => p.bdl_id && !activeBdlIds.has(p.bdl_id) && p.is_active === true,
    );
    let deactivatedCount = 0;

    if (toDeactivate.length > 0) {
      const ids = toDeactivate.map((p) => p.id);
      const { error } = await supabase
        .from("players")
        .update({ is_active: false })
        .in("id", ids);
      if (error) {
        errors.push({
          type: "deactivate",
          message: `${ids.length} players`,
          details: error,
        });
      } else {
        deactivatedCount = ids.length;
      }
    }

    // Log unmatched DB players (have no bdl_id and weren't matched by name)
    const unmatchedDb = ((dbPlayers ?? []) as DBPlayer[])
      .filter((p) => !p.bdl_id && !activeBdlIds.has(p.bdl_id ?? -1))
      .map((p) => p.name);

    // 7. Log ambiguous origin matches for review ---------------------------
    if (ambiguousOrigins.length > 0) {
      console.warn(
        `[sync] ${ambiguousOrigins.length} ambiguous origin match(es) – review these for accuracy:`,
      );
      for (const a of ambiguousOrigins) {
        console.warn(
          `  ${a.player}: BDL college="${a.bdl_college}" -> "${a.chosen}" (candidates: ${a.candidates.join(", ")})`,
        );
      }
    }

    // 8. Finalise sync log -------------------------------------------------
    const elapsed = Date.now() - t0;
    await supabase
      .from("sync_log")
      .update({
        completed_at: new Date().toISOString(),
        players_updated: updatedCount,
        players_inserted: insertedCount,
        players_deactivated: deactivatedCount,
        errors: errors.length > 0 ? errors : [],
        status: errors.length > 0 ? "completed_with_errors" : "completed",
      })
      .eq("id", logId);

    const summary = {
      sync_log_id: logId,
      active_players_fetched: activePlayers.length,
      players_updated: updatedCount,
      players_inserted: insertedCount,
      players_deactivated: deactivatedCount,
      ambiguous_origins: ambiguousOrigins,
      unmatched_bdl_players: unmatchedBdl,
      unmatched_db_players: unmatchedDb,
      error_count: errors.length,
      elapsed_ms: elapsed,
    };
    console.log("[sync] Complete:", JSON.stringify(summary));
    return jsonResponse(summary);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[sync] Fatal:", msg);

    await supabase
      .from("sync_log")
      .update({
        completed_at: new Date().toISOString(),
        errors: [...errors, { type: "fatal", message: msg }],
        status: "failed",
      })
      .eq("id", logId);

    return jsonResponse({ error: msg, sync_log_id: logId }, 500);
  }
});

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      Connection: "keep-alive",
    },
  });
}
