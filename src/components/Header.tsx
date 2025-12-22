interface HeaderProps {
  showRoomInfo?: boolean;
  roomId?: string | null;
  onLogoClick?: () => void;
}

export default function Header({ showRoomInfo, roomId, onLogoClick }: HeaderProps) {
  return (
    <header className="w-full border-b border-purple-500/30 bg-gray-900/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div
              onClick={onLogoClick}
              className={`flex items-center space-x-3 ${onLogoClick ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
            >
              <img
                src="/logo.png"
                alt="SwirledOut"
                className="h-12 w-auto"
                onError={(e) => {
                  // Fallback if logo doesn't load
                  const img = e.target as HTMLImageElement;
                  img.style.display = "none";
                }}
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                SwirledOut
              </h1>
            </div>
          </div>
          {showRoomInfo && roomId && (
            <div className="text-sm text-purple-300 font-medium">Room: {roomId}</div>
          )}
        </div>
      </div>
    </header>
  );
}
