import React, { useState, useEffect, useRef, useCallback } from 'react';

const EMOJIS = ['🍎', '🍌', '🍇', '🍉', '🍒', '🍋', '🍓', '🥝'];

function buildDeck() {
  const pairs = [...EMOJIS, ...EMOJIS];
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs.map((emoji, idx) => ({ id: idx, emoji, flipped: false, matched: false }));
}

export default function MemoryMatch({ playerName, onFinish }) {
  const [gameState, setGameState] = useState('idle');
  const [cards, setCards] = useState(buildDeck());
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  const start = () => {
    setCards(buildDeck());
    setSelected([]);
    setMoves(0);
    setSeconds(0);
    setGameState('playing');
  };

  const finishRun = useCallback(() => {
    clearInterval(timerRef.current);
    const score = Math.max(0, 1000 - moves * 20 - seconds * 5);
    setGameState('finished');
    onFinish(score);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moves, seconds]);

  const handleFlip = (card) => {
    if (gameState !== 'playing') return;
    if (card.flipped || card.matched || selected.length === 2) return;

    const newCards = cards.map((c) => (c.id === card.id ? { ...c, flipped: true } : c));
    const newSelected = [...selected, card];
    setCards(newCards);
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newSelected;
      if (first.emoji === second.emoji) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first.id || c.id === second.id ? { ...c, matched: true } : c
            )
          );
          setSelected([]);
        }, 400);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first.id || c.id === second.id ? { ...c, flipped: false } : c
            )
          );
          setSelected([]);
        }, 700);
      }
    }
  };

  useEffect(() => {
    if (gameState === 'playing' && cards.length > 0 && cards.every((c) => c.matched)) {
      finishRun();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  return (
    <div className="game-card">
      {gameState === 'idle' && (
        <button className="btn primary" onClick={start} disabled={!playerName.trim()}>
          Start Memory Match
        </button>
      )}

      {gameState === 'playing' && (
        <div>
          <div className="hud">
            <span className="hud-pill">⏱ {seconds}s</span>
            <span className="hud-pill score-pill">🔁 {moves} moves</span>
          </div>
          <div className="memory-grid">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`memory-card ${card.flipped || card.matched ? 'flipped' : ''} ${
                  card.matched ? 'matched' : ''
                }`}
                onClick={() => handleFlip(card)}
              >
                <span>{card.flipped || card.matched ? card.emoji : '❓'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="result">
          <h2>All Matched!</h2>
          <p className="final-score">{Math.max(0, 1000 - moves * 20 - seconds * 5)}</p>
          <p className="subtitle">
            {moves} moves · {seconds}s
          </p>
          <button className="btn primary" onClick={() => setGameState('idle')}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
