"use client";

import { useEffect, useState } from "react";
import { useGame } from "@/context/GameContext";

export default function Timer() {
  const { startTime, endTime } = useGame();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) return;

    if (endTime) {
      setElapsed(Math.floor((endTime - startTime) / 1000));
      return;
    }

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, endTime]);

  if (!startTime) return null;

  const minutes = Math.floor(elapsed / 60).toString().padStart(2, "0");
  const seconds = (elapsed % 60).toString().padStart(2, "0");

  return (
    <div className="terminal-text" style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ opacity: 0.6 }}>TIME_ELAPSED </span>
      <span className={elapsed > 1800 ? "glow-text-red" : "glow-text-cyan"} style={{ fontWeight: 'bold', letterSpacing: '2px' }}>
        [{minutes}:{seconds}]
      </span>
    </div>
  );
}
