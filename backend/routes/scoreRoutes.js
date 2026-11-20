const express = require('express');
const router = express.Router();
const Score = require('../models/Score');

const VALID_GAMES = ['reaction', 'math', 'memory'];

function validGame(game) {
  return VALID_GAMES.includes(game);
}

// CREATE - add a new score entry
router.post('/', async (req, res) => {
  try {
    const { name, highScore, game } = req.body;
    if (!name || highScore === undefined || !validGame(game)) {
      return res.status(400).json({ error: 'name, highScore, and a valid game are required' });
    }
    const newScore = new Score({ name, highScore, game });
    const saved = await newScore.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ - get all scores for a game, sorted highest first (leaderboard)
// usage: GET /api/scores?game=reaction
router.get('/', async (req, res) => {
  try {
    const game = req.query.game && validGame(req.query.game) ? req.query.game : 'reaction';
    const scores = await Score.find({ game }).sort({ highScore: -1 }).limit(100);
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE - get a single score entry by id
router.get('/:id', async (req, res) => {
  try {
    const score = await Score.findById(req.params.id);
    if (!score) return res.status(404).json({ error: 'Not found' });
    res.json(score);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE - update an entry directly
router.put('/:id', async (req, res) => {
  try {
    const { name, highScore } = req.body;
    const updated = await Score.findByIdAndUpdate(
      req.params.id,
      { name, highScore },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPSERT BY NAME+GAME - convenience route: submit a run, only saves if it beats existing high score
router.post('/submit', async (req, res) => {
  try {
    const { name, highScore, game } = req.body;
    if (!name || highScore === undefined || !validGame(game)) {
      return res.status(400).json({ error: 'name, highScore, and a valid game are required' });
    }
    const existing = await Score.findOne({ name, game });
    if (!existing) {
      const created = await Score.create({ name, highScore, game });
      return res.status(201).json(created);
    }
    if (highScore > existing.highScore) {
      existing.highScore = highScore;
      await existing.save();
    }
    res.json(existing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - remove a score entry
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Score.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
