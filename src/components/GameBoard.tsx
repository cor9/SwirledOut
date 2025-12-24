import { useEffect, useState } from "react";
import { BoardProps } from "boardgame.io/react";
import { SwirledOutGameState, CardCategory, ActionCard } from "../game/game";
import ActionModal from "./ActionModal";
import CardEditor from "./CardEditor";
import ActivityLog from "./ActivityLog";
import TileManager from "./TileManager";

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
  const [editingCard, setEditingCard] = useState<ActionCard | undefined>(
    undefined
  );
  const playerIDNum = playerID ? parseInt(playerID, 10) : 0;
  const isMyTurn =
    typeof ctx.currentPlayer === "number" && ctx.currentPlayer === playerIDNum;

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
    if (isMyTurn && (G.phase === "playing" || G.phase === "setup")) {
      moves.rollDice();
      // Auto-transition to playing if in setup
      if (G.phase === "setup" && events.setPhase) {
        events.setPhase("playing");
      }
    }
  };

  const handleMove = () => {
    if (
      isMyTurn &&
      G.lastRoll &&
      (G.phase === "playing" || G.phase === "setup")
    ) {
      const currentPlayer = G.players[ctx.currentPlayer];
      const newPosition = Math.min(
        currentPlayer.position + G.lastRoll,
        G.boardSize - 1
      );
      moves.movePawn(newPosition);

      // Note: movePawn now handles drawing action cards automatically
      // for tiles with linked actionCardId. For other tile types, we still
      // need to manually draw actions.
      const landedTile = G.boardTiles[newPosition];

      // Only manually draw if tile doesn't have a linked action card
      // (movePawn handles tiles with actionCardId automatically)
      if (!landedTile.actionCardId) {
        setTimeout(() => {
          if (moves.drawAction) {
            if (landedTile.type === "wild") {
              // Player can choose category for wild tiles
              moves.drawAction();
            } else if (landedTile.type === "punishment") {
              // Draw from punishment deck
              moves.drawAction("punishment");
            } else if (landedTile.type === "action") {
              // Draw random action if no linked card
              moves.drawAction();
            }
          }
        }, 500);
      }
    }
  };

  const handleCompleteAction = () => {
    if (moves.completeAction) {
      moves.completeAction();
    }
    setShowActionModal(false);
    if (events.endTurn) {
      events.endTurn();
    }
  };

  const handleSkipAction = () => {
    if (moves.skipAction) {
      moves.skipAction();
    }
    setShowActionModal(false);
    if (events.endTurn) {
      events.endTurn();
    }
  };

  const handleSafeWord = () => {
    if (moves.pauseGame) {
      moves.pauseGame();
    }
    alert("Game paused. Safe word activated. All players can take a break.");
  };

  const handleCategorySelect = (category: CardCategory) => {
    if (moves.drawAction) {
      moves.drawAction(category);
    }
  };

  // Show start game button if in setup phase, but also show it alongside turn controls
  const showStartButton = G.phase === "setup";

  return (
    <div className="w-full">
      {/* Turn Indicator - Prominent */}
      <div
        className={`mb-6 p-4 rounded-xl border-2 ${
          isMyTurn
            ? "bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-purple-400 shadow-lg shadow-purple-500/50"
            : "bg-gray-800/50 border-gray-600"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2
              className={`text-3xl font-bold ${
                isMyTurn ? "text-white" : "text-gray-400"
              }`}
            >
              {isMyTurn
                ? "🎲 YOUR TURN - Take Action!"
                : `⏳ Player ${ctx.currentPlayer + 1}'s Turn`}
            </h2>
            {isMyTurn && (
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
        <div className="mb-6 bg-gray-800/50 rounded-xl p-6 border border-purple-500/30 text-center">
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
      )}

      {/* Turn Controls - Always Show When It's Your Turn OR if it's the first player's turn */}
      <div className="mb-6">
        {/* Show controls if it's your turn OR if it's player 0's turn and we're player 0 (fallback for solo/local play) */}
        {isMyTurn ||
        (typeof ctx.currentPlayer === "number" &&
          ctx.currentPlayer === 0 &&
          playerIDNum === 0) ? (
          <div className="space-y-4">
            {/* Roll Dice Button - Show if no roll yet */}
            {!G.lastRoll && (
              <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/30">
                <h3 className="text-white font-semibold mb-4">
                  Step 1: Roll the Dice
                </h3>
                <button
                  onClick={handleRollDice}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg transition-all transform hover:scale-105 font-bold text-xl shadow-lg"
                >
                  🎲 Roll Dice (2 dice = 2-12)
                </button>
                <p className="text-gray-400 text-sm mt-2 text-center">
                  Click to roll two dice and see how many spaces you can move
                </p>
              </div>
            )}

            {/* Move Button - Show if rolled but not moved */}
            {G.lastRoll && (
              <div className="bg-gray-800/50 rounded-xl p-6 border border-blue-500/30">
                <h3 className="text-white font-semibold mb-4">
                  Step 2: Move Your Pawn
                </h3>
                <button
                  onClick={handleMove}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg transition-all transform hover:scale-105 font-bold text-xl shadow-lg"
                >
                  👉 Move {G.lastRoll} Spaces
                </button>
                <p className="text-gray-400 text-sm mt-2 text-center">
                  Click to move your pawn {G.lastRoll} spaces forward on the
                  board
                </p>
              </div>
            )}

            {/* Category Selection (Optional) */}
            {!G.lastRoll && (
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-600">
                <h3 className="text-white font-semibold mb-3 text-sm">
                  Or Choose a Category:
                </h3>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleCategorySelect("truth")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    💭 Truth
                  </button>
                  <button
                    onClick={() => handleCategorySelect("dare")}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    🎯 Dare
                  </button>
                  <button
                    onClick={() => handleCategorySelect("challenge")}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    ⚡ Challenge
                  </button>
                  <button
                    onClick={() => {
                      setEditingCard(undefined);
                      setShowCardEditor(true);
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    ➕ Add Card
                  </button>
                  <button
                    onClick={() => setShowCardManager(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    📋 My Cards ({customCards.length})
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600 text-center">
            <p className="text-gray-400 text-lg mb-2">
              Waiting for Player {ctx.currentPlayer + 1} to take their turn...
            </p>
            <p className="text-gray-500 text-sm">
              When it's your turn, action buttons will appear here
            </p>
          </div>
        )}
      </div>

      {/* Board and Activity Log Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Linear Board */}
        <div className="lg:col-span-3 relative bg-gray-900/50 rounded-xl p-6 border-2 border-purple-500/30 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max" style={{ width: `${G.boardSize * 60}px` }}>
          {G.boardTiles.map((tile, idx) => {
            const isOccupied = G.players.some(p => p.position === tile.position);
            const playersOnTile = G.players.filter(p => p.position === tile.position);

            return (
              <div key={tile.id} className="relative flex-shrink-0">
                {/* Tile */}
                <div
                  className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center font-bold text-xs transition-all ${
                    tile.type === "start"
                      ? "bg-green-600 border-green-400 text-white"
                      : tile.type === "finish"
                      ? "bg-red-600 border-red-400 text-white"
                      : tile.type === "action"
                      ? "bg-purple-600 border-purple-400 text-white"
                      : tile.type === "punishment"
                      ? "bg-orange-600 border-orange-400 text-white"
                      : tile.type === "reward"
                      ? "bg-green-500 border-green-300 text-white"
                      : tile.type === "wild"
                      ? "bg-pink-600 border-pink-400 text-white"
                      : "bg-gray-600 border-gray-400 text-white"
                  } ${isOccupied ? "ring-2 ring-yellow-400 ring-offset-2" : ""}`}
                  title={
                    tile.type === "start"
                      ? "START"
                      : tile.type === "finish"
                      ? "FINISH"
                      : `#${tile.position + 1}: ${tile.type.charAt(0).toUpperCase() + tile.type.slice(1)}${tile.specialEffect ? ` - ${tile.specialEffect}` : ""}`
                  }
                >
                  {tile.type === "start" ? (
                    <span className="text-xs">START</span>
                  ) : tile.type === "finish" ? (
                    <span className="text-xs">END</span>
                  ) : (
                    <span>{tile.position + 1}</span>
                  )}
                </div>

                {/* Player Pawns on Tile */}
                {playersOnTile.length > 0 && (
                  <div className="absolute -top-2 -right-2 flex gap-1">
                    {playersOnTile.map((player) => (
                      <div
                        key={player.id}
                        className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: player.color }}
                        title={`${player.name} - Position: ${player.position}`}
                      >
                        {G.players.findIndex(p => p.id === player.id) + 1}
                      </div>
                    ))}
                  </div>
                )}

                {/* Arrow between tiles (except last) */}
                {idx < G.boardTiles.length - 1 && (
                  <div className="absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 18L15 12L9 6"
                        stroke="#7C3AED"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
