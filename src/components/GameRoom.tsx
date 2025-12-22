import { Client } from "boardgame.io/react";
import { Local } from "boardgame.io/multiplayer";
import { SwirledOutGame } from "../game/game";
import GameBoard from "./GameBoard";
import VideoChat from "./VideoChat";
import { useGameStore } from "../store/gameStore";
import Header from "./Header";

interface GameRoomProps {
  onLeave?: () => void;
}

const SwirledOutClient = Client({
  game: SwirledOutGame,
  board: GameBoard,
  multiplayer: Local(),
  numPlayers: 4,
});

export default function GameRoom({ onLeave }: GameRoomProps = {}) {
  const { currentRoom, setCurrentRoom } = useGameStore();
  const App = SwirledOutClient;

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
    if (onLeave) onLeave();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showRoomInfo={true} roomId={currentRoom} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleLeaveRoom}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium"
          >
            Leave Room
          </button>
        </div>

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Board - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <App playerID="0" />
            </div>
          </div>

          {/* Video Chat - Takes 1 column */}
          <div className="lg:col-span-1">
            <VideoChat roomId={currentRoom || ""} />
          </div>
        </div>
      </main>
    </div>
  );
}
