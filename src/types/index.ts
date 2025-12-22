export type IntensityLevel = "mild" | "medium" | "intense";

export interface ActionCard {
  id: string;
  text: string;
  intensity: IntensityLevel;
  category?: string;
}

export interface GameState {
  players: Player[];
  currentPlayer: number;
  board: BoardTile[];
  lastRoll?: number;
  currentAction?: ActionCard;
  phase: "setup" | "playing" | "action" | "paused";
}

export interface Player {
  id: string;
  name: string;
  position: number;
  color: string;
}

export interface BoardTile {
  id: number;
  type: "normal" | "action" | "special";
  actionCardId?: string;
}
