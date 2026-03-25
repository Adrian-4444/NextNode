"use client";

import { useGame } from "@/context/GameContext";
import Timer from "@/components/Timer";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PUZZLES } from "@/data/puzzles";

export default function GameLayout({ children }: { children: React.ReactNode }) {
  const { teamName, role, puzzleIndex } = useGame();
  const router = useRouter();

  useEffect(() => {
    if (!teamName || !role) {
      router.push("/");
    }
  }, [teamName, role, router]);

  if (!teamName || !role) return null;
  
  const operativePuzzles = PUZZLES.filter(p => p.role === role || p.role === 'SHARED');
  const currentPuzzle = operativePuzzles[puzzleIndex];
  const level = currentPuzzle ? currentPuzzle.level : "MAX";
  const roleLabel = role === 'A' ? 'PLAYER_A (DECODER)' : role === 'B' ? 'PLAYER_B (ANALYST)' : 'UNKNOWN';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ 
        padding: '1rem 2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid var(--surface-border)',
        background: 'var(--surface)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div className="terminal-text" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
            <span style={{ color: 'var(--accent-cyan)' }}>TEAM:</span> {teamName.toUpperCase()}
          </div>
          <div className="terminal-text" style={{ opacity: 0.8 }}>
            <span style={{ color: 'var(--accent-cyan)' }}>ROLE:</span> {roleLabel}
          </div>
          <div className="terminal-text" style={{ opacity: 0.8 }}>
            <span style={{ color: 'var(--accent-cyan)' }}>LEVEL:</span> <span className="glow-text-cyan">{level}</span>
          </div>
        </div>
        <Timer />
      </header>
      <main style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '900px' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
