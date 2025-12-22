import { SwirledOutGameState } from "../game/game";

interface ActionModalProps {
  action: SwirledOutGameState["currentAction"];
  onSkip: () => void;
  onComplete: () => void;
}

export default function ActionModal({
  action,
  onSkip,
  onComplete,
}: ActionModalProps) {
  if (!action) return null;

  const intensityColors = {
    mild: "bg-green-900/40 border-green-500/50 text-green-200",
    medium: "bg-yellow-900/40 border-yellow-500/50 text-yellow-200",
    intense: "bg-red-900/40 border-red-500/50 text-red-200",
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-lg w-full border-2 border-purple-500/50 shadow-2xl">
        <div className="text-center mb-6">
          <div
            className={`inline-block px-4 py-2 rounded-lg mb-4 ${
              intensityColors[action.intensity]
            }`}
          >
            <span className="font-bold uppercase text-sm">
              {action.intensity}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Your Action</h2>
          <p className="text-2xl text-purple-200 font-medium">{action.text}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            I Completed This
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
