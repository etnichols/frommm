# From Game

A quiz game that tests your knowledge of where NBA players went to college. Built with Next.js, Supabase, and deployed on Vercel.

**Live at [from-game.com](https://from-game.com)**

## Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS, Radix UI
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel
- **Data Source:** [BallDontLie API](https://www.balldontlie.io) (All-Star tier)

## Database Schema

### `players`

The core table. Each row is an NBA player linked to a team and an origin (college/country).

| Column | Type | Description |
|---|---|---|
| `id` | bigint (PK) | Auto-generated ID |
| `name` | text | Full player name (e.g., "LeBron James") |
| `team_id` | bigint (FK) | References `nba_teams.id` |
| `origin_id` | bigint (FK) | References `origins.id` (college, G-League team, or country) |
| `is_active` | boolean | `true` if currently on an NBA roster, `false` if retired/waived |
| `bdl_id` | integer (unique) | BallDontLie API player ID, used for stable sync matching |
| `created_at` | timestamptz | Row creation timestamp |

### `nba_teams`

All 30 NBA teams.

| Column | Type | Description |
|---|---|---|
| `id` | bigint (PK) | Auto-generated ID |
| `team` | text | Team name (e.g., "Lakers") |
| `location` | text | City (e.g., "Los Angeles") |
| `abbreviation` | text | 3-letter code (e.g., "LAL") |
| `conference` | smallint | Conference ID |
| `division` | integer | Division ID |

### `origins`

Where a player came from before the NBA. Three types:

| `type` | Category | Count | Example |
|---|---|---|---|
| 1 | College | ~604 | "University of Kentucky" |
| 2 | G-League | ~32 | "G League Ignite" |
| 3 | Country | ~196 | "France" |

### `quizzes` / `quiz_questions`

Admin-created quizzes. Each quiz has ordered questions, each referencing a `player_id`. The user guesses the player's origin.

### `sync_log`

Tracks every run of the nightly roster sync.

| Column | Type | Description |
|---|---|---|
| `id` | bigint (PK) | Auto-generated ID |
| `started_at` | timestamptz | When the sync began |
| `completed_at` | timestamptz | When the sync finished |
| `players_updated` | integer | Players whose team or status changed |
| `players_inserted` | integer | New players added |
| `players_deactivated` | integer | Players marked inactive |
| `errors` | jsonb | Array of error objects (empty on success) |
| `status` | text | `running`, `completed`, `completed_with_errors`, or `failed` |

## Nightly Roster Sync

Player rosters are kept up to date automatically via a Supabase Edge Function triggered by `pg_cron`.

### How it works

```
pg_cron (daily at 4 AM EST / 9 AM UTC)
  -> pg_net HTTP POST
    -> Edge Function: update-nba-rosters
      -> BallDontLie API: GET /nba/v1/players/active (paginated)
      -> Supabase DB: match, upsert, deactivate
```

1. **Fetch**: The Edge Function pages through BallDontLie's `/nba/v1/players/active` endpoint (100 per page, ~517 active players).
2. **Match**: Each BDL player is matched to an existing DB row by `bdl_id` (fast path) or by normalized name (fallback).
3. **Update**: If a player's team changed (trade/free agency), `team_id` is updated. New players are inserted with college/origin resolved via fuzzy ILIKE matching.
4. **Deactivate**: Any DB player with a `bdl_id` that no longer appears in the active response is marked `is_active = false`.
5. **Log**: Results are written to `sync_log` for observability.

### Key design decisions

- **Soft deletes**: Inactive players are marked `is_active = false` rather than deleted, preserving existing quiz question references.
- **`bdl_id` for stable matching**: After initial name-based reconciliation, all future syncs use the BallDontLie player ID for reliable matching across name changes.
- **College name resolution**: BDL uses short names ("Kentucky") while the DB uses full names ("University of Kentucky"). The Edge Function resolves this with a fuzzy ILIKE chain and caches mappings in-memory per run.
- **Idempotency**: The function is safe to run multiple times. Re-running produces zero changes if the data hasn't changed.

### Monitoring

Check recent sync history:

```sql
SELECT * FROM sync_log ORDER BY id DESC LIMIT 10;
```

### Configuration

- **Edge Function secret**: `BALLDONTLIE_API_KEY` -- set in Supabase Dashboard > Edge Functions > Secrets
- **Cron schedule**: `0 9 * * *` (4 AM EST) -- managed via `pg_cron` extension
- **API tier**: BallDontLie All-Star ($9.99/mo) -- required for the `/players/active` endpoint

### Deploying from source

The Edge Function source lives in `supabase/functions/update-nba-rosters/index.ts` and can be deployed via the Supabase CLI:

```bash
# Install the CLI (if not already)
npm install -g supabase

# Link to the project (one-time setup)
supabase login
supabase link --project-ref gecdensakhrfjswvzspp

# Deploy the function
supabase functions deploy update-nba-rosters
```

After deploying, ensure the `BALLDONTLIE_API_KEY` secret is set:

```bash
supabase secrets set BALLDONTLIE_API_KEY=your-key-here
```
