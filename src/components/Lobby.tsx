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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <p className="text-gray-600 text-sm mb-2">
                Step into our playful dice game community, where kinky minds craft
                the experience.
              </p>
              <p className="text-gray-500 text-xs">
                Registration and login are optional to access the game.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCreateRoom}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors"
                >
                  Create New Room
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room ID
                  </label>
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    placeholder="Enter room ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
                  />
                </div>

                <button
                  onClick={handleJoinRoom}
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-2.5 px-4 rounded-md transition-colors"
                >
                  Join Room
                </button>
              </div>

              {isCreating && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-800 text-sm text-center">
                    Room created! Share this ID:{" "}
                    <span className="font-bold">{roomId || "Generating..."}</span>
                  </p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-gray-500 text-xs text-center">
                  🔒 All rooms are private and anonymous. No data is stored or
                  logged.
                </p>
              </div>
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
