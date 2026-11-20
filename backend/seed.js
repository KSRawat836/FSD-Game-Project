// Run with: node seed.js
// Populates the database with ~50 sample leaderboard entries PER GAME
// (reaction, math, memory) for testing/demo purposes.
require('dotenv').config();
const mongoose = require('mongoose');
const Score = require('./models/Score');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/reaction_game';

const names = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan',
  'Krishna', 'Ishaan', 'Rohan', 'Kabir', 'Aryan', 'Dhruv', 'Karan', 'Yash',
  'Aditi', 'Ananya', 'Diya', 'Ishita', 'Kavya', 'Meera', 'Naina', 'Priya',
  'Riya', 'Saanvi', 'Tara', 'Zara', 'Neha', 'Pooja', 'Sanya', 'Anika',
  'Rahul', 'Rajesh', 'Vikram', 'Amit', 'Sandeep', 'Manish', 'Nikhil',
  'Siddharth', 'Varun', 'Akash', 'Gaurav', 'Harsh', 'Jatin', 'Kunal',
  'Lakshya', 'Mohit', 'Nitin', 'Om', 'Parth'
];

// each game has its own realistic score range (all "higher is better")
const GAME_RANGES = {
  reaction: [5, 45],   // targets hit in 20s
  math: [8, 60],       // correct answers in 30s
  memory: [400, 1000]  // points (faster/fewer moves = higher points)
};

function randomInRange([min, max]) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seedGame(game) {
  const existingNames = new Set(
    (await Score.find({ game }, 'name')).map((s) => s.name)
  );

  const entries = names
    .filter((name) => !existingNames.has(name))
    .map((name) => ({ name, game, highScore: randomInRange(GAME_RANGES[game]) }));

  if (entries.length === 0) {
    console.log(`[${game}] All sample names already exist. Nothing to add.`);
    return;
  }

  const inserted = await Score.insertMany(entries);
  console.log(`[${game}] Inserted ${inserted.length} new sample players.`);
}

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await seedGame('reaction');
    await seedGame('math');
    await seedGame('memory');

    await mongoose.disconnect();
    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();
