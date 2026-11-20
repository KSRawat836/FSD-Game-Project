import React, { useState, useEffect, useRef } from 'react';

const DURATION = 20;
const BOX_SIZE = 400;

function randomPosition() {
  const targetSize = 50;
  const x = Math.floor(Math.random() * (BOX_SIZE - targetSize));
  const y = Math.floor(Math.random() * (BOX_SIZE - targetSize));
  return { x, y };
}

export default function ReactionSpeed({ playerName, onFinish }) {
  const [gameState, setGameState] = useState('idle');
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [score, setScore] = useState(0);
  const [targetPos, setTargetPos] = useState(randomPosition());
  const [pulse, setPulse] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setGameState('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  const start = () => {
    setScore(0);
    setTimeLeft(DURATION);
    setTargetPos(randomPosition());
    setGameState('playing');
  };

  const hitTarget = () => {
    setScore((s) => s + 1);
    setTargetPos(randomPosition());
    setPulse(true);
    setTimeout(() => setPulse(false), 150);
  };

  useEffect(() => {
    if (gameState === 'finished') {
      onFinish(score);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  return (
    <div className="game-card">
      {gameState === 'idle' && (
        <button className="btn primary" onClick={start} disabled={!playerName.trim()}>
          Start Reaction Speed
        </button>
      )}

      {gameState === 'playing' && (
        <div>
          <div className="hud">
            <span className={`hud-pill ${timeLeft <= 5 ? 'urgent' : ''}`}>⏱ {timeLeft}s</span>
            <span className={`hud-pill score-pill ${pulse ? 'pulse' : ''}`}>🎯 {score}</span>
          </div>
          <div className="play-area" style={{ width: BOX_SIZE, height: BOX_SIZE }}>
            <div
              className="target"
              style={{ left: targetPos.x, top: targetPos.y }}
              onClick={hitTarget}
            />
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="result">
          <h2>Game Over!</h2>
          <p className="final-score">{score}</p>
          <button className="btn primary" onClick={() => setGameState('idle')}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
