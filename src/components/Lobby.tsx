import { useState } from "react";
import { useGameStore } from "../store/gameStore";
import Header from "./Header";

export default function Lobby() {
  const [roomId, setRoomId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { setCurrentRoom, setPlayerName: setStorePlayerName } = useGameStore();

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 9).toUpperCase();
  };

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      alert("Please enter your name");
      return;
    }
    const newRoomId = generateRoomId();
    setRoomId(newRoomId);
    setStorePlayerName(playerName);
    setCurrentRoom(newRoomId);
    setIsCreating(true);
  };

  const handleJoinRoom = () => {
    if (!playerName.trim() || !roomId.trim()) {
      alert("Please enter your name and room ID");
      return;
    }
    setStorePlayerName(playerName);
    setCurrentRoom(roomId.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Join the Experience
              </h2>
              <p className="text-gray-300 text-sm">
                Enter your name and begin the session
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Display name *
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && playerName.trim()) {
                      handleCreateRoom();
                    }
                  }}
                />
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCreateRoom}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  Enter Session
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-800 text-gray-400">or</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Room ID
                  </label>
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    placeholder="Enter room ID"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
                    onKeyPress={(e) => {
                      if (
                        e.key === "Enter" &&
                        playerName.trim() &&
                        roomId.trim()
                      ) {
                        handleJoinRoom();
                      }
                    }}
                  />
                </div>

                <button
                  onClick={handleJoinRoom}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Join Room
                </button>
              </div>

              {isCreating && (
                <div className="mt-4 p-4 bg-green-900/30 border border-green-500/50 rounded-lg">
                  <p className="text-green-300 text-center text-sm">
                    Room created! Share this ID:{" "}
                    <span className="font-bold text-green-200">
                      {roomId || "Generating..."}
                    </span>
                  </p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-gray-400 text-xs text-center">
                  🔒 All rooms are private and anonymous. No data is stored or
                  logged.
                </p>
              </div>
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
