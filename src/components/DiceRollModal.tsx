import { useEffect, useState } from "react";

interface DiceRollModalProps {
  roll: number;
  die1?: number;
  die2?: number;
  onClose: () => void;
  tileInstruction?: string;
}

export default function DiceRollModal({
  roll,
  die1,
  die2,
  onClose,
  tileInstruction,
}: DiceRollModalProps) {
  const [isAnimating, setIsAnimating] = useState(true);
  const [displayRoll, setDisplayRoll] = useState(0);

  useEffect(() => {
    // Animate dice rolling
    const interval = setInterval(() => {
      setDisplayRoll(Math.floor(Math.random() * 11) + 2);
    }, 100);

    // Stop animation after 1.5 seconds and show actual roll
    setTimeout(() => {
      setIsAnimating(false);
      setDisplayRoll(roll);
      clearInterval(interval);
    }, 1500);

    return () => clearInterval(interval);
  }, [roll]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl p-8 max-w-md w-full border-2 border-purple-500/50 shadow-2xl text-center">
        <h2 className="text-3xl font-bold text-white mb-6">🎲 Dice Roll!</h2>

        <div className="mb-6">
          {die1 && die2 ? (
            <div className="flex justify-center gap-4 mb-4">
              <div className="bg-white/20 rounded-xl p-6 border-2 border-white/30">
                <div className="text-4xl mb-2">🎲</div>
                <div className="text-3xl font-bold text-white">
                  {isAnimating ? displayRoll : die1}
                </div>
              </div>
              <div className="text-4xl text-white flex items-center">+</div>
              <div className="bg-white/20 rounded-xl p-6 border-2 border-white/30">
                <div className="text-4xl mb-2">🎲</div>
                <div className="text-3xl font-bold text-white">
                  {isAnimating ? displayRoll : die2}
                </div>
              </div>
            </div>
          ) : null}

          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 border-2 border-white/30">
            <div className="text-sm text-purple-200 mb-2 uppercase tracking-wide">
              Total Roll
            </div>
            <div
              className={`text-7xl font-bold text-white transition-all ${
                isAnimating ? "animate-pulse" : ""
              }`}
            >
              {displayRoll}
            </div>
            <div className="text-purple-200 text-sm mt-2">
              Move {displayRoll} spaces forward
            </div>
          </div>
        </div>

        {tileInstruction && !isAnimating && (
          <div className="mb-4 bg-white/10 rounded-xl p-4 border border-white/20">
            <div className="text-sm text-purple-200 mb-1">
              Tile Instruction:
            </div>
            <div className="text-white font-medium">{tileInstruction}</div>
          </div>
        )}

        {!isAnimating && (
          <button
            onClick={onClose}
            className="w-full bg-white hover:bg-gray-100 text-purple-900 font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
