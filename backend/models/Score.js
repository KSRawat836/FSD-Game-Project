const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20
    },
    game: {
      type: String,
      required: true,
      enum: ['reaction', 'math', 'memory'],
      default: 'reaction'
    },
    highScore: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { timestamps: true }
);

// one leaderboard row per (name, game) pair
ScoreSchema.index({ name: 1, game: 1 }, { unique: true });

module.exports = mongoose.model('Score', ScoreSchema);
