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
  actionCardId?: string;
  specialEffect?: string;
}

export interface GameRules {
  winCondition: "first_to_finish" | "most_actions" | "highest_score";
  allowSkip: boolean;
  punishmentOnSkip: boolean;
  timerEnabled: boolean;
  defaultTimerSeconds: number;
}

export interface GameEvent {
  id: string;
  timestamp: number;
  type: "roll" | "move" | "action" | "complete" | "skip" | "punishment" | "reward";
  playerId: string;
  playerName: string;
  message: string;
  data?: any;
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
  activityLog: GameEvent[];
}

// Default card decks with categories
const createDefaultDecks = () => {
  const actionDeck: ActionCard[] = [
    // Bating cards (detailed instructions)
    {
      id: "b1",
      text: "30 slow touches to your (genital)",
      category: "dare",
      intensity: "mild",
      timerSeconds: 30,
    },
    {
      id: "b2",
      text: "Time your touches with your breathing until your next turn",
      category: "dare",
      intensity: "mild",
    },
    {
      id: "b3",
      text: "Touch as fast as you can for 30 seconds",
      category: "dare",
      intensity: "medium",
      timerSeconds: 30,
    },
    {
      id: "b4",
      text: "Alternate between fast and slow touches until another Bating action",
      category: "dare",
      intensity: "medium",
    },
    {
      id: "b5",
      text: "Stimulate yourself until your next turn while using your other hand on an erogenous zone",
      category: "dare",
      intensity: "medium",
    },
    {
      id: "b6",
      text: "Use two fingers and focus on sensitive areas of your (genital)",
      category: "dare",
      intensity: "medium",
    },
    {
      id: "b7",
      text: "Perform a kegel with every touch until your next turn",
      category: "dare",
      intensity: "medium",
    },
    {
      id: "b8",
      text: "Experiment with different touches and pressures while masturbating",
      category: "dare",
      intensity: "medium",
    },
    {
      id: "b9",
      text: "Touch with your non-dominant hand",
      category: "dare",
      intensity: "mild",
    },
    {
      id: "b10",
      text: "Play with your (genital)",
      category: "dare",
      intensity: "mild",
    },
    {
      id: "b11",
      text: "Spit on your (genital)",
      category: "dare",
      intensity: "medium",
    },
    {
      id: "b12",
      text: "30 firm squeezes to your (genital)",
      category: "dare",
      intensity: "medium",
      timerSeconds: 30,
    },
    {
      id: "b13",
      text: "Touch your (genital) with a circular motion",
      category: "dare",
      intensity: "mild",
    },
    {
      id: "b14",
      text: "Edge with your non-dominant hand",
      category: "dare",
      intensity: "medium",
    },
    {
      id: "b15",
      text: "Shift positions (stand, kneel, sit) while edging yourself",
      category: "dare",
      intensity: "medium",
    },
    {
      id: "b16",
      text: "Bring yourself to the edge",
      category: "dare",
      intensity: "intense",
    },
    {
      id: "b17",
      text: "Get to the edge as fast as possible",
      category: "dare",
      intensity: "intense",
    },
    {
      id: "b18",
      text: "Get to the edge twice",
      category: "dare",
      intensity: "intense",
    },
    {
      id: "b19",
      text: "Edge using only a few fingers",
      category: "dare",
      intensity: "medium",
    },
    {
      id: "b20",
      text: "Edge using your whole hand",
      category: "dare",
      intensity: "medium",
    },
    {
      id: "b21",
      text: "Practice breath control by holding your breath while edging",
      category: "dare",
      intensity: "intense",
    },
    {
      id: "b22",
      text: "Rapidly stimulate to the edge, then hold a kegel as long as possible",
      category: "dare",
      intensity: "intense",
    },
    {
      id: "b23",
      text: "Touch yourself as quickly as you can until your next turn",
      category: "dare",
      intensity: "medium",
    },
    {
      id: "b24",
      text: "Touch yourself below your (genital) while edging",
      category: "dare",
      intensity: "medium",
    },

    // Tit Torture cards
    {
      id: "tt1",
      text: "Hit 5 seconds. Hold 5 seconds. Twist your tits in both directions",
      category: "dare",
      intensity: "medium",
      timerSeconds: 15,
    },
    {
      id: "tt2",
      text: "Hit 5 seconds. Hold 5 seconds. Pinch your tits hard",
      category: "dare",
      intensity: "intense",
      timerSeconds: 15,
    },
    {
      id: "tt3",
      text: "5 quick hits. Rub your tits for 15 seconds",
      category: "dare",
      intensity: "medium",
      timerSeconds: 20,
    },
    {
      id: "tt4",
      text: "8 hits. Twist your tits hard",
      category: "dare",
      intensity: "intense",
    },

    // Throat Training cards
    {
      id: "th1",
      text: "Practice deep breathing for 30 seconds",
      category: "challenge",
      intensity: "mild",
      timerSeconds: 30,
    },
    {
      id: "th2",
      text: "Hold your breath for 15 seconds",
      category: "challenge",
      intensity: "medium",
      timerSeconds: 15,
    },

    // Rating cards
    {
      id: "r1",
      text: "Rate your current arousal level (1-10)",
      category: "truth",
      intensity: "mild",
    },
    {
      id: "r2",
      text: "Describe what you're feeling right now",
      category: "truth",
      intensity: "mild",
    },

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
const createBoardTiles = (boardSize: number, actionDeck: ActionCard[]): BoardTile[] => {
  const tiles: BoardTile[] = [];

  for (let i = 0; i < boardSize; i++) {
    let type: TileType = "normal";
    let specialEffect: string | undefined;
    let actionCardId: string | undefined;

    // Start tile
    if (i === 0) {
      type = "start";
    }
    // Finish tile
    else if (i === boardSize - 1) {
      type = "finish";
    }
    // Special tiles at intervals - assign specific action cards
    else if (i % 3 === 0) {
      // Every 3rd tile gets an action card
      type = "action";
      // Assign a random action card from the deck
      if (actionDeck.length > 0) {
        const cardIndex = i % actionDeck.length;
        actionCardId = actionDeck[cardIndex].id;
        specialEffect = actionDeck[cardIndex].text;
      }
    }
    // Punishment tiles
    else if (i % 7 === 0) {
      type = "punishment";
      specialEffect = "Draw a punishment card";
    }
    // Reward tiles
    else if (i % 9 === 0) {
      type = "reward";
      specialEffect = "Move forward 2 spaces";
    }
    // Wild tiles
    else if (i % 11 === 0) {
      type = "wild";
      specialEffect = "Choose any category";
    }

    tiles.push({
      id: i,
      type,
      position: i,
      specialEffect,
      actionCardId,
    });
  }

  return tiles;
};

export const SwirledOutGame: Game<SwirledOutGameState> & {
  numPlayers?: (args: { numPlayers?: number }) => number;
} = {
  name: "SwirledOut",
  minPlayers: 1,
  maxPlayers: 6,

  // CRITICAL FIX: This pulls numPlayers from Client config into ctx.numPlayers
  // When Client is created with numPlayers: 1 (solo), this ensures ctx.numPlayers = 1
  numPlayers: ({ numPlayers }: { numPlayers?: number }) => numPlayers ?? 4,

  setup: (ctx) => {
    const { actionDeck, punishmentDeck } = createDefaultDecks();

    // Now ctx.numPlayers should be correctly set (1 for solo, correct # for multi)
    // Thanks to the numPlayers property in the game config above
    // BUT: If it's still undefined (boardgame.io 0.50.2 bug), use fallback logic
    let numPlayers = ctx.numPlayers;

    // FALLBACK: If ctx.numPlayers is undefined, detect solo from playOrder
    if (typeof numPlayers !== "number" || numPlayers <= 0) {
      const existingPlayOrder = ctx.playOrder as string[] | undefined;
      if (
        existingPlayOrder &&
        existingPlayOrder.length === 1 &&
        existingPlayOrder[0] === "0"
      ) {
        // Solo mode: playOrder is ["0"]
        numPlayers = 1;
        console.log(
          "[Game Setup] Fallback: Solo detected from playOrder ['0'], forcing numPlayers to 1"
        );
      } else if (existingPlayOrder && existingPlayOrder.length > 0) {
        // Multiplayer: use playOrder length
        numPlayers = existingPlayOrder.length;
        console.log(
          "[Game Setup] Fallback: Using playOrder length:",
          numPlayers
        );
      } else {
        // Last resort: default to 4
        numPlayers = 4;
        console.log("[Game Setup] Fallback: Defaulting to 4 players");
      }
    }

    console.log(
      "[Game Setup] ctx.numPlayers:",
      ctx.numPlayers,
      "| Final numPlayers:",
      numPlayers
    );

    // ALWAYS create our own playOrder based on numPlayers - ignore ctx.playOrder
    // This ensures we get exactly the number of players we want
    const playOrder: string[] = Array.from<string, string>(
      { length: numPlayers } as ArrayLike<string>,
      (_, i: number) => String(i)
    );

    console.log(
      "[Game Setup] Creating game with",
      numPlayers,
      "players | Play order:",
      playOrder
    );

    const boardSize = 42; // Match BlitzedOut board size
    const boardTiles = createBoardTiles(boardSize, actionDeck);

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
      activityLog: [],
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

      // Log roll event
      const player = gameState.players[ctx.currentPlayer];
      if (player) {
        gameState.activityLog.push({
          id: `event-${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
          type: "roll",
          playerId: player.id,
          playerName: player.name,
          message: `Roll: ${die1} + ${die2} = ${gameState.lastRoll}`,
          data: { roll: gameState.lastRoll, die1, die2 },
        });
      }
    },

    movePawn: (G, ctx, position: number) => {
      const gameState = G as unknown as SwirledOutGameState;
      const player = gameState.players[ctx.currentPlayer];
      if (!player) return;

      const oldPosition = player.position;
      const newPosition = Math.min(position, gameState.boardSize - 1);
      gameState.players[ctx.currentPlayer].position = newPosition;

      // Log move event
      const currentTile = gameState.boardTiles[newPosition];
      gameState.activityLog.push({
        id: `event-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        type: "move",
        playerId: player.id,
        playerName: player.name,
        message: `#${newPosition + 1}: ${currentTile.type === "start" ? "START" : currentTile.type === "finish" ? "FINISH" : currentTile.type.charAt(0).toUpperCase() + currentTile.type.slice(1)}`,
        data: { from: oldPosition, to: newPosition, tile: currentTile },
      });

      // Check if player reached the end
      if (newPosition >= gameState.boardSize - 1) {
        gameState.winner = player.id;
        gameState.phase = "finished";
        return;
      }

      // Check for special tile effects
      if (currentTile.type === "reward" && currentTile.specialEffect) {
        // Move forward 2 more spaces
        const rewardPosition = Math.min(
          newPosition + 2,
          gameState.boardSize - 1
        );
        gameState.players[ctx.currentPlayer].position = rewardPosition;
      } else if (currentTile.type === "action" && currentTile.actionCardId) {
        // Draw the specific action card linked to this tile
        const linkedCard = gameState.actionDeck.find(
          (card) => card.id === currentTile.actionCardId
        );
        if (linkedCard) {
          gameState.currentAction = linkedCard;
          gameState.phase = "action";
          if (gameState.gameRules.timerEnabled) {
            gameState.timerRemaining =
              linkedCard.timerSeconds || gameState.gameRules.defaultTimerSeconds;
          }
          // Log action event
          gameState.activityLog.push({
            id: `event-${Date.now()}-${Math.random()}`,
            timestamp: Date.now(),
            type: "action",
            playerId: player.id,
            playerName: player.name,
            message: `Action: ${linkedCard.text}`,
            data: { card: linkedCard, tile: currentTile },
          });
        }
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

      // Log action event
      const player = gameState.players[ctx.currentPlayer];
      if (player) {
        gameState.activityLog.push({
          id: `event-${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
          type: "action",
          playerId: player.id,
          playerName: player.name,
          message: `Action: ${drawnCard.text}`,
          data: { card: drawnCard },
        });
      }
    },

    completeAction: (G, ctx) => {
      const gameState = G as unknown as SwirledOutGameState;
      const player = gameState.players[ctx.currentPlayer];
      if (!player || !gameState.currentAction) return;

      const completedCard = gameState.currentAction;

      // Award points/reward
      player.completedActions += 1;
      player.score +=
        completedCard.intensity === "mild"
          ? 1
          : completedCard.intensity === "medium"
          ? 2
          : 3;

      // Apply reward if card has one
      if (completedCard.reward) {
        // Handle reward (e.g., move forward, bonus points)
        if (completedCard.reward.includes("forward")) {
          const newPos = Math.min(player.position + 2, gameState.boardSize - 1);
          gameState.players[ctx.currentPlayer].position = newPos;
        }
      }

      // Log complete event before clearing
      gameState.activityLog.push({
        id: `event-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        type: "complete",
        playerId: player.id,
        playerName: player.name,
        message: `Completed: ${completedCard.text}`,
        data: { card: completedCard },
      });

      gameState.currentAction = undefined;
      gameState.timerRemaining = undefined;
      gameState.phase = "playing";
      // Clear lastRoll so next turn can roll again
      gameState.lastRoll = undefined;
    },

    skipAction: (G, ctx) => {
      const gameState = G as unknown as SwirledOutGameState;
      const player = gameState.players[ctx.currentPlayer];
      if (!player || !gameState.currentAction) return;

      const skippedCard = gameState.currentAction;

      // Apply punishment if enabled
      if (
        gameState.gameRules.punishmentOnSkip &&
        skippedCard.punishment
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

      // Log skip event before clearing
      gameState.activityLog.push({
        id: `event-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        type: "skip",
        playerId: player.id,
        playerName: player.name,
        message: `Skipped: ${skippedCard.text}`,
        data: { card: skippedCard },
      });

      gameState.currentAction = undefined;
      gameState.timerRemaining = undefined;
      gameState.phase = "playing";
      // Clear lastRoll so next turn can roll again
      gameState.lastRoll = undefined;
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

    addGameEvent: (G, _ctx, event: GameEvent) => {
      const gameState = G as unknown as SwirledOutGameState;
      gameState.activityLog.push(event);
      // Keep only last 100 events
      if (gameState.activityLog.length > 100) {
        gameState.activityLog = gameState.activityLog.slice(-100);
      }
    },

    updateBoardTile: (G, _ctx, tileId: number, updates: Partial<BoardTile>) => {
      const gameState = G as unknown as SwirledOutGameState;
      const tileIndex = gameState.boardTiles.findIndex(t => t.id === tileId);
      if (tileIndex >= 0) {
        gameState.boardTiles[tileIndex] = {
          ...gameState.boardTiles[tileIndex],
          ...updates,
        };
      }
    },

    addBoardTile: (G, _ctx, tile: BoardTile) => {
      const gameState = G as unknown as SwirledOutGameState;
      gameState.boardTiles.push(tile);
      gameState.boardSize = gameState.boardTiles.length;
    },

    removeBoardTile: (G, _ctx, tileId: number) => {
      const gameState = G as unknown as SwirledOutGameState;
      gameState.boardTiles = gameState.boardTiles.filter(t => t.id !== tileId);
      gameState.boardSize = gameState.boardTiles.length;
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
