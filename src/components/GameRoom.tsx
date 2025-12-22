import { useState, useEffect, useMemo } from "react";
import { Client } from "boardgame.io/react";
import { Local } from "boardgame.io/multiplayer";
import { SwirledOutGame } from "../game/game";
import GameBoard from "./GameBoard";
import VideoChat from "./VideoChat";
import GameSetup, { GameConfig } from "./GameSetup";
import RulesDisplay from "./RulesDisplay";
import { useGameStore } from "../store/gameStore";
import Header from "./Header";

// Create clients dynamically based on mode
// IMPORTANT: For solo games, do NOT use Local() - use pure single-player mode
// For multiplayer, use Local() for local testing
const createClient = (isSolo: boolean) => {
  console.log("[createClient] Creating client, isSolo:", isSolo);

  if (isSolo) {
    // SOLO MODE: Pure single-player, NO multiplayer prop
    // Explicitly set numPlayers: 1 to ensure ctx.numPlayers = 1 in setup
    const clientConfig: any = {
      game: SwirledOutGame,
      board: GameBoard,
      numPlayers: 1, // CRITICAL: This must be set to 1 for solo
      playerID: "0",
      // NO multiplayer prop - this is pure single-player mode
    };
    
    const client = Client(clientConfig);
    console.log(
      "[createClient] Solo client created with numPlayers: 1 (pure single-player, no multiplayer transport)"
    );
    return client;
  } else {
    // MULTIPLAYER MODE: Use Local() for local testing
    const client = Client({
      game: SwirledOutGame,
      board: GameBoard,
      multiplayer: Local(),
      numPlayers: 4, // Default for multiplayer
    });
    console.log(
      "[createClient] Multiplayer client created with Local() transport"
    );
    return client;
  }
};

export default function GameRoom() {
  const { currentRoom, setCurrentRoom, playerName } = useGameStore();
  const [showSetup, setShowSetup] = useState(true);
  const [gameKey, setGameKey] = useState(0);
  const isSolo = currentRoom?.startsWith("SOLO") ?? false;

  // Create the appropriate client based on solo/multiplayer
  // CRITICAL: Recreate client whenever solo status or gameKey changes
  const App = useMemo(() => {
    console.log(
      "[GameRoom] useMemo triggered - Creating client. Solo:",
      isSolo,
      "GameKey:",
      gameKey
    );
    const client = createClient(isSolo);
    console.log(
      "[GameRoom] Client created for",
      isSolo ? "solo" : "multiplayer",
      "mode"
    );
    return client;
  }, [isSolo, gameKey]);

  useEffect(() => {
    console.log(
      "[GameRoom] useEffect triggered - currentRoom:",
      currentRoom,
      "isSolo:",
      isSolo
    );
    // For solo play, skip setup and start immediately
    if (isSolo) {
      console.log(
        "[GameRoom] Solo mode detected - skipping setup, forcing new game"
      );
      setShowSetup(false);
      // Force a new game key to ensure fresh state - use timestamp for uniqueness
      const newKey = Date.now();
      console.log("[GameRoom] Setting gameKey to:", newKey);
      setGameKey(newKey);
    } else {
      // Show setup when entering room for multiplayer
      console.log("[GameRoom] Multiplayer mode - showing setup");
      setShowSetup(true);
      setGameKey(0);
    }
  }, [currentRoom, isSolo]);

  const handleStartGame = (_config: GameConfig) => {
    // TODO: Update Client with config.numPlayers and player names
    setShowSetup(false);
    // Force remount
    setGameKey((prev) => prev + 1);
  };

  const handleCancelSetup = () => {
    setCurrentRoom(null);
    setGameKey(0);
  };

  const handleLeaveRoom = () => {
    if (confirm("Are you sure you want to leave the game?")) {
      setCurrentRoom(null);
      setShowSetup(true);
      setGameKey(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header showRoomInfo={true} roomId={currentRoom} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Game Setup Modal */}
        {showSetup && (
          <GameSetup
            onStart={handleStartGame}
            onCancel={handleCancelSetup}
            isSolo={isSolo}
          />
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
                {/* Multiple keys to force complete remount: room ID, solo status, and game key */}
                {/* Force complete remount with unique key that includes timestamp */}
                <App
                  key={`${
                    isSolo ? "solo" : "multi"
                  }-${currentRoom}-${gameKey}-${Date.now()}`}
                  playerID="0"
                  matchID={
                    isSolo ? `SOLO-${currentRoom}` : currentRoom || undefined
                  }
                />
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
