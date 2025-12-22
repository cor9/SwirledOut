import { create } from "zustand";

interface GameStore {
  currentRoom: string | null;
  playerName: string;
  setCurrentRoom: (roomId: string | null) => void;
  setPlayerName: (name: string) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  currentRoom: null,
  playerName: "",
  setCurrentRoom: (roomId) => set({ currentRoom: roomId }),
  setPlayerName: (name) => set({ playerName: name }),
}));
