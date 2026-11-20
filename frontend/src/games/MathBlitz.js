import React, { useState, useEffect, useRef, useCallback } from 'react';

const DURATION = 30;

function generateProblem() {
  const ops = ['+', '-', '×'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a = Math.floor(Math.random() * 20) + 1;
  let b = Math.floor(Math.random() * 20) + 1;
  if (op === '×') {
    a = Math.floor(Math.random() * 12) + 1;
    b = Math.floor(Math.random() * 12) + 1;
  }
  if (op === '-' && b > a) [a, b] = [b, a]; // avoid negatives
  let answer;
  if (op === '+') answer = a + b;
  else if (op === '-') answer = a - b;
  else answer = a * b;
  return { text: `${a} ${op} ${b}`, answer };
}

export default function MathBlitz({ playerName, onFinish }) {
  const [gameState, setGameState] = useState('idle');
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [score, setScore] = useState(0);
  const [problem, setProblem] = useState(generateProblem());
  const [input, setInput] = useState('');
  const [wrongFlash, setWrongFlash] = useState(false);
  const timerRef = useRef(null);
  const inputRef = useRef(null);

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
    setProblem(generateProblem());
    setInput('');
    setGameState('playing');
    setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
  };

  const submitAnswer = useCallback(
    (e) => {
      e.preventDefault();
      if (input.trim() === '') return;
      if (Number(input) === problem.answer) {
        setScore((s) => s + 1);
        setProblem(generateProblem());
        setInput('');
      } else {
        setWrongFlash(true);
        setInput('');
        setTimeout(() => setWrongFlash(false), 200);
      }
    },
    [input, problem]
  );

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
          Start Math Blitz
        </button>
      )}

      {gameState === 'playing' && (
        <div>
          <div className="hud">
            <span className={`hud-pill ${timeLeft <= 5 ? 'urgent' : ''}`}>⏱ {timeLeft}s</span>
            <span className="hud-pill score-pill">✅ {score}</span>
          </div>
          <div className={`math-problem ${wrongFlash ? 'shake' : ''}`}>{problem.text}</div>
          <form onSubmit={submitAnswer}>
            <input
              ref={inputRef}
              className="name-input"
              type="number"
              placeholder="Your answer"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
          </form>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="result">
          <h2>Time's Up!</h2>
          <p className="final-score">{score}</p>
          <p className="subtitle">correct answers</p>
          <button className="btn primary" onClick={() => setGameState('idle')}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
