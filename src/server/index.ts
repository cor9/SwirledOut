import { Server } from 'boardgame.io/server';
import { SwirledOutGame } from '../game/game';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import express from 'express';

const PORT = Number(process.env.PORT) || 8000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Create Express app
const app = express();
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

// Create HTTP server
const httpServer = createServer(app);

// Create Socket.io server for WebRTC signaling
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// WebRTC signaling handlers
io.on('connection', (socket) => {
  console.log(`[WebRTC] Client connected: ${socket.id}`);

  socket.on('join-room', (roomId: string) => {
    socket.join(roomId);
    console.log(`[WebRTC] ${socket.id} joined room: ${roomId}`);

    // Notify other users in the room
    socket.to(roomId).emit('user-joined', socket.id);
  });

  socket.on('offer', (data: { offer: RTCSessionDescriptionInit; target: string; roomId: string }) => {
    console.log(`[WebRTC] Offer from ${socket.id} to ${data.target}`);
    socket.to(data.target).emit('offer', {
      offer: data.offer,
      sender: socket.id,
    });
  });

  socket.on('answer', (data: { answer: RTCSessionDescriptionInit; target: string }) => {
    console.log(`[WebRTC] Answer from ${socket.id} to ${data.target}`);
    socket.to(data.target).emit('answer', {
      answer: data.answer,
      sender: socket.id,
    });
  });

  socket.on('ice-candidate', (data: { candidate: any; target: string }) => {
    socket.to(data.target).emit('ice-candidate', {
      candidate: data.candidate,
      sender: socket.id,
    });
  });

  socket.on('disconnect', () => {
    console.log(`[WebRTC] Client disconnected: ${socket.id}`);
    socket.broadcast.emit('user-left', socket.id);
  });
});

// Create boardgame.io server
const bgServer = Server({
  games: [SwirledOutGame],
});

// Mount boardgame.io server - it returns an Express app
// Type assertion needed due to boardgame.io type definitions mismatch
app.use('/games', (bgServer.app || bgServer) as unknown as express.Application);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', webrtc: 'enabled' });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`SwirledOut server running on port ${PORT}`);
  console.log(`Game server available at http://localhost:${PORT}/games`);
  console.log(`WebRTC signaling available via Socket.io`);
  console.log(`Frontend URL: ${FRONTEND_URL}`);
});

