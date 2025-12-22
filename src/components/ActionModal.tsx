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
    mild: "bg-green-500/20 border-green-500/50 text-green-100",
    medium: "bg-yellow-500/20 border-yellow-500/50 text-yellow-100",
    intense: "bg-red-500/20 border-red-500/50 text-red-100",
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl p-8 max-w-lg w-full border-2 border-white/20 shadow-2xl">
        <div className="text-center mb-6">
          <div
            className={`inline-block px-4 py-2 rounded-lg mb-4 ${
              intensityColors[action.intensity]
            }`}
          >
            <span className="font-semibold uppercase">{action.intensity}</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Your Action</h2>
          <p className="text-2xl text-white/90 font-medium">{action.text}</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={onComplete}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            I Completed This
          </button>

          <button
            onClick={onSkip}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Skip (No Judgment)
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
          <p className="text-blue-100 text-xs text-center">
            💬 Remember: All actions are consensual. You can skip at any time
            without judgment.
          </p>
        </div>
      </div>
    </div>
  );
}
