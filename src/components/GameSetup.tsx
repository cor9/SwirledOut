import { useState } from "react";
import { GameRules } from "../game/game";

interface GameSetupProps {
  onStart: (config: GameConfig) => void;
  onCancel: () => void;
  isSolo?: boolean;
}

export interface GameConfig {
  numPlayers: number;
  boardSize: number;
  rules: GameRules;
  playerNames: string[];
}

export default function GameSetup({ onStart, onCancel, isSolo = false }: GameSetupProps) {
  const [numPlayers, setNumPlayers] = useState(isSolo ? 1 : 4);
  const [boardSize, setBoardSize] = useState(30);
  const [playerNames, setPlayerNames] = useState<string[]>(isSolo ? [""] : ["", "", "", ""]);
  const [winCondition, setWinCondition] = useState<GameRules["winCondition"]>("first_to_finish");
  const [allowSkip, setAllowSkip] = useState(true);
  const [punishmentOnSkip, setPunishmentOnSkip] = useState(true);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [defaultTimerSeconds, setDefaultTimerSeconds] = useState(60);

  const handleNumPlayersChange = (value: number) => {
    setNumPlayers(value);
    const newNames = [...playerNames];
    while (newNames.length < value) {
      newNames.push("");
    }
    while (newNames.length > value) {
      newNames.pop();
    }
    setPlayerNames(newNames);
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStart = () => {
    // Validate player names
    const validNames = playerNames.slice(0, numPlayers).filter((name) => name.trim());
    if (validNames.length !== numPlayers) {
      alert(`Please enter names for all ${numPlayers} players`);
      return;
    }

    const config: GameConfig = {
      numPlayers,
      boardSize,
      rules: {
        winCondition,
        allowSkip,
        punishmentOnSkip,
        timerEnabled,
        defaultTimerSeconds,
      },
      playerNames: validNames,
    };

    onStart(config);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-3xl w-full border-2 border-purple-500/50 shadow-2xl my-8">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          🎮 Game Setup
        </h2>

        <div className="space-y-6">
          {/* Number of Players - Hidden for solo play */}
          {!isSolo && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Number of Players
              </label>
              <select
                value={numPlayers}
                onChange={(e) => handleNumPlayersChange(parseInt(e.target.value, 10))}
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {[2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} Players
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Solo Play Info */}
          {isSolo && (
            <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎮</span>
                <div>
                  <p className="text-purple-200 font-semibold">Solo Play Mode</p>
                  <p className="text-purple-300 text-sm">Playing by yourself - just you against the board!</p>
                </div>
              </div>
            </div>
          )}

          {/* Player Names */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Player Names
            </label>
            <div className="space-y-2">
              {Array.from({ length: numPlayers }).map((_, idx) => (
                <input
                  key={idx}
                  id={`player-${idx + 1}-name`}
                  name={`player-${idx + 1}-name`}
                  type="text"
                  value={playerNames[idx] || ""}
                  onChange={(e) => handlePlayerNameChange(idx, e.target.value)}
                  placeholder={`Player ${idx + 1} name`}
                  autoComplete="name"
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ))}
            </div>
          </div>

          {/* Board Size */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Board Size: {boardSize} tiles
            </label>
            <input
              type="range"
              min="20"
              max="50"
              value={boardSize}
              onChange={(e) => setBoardSize(parseInt(e.target.value, 10))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>20 (Short)</span>
              <span>35 (Medium)</span>
              <span>50 (Long)</span>
            </div>
          </div>

          {/* Win Condition */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Win Condition
            </label>
            <select
              value={winCondition}
              onChange={(e) => setWinCondition(e.target.value as GameRules["winCondition"])}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="first_to_finish">First to Finish</option>
              <option value="most_actions">Most Actions Completed</option>
              <option value="highest_score">Highest Score</option>
            </select>
          </div>

          {/* Game Rules */}
          <div className="bg-gray-700/30 rounded-lg p-4 space-y-3">
            <h3 className="text-lg font-semibold text-white mb-3">Game Rules</h3>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={allowSkip}
                onChange={(e) => setAllowSkip(e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-gray-300">Allow players to skip actions</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={punishmentOnSkip}
                onChange={(e) => setPunishmentOnSkip(e.target.checked)}
                disabled={!allowSkip}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 disabled:opacity-50"
              />
              <span className="text-gray-300">Apply punishment when skipping</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={timerEnabled}
                onChange={(e) => setTimerEnabled(e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-gray-300">Enable timers for timed challenges</span>
            </label>

            {timerEnabled && (
              <div className="ml-8">
                <label className="block text-sm text-gray-400 mb-1">
                  Default Timer: {defaultTimerSeconds} seconds
                </label>
                <input
                  type="range"
                  min="30"
                  max="180"
                  step="10"
                  value={defaultTimerSeconds}
                  onChange={(e) => setDefaultTimerSeconds(parseInt(e.target.value, 10))}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleStart}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Start Game
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

