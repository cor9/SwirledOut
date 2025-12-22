import { useState } from "react";

interface AgeGateProps {
  onVerify: () => void;
}

export default function AgeGate({ onVerify }: AgeGateProps) {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (confirmed) {
      // Store age verification in sessionStorage (not localStorage for privacy)
      sessionStorage.setItem("ageVerified", "true");
      onVerify();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
        <h1 className="text-4xl font-bold text-white mb-6 text-center">
          SwirledOut
        </h1>
        <div className="space-y-6">
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
            <p className="text-yellow-100 text-center font-semibold">
              ⚠️ Age Verification Required
            </p>
          </div>

          <p className="text-white/90 text-center">
            This game contains adult content and themes. You must be 18 years or
            older to continue.
          </p>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-white">
              I confirm that I am 18 years of age or older
            </span>
          </label>

          <button
            onClick={handleConfirm}
            disabled={!confirmed}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Enter
          </button>

          <p className="text-white/60 text-xs text-center">
            By entering, you agree that all content and interactions are
            consensual and that you understand the nature of this adult-themed
            game.
          </p>
        </div>
      </div>
    </div>
  );
}
