import { useState } from "react";
import Header from "./Header";

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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Age Verification Required
              </h1>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                <p className="text-yellow-800 text-sm font-medium">
                  ⚠️ 18+ Content
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-gray-700 text-center">
                This game contains adult content and themes. You must be 18 years
                or older to continue.
              </p>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">
                  I confirm that I am 18 years of age or older
                </span>
              </label>

              <button
                onClick={handleConfirm}
                disabled={!confirmed}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-md transition-colors"
              >
                Enter
              </button>

              <p className="text-gray-500 text-xs text-center">
                By entering, you agree that all content and interactions are
                consensual and that you understand the nature of this adult-themed
                game.
              </p>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            <a href="#" className="hover:text-gray-700">
              Change
            </a>
            {" | "}
            <a href="#" className="hover:text-gray-700">
              Terms and condition
            </a>
            {" | "}
            <a href="#" className="hover:text-gray-700">
              Privacy
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
