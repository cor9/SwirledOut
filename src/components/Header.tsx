interface HeaderProps {
  showRoomInfo?: boolean;
  roomId?: string | null;
  onLogoClick?: () => void;
}

export default function Header({ showRoomInfo, roomId, onLogoClick }: HeaderProps) {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div
              onClick={onLogoClick}
              className={`flex items-center space-x-3 ${onLogoClick ? "cursor-pointer hover:opacity-80" : ""}`}
            >
              <img
                src="/logo.png"
                alt="SwirledOut"
                className="h-10 w-auto"
                onError={(e) => {
                  // Fallback if logo doesn't load
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <h1 className="text-2xl font-bold text-gray-900">SwirledOut</h1>
            </div>
          </div>
          {showRoomInfo && roomId && (
            <div className="text-sm text-gray-600">Room: {roomId}</div>
          )}
        </div>
      </div>
    </header>
  );
}

