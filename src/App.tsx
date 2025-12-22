import { useState } from "react";
import AgeGate from "./components/AgeGate";
import Lobby from "./components/Lobby";
import GameRoom from "./components/GameRoom";
import { useGameStore } from "./store/gameStore";

function App() {
  const [ageVerified, setAgeVerified] = useState(false);
  const { currentRoom } = useGameStore();

  if (!ageVerified) {
    return <AgeGate onVerify={() => setAgeVerified(true)} />;
  }

  if (!currentRoom) {
    return <Lobby />;
  }

  return <GameRoom />;
}

export default App;
