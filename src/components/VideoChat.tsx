import { useEffect, useRef, useState } from "react";
import SimplePeer from "simple-peer";
import { io, Socket } from "socket.io-client";

interface VideoChatProps {
  roomId: string;
}

// Get server URL from environment or use default
const getServerUrl = (): string => {
  try {
    return (import.meta as any).env?.VITE_SERVER_URL || "http://localhost:8000";
  } catch {
    return "http://localhost:8000";
  }
};

const SERVER_URL = getServerUrl();

export default function VideoChat({ roomId }: VideoChatProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(
    new Map()
  );
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [connectedUsers, setConnectedUsers] = useState<Set<string>>(new Set());
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<Map<string, SimplePeer.Instance>>(new Map());
  const socketRef = useRef<Socket | null>(null);
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  // Initialize Socket.io connection
  useEffect(() => {
    if (!roomId) return;

    const socket = io(SERVER_URL, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[VideoChat] Connected to signaling server");
      socket.emit("join-room", roomId);
    });

    socket.on("user-joined", (userId: string) => {
      console.log("[VideoChat] User joined:", userId);
      setConnectedUsers((prev) => new Set(prev).add(userId));

      // If we have a local stream, create an offer
      if (localStream && socket.id) {
        createPeerConnection(userId, true);
      }
    });

    socket.on("user-left", (userId: string) => {
      console.log("[VideoChat] User left:", userId);
      setConnectedUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });

      // Clean up peer connection
      const peer = peersRef.current.get(userId);
      if (peer) {
        peer.destroy();
        peersRef.current.delete(userId);
      }

      // Remove remote stream
      setRemoteStreams((prev) => {
        const next = new Map(prev);
        next.delete(userId);
        return next;
      });
    });

    socket.on(
      "offer",
      async (data: { offer: RTCSessionDescriptionInit; sender: string }) => {
        console.log("[VideoChat] Received offer from:", data.sender);
        if (localStream) {
          await createPeerConnection(data.sender, false);
          const peer = peersRef.current.get(data.sender);
          if (peer) {
            await peer.signal(data.offer);
          }
        }
      }
    );

    socket.on(
      "answer",
      async (data: { answer: RTCSessionDescriptionInit; sender: string }) => {
        console.log("[VideoChat] Received answer from:", data.sender);
        const peer = peersRef.current.get(data.sender);
        if (peer) {
          await peer.signal(data.answer);
        }
      }
    );

    socket.on(
      "ice-candidate",
      (data: { candidate: SimplePeer.SignalData; sender: string }) => {
        const peer = peersRef.current.get(data.sender);
        if (peer) {
          peer.signal(data.candidate as SimplePeer.SignalData);
        }
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [roomId, localStream]);

  const createPeerConnection = (userId: string, isInitiator: boolean) => {
    if (peersRef.current.has(userId)) {
      console.log("[VideoChat] Peer connection already exists for:", userId);
      return;
    }

    const peer = new SimplePeer({
      initiator: isInitiator,
      trickle: false,
      stream: localStream || undefined,
    });

    peer.on("signal", (data: SimplePeer.SignalData) => {
      if (!socketRef.current) return;

      const signalData = data as any;
      if (signalData.type === "offer") {
        socketRef.current.emit("offer", {
          offer: data,
          target: userId,
          roomId,
        });
      } else if (signalData.type === "answer") {
        socketRef.current.emit("answer", {
          answer: data,
          target: userId,
        });
      } else if (signalData.candidate || signalData.type === "candidate") {
        socketRef.current.emit("ice-candidate", {
          candidate: data,
          target: userId,
        });
      }
    });

    peer.on("stream", (stream: MediaStream) => {
      console.log("[VideoChat] Received remote stream from:", userId);
      setRemoteStreams((prev) => {
        const next = new Map(prev);
        next.set(userId, stream);
        return next;
      });

      // Update video element
      const videoElement = remoteVideoRefs.current.get(userId);
      if (videoElement) {
        videoElement.srcObject = stream;
      }
    });

    peer.on("error", (err) => {
      console.error("[VideoChat] Peer error:", err);
    });

    peer.on("close", () => {
      console.log("[VideoChat] Peer connection closed:", userId);
      peersRef.current.delete(userId);
      setRemoteStreams((prev) => {
        const next = new Map(prev);
        next.delete(userId);
        return next;
      });
    });

    peersRef.current.set(userId, peer);
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      localStream?.getTracks().forEach((track) => track.stop());
      peersRef.current.forEach((peer) => peer.destroy());
      socketRef.current?.disconnect();
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
                  if (video) {
                    remoteVideoRefs.current.set(id, video);
                    video.srcObject = stream;
                  }
                }}
                className="w-full rounded-lg bg-black"
              />
              <div className="absolute bottom-2 left-2 bg-gray-900/80 text-white px-2 py-1 rounded text-xs font-medium">
                Player {id.slice(0, 8)}
              </div>
            </div>
          ))}

          {/* Connected users without video */}
          {Array.from(connectedUsers)
            .filter((id) => !remoteStreams.has(id))
            .map((id) => (
              <div
                key={id}
                className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 text-center"
              >
                <p className="text-gray-300 text-sm">
                  Player {id.slice(0, 8)} (no video)
                </p>
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

      {remoteStreams.size === 0 &&
        isVideoEnabled &&
        connectedUsers.size === 0 && (
          <p className="text-gray-400 text-xs text-center mt-4">
            Waiting for other players to join video...
          </p>
        )}

      {connectedUsers.size > 0 && (
        <p className="text-gray-400 text-xs text-center mt-4">
          {connectedUsers.size} player(s) in room
        </p>
      )}
    </div>
  );
}
