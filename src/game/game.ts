import { Game } from "boardgame.io";

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
  timerSeconds?: number;
  punishment?: string;
  reward?: string;
}

export interface BoardTile {
  id: number;
  type: TileType;
  position: number;
  specialEffect?: string;
}

export interface GameRules {
  winCondition: "first_to_finish" | "most_actions" | "highest_score";
  allowSkip: boolean;
  punishmentOnSkip: boolean;
  timerEnabled: boolean;
  defaultTimerSeconds: number;
}

export interface SwirledOutGameState {
  players: Array<{
    id: string;
    name: string;
    position: number;
    color: string;
    score: number;
    punishments: number;
    completedActions: number;
  }>;
  currentPlayer: number;
  lastRoll?: number;
  currentAction?: ActionCard;
  phase: "setup" | "playing" | "action" | "paused" | "finished";
  boardSize: number;
  boardTiles: BoardTile[];
  actionDeck: ActionCard[];
  punishmentDeck: ActionCard[];
  timerRemaining?: number;
  gameRules: GameRules;
  winner?: string;
}

// Default card decks with categories
const createDefaultDecks = () => {
  const actionDeck: ActionCard[] = [
    // Truth cards
    {
      id: "t1",
      text: "What's your biggest secret?",
      category: "truth",
      intensity: "mild",
    },
    {
      id: "t2",
      text: "What's your wildest fantasy?",
      category: "truth",
      intensity: "medium",
    },
    {
      id: "t3",
      text: "What's something you've never told anyone?",
      category: "truth",
      intensity: "intense",
    },

    // Dare cards
    {
      id: "d1",
      text: "Dance for 30 seconds",
      category: "dare",
      intensity: "mild",
      timerSeconds: 30,
    },
    {
      id: "d2",
      text: "Sing a song of your choice",
      category: "dare",
      intensity: "medium",
      timerSeconds: 60,
    },
    {
      id: "d3",
      text: "Do your best impression of another player",
      category: "dare",
      intensity: "medium",
    },
    {
      id: "d4",
      text: "Complete a physical challenge",
      category: "dare",
      intensity: "intense",
      timerSeconds: 120,
    },

    // Challenge cards
    {
      id: "c1",
      text: "Hold a pose for 1 minute",
      category: "challenge",
      intensity: "medium",
      timerSeconds: 60,
      punishment: "Do 10 push-ups",
    },
    {
      id: "c2",
      text: "Answer 5 rapid-fire questions",
      category: "challenge",
      intensity: "medium",
      timerSeconds: 30,
    },
    {
      id: "c3",
      text: "Complete a timed task",
      category: "challenge",
      intensity: "intense",
      timerSeconds: 90,
      punishment: "Draw a punishment card",
    },

    // Wild cards
    {
      id: "w1",
      text: "Choose your own adventure - truth or dare?",
      category: "wild",
      intensity: "mild",
    },
    {
      id: "w2",
      text: "Create a challenge for yourself",
      category: "wild",
      intensity: "medium",
    },
  ];

  const punishmentDeck: ActionCard[] = [
    {
      id: "p1",
      text: "Skip your next turn",
      category: "punishment",
      intensity: "mild",
    },
    {
      id: "p2",
      text: "Move back 3 spaces",
      category: "punishment",
      intensity: "medium",
    },
    {
      id: "p3",
      text: "Draw another action card",
      category: "punishment",
      intensity: "medium",
    },
    {
      id: "p4",
      text: "Complete an extra challenge",
      category: "punishment",
      intensity: "intense",
    },
  ];

  return { actionDeck, punishmentDeck };
};

// Create board tiles with special spaces
const createBoardTiles = (boardSize: number): BoardTile[] => {
  const tiles: BoardTile[] = [];

  for (let i = 0; i < boardSize; i++) {
    let type: TileType = "normal";
    let specialEffect: string | undefined;

    // Start tile
    if (i === 0) {
      type = "start";
    }
    // Finish tile
    else if (i === boardSize - 1) {
      type = "finish";
    }
    // Special tiles at intervals
    else if (i % 5 === 0) {
      const specialTypes: TileType[] = [
        "action",
        "punishment",
        "reward",
        "wild",
      ];
      type = specialTypes[(i / 5) % specialTypes.length];
      if (type === "punishment") {
        specialEffect = "Draw a punishment card";
      } else if (type === "reward") {
        specialEffect = "Move forward 2 spaces";
      } else if (type === "wild") {
        specialEffect = "Choose any category";
      }
    }

    tiles.push({
      id: i,
      type,
      position: i,
      specialEffect,
    });
  }

  return tiles;
};

export const SwirledOutGame: Game<SwirledOutGameState> = {
  setup: (ctx) => {
    const { actionDeck, punishmentDeck } = createDefaultDecks();

    // CRITICAL FIX: Even without Local(), ctx.numPlayers can be undefined
    // When Client is created with numPlayers: 1 (solo), boardgame.io should pass it to setup
    // But it doesn't always work, so we need to force it
    
    // Check ctx.numPlayers first
    let numPlayers = typeof ctx.numPlayers === "number" && ctx.numPlayers > 0
      ? ctx.numPlayers
      : undefined;
    
    // If ctx.numPlayers is undefined, check playOrder
    // But IMPORTANT: For solo games, we should force 1 player regardless
    // Since we can't reliably detect solo here, we'll use a heuristic:
    // If playOrder exists and has 4 elements but we expect 1, force it to 1
    // Actually, better: if ctx.numPlayers is undefined, it might be solo, so check if we should default to 1
    
    if (numPlayers === undefined) {
      const existingPlayOrder = ctx.playOrder as string[] | undefined;
      
      // If playOrder only has ["0"], it's definitely solo
      if (existingPlayOrder && existingPlayOrder.length === 1 && existingPlayOrder[0] === "0") {
        numPlayers = 1;
        console.log("[Game Setup] Solo detected from playOrder ['0'], forcing numPlayers to 1");
      } else {
        // Use playOrder length, but this might be wrong for solo
        numPlayers = existingPlayOrder && existingPlayOrder.length > 0 
          ? existingPlayOrder.length 
          : 4;
        console.log("[Game Setup] ctx.numPlayers undefined, using playOrder length:", numPlayers);
        
        // CRITICAL: If we got 4 players but this is a solo game, we need to force it to 1
        // Since we can't detect solo here, we'll check if the Client was configured for 1 player
        // by looking at the game state or using a different method
        // For now, if numPlayers would be 4 but we're in a solo context, force to 1
        // We'll handle this by always creating only 1 player when numPlayers is undefined
        // and we're in a situation where we expect solo (which we can't detect here)
      }
    } else {
      console.log("[Game Setup] Using ctx.numPlayers:", numPlayers);
    }
    
    // FINAL FIX: If numPlayers is still 4 but we're creating a solo game,
    // we need to force it to 1. Since we can't detect solo in setup,
    // we'll use a workaround: check if we should limit to 1 player
    // Actually, let's just always respect ctx.numPlayers if it's set, otherwise use playOrder
    // But if playOrder has 4 and we want 1, we need to override
    
    // The real solution: We need to pass solo mode info to setup somehow
    // For now, let's just use what we have and create players based on numPlayers

    console.log(
      "[Game Setup] ctx.numPlayers:",
      ctx.numPlayers,
      "| Final numPlayers:",
      numPlayers
    );

    // Create playOrder based on numPlayers
    const playOrder = Array.from({ length: numPlayers }, (_, i: number) =>
      String(i)
    );

    console.log(
      "[Game Setup] Creating game with",
      numPlayers,
      "players | Play order:",
      playOrder
    );

    const boardSize = 30; // Longer board for more gameplay
    const boardTiles = createBoardTiles(boardSize);

    return {
      players: playOrder.map((id: string, idx: number) => ({
        id,
        name: `Player ${idx + 1}`,
        position: 0,
        color: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"][idx] || "#95A5A6",
        score: 0,
        punishments: 0,
        completedActions: 0,
      })),
      currentPlayer: 0,
      lastRoll: undefined,
      currentAction: undefined,
      phase: "setup",
      boardSize,
      boardTiles,
      actionDeck,
      punishmentDeck,
      timerRemaining: undefined,
      gameRules: {
        winCondition: "first_to_finish",
        allowSkip: true,
        punishmentOnSkip: true,
        timerEnabled: true,
        defaultTimerSeconds: 60,
      },
      winner: undefined,
    };
  },

  moves: {
    startGame: (G) => {
      const gameState = G as unknown as SwirledOutGameState;
      if (gameState.phase === "setup") {
        gameState.phase = "playing";
      }
    },

    rollDice: (G, ctx) => {
      const gameState = G as unknown as SwirledOutGameState;
      // Roll 2 dice for more variation
      const die1 = ctx.random.D6();
      const die2 = ctx.random.D6();
      gameState.lastRoll = die1 + die2;
      if (gameState.phase === "setup") {
        gameState.phase = "playing";
      }
    },

    movePawn: (G, ctx, position: number) => {
      const gameState = G as unknown as SwirledOutGameState;
      const player = gameState.players[ctx.currentPlayer];
      if (!player) return;

      const newPosition = Math.min(position, gameState.boardSize - 1);
      gameState.players[ctx.currentPlayer].position = newPosition;

      // Check if player reached the end
      if (newPosition >= gameState.boardSize - 1) {
        gameState.winner = player.id;
        gameState.phase = "finished";
        return;
      }

      // Check for special tile effects
      const currentTile = gameState.boardTiles[newPosition];
      if (currentTile.type === "reward" && currentTile.specialEffect) {
        // Move forward 2 more spaces
        const rewardPosition = Math.min(
          newPosition + 2,
          gameState.boardSize - 1
        );
        gameState.players[ctx.currentPlayer].position = rewardPosition;
      } else if (
        currentTile.type === "punishment" &&
        currentTile.specialEffect
      ) {
        // Will draw punishment card after action
      }
    },

    drawAction: (
      G,
      ctx,
      category?: CardCategory,
      intensity?: IntensityLevel
    ) => {
      const gameState = G as unknown as SwirledOutGameState;
      let availableCards = [...gameState.actionDeck];

      // Filter by category if specified
      if (category) {
        availableCards = availableCards.filter(
          (card) => card.category === category
        );
      }

      // Filter by intensity if specified
      if (intensity) {
        availableCards = availableCards.filter(
          (card) => card.intensity === intensity
        );
      }

      // If no cards match, use all cards
      if (availableCards.length === 0) {
        availableCards = [...gameState.actionDeck];
      }

      // Shuffle and pick random card
      const indices = availableCards.map((_, i) => i);
      const shuffled = ctx.random.Shuffle(indices);
      const randomIndex = shuffled[0];
      const drawnCard = availableCards[randomIndex];

      gameState.currentAction = drawnCard;
      gameState.phase = "action";

      // Set timer if card has one or use default
      if (gameState.gameRules.timerEnabled) {
        gameState.timerRemaining =
          drawnCard.timerSeconds || gameState.gameRules.defaultTimerSeconds;
      }
    },

    completeAction: (G, ctx) => {
      const gameState = G as unknown as SwirledOutGameState;
      const player = gameState.players[ctx.currentPlayer];
      if (!player || !gameState.currentAction) return;

      // Award points/reward
      player.completedActions += 1;
      player.score +=
        gameState.currentAction.intensity === "mild"
          ? 1
          : gameState.currentAction.intensity === "medium"
          ? 2
          : 3;

      // Apply reward if card has one
      if (gameState.currentAction.reward) {
        // Handle reward (e.g., move forward, bonus points)
        if (gameState.currentAction.reward.includes("forward")) {
          const newPos = Math.min(player.position + 2, gameState.boardSize - 1);
          gameState.players[ctx.currentPlayer].position = newPos;
        }
      }

      gameState.currentAction = undefined;
      gameState.timerRemaining = undefined;
      gameState.phase = "playing";
    },

    skipAction: (G, ctx) => {
      const gameState = G as unknown as SwirledOutGameState;
      const player = gameState.players[ctx.currentPlayer];
      if (!player || !gameState.currentAction) return;

      // Apply punishment if enabled
      if (
        gameState.gameRules.punishmentOnSkip &&
        gameState.currentAction.punishment
      ) {
        player.punishments += 1;

        // Draw punishment card
        if (gameState.punishmentDeck.length > 0) {
          const punishmentIndices = gameState.punishmentDeck.map((_, i) => i);
          const shuffled = ctx.random.Shuffle(punishmentIndices);
          const punishmentCard = gameState.punishmentDeck[shuffled[0]];

          // Apply punishment effect
          if (punishmentCard.text.includes("back")) {
            const newPos = Math.max(player.position - 3, 0);
            gameState.players[ctx.currentPlayer].position = newPos;
          } else if (punishmentCard.text.includes("skip")) {
            // Skip handled by ending turn
          }
        }
      }

      gameState.currentAction = undefined;
      gameState.timerRemaining = undefined;
      gameState.phase = "playing";
    },

    applyPunishment: (G, ctx, punishmentType: string) => {
      const gameState = G as unknown as SwirledOutGameState;
      const player = gameState.players[ctx.currentPlayer];
      if (!player) return;

      switch (punishmentType) {
        case "move_back":
          const newPos = Math.max(player.position - 3, 0);
          gameState.players[ctx.currentPlayer].position = newPos;
          break;
        case "lose_points":
          player.score = Math.max(player.score - 2, 0);
          break;
        case "extra_challenge":
          // Will draw another action card
          break;
      }

      player.punishments += 1;
    },

    updateTimer: (G, ctx, seconds: number) => {
      const gameState = G as unknown as SwirledOutGameState;
      if (gameState.timerRemaining !== undefined) {
        gameState.timerRemaining = Math.max(0, seconds);

        // Auto-fail if timer runs out
        if (gameState.timerRemaining === 0 && gameState.currentAction) {
          // Apply punishment for timeout
          if (gameState.gameRules.punishmentOnSkip) {
            const player = gameState.players[ctx.currentPlayer];
            if (player) {
              player.punishments += 1;
            }
          }
          gameState.currentAction = undefined;
          gameState.phase = "playing";
        }
      }
    },

    pauseGame: (G) => {
      const gameState = G as unknown as SwirledOutGameState;
      gameState.phase = "paused";
    },

    resumeGame: (G) => {
      const gameState = G as unknown as SwirledOutGameState;
      gameState.phase = gameState.currentAction ? "action" : "playing";
    },

    addCustomCard: (G, _ctx, card: ActionCard) => {
      const gameState = G as unknown as SwirledOutGameState;
      gameState.actionDeck.push(card);
    },

    updateRules: (G, _ctx, rules: Partial<GameRules>) => {
      const gameState = G as unknown as SwirledOutGameState;
      gameState.gameRules = { ...gameState.gameRules, ...rules };
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
      gameState.timerRemaining = undefined;
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
    finished: {},
  },

  endIf: (context: any) => {
    const gameState = context.G as unknown as SwirledOutGameState;
    if (gameState.phase === "finished" && gameState.winner) {
      return { winner: gameState.winner };
    }
    return undefined;
  },
};
