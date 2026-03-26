"use client";

import { useState, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { PUZZLES } from "@/data/puzzles";
import { useRouter } from "next/navigation";

export default function GameHq() {
  const { puzzleIndex, advancePuzzle, role, finishGame, startTime, endTime, levelStartTime, teamName } = useGame();
  const router = useRouter();
  const [answerInput, setAnswerInput] = useState("");
  const [error, setError] = useState(false);
  const [solved, setSolved] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  if (!role) {
    if (typeof window !== 'undefined') {
      router.push("/");
    }
    return null;
  }

  // Filter puzzles based on the operative's role
  const operativePuzzles = PUZZLES.filter(p => p.role === role || p.role === 'SHARED');
  const isComplete = puzzleIndex >= operativePuzzles.length;

  useEffect(() => {
    if (isComplete && !endTime) {
      finishGame();

      const timeElapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
      
      // Save final total time in seconds
      fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_final_time', teamName, role, totalTime: timeElapsed })
      }).catch(err => console.error('Failed to save final time:', err));

      // Fetch final score
      fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_team_score', teamName })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setFinalScore(data.teamScore);
          }
        })
        .catch(err => console.error('Failed to get final score:', err));
    }
  }, [isComplete, endTime, finishGame, teamName, role, startTime]);

  // Final Success State
  if (isComplete) {
    const totalTime = endTime && startTime ? Math.floor((endTime - startTime) / 1000) : 0;
    const minutes = Math.floor(totalTime / 60).toString().padStart(2, "0");
    const seconds = (totalTime % 60).toString().padStart(2, "0");

    return (
      <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', borderColor: 'var(--accent-green)', boxShadow: 'var(--glow-green)' }}>
        <h1 className="glow-text-green" style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--accent-green)' }}>SYSTEM COMPROMISED</h1>
        <p className="terminal-text" style={{ fontSize: '1.2rem', marginBottom: '3rem' }}>
          Congratulations Operatives. You have successfully breached the final mainframe and escaped securely.
        </p>
        <div className="terminal-text glow-text-cyan" style={{ fontSize: '2rem', background: 'rgba(34, 197, 94, 0.1)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--accent-green)', marginBottom: '2rem' }}>
          MISSION ACCOMPLISHED
        </div>

        {endTime && (
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '2rem' }}>
            <div style={{ padding: '1.5rem 3rem', border: '1px dashed var(--accent-cyan)', background: 'rgba(14, 165, 233, 0.1)' }}>
              <div className="terminal-text" style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '0.5rem' }}>COMPLETION_TIME:</div>
              <div className="glow-text-cyan" style={{ fontSize: '2.5rem', fontWeight: 'bold', letterSpacing: '4px' }}>[{minutes}:{seconds}]</div>
            </div>

            {finalScore !== null && (
              <div style={{ padding: '1.5rem 3rem', border: '1px solid var(--accent-green)', background: 'rgba(34, 197, 94, 0.1)' }}>
                <div className="terminal-text" style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '0.5rem', color: 'var(--accent-green)' }}>TEAM_SCORE:</div>
                <div className="glow-text-green" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{finalScore}  Pts</div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  const puzzle = operativePuzzles[puzzleIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answerInput.trim().toLowerCase() === puzzle.answer.toLowerCase()) {
      setSolved(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const saveLevelScore = async (isSolved: boolean) => {
    const timeTaken = levelStartTime ? Math.floor((Date.now() - levelStartTime) / 1000) : 0;
    let score = 0;
    if (isSolved) {
      if (timeTaken <= 180) score = 5;       // < 3 mins
      else if (timeTaken <= 300) score = 4;  // < 5 mins
      else if (timeTaken <= 600) score = 3;  // < 10 mins
      else score = 2;                        // > 10 mins
    }

    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName,
          role,
          level: puzzle.level,
          score,
          timeTaken,
          solved: isSolved
        })
      });
    } catch (err) {
      console.error('Failed to save level score:', err);
    }
  };

  const handleNext = () => {
    // Save in background
    saveLevelScore(true);

    setSolved(false);
    setAnswerInput("");
    advancePuzzle();
  };

  const handleSkip = () => {
    if (window.confirm("Are you sure you want to give up on this puzzle? You will receive 0 points for this level.")) {
      // Save in background
      saveLevelScore(false);

      setSolved(false);
      setAnswerInput("");
      advancePuzzle();
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '3rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <span className="terminal-text" style={{ opacity: 0.5, letterSpacing: '2px' }}>MISSION_ID: MSG_L{puzzle.level}_{puzzle.role}</span>
          <h1 className="glow-text-cyan" style={{ fontSize: '2.5rem', marginTop: '0.5rem', textTransform: 'uppercase' }}>{puzzle.title}</h1>
        </div>
        <div style={{ background: 'rgba(14, 165, 233, 0.1)', padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--accent-cyan)' }}>
          <span className="terminal-text" style={{ fontSize: '0.9rem' }}>TYPE: {puzzle.type.toUpperCase()}</span>
        </div>
      </div>

      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', lineHeight: 1.6, color: 'var(--foreground)' }}>
        {puzzle.description}
      </p>

      {/* Render Puzzle Content */}
      <div style={{
        background: 'rgba(0,0,0,0.6)',
        padding: '2rem',
        borderRadius: '8px',
        fontFamily: 'var(--font-geist-mono), monospace',
        color: 'var(--accent-green)',
        marginBottom: '2rem',
        whiteSpace: 'pre-wrap',
        borderLeft: '4px solid var(--accent-cyan)',
        fontSize: '1.1rem',
        textShadow: '0 0 5px rgba(34, 197, 94, 0.3)'
      }}>
        {puzzle.content}
      </div>

      {solved ? (
        <div style={{ marginTop: '2.5rem', padding: '2rem', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--accent-green)', borderRadius: '8px', textAlign: 'center' }}>
          <h2 className="glow-text-green" style={{ marginBottom: '1rem', color: 'var(--accent-green)', textTransform: 'uppercase' }}>ACCESS GRANTED</h2>

          {puzzle.outputClue && (
            <p className="terminal-text" style={{ fontSize: '1.1rem', marginBottom: '2rem', color: 'var(--foreground)' }}>
              TRANSMIT THE FOLLOWING TO YOUR PARTNER:
              <br />
              <br />
              <span className="glow-text-cyan" style={{
                fontSize: '1.5rem',
                background: '#000',
                padding: '1rem 2rem',
                display: 'inline-block',
                border: '1px solid var(--accent-cyan)',
                borderRadius: '4px'
              }}>
                {puzzle.outputClue}
              </span>
            </p>
          )}

          <button className="cyber-button" onClick={handleNext} style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>
            PROCEED TO NEXT SECTOR
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ marginTop: '2.5rem' }}>
          <label className="terminal-text" style={{ display: 'block', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
            &gt; SUBMIT_DECRYPTION_KEY
          </label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              className="cyber-input"
              placeholder="Enter answer..."
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              style={{ flex: 1, borderColor: error ? 'var(--accent-red)' : 'var(--accent-cyan)', fontSize: '1.2rem' }}
            />
            <button type="button" onClick={handleSkip} className="cyber-button" style={{ padding: '0 1rem', background: 'rgba(239, 68, 68, 0.1)', borderColor: 'var(--accent-red)', color: 'var(--accent-red)' }}>
              SKIP
            </button>
            <button type="submit" className="cyber-button" style={{ padding: '0 2rem' }}>
              VERIFY
            </button>
          </div>
          {error && (
            <div className="terminal-text glow-text-red" style={{ marginTop: '1rem', animation: 'flash 1s infinite' }}>
              ERROR: ACCESS DENIED. INCORRECT KEY.
            </div>
          )}
        </form>
      )}
    </div>
  );
}
