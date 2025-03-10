import { COUNTRIES } from './countries'
import { G_LEAGUE_TEAMS } from './g-league'
import { NCAA_DIV_1_SCHOOLS } from './ncaa-schools'

export const AutoCompleteValues = [...NCAA_DIV_1_SCHOOLS, ...G_LEAGUE_TEAMS, ...COUNTRIES].map(
  (item) => ({ value: item, label: item }),
)
