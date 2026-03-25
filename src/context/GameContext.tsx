"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface GameState {
  teamName: string;
  role: 'A' | 'B' | null;
  puzzleIndex: number;
  startTime: number | null;
  endTime: number | null;
}

interface GameContextType extends GameState {
  setTeamName: (name: string) => void;
  setRole: (role: 'A' | 'B') => void;
  advancePuzzle: () => void;
  startGame: () => void;
  finishGame: () => void;
  resetGame: () => void;
}

const initialState: GameState = {
  teamName: "",
  role: null,
  puzzleIndex: 0,
  startTime: null,
  endTime: null,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dualMindEscapeState");
    if (saved) {
      setState(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("dualMindEscapeState", JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const setTeamName = (teamName: string) => setState((s) => ({ ...s, teamName }));
  const setRole = (role: 'A' | 'B') => setState((s) => ({ ...s, role }));
  
  const advancePuzzle = () => setState((s) => ({ 
    ...s, 
    puzzleIndex: s.puzzleIndex + 1
  }));

  const startGame = () => setState((s) => ({ 
    ...s, 
    startTime: s.startTime || Date.now(),
    endTime: null,
    puzzleIndex: 0,
  }));
  
  const finishGame = () => setState((s) => ({
    ...s,
    endTime: s.endTime || Date.now()
  }));

  const resetGame = () => {
    setState(initialState);
    localStorage.removeItem("dualMindEscapeState");
  };

  return (
    <GameContext.Provider
      value={{ ...state, setTeamName, setRole, advancePuzzle, startGame, finishGame, resetGame }}
    >
      {isLoaded ? children : <div className="terminal-text" style={{ padding: '2rem' }}>INITIALIZING SYSTEM...</div>}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
}
