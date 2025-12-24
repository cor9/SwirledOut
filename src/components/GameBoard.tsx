import { useEffect, useState } from "react";
import { BoardProps } from "boardgame.io/react";
import { SwirledOutGameState, ActionCard } from "../game/game";
import ActionModal from "./ActionModal";
import CardEditor from "./CardEditor";
import ActivityLog from "./ActivityLog";
import TileManager from "./TileManager";
import DiceRollModal from "./DiceRollModal";

export default function GameBoard({
  G,
  ctx,
  moves,
  events,
  playerID,
}: BoardProps<SwirledOutGameState>) {
  const [showActionModal, setShowActionModal] = useState(false);
  const [showCardEditor, setShowCardEditor] = useState(false);
  const [showCardManager, setShowCardManager] = useState(false);
  const [showTileManager, setShowTileManager] = useState(false);
  const [showDiceRoll, setShowDiceRoll] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [editingCard, setEditingCard] = useState<ActionCard | undefined>(
    undefined
  );
  const playerIDNum = playerID ? parseInt(playerID, 10) : 0;
  const currentPlayerNum = typeof ctx.currentPlayer === "number" ? ctx.currentPlayer : parseInt(String(ctx.currentPlayer || "0"), 10);
  const isMyTurn = currentPlayerNum === playerIDNum;

  // In solo mode, always allow player 0 to take actions
  const isSoloMode = typeof ctx.numPlayers === "number" && ctx.numPlayers === 1;
  const canTakeTurn = isMyTurn || (isSoloMode && currentPlayerNum === 0);

  // Separate custom cards from default cards
  const customCards = G.actionDeck.filter((card) =>
    card.id.startsWith("card-")
  );

  useEffect(() => {
    if (G.phase === "action" && G.currentAction) {
      setShowActionModal(true);
    } else {
      setShowActionModal(false);
    }
  }, [G.phase, G.currentAction]);

  const handleStartGame = () => {
    // Transition from setup to playing phase
    if (moves.startGame) {
      moves.startGame();
    } else if (events.setPhase) {
      events.setPhase("playing");
    }
  };

  const handleRollDice = () => {
    // Prevent multiple rolls - only roll if we haven't rolled yet and aren't currently rolling
    if (canTakeTurn && (G.phase === "playing" || G.phase === "setup") && !isRolling && !G.lastRoll) {
      setIsRolling(true);
      moves.rollDice();
      // Auto-transition to playing if in setup
      if (G.phase === "setup" && events.setPhase) {
        events.setPhase("playing");
      }
    }
  };

  useEffect(() => {
    // Show dice roll modal when a roll happens, but only once per roll
    if (G.lastRoll && canTakeTurn && isRolling && !showDiceRoll) {
      setShowDiceRoll(true);
    }
  }, [G.lastRoll, canTakeTurn, isRolling, showDiceRoll]);
  
  // Reset rolling state when turn changes
  useEffect(() => {
    if (!G.lastRoll) {
      setIsRolling(false);
      setShowDiceRoll(false);
    }
  }, [ctx.currentPlayer, G.lastRoll]);

  const handleMove = () => {
    if (
      canTakeTurn &&
      G.lastRoll &&
      G.phase === "playing"
    ) {
      const currentPlayer = G.players[ctx.currentPlayer];
      if (!currentPlayer) return;
      
      const newPosition = Math.min(
        currentPlayer.position + G.lastRoll,
        G.boardSize - 1
      );
      
      // Move the pawn
      moves.movePawn(newPosition);
      
      // Clear the roll state and close dice modal
      setShowDiceRoll(false);
      setIsRolling(false);
      
      // Check what tile we landed on - movePawn handles action cards automatically
      // If no action was drawn, we can end the turn
      setTimeout(() => {
        // If we're still in playing phase (no action drawn), end the turn
        if (G.phase === "playing" && !G.currentAction) {
          if (events.endTurn) {
            events.endTurn();
          }
        }
      }, 1000);
    }
  };

  const handleCompleteAction = () => {
    if (moves.completeAction) {
      moves.completeAction();
    }
    setShowActionModal(false);
    
    // End turn after completing action
    setTimeout(() => {
      if (events.endTurn) {
        events.endTurn();
      }
    }, 300);
  };

  const handleSkipAction = () => {
    if (moves.skipAction) {
      moves.skipAction();
    }
    setShowActionModal(false);
    
    // End turn after skipping action
    setTimeout(() => {
      if (events.endTurn) {
        events.endTurn();
      }
    }, 300);
  };

  const handleSafeWord = () => {
    if (moves.pauseGame) {
      moves.pauseGame();
    }
    alert("Game paused. Safe word activated. All players can take a break.");
  };


  // Show start game button if in setup phase
  const showStartButton = G.phase === "setup";

  return (
    <div className="w-full">
      {/* Turn Indicator - Prominent */}
      <div
        className={`mb-6 p-4 rounded-xl border-2 ${
          canTakeTurn
            ? "bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-purple-400 shadow-lg shadow-purple-500/50"
            : "bg-gray-800/50 border-gray-600"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2
              className={`text-3xl font-bold ${
                canTakeTurn ? "text-white" : "text-gray-400"
              }`}
            >
              {canTakeTurn
                ? "🎲 YOUR TURN - Take Action!"
                : `⏳ Player ${ctx.currentPlayer + 1}'s Turn`}
            </h2>
            {canTakeTurn && (
              <p className="text-purple-200 text-sm mt-1">
                Roll the dice to begin your turn
              </p>
            )}
          </div>
          {G.lastRoll && (
            <div className="bg-purple-600/20 border border-purple-500/50 rounded-lg px-6 py-3">
              <div className="text-purple-200 text-xs uppercase tracking-wide">
                Rolled
              </div>
              <span className="font-bold text-4xl text-purple-300 block">
                {G.lastRoll}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-4 gap-4 text-sm mb-6">
        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="text-gray-400">Board Size</div>
          <div className="text-white font-bold">{G.boardSize} tiles</div>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="text-gray-400">Cards in Deck</div>
          <div className="text-white font-bold">{G.actionDeck.length}</div>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="text-gray-400">Win Condition</div>
          <div className="text-white font-bold capitalize">
            {G.gameRules.winCondition.replace(/_/g, " ")}
          </div>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3 flex items-center">
          <button
            onClick={() => setShowTileManager(true)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            🗺️ Manage Tiles
          </button>
        </div>
      </div>


      {/* Start Game Button - Show if in setup phase */}
      {showStartButton && (
        <div className="mb-6 flex justify-center">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/30 text-center max-w-md">
            <h3 className="text-2xl font-bold text-white mb-3">
              🎮 Ready to Play?
            </h3>
            <p className="text-gray-300 mb-4">
              Click the button below to start the game!
            </p>
            <button
              onClick={handleStartGame}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg transition-all transform hover:scale-105 font-bold text-xl shadow-lg"
            >
              🚀 Start Game
            </button>
          </div>
        </div>
      )}

      {/* Game Controls - Clear step-by-step flow */}
      {!showStartButton && canTakeTurn && (
        <div className="mb-6">
          {/* Step 1: Roll Dice */}
          {!G.lastRoll && !showDiceRoll && (
            <div className="flex justify-center">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/30 text-center max-w-md">
                <div className="text-purple-300 text-sm mb-2">Step 1 of 2</div>
                <h3 className="text-xl font-bold text-white mb-4">Roll the Dice</h3>
                <button
                  onClick={handleRollDice}
                  disabled={isRolling}
                  className="relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-6 rounded-2xl transition-all transform hover:scale-110 active:scale-95 font-bold text-2xl shadow-2xl border-4 border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-4xl">🎲</span>
                    <span>Roll Dice</span>
                  </span>
                </button>
                <p className="text-gray-400 text-sm mt-3">Roll two dice to see how many spaces you can move</p>
              </div>
            </div>
          )}

          {/* Step 2: Move (shown after dice roll modal closes) */}
          {G.lastRoll && !showDiceRoll && !isRolling && (
            <div className="flex justify-center">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-blue-500/30 text-center max-w-md">
                <div className="text-blue-300 text-sm mb-2">Step 2 of 2</div>
                <h3 className="text-xl font-bold text-white mb-4">Move Your Pawn</h3>
                <div className="bg-blue-600/20 border border-blue-500/50 rounded-lg px-6 py-3 mb-4">
                  <div className="text-blue-200 text-xs uppercase tracking-wide mb-1">You Rolled</div>
                  <div className="text-5xl font-bold text-blue-300">{G.lastRoll}</div>
                </div>
                <button
                  onClick={handleMove}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 rounded-2xl transition-all transform hover:scale-110 active:scale-95 font-bold text-2xl shadow-2xl border-4 border-white/20 w-full"
                >
                  <span className="flex items-center justify-center gap-3">
                    <span>👉</span>
                    <span>Move {G.lastRoll} Spaces</span>
                  </span>
                </button>
                <p className="text-gray-400 text-sm mt-3">Click to move your pawn forward on the board</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Waiting Message for Other Players */}
      {!showStartButton && !canTakeTurn && (
        <div className="mb-6 bg-gray-800/50 rounded-xl p-6 border border-gray-600 text-center">
          <p className="text-gray-400 text-lg mb-2">
            Waiting for Player {ctx.currentPlayer + 1} to take their turn...
          </p>
          <p className="text-gray-500 text-sm">
            When it's your turn, the dice roll button will appear here
          </p>
        </div>
      )}

      {/* Board and Activity Log Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Shaped Board - Snake/Winding Path */}
        <div className="lg:col-span-3 relative bg-gray-900/50 rounded-xl p-8 border-2 border-purple-500/30 overflow-auto">
          <svg viewBox="0 0 1000 600" className="w-full h-auto min-h-[600px]">
            {/* Draw winding snake path - Thicker and more visible */}
            <path
              d="M 50 300 L 200 300 L 200 150 L 400 150 L 400 300 L 600 300 L 600 150 L 800 150 L 800 300 L 950 300"
              fill="none"
              stroke="#7C3AED"
              strokeWidth="12"
              strokeOpacity="0.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Board tiles positioned along the path */}
            {G.boardTiles.map((tile) => {
              const progress = tile.position / (G.boardSize - 1);
              let x = 50;
              let y = 300;

              // Calculate position along winding path
              if (progress < 0.15) {
                // First straight section
                x = 50 + (progress / 0.15) * 150;
                y = 300;
              } else if (progress < 0.3) {
                // First turn up
                x = 200;
                y = 300 - ((progress - 0.15) / 0.15) * 150;
              } else if (progress < 0.5) {
                // Second straight section
                x = 200 + ((progress - 0.3) / 0.2) * 200;
                y = 150;
              } else if (progress < 0.65) {
                // Second turn down
                x = 400;
                y = 150 + ((progress - 0.5) / 0.15) * 150;
              } else if (progress < 0.8) {
                // Third straight section
                x = 400 + ((progress - 0.65) / 0.15) * 200;
                y = 300;
              } else if (progress < 0.95) {
                // Third turn up
                x = 600;
                y = 300 - ((progress - 0.8) / 0.15) * 150;
              } else {
                // Final sections
                const finalProgress = (progress - 0.95) / 0.05;
                if (finalProgress < 0.5) {
                  x = 600 + (finalProgress / 0.5) * 200;
                  y = 150;
                } else {
                  x = 800;
                  y = 150 + ((finalProgress - 0.5) / 0.5) * 150;
                }
              }

              const isOccupied = G.players.some(p => p.position === tile.position);
              const playersOnTile = G.players.filter(p => p.position === tile.position);

              const getTileColor = () => {
                switch (tile.type) {
                  case "start": return "#10B981";
                  case "finish": return "#EF4444";
                  case "action": return "#8B5CF6";
                  case "punishment": return "#F59E0B";
                  case "reward": return "#10B981";
                  case "wild": return "#EC4899";
                  default: return "#4B5563";
                }
              };

              return (
                <g key={tile.id}>
                  {/* Tile circle - Larger and no hover scale to prevent blinking */}
                  <circle
                    cx={x}
                    cy={y}
                    r="35"
                    fill={getTileColor()}
                    stroke={isOccupied ? "#FCD34D" : "#7C3AED"}
                    strokeWidth={isOccupied ? "5" : "3"}
                    strokeOpacity="0.9"
                    className="transition-opacity hover:opacity-80 cursor-pointer"
                  >
                    <title>
                      {tile.type === "start"
                        ? "START"
                        : tile.type === "finish"
                        ? "FINISH"
                        : `#${tile.position + 1}: ${tile.type.charAt(0).toUpperCase() + tile.type.slice(1)}${tile.specialEffect ? ` - ${tile.specialEffect}` : ""}`}
                    </title>
                  </circle>

                  {/* Tile number/label - Larger text */}
                  <text
                    x={x}
                    y={y + 8}
                    textAnchor="middle"
                    fill="white"
                    fontSize="18"
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    {tile.type === "start" ? "START" : tile.type === "finish" ? "FINISH" : tile.position + 1}
                  </text>

                  {/* Player pawns - Larger */}
                  {playersOnTile.map((player, pIdx) => {
                    const offsetAngle = (pIdx - (playersOnTile.length - 1) / 2) * 0.6;
                    const pawnX = x + Math.cos(offsetAngle) * 25;
                    const pawnY = y + Math.sin(offsetAngle) * 25;

                    return (
                      <g key={player.id}>
                        <circle
                          cx={pawnX}
                          cy={pawnY}
                          r="12"
                          fill={player.color}
                          stroke="white"
                          strokeWidth="3"
                        >
                          <title>{player.name} - Position: {player.position}</title>
                        </circle>
                        <text
                          x={pawnX}
                          y={pawnY + 4}
                          textAnchor="middle"
                          fill="white"
                          fontSize="10"
                          fontWeight="bold"
                        >
                          {G.players.findIndex(p => p.id === player.id) + 1}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Activity Log */}
        <div className="lg:col-span-1">
          <ActivityLog events={G.activityLog || []} />
        </div>
      </div>

      {/* Debug info */}
      <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-500/50 rounded text-sm text-yellow-200">
        <strong>Debug Info:</strong>{" "}
        {typeof ctx.numPlayers === "number" ? ctx.numPlayers : G.players.length}{" "}
        player(s) | ctx.numPlayers:{" "}
        {typeof ctx.numPlayers === "number" ? ctx.numPlayers : "undefined"} |
        Current Player: {ctx.currentPlayer} | Your PlayerID: {playerID} | Phase:{" "}
        {G.phase} | Solo Mode:{" "}
        {typeof ctx.numPlayers === "number" && ctx.numPlayers === 1
          ? "YES"
          : "NO"}
      </div>

      {/* Players List with Stats - Only show players that exist */}
      <div
        className={`mt-6 grid gap-4 ${
          G.players.length === 1
            ? "grid-cols-1 max-w-md mx-auto"
            : G.players.length === 2
            ? "grid-cols-2"
            : "grid-cols-2 md:grid-cols-4"
        }`}
      >
        {/* Only render players that actually exist (0 to numPlayers-1) */}
        {Array.from(
          {
            length:
              typeof ctx.numPlayers === "number"
                ? ctx.numPlayers
                : G.players.length,
          },
          (_, idx) => {
            const player = G.players[idx];
            if (!player) return null;

            const isCurrentPlayer =
              typeof ctx.currentPlayer === "number" &&
              idx === ctx.currentPlayer;

            return (
              <div
                key={player.id}
                className={`p-4 rounded-lg border ${
                  isCurrentPlayer
                    ? "bg-purple-600/30 border-purple-400 shadow-lg shadow-purple-500/50"
                    : "bg-gray-700/50 border-gray-600"
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: player.color }}
                />
                <p
                  className={`text-center text-sm font-semibold ${
                    isCurrentPlayer ? "text-purple-200" : "text-gray-300"
                  }`}
                >
                  {player.name}
                </p>
                <div className="mt-2 space-y-1 text-xs text-gray-400">
                  <div>
                    Position: {player.position}/{G.boardSize - 1}
                  </div>
                  <div>Score: {player.score}</div>
                  <div>Completed: {player.completedActions}</div>
                  {player.punishments > 0 && (
                    <div className="text-red-400">
                      Punishments: {player.punishments}
                    </div>
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* Safe Word Button - Always visible */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleSafeWord}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 font-bold shadow-lg"
        >
          🛑 Safe Word (Pause Game)
        </button>
      </div>

      {/* Dice Roll Modal */}
      {showDiceRoll && G.lastRoll && (
        <DiceRollModal
          roll={G.lastRoll}
          die1={G.activityLog?.find(e => e.type === "roll" && e.data?.roll === G.lastRoll)?.data?.die1}
          die2={G.activityLog?.find(e => e.type === "roll" && e.data?.roll === G.lastRoll)?.data?.die2}
          tileInstruction={
            G.lastRoll && G.players[ctx.currentPlayer]
              ? G.boardTiles[Math.min(G.players[ctx.currentPlayer].position + G.lastRoll, G.boardSize - 1)]?.specialEffect
              : undefined
          }
          onClose={() => {
            setShowDiceRoll(false);
            setIsRolling(false);
            // Reset the roll state so we can roll again next turn
          }}
        />
      )}

      {/* Action Modal */}
      {showActionModal && G.currentAction && (
        <ActionModal
          action={G.currentAction}
          timerRemaining={G.timerRemaining}
          onSkip={handleSkipAction}
          onComplete={handleCompleteAction}
          timerEnabled={G.gameRules.timerEnabled}
        />
      )}

      {/* Card Editor */}
      {showCardEditor && (
        <CardEditor
          existingCard={editingCard}
          onSave={(card) => {
            if (moves.addCustomCard) {
              moves.addCustomCard(card);
            }
            setShowCardEditor(false);
            setEditingCard(undefined);
          }}
          onClose={() => {
            setShowCardEditor(false);
            setEditingCard(undefined);
          }}
        />
      )}

      {/* Tile Manager Modal */}
      {showTileManager && (
        <TileManager
          G={G}
          ctx={ctx}
          moves={moves}
          onClose={() => setShowTileManager(false)}
        />
      )}

      {/* Card Manager Modal */}
      {showCardManager && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-4xl w-full border-2 border-purple-500/50 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Your Custom Cards ({customCards.length})
              </h2>
              <button
                onClick={() => setShowCardManager(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {customCards.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg mb-4">
                  You haven't created any custom cards yet.
                </p>
                <button
                  onClick={() => {
                    setShowCardManager(false);
                    setEditingCard(undefined);
                    setShowCardEditor(true);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 font-medium"
                >
                  Create Your First Card
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customCards.map((card) => {
                  const intensityColors = {
                    mild: "bg-green-900/40 border-green-500/50",
                    medium: "bg-yellow-900/40 border-yellow-500/50",
                    intense: "bg-red-900/40 border-red-500/50",
                  };
                  const categoryIcons = {
                    truth: "💭",
                    dare: "🎯",
                    challenge: "⚡",
                    punishment: "⚠️",
                    reward: "🎁",
                    wild: "🌟",
                  };

                  return (
                    <div
                      key={card.id}
                      className="bg-gray-700/50 rounded-lg p-4 border border-gray-600"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">
                            {categoryIcons[card.category]}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                              intensityColors[card.intensity]
                            } text-white`}
                          >
                            {card.intensity}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setEditingCard(card);
                            setShowCardManager(false);
                            setShowCardEditor(true);
                          }}
                          className="text-purple-400 hover:text-purple-300 text-sm"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-white font-medium mb-2">{card.text}</p>
                      <div className="text-xs text-gray-400 space-y-1">
                        {card.timerSeconds && (
                          <div>⏱️ Timer: {card.timerSeconds}s</div>
                        )}
                        {card.punishment && (
                          <div>⚠️ Punishment: {card.punishment}</div>
                        )}
                        {card.reward && <div>🎁 Reward: {card.reward}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowCardManager(false);
                  setEditingCard(undefined);
                  setShowCardEditor(true);
                }}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                ➕ Add New Card
              </button>
              <button
                onClick={() => setShowCardManager(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Finished Modal */}
      {G.phase === "finished" && G.winner && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border-2 border-purple-500/50 shadow-2xl text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              🎉 Game Over!
            </h2>
            <p className="text-2xl text-purple-200 mb-6">
              {G.players.find((p) => p.id === G.winner)?.name} Wins!
            </p>
            <div className="space-y-2 text-gray-300 mb-6">
              <p>Final Scores:</p>
              {G.players
                .sort((a, b) => b.score - a.score)
                .map((player, idx) => (
                  <div key={player.id} className="flex justify-between">
                    <span>
                      {idx + 1}. {player.name}
                    </span>
                    <span className="font-bold">{player.score} pts</span>
                  </div>
                ))}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
