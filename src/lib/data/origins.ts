const { COUNTRIES } = require('./countries')
const { G_LEAGUE_TEAMS } = require('./g-league')
const { NCAA_DIV_1_SCHOOLS } = require('./ncaa-schools')

const Origins = [...NCAA_DIV_1_SCHOOLS, ...G_LEAGUE_TEAMS, ...COUNTRIES].map((item) => ({
  value: item,
  label: item,
}))

module.exports = { Origins }
