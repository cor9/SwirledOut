import { useState } from "react";
import { ActionCard, IntensityLevel, CardCategory } from "../game/game";

interface CardEditorProps {
  onSave: (card: ActionCard) => void;
  onClose: () => void;
  existingCard?: ActionCard;
}

export default function CardEditor({ onSave, onClose, existingCard }: CardEditorProps) {
  const [text, setText] = useState(existingCard?.text || "");
  const [intensity, setIntensity] = useState<IntensityLevel>(existingCard?.intensity || "mild");
  const [category, setCategory] = useState<CardCategory>(existingCard?.category || "truth");
  const [timerSeconds, setTimerSeconds] = useState(existingCard?.timerSeconds?.toString() || "");
  const [punishment, setPunishment] = useState(existingCard?.punishment || "");
  const [reward, setReward] = useState(existingCard?.reward || "");

  const handleSave = () => {
    if (!text.trim()) {
      alert("Please enter card text");
      return;
    }

    const card: ActionCard = {
      id: existingCard?.id || `card-${Date.now()}`,
      text: text.trim(),
      intensity,
      category,
      timerSeconds: timerSeconds ? parseInt(timerSeconds, 10) : undefined,
      punishment: punishment.trim() || undefined,
      reward: reward.trim() || undefined,
    };

    onSave(card);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full border-2 border-purple-500/50 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">
          {existingCard ? "Edit Card" : "Create New Card"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Card Text *
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the action, truth, or dare..."
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Intensity
              </label>
              <select
                value={intensity}
                onChange={(e) => setIntensity(e.target.value as IntensityLevel)}
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="mild">Mild</option>
                <option value="medium">Medium</option>
                <option value="intense">Intense</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CardCategory)}
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="truth">Truth</option>
                <option value="dare">Dare</option>
                <option value="challenge">Challenge</option>
                <option value="punishment">Punishment</option>
                <option value="reward">Reward</option>
                <option value="wild">Wild</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Timer (seconds, optional)
            </label>
            <input
              type="number"
              value={timerSeconds}
              onChange={(e) => setTimerSeconds(e.target.value)}
              placeholder="e.g., 60"
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Punishment (if failed/skipped, optional)
            </label>
            <input
              type="text"
              value={punishment}
              onChange={(e) => setPunishment(e.target.value)}
              placeholder="e.g., Move back 3 spaces"
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Reward (if completed, optional)
            </label>
            <input
              type="text"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              placeholder="e.g., Move forward 2 spaces"
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Save Card
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}


