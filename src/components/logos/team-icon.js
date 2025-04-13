// Import all team icons
import ATL from './atl'
import BKN from './bkn'
import BOS from './bos'
import CHA from './cha'
import CHI from './chi'
import CLE from './cle'
import DAL from './dal'
import DEN from './den'
import DET from './det'
import GSW from './gsw'
import HOU from './hou'
import IND from './ind'
import LAC from './lac'
import LAL from './lal'
import MEM from './mem'
import MIA from './mia'
import MIL from './mil'
import MIN from './min'
import NOP from './nop'
import NYK from './nyk'
import OKC from './okc'
import ORL from './orl'
import PHI from './phi'
import PHX from './phx'
import POR from './por'
import PropTypes from 'prop-types'
import React from 'react'
import SAC from './sac'
import SAS from './sas'
import TOR from './tor'
import UTA from './uta'
import WAS from './was'

// Define prop types for the icons
const iconPropTypes = {
  size: PropTypes.number,
}

// Apply prop types to all icons
Object.values({
  ATL,
  BKN,
  BOS,
  CHA,
  CHI,
  CLE,
  DAL,
  DEN,
  DET,
  GSW,
  HOU,
  IND,
  LAC,
  LAL,
  MEM,
  MIA,
  MIL,
  MIN,
  NOP,
  NYK,
  OKC,
  ORL,
  PHI,
  PHX,
  POR,
  SAC,
  SAS,
  TOR,
  UTA,
  WAS,
}).forEach((Icon) => {
  Icon.propTypes = iconPropTypes
})

// Create the IconMap using numeric IDs
export const TeamIcon = new Map([
  [1, BOS], // Boston Celtics
  [2, BKN], // Brooklyn Nets
  [3, NYK], // New York Knicks
  [4, PHI], // Philadelphia 76ers
  [5, TOR], // Toronto Raptors
  [6, CHI], // Chicago Bulls
  [7, CLE], // Cleveland Cavaliers
  [8, DET], // Detroit Pistons
  [9, IND], // Indiana Pacers
  [10, MIL], // Milwaukee Bucks
  [11, ATL], // Atlanta Hawks
  [12, CHA], // Charlotte Hornets
  [13, MIA], // Miami Heat
  [14, ORL], // Orlando Magic
  [15, WAS], // Washington Wizards
  [16, DEN], // Denver Nuggets
  [17, MIN], // Minnesota Timberwolves
  [18, OKC], // Oklahoma City Thunder
  [19, POR], // Portland Trail Blazers
  [20, UTA], // Utah Jazz
  [21, GSW], // Golden State Warriors
  [22, LAC], // Los Angeles Clippers
  [23, LAL], // Los Angeles Lakers
  [24, PHX], // Phoenix Suns
  [25, SAC], // Sacramento Kings
  [26, DAL], // Dallas Mavericks
  [27, HOU], // Houston Rockets
  [28, MEM], // Memphis Grizzlies
  [29, NOP], // New Orleans Pelicans
  [30, SAS], // San Antonio Spurs
])

// Export individual icons for direct usage
export {
  ATL,
  BKN,
  BOS,
  CHA,
  CHI,
  CLE,
  DAL,
  DEN,
  DET,
  GSW,
  HOU,
  IND,
  LAC,
  LAL,
  MEM,
  MIA,
  MIL,
  MIN,
  NOP,
  NYK,
  OKC,
  ORL,
  PHI,
  PHX,
  POR,
  SAC,
  SAS,
  TOR,
  UTA,
  WAS,
}
