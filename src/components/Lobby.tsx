import { useState } from "react";
import { useGameStore } from "../store/gameStore";

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">
          SwirledOut
        </h1>
        <p className="text-white/70 text-center mb-8">
          Multiplayer Kink Boardgame
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-white mb-2">Your Name</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-4">
            <button
              onClick={handleCreateRoom}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Create New Room
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-white/70">or</span>
              </div>
            </div>

            <div>
              <label className="block text-white mb-2">Room ID</label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                placeholder="Enter room ID"
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 uppercase"
              />
            </div>

            <button
              onClick={handleJoinRoom}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Join Room
            </button>
          </div>

          {isCreating && (
            <div className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
              <p className="text-green-100 text-center">
                Room created! Share this ID:{" "}
                <span className="font-bold">{roomId || "Generating..."}</span>
              </p>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
            <p className="text-blue-100 text-xs text-center">
              🔒 All rooms are private and anonymous. No data is stored or
              logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
