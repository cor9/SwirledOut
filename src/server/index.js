import { Server } from "boardgame.io/server";
import { SwirledOutGame } from "../game/game.ts";
import cors from "cors";
import express from "express";

const PORT = process.env.PORT || 8000;

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Create boardgame.io server
const server = Server({
  games: [SwirledOutGame],
});

// Mount boardgame.io server
app.use("/games", server);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`SwirledOut server running on port ${PORT}`);
  console.log(`Game server available at http://localhost:${PORT}/games`);
});
