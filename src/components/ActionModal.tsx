import { useEffect, useState } from "react";
import { SwirledOutGameState } from "../game/game";

interface ActionModalProps {
  action: SwirledOutGameState["currentAction"];
  timerRemaining?: number;
  onSkip: () => void;
  onComplete: () => void;
  timerEnabled: boolean;
}

export default function ActionModal({
  action,
  timerRemaining,
  onSkip,
  onComplete,
  timerEnabled,
}: ActionModalProps) {
  const [localTimer, setLocalTimer] = useState(timerRemaining || 0);

  useEffect(() => {
    if (timerEnabled && timerRemaining !== undefined && timerRemaining > 0) {
      setLocalTimer(timerRemaining);
      const interval = setInterval(() => {
        setLocalTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timerRemaining, timerEnabled]);

  if (!action) return null;

  const intensityColors = {
    mild: "bg-green-900/40 border-green-500/50 text-green-200",
    medium: "bg-yellow-900/40 border-yellow-500/50 text-yellow-200",
    intense: "bg-red-900/40 border-red-500/50 text-red-200",
  };

  const categoryColors = {
    truth: "text-blue-300",
    dare: "text-pink-300",
    challenge: "text-purple-300",
    punishment: "text-red-300",
    reward: "text-green-300",
    wild: "text-yellow-300",
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-lg w-full border-2 border-purple-500/50 shadow-2xl">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className={`inline-block px-4 py-2 rounded-lg ${
                intensityColors[action.intensity]
              }`}
            >
              <span className="font-bold uppercase text-sm">
                {action.intensity}
              </span>
            </div>
            <div className={`text-2xl ${categoryColors[action.category]}`}>
              {categoryIcons[action.category]} {action.category}
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">Your Action</h2>
          <p className="text-2xl text-purple-200 font-medium mb-4">
            {action.text}
          </p>

          {/* Timer */}
          {timerEnabled && localTimer > 0 && (
            <div className="mb-4">
              <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-3">
                <div className="text-purple-300 text-sm mb-1">
                  Time Remaining
                </div>
                <div className="text-4xl font-bold text-purple-200">
                  {Math.floor(localTimer / 60)}:
                  {(localTimer % 60).toString().padStart(2, "0")}
                </div>
              </div>
            </div>
          )}

          {/* Punishment warning */}
          {action.punishment && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 mb-4">
              <p className="text-red-200 text-sm">
                ⚠️ If failed/skipped: {action.punishment}
              </p>
            </div>
          )}

          {/* Reward info */}
          {action.reward && (
            <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-3 mb-4">
              <p className="text-green-200 text-sm">
                🎁 Reward: {action.reward}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            ✓ I Completed This
          </button>

          <button
            onClick={onSkip}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Skip (No Judgment)
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg">
          <p className="text-blue-200 text-xs text-center">
            💬 Remember: All actions are consensual. You can skip at any time
            without judgment.
          </p>
        </div>
      </div>
    </div>
  );
}
