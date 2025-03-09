import { COUNTRIES } from "./countries";
import { G_LEAGUE_TEAMS } from "./g-league";
import { NCAA_DIV_1_SCHOOLS } from "./ncaa-schools";

export const ComboBoxValues = NCAA_DIV_1_SCHOOLS.concat(G_LEAGUE_TEAMS)
  .concat(COUNTRIES)
  .map((item) => ({value: item, label: item}));
