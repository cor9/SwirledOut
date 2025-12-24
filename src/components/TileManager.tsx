import { useState } from "react";
import { BoardProps } from "boardgame.io/react";
import { SwirledOutGameState, BoardTile, TileType } from "../game/game";

interface TileManagerProps {
  G: SwirledOutGameState;
  ctx: BoardProps<SwirledOutGameState>["ctx"];
  moves: BoardProps<SwirledOutGameState>["moves"];
  onClose: () => void;
}

export default function TileManager({ G, ctx, moves, onClose }: TileManagerProps) {
  const [selectedTile, setSelectedTile] = useState<BoardTile | null>(null);
  const [gameMode, setGameMode] = useState<string>("all");
  const [intensity, setIntensity] = useState<string>("all");
  const [importData, setImportData] = useState<string>("");
  const [exportData, setExportData] = useState<string>("");

  const filteredTiles = G.boardTiles.filter((tile) => {
    if (gameMode !== "all" && tile.type !== gameMode) return false;
    // Intensity filtering would require tiles to have intensity property
    return true;
  });

  const handleExport = () => {
    const data = {
      tiles: G.boardTiles,
      boardSize: G.boardSize,
      timestamp: Date.now(),
    };
    setExportData(JSON.stringify(data, null, 2));
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(importData);
      if (data.tiles && Array.isArray(data.tiles)) {
        // Update tiles - this would need a move to replace all tiles
        data.tiles.forEach((tile: BoardTile) => {
          if (moves.updateBoardTile) {
            moves.updateBoardTile(tile.id, tile);
          }
        });
        alert("Tiles imported successfully!");
        setImportData("");
      }
    } catch (error) {
      alert("Invalid import data. Please check the format.");
    }
  };

  const handleAddTile = () => {
    const newTile: BoardTile = {
      id: G.boardTiles.length,
      type: "normal",
      position: G.boardTiles.length,
    };
    if (moves.addBoardTile) {
      moves.addBoardTile(newTile);
    }
  };

  const handleDeleteTile = (tileId: number) => {
    if (confirm("Are you sure you want to delete this tile?")) {
      if (moves.removeBoardTile) {
        moves.removeBoardTile(tileId);
      }
    }
  };

  const getTileTypeColor = (type: TileType) => {
    switch (type) {
      case "start":
        return "bg-green-600";
      case "finish":
        return "bg-red-600";
      case "action":
        return "bg-purple-600";
      case "punishment":
        return "bg-orange-600";
      case "reward":
        return "bg-green-500";
      case "wild":
        return "bg-pink-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-6xl w-full border-2 border-purple-500/50 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Manage Game Tiles</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Game Mode
            </label>
            <select
              value={gameMode}
              onChange={(e) => setGameMode(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600"
            >
              <option value="all">All Types</option>
              <option value="start">Start</option>
              <option value="finish">Finish</option>
              <option value="action">Action</option>
              <option value="punishment">Punishment</option>
              <option value="reward">Reward</option>
              <option value="wild">Wild</option>
              <option value="normal">Normal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Intensity Level
            </label>
            <select
              value={intensity}
              onChange={(e) => setIntensity(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600"
            >
              <option value="all">All</option>
              <option value="mild">Mild</option>
              <option value="medium">Medium</option>
              <option value="intense">Intense</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAddTile}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-all font-medium"
            >
              ➕ Add Tile
            </button>
          </div>
        </div>

        {/* Tiles Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          {filteredTiles.map((tile) => (
            <div
              key={tile.id}
              className={`${getTileTypeColor(tile.type)} rounded-lg p-3 border-2 border-white/20 cursor-pointer hover:scale-105 transition-transform ${
                selectedTile?.id === tile.id ? "ring-2 ring-yellow-400" : ""
              }`}
              onClick={() => setSelectedTile(tile)}
            >
              <div className="text-white font-bold text-sm mb-1">
                #{tile.position + 1}
              </div>
              <div className="text-white text-xs uppercase">
                {tile.type}
              </div>
              {tile.specialEffect && (
                <div className="text-white/80 text-xs mt-1">
                  {tile.specialEffect}
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTile(tile.id);
                }}
                className="mt-2 text-red-300 hover:text-red-100 text-xs"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Import/Export Section */}
        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-xl font-bold text-white mb-4">Import/Export</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Export Scope
              </label>
              <select className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 mb-4">
                <option>All Data</option>
                <option>Tiles Only</option>
                <option>Cards Only</option>
              </select>
              <textarea
                value={exportData}
                readOnly
                placeholder="Click Export to generate data..."
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 h-32 font-mono text-xs"
              />
              <button
                onClick={handleExport}
                className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Export
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Import Data
              </label>
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste import data here..."
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 h-32 font-mono text-xs"
              />
              <button
                onClick={handleImport}
                className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Import
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

