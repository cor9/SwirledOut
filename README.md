# SwirledOut

Multiplayer online kink boardgame - An open-source, privacy-focused, turn-based multiplayer web app.

## Features

- 🎲 Turn-based board game using boardgame.io
- 🎴 Customizable action tiles/cards with intensity levels (mild/medium/intense)
- 🔒 Private rooms with shareable links (anonymous play)
- 📹 Integrated webcam/video chat via WebRTC (P2P)
- 🛡️ Consent tools: Skip buttons, boundary presets, safe word pause
- 👥 Adult/kink theme: Consensual, exciting, user-customizable dares/challenges
- 🔐 Privacy first: No logging, age-gate (18+), optional video

## Tech Stack

- **Frontend**: React 18+, TypeScript, Vite, Tailwind CSS
- **Game Logic**: boardgame.io
- **Multiplayer Sync**: boardgame.io server (Node.js)
- **Video Chat**: WebRTC with simple-peer (P2P mesh)
- **Backend**: Node.js/Express
- **State Management**: Zustand

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/cor9/SwirledOut.git
cd SwirledOut
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. (Optional) Start the game server for multiplayer:

```bash
npm run server
```

The app will be available at `http://localhost:3000`

## Project Structure

```
SwirledOut/
├── src/
│   ├── components/      # React components
│   │   ├── AgeGate.tsx      # 18+ age verification
│   │   ├── Lobby.tsx         # Room creation/joining
│   │   ├── GameRoom.tsx      # Main game room
│   │   ├── GameBoard.tsx     # Game board UI
│   │   ├── ActionModal.tsx   # Action card display
│   │   └── VideoChat.tsx      # WebRTC video chat
│   ├── game/
│   │   └── game.ts           # boardgame.io game definition
│   ├── store/
│   │   └── gameStore.ts      # Zustand state management
│   ├── server/
│   │   └── index.ts          # boardgame.io server
│   ├── types/
│   │   └── index.ts          # TypeScript types
│   ├── App.tsx
│   └── main.tsx
├── .cursor/              # Project context files
└── package.json
```

## Core Principles

- **Privacy First**: No logging of actions/prompts, age-gate (18+ confirmation)
- **Consent**: Always include skip/options in UI for actions
- **Open-Source**: Clean, modular, commented code
- **Performance**: Lightweight, no heavy dependencies

## Game Flow

1. **Age Verification**: Users must confirm they are 18+
2. **Lobby**: Create or join a private room with a shareable ID
3. **Game Setup**: Players join and game begins
4. **Turn-Based Play**:
   - Roll dice
   - Move pawn
   - Draw action card
   - Complete or skip action
5. **Video Chat**: Optional P2P video for remote play

## Consent & Safety Features

- ⚠️ Age-gate on entry (18+)
- 🛑 Safe word button (pauses game for all players)
- ⏭️ Skip button on every action
- 🔒 Private rooms (no public listing)
- 📹 Optional video (can play without)
- 🚫 No data storage or logging

## Development

### Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run server` - Start boardgame.io server

### Adding Custom Action Cards

Edit the `actionDeck` in `src/game/game.ts` to customize action cards. Each card has:

- `id`: Unique identifier
- `text`: The action/prompt text
- `intensity`: 'mild', 'medium', or 'intense'

## License

ISC

## Contributing

This is an open-source project. Contributions are welcome! Please ensure all code follows the privacy and consent principles outlined in the `.cursor` files.
