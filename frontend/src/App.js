import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from 'recharts';
import { getScores, submitScore, updateScore, deleteScore } from './api';
import ReactionSpeed from './games/ReactionSpeed';
import MathBlitz from './games/MathBlitz';
import MemoryMatch from './games/MemoryMatch';
import './App.css';

const BAR_COLORS = ['#f59e0b', '#c0c0c0', '#cd7f32', '#818cf8', '#818cf8', '#818cf8', '#818cf8', '#818cf8'];

const GAMES = [
  { key: 'reaction', label: '⚡ Reaction Speed', desc: 'Click the target as many times as you can in 20 seconds' },
  { key: 'math', label: '🧮 Math Blitz', desc: 'Solve as many quick sums as you can in 30 seconds' },
  { key: 'memory', label: '🧠 Memory Match', desc: 'Flip cards and clear the board in as few moves as possible' }
];

export default function App() {
  const [activeGame, setActiveGame] = useState('reaction');
  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editScore, setEditScore] = useState('');
  const [message, setMessage] = useState('');

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await getScores(activeGame);
      setLeaderboard(res.data);
    } catch (err) {
      setMessage('Could not load leaderboard. Is the backend running?');
    }
  }, [activeGame]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const handleFinish = async (score) => {
    if (!playerName.trim()) return;
    try {
      const res = await submitScore({ name: playerName, highScore: score, game: activeGame });
      setMessage(`Saved! ${res.data.name}'s best: ${res.data.highScore}`);
      fetchLeaderboard();
    } catch (err) {
      setMessage('Failed to save score.');
    }
  };

  const startEdit = (entry) => {
    setEditingId(entry._id);
    setEditName(entry.name);
    setEditScore(entry.highScore);
  };

  const saveEdit = async (id) => {
    try {
      await updateScore(id, { name: editName, highScore: Number(editScore) });
      setEditingId(null);
      fetchLeaderboard();
    } catch (err) {
      setMessage('Failed to update entry.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteScore(id);
      fetchLeaderboard();
    } catch (err) {
      setMessage('Failed to delete entry.');
    }
  };

  const topTen = leaderboard.slice(0, 10);
  const totalPlayers = leaderboard.length;
  const avgScore = totalPlayers
    ? Math.round(leaderboard.reduce((sum, e) => sum + e.highScore, 0) / totalPlayers)
    : 0;
  const topScore = totalPlayers ? leaderboard[0].highScore : 0;
  const myRank = leaderboard.findIndex(
    (e) => e.name.toLowerCase() === playerName.trim().toLowerCase()
  );

  const gameMeta = GAMES.find((g) => g.key === activeGame);

  return (
    <div className="app-bg">
      <div className="app">
        <header className="hero">
          <h1>🎮 Mini Arcade</h1>
          <p className="subtitle">Three quick games. One leaderboard. Pure chaos.</p>
        </header>

        <input
          className="name-input name-input-global"
          type="text"
          placeholder="Enter your name to play"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />

        <div className="tabs">
          {GAMES.map((g) => (
            <button
              key={g.key}
              className={`tab ${activeGame === g.key ? 'active' : ''}`}
              onClick={() => setActiveGame(g.key)}
            >
              {g.label}
            </button>
          ))}
        </div>

        <p className="game-desc">{gameMeta.desc}</p>

        <div className="stat-strip">
          <div className="stat-card">
            <span className="stat-value">{topScore}</span>
            <span className="stat-label">Top Score</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{avgScore}</span>
            <span className="stat-label">Average</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{totalPlayers}</span>
            <span className="stat-label">Players</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{myRank >= 0 ? `#${myRank + 1}` : '—'}</span>
            <span className="stat-label">Your Rank</span>
          </div>
        </div>

        {activeGame === 'reaction' && (
          <ReactionSpeed playerName={playerName} onFinish={handleFinish} />
        )}
        {activeGame === 'math' && <MathBlitz playerName={playerName} onFinish={handleFinish} />}
        {activeGame === 'memory' && (
          <MemoryMatch playerName={playerName} onFinish={handleFinish} />
        )}

        {message && <p className="message">{message}</p>}

        <div className="chart-card">
          <h2>📊 Top Scores — {gameMeta.label}</h2>
          {topTen.length === 0 ? (
            <p className="empty-note">No scores yet — be the first to play!</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topTen} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="name" stroke="#cbd5e1" tick={{ fontSize: 12 }} />
                <YAxis stroke="#cbd5e1" tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: '#1e1b3a',
                    border: '1px solid #4f46e5',
                    borderRadius: 8,
                    color: '#fff'
                  }}
                />
                <Bar dataKey="highScore" radius={[6, 6, 0, 0]}>
                  {topTen.map((entry, index) => (
                    <Cell key={entry._id} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="leaderboard">
          <h2>🏆 Leaderboard — {gameMeta.label}</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>High Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, idx) => (
                  <tr key={entry._id} className={idx < 3 ? `rank-${idx + 1}` : ''}>
                    <td>{idx + 1}</td>
                    {editingId === entry._id ? (
                      <>
                        <td>
                          <input value={editName} onChange={(e) => setEditName(e.target.value)} />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={editScore}
                            onChange={(e) => setEditScore(e.target.value)}
                          />
                        </td>
                        <td>
                          <button className="btn small" onClick={() => saveEdit(entry._id)}>
                            Save
                          </button>
                          <button className="btn small" onClick={() => setEditingId(null)}>
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>
                          {idx === 0 && '🥇 '}
                          {idx === 1 && '🥈 '}
                          {idx === 2 && '🥉 '}
                          {entry.name}
                        </td>
                        <td>{entry.highScore}</td>
                        <td>
                          <button className="btn small" onClick={() => startEdit(entry)}>
                            Edit
                          </button>
                          <button className="btn small danger" onClick={() => handleDelete(entry._id)}>
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="footer">Built with React · Node.js · Express · MongoDB</footer>
      </div>
    </div>
  );
}
