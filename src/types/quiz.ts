export interface Quiz {
  id: number
  slug: string
  title: string
  description: string
}

export interface Player {
  id: number
  name: string
  origin_id?: string
  team_id?: string
}

export interface Origin {
  id: number
  name: string
}

export interface Team {
  id: number
  team: string
  location: string
  abbreviation: string
}

export interface QuizQuestion {
  id: number
  player_id: number
  order_index: number
  players: Player & {
    origin: Origin
    team: Team
  }
}

export interface QuizData {
  quiz: Quiz
  questions: QuizQuestion[]
}
