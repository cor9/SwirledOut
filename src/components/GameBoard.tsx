import { useEffect, useState } from "react";
import { BoardProps } from "boardgame.io/react";
import { SwirledOutGameState, CardCategory } from "../game/game";
import ActionModal from "./ActionModal";
import CardEditor from "./CardEditor";

export default function GameBoard({
  G,
  ctx,
  moves,
  events,
  playerID,
}: BoardProps<SwirledOutGameState>) {
  const [showActionModal, setShowActionModal] = useState(false);
  const [showCardEditor, setShowCardEditor] = useState(false);
  const playerIDNum = playerID ? parseInt(playerID, 10) : 0;
  const isMyTurn =
    typeof ctx.currentPlayer === "number" && ctx.currentPlayer === playerIDNum;

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
    if (isMyTurn && G.lastRoll && (G.phase === "playing" || G.phase === "setup")) {
      const currentPlayer = G.players[ctx.currentPlayer];
      const newPosition = Math.min(
        currentPlayer.position + G.lastRoll,
        G.boardSize - 1
      );
      moves.movePawn(newPosition);

      // Check what type of tile we landed on
      const landedTile = G.boardTiles[newPosition];

      // Draw action card when landing
      setTimeout(() => {
        if (moves.drawAction) {
          if (landedTile.type === "wild") {
            // Player can choose category for wild tiles
            // For now, draw random
            moves.drawAction();
          } else if (landedTile.type === "punishment") {
            // Draw from punishment deck
            moves.drawAction("punishment");
          } else {
            moves.drawAction();
          }
        }
      }, 500);
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

  const getTileColor = (tileType: string) => {
    switch (tileType) {
      case "start":
        return "#10B981"; // Green
      case "finish":
        return "#EF4444"; // Red
      case "action":
        return "#8B5CF6"; // Purple
      case "punishment":
        return "#F59E0B"; // Orange
      case "reward":
        return "#10B981"; // Green
      case "wild":
        return "#EC4899"; // Pink
      default:
        return "#4B5563"; // Gray
    }
  };

  // Show start game button if in setup phase
  if (G.phase === "setup") {
    return (
      <div className="w-full">
        <div className="bg-gray-800/50 rounded-xl p-8 border border-purple-500/30 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">🎮 Ready to Play?</h2>
          <p className="text-gray-300 mb-6">
            Configure your game settings, then click Start Game to begin!
          </p>
          <button
            onClick={handleStartGame}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg transition-all transform hover:scale-105 font-bold text-xl shadow-lg"
          >
            🚀 Start Game
          </button>
        </div>
      </div>
    );
  }

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
      <div className="grid grid-cols-3 gap-4 text-sm mb-6">
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
      </div>

      {/* Turn Controls - Always Show When It's Your Turn */}
      <div className="mb-6">
        {isMyTurn ? (
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
                    onClick={() => setShowCardEditor(true)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    ➕ Add Card
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600 text-center">
            <p className="text-gray-400 text-lg">
              Waiting for Player {ctx.currentPlayer + 1} to take their turn...
            </p>
          </div>
        )}
      </div>

      {/* Board */}
      <div className="relative bg-gray-900/50 rounded-xl p-8 border-2 border-purple-500/30">
        <svg viewBox="0 0 800 600" className="w-full h-auto">
          {/* Draw board path */}
          <path
            d="M 50 300 L 200 300 L 200 100 L 500 100 L 500 300 L 750 300 L 750 500 L 500 500 L 500 400 L 200 400 L 200 500 L 50 500 Z"
            fill="none"
            stroke="#7C3AED"
            strokeOpacity="0.5"
            strokeWidth="4"
          />

          {/* Board tiles */}
          {G.boardTiles.map((tile) => {
            const progress = tile.position / (G.boardSize - 1);
            const angle = progress * Math.PI * 2;
            const radius = 200;
            const x = 400 + Math.cos(angle) * radius;
            const y = 300 + Math.sin(angle) * radius;

            return (
              <circle
                key={tile.id}
                cx={x}
                cy={y}
                r="18"
                fill={getTileColor(tile.type)}
                stroke={
                  tile.type === "start" || tile.type === "finish"
                    ? "#059669"
                    : "#7C3AED"
                }
                strokeOpacity="0.6"
                strokeWidth="3"
              >
                <title>
                  {tile.type === "start"
                    ? "Start"
                    : tile.type === "finish"
                    ? "Finish"
                    : tile.type.charAt(0).toUpperCase() + tile.type.slice(1)}
                  {tile.specialEffect ? ` - ${tile.specialEffect}` : ""}
                </title>
              </circle>
            );
          })}

          {/* Player pawns */}
          {G.players.map((player) => {
            const progress = player.position / (G.boardSize - 1);
            const angle = progress * Math.PI * 2;
            const radius = 200;
            const x = 400 + Math.cos(angle) * radius;
            const y = 300 + Math.sin(angle) * radius;

            return (
              <g key={player.id}>
                <circle
                  cx={x}
                  cy={y}
                  r="25"
                  fill={player.color}
                  stroke="white"
                  strokeWidth="4"
                >
                  <title>
                    {player.name} - Position: {player.position} - Score:{" "}
                    {player.score} - Completed: {player.completedActions}
                  </title>
                </circle>
                <text
                  x={x}
                  y={y + 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {G.players.indexOf(player) + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Players List with Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {G.players.map((player, playerIdx) => {
          const isCurrentPlayer =
            typeof ctx.currentPlayer === "number" &&
            playerIdx === ctx.currentPlayer;
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
        })}
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
          onSave={(card) => {
            if (moves.addCustomCard) {
              moves.addCustomCard(card);
            }
            setShowCardEditor(false);
          }}
          onClose={() => setShowCardEditor(false)}
        />
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
