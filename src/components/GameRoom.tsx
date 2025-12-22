import { Client } from "boardgame.io/react";
import { Local } from "boardgame.io/multiplayer";
import { SwirledOutGame } from "../game/game";
import GameBoard from "./GameBoard";
import VideoChat from "./VideoChat";
import { useGameStore } from "../store/gameStore";

const SwirledOutClient = Client({
  game: SwirledOutGame,
  board: GameBoard,
  multiplayer: Local(),
  numPlayers: 4,
});

export default function GameRoom() {
  const { currentRoom, setCurrentRoom } = useGameStore();
  const App = SwirledOutClient;

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">SwirledOut</h1>
            <p className="text-white/70 text-sm">Room: {currentRoom}</p>
          </div>
          <button
            onClick={handleLeaveRoom}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Leave Room
          </button>
        </div>

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Game Board - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <App playerID="0" />
            </div>
          </div>

          {/* Video Chat - Takes 1 column */}
          <div className="lg:col-span-1">
            <VideoChat roomId={currentRoom || ""} />
          </div>
        </div>
      </div>
    </div>
  );
}
