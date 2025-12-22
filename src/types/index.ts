export type IntensityLevel = "mild" | "medium" | "intense";
export type CardCategory =
  | "truth"
  | "dare"
  | "challenge"
  | "punishment"
  | "reward"
  | "wild";
export type TileType =
  | "normal"
  | "action"
  | "punishment"
  | "reward"
  | "wild"
  | "start"
  | "finish";

export interface ActionCard {
  id: string;
  text: string;
  intensity: IntensityLevel;
  category: CardCategory;
  timerSeconds?: number; // Optional timer for timed challenges
  punishment?: string; // What happens if failed/skipped
  reward?: string; // What happens if completed
}

export interface BoardTile {
  id: number;
  type: TileType;
  position: number;
  actionCardId?: string;
  specialEffect?: string;
}

export interface Player {
  id: string;
  name: string;
  position: number;
  color: string;
  score: number;
  punishments: number;
  completedActions: number;
}

export interface GameState {
  players: Player[];
  currentPlayer: number;
  board: BoardTile[];
  lastRoll?: number;
  currentAction?: ActionCard;
  phase: "setup" | "playing" | "action" | "paused" | "finished";
  boardSize: number;
  actionDeck: ActionCard[];
  punishmentDeck: ActionCard[];
  timerRemaining?: number; // Seconds remaining on current action timer
  gameRules: GameRules;
}

export interface GameRules {
  winCondition: "first_to_finish" | "most_actions" | "highest_score";
  allowSkip: boolean;
  punishmentOnSkip: boolean;
  timerEnabled: boolean;
  defaultTimerSeconds: number;
}
