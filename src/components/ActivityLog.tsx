import { useEffect, useRef } from "react";
import { GameEvent } from "../game/game";

interface ActivityLogProps {
  events: GameEvent[];
}

export default function ActivityLog({ events }: ActivityLogProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new events arrive
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 60000) {
      return "just now";
    } else if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
  };

  const getEventIcon = (type: GameEvent["type"]) => {
    switch (type) {
      case "roll":
        return "🎲";
      case "move":
        return "👣";
      case "action":
        return "🎯";
      case "complete":
        return "✅";
      case "skip":
        return "⏭️";
      case "punishment":
        return "⚠️";
      case "reward":
        return "🎁";
      default:
        return "📝";
    }
  };

  const getEventColor = (type: GameEvent["type"]) => {
    switch (type) {
      case "roll":
        return "text-purple-300";
      case "move":
        return "text-blue-300";
      case "action":
        return "text-pink-300";
      case "complete":
        return "text-green-300";
      case "skip":
        return "text-gray-400";
      case "punishment":
        return "text-red-300";
      case "reward":
        return "text-yellow-300";
      default:
        return "text-gray-300";
    }
  };

  return (
    <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-purple-500/30 shadow-2xl h-full flex flex-col">
      <div className="p-4 border-b border-purple-500/30">
        <h3 className="text-xl font-bold text-white">Activity Log</h3>
        <p className="text-sm text-gray-400 mt-1">
          {events.length} event{events.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {events.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No activity yet. Start playing to see events here!</p>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="bg-gray-700/50 rounded-lg p-3 border border-gray-600/50"
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">{getEventIcon(event.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-semibold text-sm ${getEventColor(event.type)}`}>
                      {event.playerName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(event.timestamp)}
                    </span>
                  </div>
                  <p className="text-white text-sm break-words">
                    {event.message}
                  </p>
                  {event.data?.roll && (
                    <div className="mt-1 text-xs text-purple-300">
                      Rolled: {event.data.roll}
                    </div>
                  )}
                  {event.data?.tile && (
                    <div className="mt-1 text-xs text-blue-300">
                      Tile: {event.data.tile.type}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}

