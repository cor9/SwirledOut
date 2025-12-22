import { Server } from 'boardgame.io/server';
import { SwirledOutGame } from '../game/game';

const PORT = Number(process.env.PORT) || 8000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Create boardgame.io server with CORS configuration
const server = Server({
  games: [SwirledOutGame],
  // CORS is handled by boardgame.io server automatically
  // For custom CORS, you may need to configure the underlying Express app
});

// Run the server
server.run(PORT, () => {
  console.log(`SwirledOut server running on port ${PORT}`);
  console.log(`Game server available at http://localhost:${PORT}`);
  console.log(`Frontend URL: ${FRONTEND_URL}`);
});

