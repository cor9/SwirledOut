import { useState, useEffect } from "react";
import { Client } from "boardgame.io/react";
import { Local } from "boardgame.io/multiplayer";
import { SwirledOutGame } from "../game/game";
import GameBoard from "./GameBoard";
import VideoChat from "./VideoChat";
import GameSetup, { GameConfig } from "./GameSetup";
import RulesDisplay from "./RulesDisplay";
import { useGameStore } from "../store/gameStore";
import Header from "./Header";

const SwirledOutClient = Client({
  game: SwirledOutGame,
  board: GameBoard,
  multiplayer: Local(),
  numPlayers: 4,
});

// Solo play client - 1 player
const SoloClient = Client({
  game: SwirledOutGame,
  board: GameBoard,
  multiplayer: Local(),
  numPlayers: 1,
});

export default function GameRoom() {
  const { currentRoom, setCurrentRoom, playerName } = useGameStore();
  const [showSetup, setShowSetup] = useState(true);
  const isSolo = currentRoom === "SOLO";
  const App = isSolo ? SoloClient : SwirledOutClient;

  useEffect(() => {
    // Show setup when entering room
    setShowSetup(true);
  }, [currentRoom]);

  const handleStartGame = (_config: GameConfig) => {
    // TODO: Update Client with config.numPlayers and player names
    setShowSetup(false);
  };

  const handleCancelSetup = () => {
    setCurrentRoom(null);
  };

  const handleLeaveRoom = () => {
    if (confirm("Are you sure you want to leave the game?")) {
      setCurrentRoom(null);
      setShowSetup(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header showRoomInfo={true} roomId={currentRoom} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Game Setup Modal */}
        {showSetup && (
          <GameSetup onStart={handleStartGame} onCancel={handleCancelSetup} />
        )}

        {/* Rules Display Button */}
        {!showSetup && <RulesDisplay />}

        {/* Leave Room Button */}
        {!showSetup && (
          <div className="mb-4 flex justify-between items-center">
            <div className="text-white">
              <p className="text-sm text-gray-400">
                {isSolo ? (
                  <span>
                    Playing Solo as:{" "}
                    <span className="font-semibold text-purple-300">
                      {playerName || "Player"}
                    </span>
                  </span>
                ) : (
                  <span>
                    Playing as:{" "}
                    <span className="font-semibold text-purple-300">
                      {playerName || "Player"}
                    </span>
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={handleLeaveRoom}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-lg"
            >
              Leave {isSolo ? "Game" : "Room"}
            </button>
          </div>
        )}

        {/* Main Game Area */}
        {!showSetup && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Game Board - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-purple-500/30 shadow-2xl p-6">
                <App playerID="0" />
              </div>
            </div>

            {/* Video Chat - Only show for multiplayer */}
            {!isSolo && (
              <div className="lg:col-span-1">
                <VideoChat roomId={currentRoom || ""} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
