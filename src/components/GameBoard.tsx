import { useEffect, useState } from "react";
import { BoardProps } from "boardgame.io/react";
import { SwirledOutGameState } from "../game/game";
import ActionModal from "./ActionModal";

export default function GameBoard({
  G,
  ctx,
  moves,
  events,
  playerID,
}: BoardProps<SwirledOutGameState>) {
  const [showActionModal, setShowActionModal] = useState(false);
  const playerIDNum = playerID ? parseInt(playerID, 10) : 0;
  const isMyTurn =
    typeof ctx.currentPlayer === "number" && ctx.currentPlayer === playerIDNum;

  useEffect(() => {
    if (G.phase === "action" && G.currentAction) {
      setShowActionModal(true);
    }
  }, [G.phase, G.currentAction]);

  const handleRollDice = () => {
    if (isMyTurn && G.phase === "playing") {
      moves.rollDice();
    }
  };

  const handleMove = () => {
    if (isMyTurn && G.lastRoll && G.phase === "playing") {
      const currentPlayer = G.players[ctx.currentPlayer];
      const newPosition = Math.min(
        currentPlayer.position + G.lastRoll,
        G.boardSize - 1
      );
      moves.movePawn(newPosition);

      // Draw action card when landing
      setTimeout(() => {
        if (moves.drawAction) {
          moves.drawAction();
        }
      }, 500);
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

  return (
    <div className="w-full">
      {/* Game Info */}
      <div className="mb-6 space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            {isMyTurn ? "🎲 Your Turn" : `Player ${ctx.currentPlayer + 1}'s Turn`}
          </h2>
          {G.lastRoll && (
            <div className="bg-purple-600/20 border border-purple-500/50 rounded-lg px-4 py-2">
              <div className="text-purple-200 text-sm">Rolled</div>
              <span className="font-bold text-3xl text-purple-300">
                {G.lastRoll}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {isMyTurn && G.phase === "playing" && !G.lastRoll && (
            <button
              onClick={handleRollDice}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg transition-all transform hover:scale-105 font-bold shadow-lg"
            >
              🎲 Roll Dice
            </button>
          )}

          {isMyTurn && G.lastRoll && G.phase === "playing" && (
            <button
              onClick={handleMove}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg transition-all transform hover:scale-105 font-bold shadow-lg"
            >
              Move {G.lastRoll} Spaces
            </button>
          )}
        </div>
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
          {Array.from({ length: G.boardSize }).map((_, i) => {
            const progress = i / (G.boardSize - 1);
            const angle = progress * Math.PI * 2;
            const radius = 200;
            const x = 400 + Math.cos(angle) * radius;
            const y = 300 + Math.sin(angle) * radius;

            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="15"
                fill={i === 0 || i === G.boardSize - 1 ? "#10B981" : "#4B5563"}
                stroke={
                  i === 0 || i === G.boardSize - 1 ? "#059669" : "#7C3AED"
                }
                strokeOpacity="0.6"
                strokeWidth="2"
              />
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
              <circle
                key={player.id}
                cx={x}
                cy={y}
                r="20"
                fill={player.color}
                stroke="white"
                strokeWidth="3"
              >
                <title>{player.name}</title>
              </circle>
            );
          })}
        </svg>
      </div>

      {/* Players List */}
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
              <p className={`text-center text-sm font-semibold ${
                isCurrentPlayer ? "text-purple-200" : "text-gray-300"
              }`}>
                {player.name}
              </p>
              <p className="text-gray-400 text-center text-xs">
                Position: {player.position}
              </p>
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
          onSkip={handleSkipAction}
          onComplete={() => {
            if (moves.skipAction) {
              moves.skipAction();
            }
            setShowActionModal(false);
            if (events.endTurn) {
              events.endTurn();
            }
          }}
        />
      )}
    </div>
  );
}
