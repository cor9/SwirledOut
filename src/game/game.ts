import { Game } from "boardgame.io";

export interface SwirledOutGameState {
  players: Array<{
    id: string;
    name: string;
    position: number;
    color: string;
  }>;
  currentPlayer: number;
  lastRoll?: number;
  currentAction?: {
    id: string;
    text: string;
    intensity: "mild" | "medium" | "intense";
  };
  phase: "setup" | "playing" | "action" | "paused";
  boardSize: number;
  actionDeck: Array<{
    id: string;
    text: string;
    intensity: "mild" | "medium" | "intense";
  }>;
}

export const SwirledOutGame: Game<SwirledOutGameState> = {
  setup: (ctx) => {
    // Default action deck - users can customize
    const defaultDeck: SwirledOutGameState["actionDeck"] = [
      { id: "1", text: "Give a compliment", intensity: "mild" },
      { id: "2", text: "Share a secret", intensity: "mild" },
      { id: "3", text: "Truth or dare (mild)", intensity: "mild" },
      { id: "4", text: "Dance for 30 seconds", intensity: "medium" },
      { id: "5", text: "Sing a song", intensity: "medium" },
      { id: "6", text: "Truth or dare (medium)", intensity: "medium" },
      { id: "7", text: "Intense challenge", intensity: "intense" },
      { id: "8", text: "Advanced dare", intensity: "intense" },
    ];

    const playOrder = ctx.playOrder as string[];
    return {
      players: playOrder.map((id: string, idx: number) => ({
        id,
        name: `Player ${idx + 1}`,
        position: 0,
        color: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"][idx] || "#95A5A6",
      })),
      currentPlayer: 0,
      lastRoll: undefined,
      currentAction: undefined,
      phase: "setup",
      boardSize: 20,
      actionDeck: defaultDeck,
    };
  },

  moves: {
    rollDice: (G, ctx) => {
      const gameState = G as unknown as SwirledOutGameState;
      gameState.lastRoll = ctx.random.D6();
      gameState.phase = "playing";
    },

    movePawn: (G, ctx, position: number) => {
      const gameState = G as unknown as SwirledOutGameState;
      const player = gameState.players[ctx.currentPlayer];
      if (!player) return;

      const newPosition = Math.min(position, gameState.boardSize - 1);
      gameState.players[ctx.currentPlayer].position = newPosition;
    },

    drawAction: (G, ctx, intensity?: "mild" | "medium" | "intense") => {
      const gameState = G as unknown as SwirledOutGameState;
      let availableCards = [...gameState.actionDeck];

      if (intensity) {
        availableCards = gameState.actionDeck.filter(
          (card) => card.intensity === intensity
        );
      }

      if (availableCards.length === 0) {
        availableCards = [...gameState.actionDeck];
      }

      const indices = availableCards.map((_, i) => i);
      const shuffled = ctx.random.Shuffle(indices);
      const randomIndex = shuffled[0];
      const drawnCard = availableCards[randomIndex];

      gameState.currentAction = drawnCard;
      gameState.phase = "action";
    },

    skipAction: (G) => {
      const gameState = G as unknown as SwirledOutGameState;
      gameState.currentAction = undefined;
      gameState.phase = "playing";
    },

    pauseGame: (G) => {
      const gameState = G as unknown as SwirledOutGameState;
      gameState.phase = "paused";
    },

    resumeGame: (G) => {
      const gameState = G as unknown as SwirledOutGameState;
      gameState.phase = gameState.currentAction ? "action" : "playing";
    },
  },

  turn: {
    order: {
      first: () => 0,
      next: (context: any) =>
        (context.ctx.playOrderPos + 1) % context.ctx.numPlayers,
    },
    onBegin: (context: any) => {
      const gameState = context.G as unknown as SwirledOutGameState;
      gameState.currentPlayer = context.ctx.playOrderPos;
      gameState.lastRoll = undefined;
      gameState.currentAction = undefined;
      gameState.phase = "playing";
    },
  },

  phases: {
    setup: {
      start: true,
      next: "playing",
    },
    playing: {
      next: "action",
    },
    action: {
      next: "playing",
    },
    paused: {},
  },
};
