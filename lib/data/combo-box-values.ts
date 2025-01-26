import { G_LEAGUE_TEAMS } from "./g-league";

import { NCAA_DIV_1_SCHOOLS } from "./ncaa-schools";

import { COUNTRIES } from "./countries";

export const ComboBoxValues = NCAA_DIV_1_SCHOOLS.concat(G_LEAGUE_TEAMS)
  .concat(COUNTRIES)
  .map((item) => [item, item]);
