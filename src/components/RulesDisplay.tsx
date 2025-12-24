import { useState } from "react";

export default function RulesDisplay() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all transform hover:scale-105 z-40"
      >
        📖 View Rules
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-3xl w-full border-2 border-purple-500/50 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">📖 Game Rules</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6 text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-purple-300 mb-3">🎲 How to Play</h3>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>Roll the dice (2 dice = 2-12 total)</li>
              <li>Move your pawn the rolled number of spaces</li>
              <li>When you land on a tile, draw an action card</li>
              <li>Complete the action or skip (no judgment!)</li>
              <li>First player to reach the finish wins (or highest score/most actions, depending on settings)</li>
            </ol>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-purple-300 mb-3">🎴 Card Categories</h3>
            <ul className="space-y-2 ml-2">
              <li><strong className="text-blue-300">💭 Truth</strong> - Answer questions honestly</li>
              <li><strong className="text-pink-300">🎯 Dare</strong> - Perform physical actions</li>
              <li><strong className="text-purple-300">⚡ Challenge</strong> - Timed or skill-based tasks</li>
              <li><strong className="text-red-300">⚠️ Punishment</strong> - Negative consequences</li>
              <li><strong className="text-green-300">🎁 Reward</strong> - Positive bonuses</li>
              <li><strong className="text-yellow-300">🌟 Wild</strong> - Choose any category</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-purple-300 mb-3">🗺️ Board Tiles</h3>
            <ul className="space-y-2 ml-2">
              <li><strong className="text-green-400">Start</strong> - Beginning position</li>
              <li><strong className="text-gray-400">Normal</strong> - Regular spaces</li>
              <li><strong className="text-purple-400">Action</strong> - Draw action card</li>
              <li><strong className="text-orange-400">Punishment</strong> - Draw punishment card</li>
              <li><strong className="text-green-400">Reward</strong> - Move forward 2 spaces</li>
              <li><strong className="text-pink-400">Wild</strong> - Choose any category</li>
              <li><strong className="text-red-400">Finish</strong> - Win condition</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-purple-300 mb-3">⏱️ Timer System</h3>
            <p className="ml-2">
              Some cards have timers. Complete the action before time runs out, or face a punishment (if enabled).
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-purple-300 mb-3">🎯 Scoring</h3>
            <ul className="space-y-2 ml-2">
              <li><strong>Mild cards:</strong> 1 point</li>
              <li><strong>Medium cards:</strong> 2 points</li>
              <li><strong>Intense cards:</strong> 3 points</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-purple-300 mb-3">⚠️ Punishments</h3>
            <p className="ml-2">
              Punishments can occur when skipping actions, failing timed challenges, or landing on punishment tiles.
              Possible punishments include: moving back spaces, skipping turns, losing points, or drawing extra cards.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-purple-300 mb-3">🛑 Safe Word</h3>
            <p className="ml-2">
              Any player can pause the game at any time using the Safe Word button. All actions are consensual,
              and you can skip any action without judgment.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-purple-300 mb-3">➕ Custom Cards</h3>
            <p className="ml-2">
              Players can create custom action cards during the game. Click "Add Card" to create your own
              truth, dare, or challenge with custom intensity, timer, and rewards/punishments.
            </p>
          </section>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
}


