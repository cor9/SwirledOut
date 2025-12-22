import { useState } from "react";
import Header from "./Header";

interface AgeGateProps {
  onVerify: () => void;
}

export default function AgeGate({ onVerify }: AgeGateProps) {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (confirmed) {
      sessionStorage.setItem("ageVerified", "true");
      onVerify();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 shadow-2xl">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-white mb-4">
                Age Verification Required
              </h1>
              <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4 mb-4">
                <p className="text-yellow-300 text-sm font-medium">
                  ⚠️ 18+ Content
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-gray-300 text-center">
                This game contains adult content and themes. You must be 18
                years or older to continue.
              </p>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-1 w-5 h-5 text-purple-600 border-gray-600 bg-gray-700 rounded focus:ring-purple-500 focus:ring-2"
                />
                <span className="text-gray-300 text-sm">
                  I confirm that I am 18 years of age or older
                </span>
              </label>

              <button
                onClick={handleConfirm}
                disabled={!confirmed}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:transform-none shadow-lg"
              >
                Enter
              </button>

              <p className="text-gray-400 text-xs text-center">
                By entering, you agree that all content and interactions are
                consensual and that you understand the nature of this
                adult-themed game.
              </p>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            <a href="#" className="hover:text-gray-400 transition-colors">
              Change
            </a>
            {" | "}
            <a href="#" className="hover:text-gray-400 transition-colors">
              Terms and condition
            </a>
            {" | "}
            <a href="#" className="hover:text-gray-400 transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
