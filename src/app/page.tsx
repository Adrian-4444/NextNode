"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/context/GameContext";

export default function Home() {
  const router = useRouter();
  const { setTeamName, setRole, startGame, resetGame, teamName: initialTeam } = useGame();
  
  const [name, setName] = useState(initialTeam || "");
  const [selectedRole, setSelectedRole] = useState<'A' | 'B' | null>(null);

  const handleStart = () => {
    if (!name.trim() || !selectedRole) return;
    
    // Always start fresh if coming from Landing
    resetGame();
    setTimeout(() => {
      setTeamName(name.trim());
      setRole(selectedRole);
      startGame();
      router.push("/game");
    }, 50);
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '3rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '200px', height: '2px', background: 'var(--accent-cyan)', boxShadow: 'var(--glow-cyan)' }} />
        
        <h1 className="glow-text-cyan" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', letterSpacing: '4px', textTransform: 'uppercase' }}>
          Dual Mind Escape
        </h1>
        <p className="terminal-text" style={{ marginBottom: '2.5rem', opacity: 0.8 }}>
          CO-OP OPERATIVE MODE
        </p>

        <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <label className="terminal-text" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            &gt; INPUT_TEAM_IDENTIFIER
          </label>
          <input 
            type="text" 
            className="cyber-input" 
            placeholder="Enter Team Name..." 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
          <label className="terminal-text" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            &gt; SELECT_OPERATIVE_ROLE
          </label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              className="cyber-button"
              style={{
                flex: 1,
                padding: '1rem',
                border: selectedRole === 'A' ? '1px solid var(--accent-cyan)' : '1px solid rgba(14, 165, 233, 0.3)',
                background: selectedRole === 'A' ? 'rgba(14, 165, 233, 0.1)' : 'transparent',
                color: selectedRole === 'A' ? 'var(--accent-cyan)' : 'inherit',
                boxShadow: selectedRole === 'A' ? 'var(--glow-cyan)' : 'none'
              }}
              onClick={() => setSelectedRole('A')}
            >
              PLAYER A [DECODER]
            </button>
            <button
              className="cyber-button"
              style={{
                flex: 1,
                padding: '1rem',
                border: selectedRole === 'B' ? '1px solid var(--accent-cyan)' : '1px solid rgba(14, 165, 233, 0.3)',
                background: selectedRole === 'B' ? 'rgba(14, 165, 233, 0.1)' : 'transparent',
                color: selectedRole === 'B' ? 'var(--accent-cyan)' : 'inherit',
                boxShadow: selectedRole === 'B' ? 'var(--glow-cyan)' : 'none'
              }}
              onClick={() => setSelectedRole('B')}
            >
              PLAYER B [ANALYST]
            </button>
          </div>
        </div>

        <button 
          className="cyber-button" 
          style={{ 
            width: '100%', 
            padding: '1rem', 
            fontSize: '1.2rem', 
            opacity: (!name.trim() || !selectedRole) ? 0.3 : 1,
            pointerEvents: (!name.trim() || !selectedRole) ? 'none' : 'all',
            border: '1px solid var(--accent-green)',
            color: 'var(--accent-green)',
            boxShadow: (!name.trim() || !selectedRole) ? 'none' : 'var(--glow-green)',
            marginTop: '1rem'
          }}
          onClick={handleStart}
        >
          INITIALIZE CONNECTION
        </button>
      </div>
    </main>
  );
}
