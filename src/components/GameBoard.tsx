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
      <div className="mb-6 space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {isMyTurn ? "Your Turn" : `Player ${ctx.currentPlayer + 1}'s Turn`}
          </h2>
          {G.lastRoll && (
            <div className="text-gray-700">
              Rolled: <span className="font-bold text-2xl text-purple-600">{G.lastRoll}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {isMyTurn && G.phase === "playing" && !G.lastRoll && (
            <button
              onClick={handleRollDice}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition-colors font-medium"
            >
              Roll Dice
            </button>
          )}

          {isMyTurn && G.lastRoll && G.phase === "playing" && (
            <button
              onClick={handleMove}
              className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-md transition-colors font-medium"
            >
              Move {G.lastRoll} Spaces
            </button>
          )}
        </div>
      </div>

      {/* Board */}
      <div className="relative bg-gray-50 rounded-lg p-8 border-2 border-gray-200">
        <svg viewBox="0 0 800 600" className="w-full h-auto">
          {/* Draw board path */}
          <path
            d="M 50 300 L 200 300 L 200 100 L 500 100 L 500 300 L 750 300 L 750 500 L 500 500 L 500 400 L 200 400 L 200 500 L 50 500 Z"
            fill="none"
            stroke="#9CA3AF"
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
                fill={
                  i === 0 || i === G.boardSize - 1
                    ? "#10B981"
                    : "#E5E7EB"
                }
                stroke={i === 0 || i === G.boardSize - 1 ? "#059669" : "#9CA3AF"}
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
                  ? "bg-purple-50 border-purple-300"
                  : "bg-white border-gray-200"
              }`}
            >
              <div
                className="w-8 h-8 rounded-full mx-auto mb-2"
                style={{ backgroundColor: player.color }}
              />
                <p className="text-gray-900 text-center text-sm font-semibold">
                  {player.name}
                </p>
                <p className="text-gray-600 text-center text-xs">
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
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md transition-colors font-medium"
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
