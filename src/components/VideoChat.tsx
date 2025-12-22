import { useEffect, useRef, useState } from "react";
import SimplePeer from "simple-peer";

interface VideoChatProps {
  roomId: string;
}

export default function VideoChat({ roomId: _roomId }: VideoChatProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<Map<string, SimplePeer.Instance>>(new Map());

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      localStream?.getTracks().forEach((track) => track.stop());
      peersRef.current.forEach((peer) => peer.destroy());
    };
  }, [localStream]);

  const startVideo = async () => {
    try {
      // Check if mediaDevices is available (requires HTTPS or localhost)
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          "Media devices not available. Video requires HTTPS or localhost."
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      setIsVideoEnabled(true);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert(
        "Could not access camera/microphone. You can still play without video."
      );
    }
  };

  const stopVideo = () => {
    localStream?.getTracks().forEach((track) => track.stop());
    setLocalStream(null);
    setIsVideoEnabled(false);
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  return (
    <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-purple-500/30 shadow-2xl p-4">
      <h3 className="text-white font-bold mb-4">Video Chat</h3>

      {!isVideoEnabled ? (
        <div className="space-y-4">
          <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-700 text-center">
            <p className="text-gray-300 mb-4">Video chat is optional</p>
            <button
              onClick={startVideo}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105 font-medium shadow-lg"
            >
              Enable Camera
            </button>
          </div>
          <p className="text-gray-400 text-xs text-center">
            🔒 Video is P2P only, never recorded or stored
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Local Video */}
          <div className="relative">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full rounded-lg bg-black"
            />
            <div className="absolute bottom-2 left-2 bg-gray-900/80 text-white px-2 py-1 rounded text-xs font-medium">
              You
            </div>
          </div>

          {/* Remote Videos */}
          {Array.from(remoteStreams.entries()).map(([id, stream]) => (
            <div key={id} className="relative">
              <video
                autoPlay
                playsInline
                ref={(video) => {
                  if (video) video.srcObject = stream;
                }}
                className="w-full rounded-lg bg-black"
              />
              <div className="absolute bottom-2 left-2 bg-gray-900/80 text-white px-2 py-1 rounded text-xs font-medium">
                Player {id}
              </div>
            </div>
          ))}

          {/* Controls */}
          <div className="flex gap-2">
            <button
              onClick={toggleAudio}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium ${
                isAudioEnabled
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              } text-white`}
            >
              {isAudioEnabled ? "🔊 Mute" : "🔇 Unmute"}
            </button>
            <button
              onClick={stopVideo}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Stop Video
            </button>
          </div>
        </div>
      )}

      {remoteStreams.size === 0 && isVideoEnabled && (
        <p className="text-gray-400 text-xs text-center mt-4">
          Waiting for other players to join video...
        </p>
      )}
    </div>
  );
}
