# 🎮 Mini Arcade (MERN)

A small arcade with **3 games**. Each game has its own leaderboard with full CRUD (add, edit, delete entries). Scores are stored in MongoDB.

## Games
| Game | How to play | Score |
|---|---|---|
| **Reaction Speed** | Click the moving red target for 20 seconds | Targets hit |
| **Math Blitz** | Solve `+`, `-`, `×` problems for 30 seconds | Correct answers |
| **Memory Match** | Flip cards and match all 8 emoji pairs | Points (faster + fewer moves = higher) |

## Features
- Per-game leaderboard (top 100, sorted highest first)
- Top Scores chart (Recharts)
- Edit and delete any leaderboard entry
- Score auto-saves when a game ends, and only overwrites if it beats your previous best
- One entry per **(name, game)** pair (unique index in MongoDB)
- Seed script to fill the database with sample players

## Stack
- **Frontend:** React (Create React App), Axios, Recharts
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)

## Folder structure
```
backend/
  models/Score.js
  routes/scoreRoutes.js
  server.js
  seed.js
  package.json
  .env.example
frontend/
  public/index.html
  src/
    App.js
    App.css
    api.js
    index.js
    index.css
    games/
      ReactionSpeed.js
      MathBlitz.js
      MemoryMatch.js
  package.json
Makefile
```

## Setup

### 1. MongoDB
- **Local:** install MongoDB Community and use `mongodb://127.0.0.1:27017/reaction_game`
- **Cloud:** create a free cluster on MongoDB Atlas and copy the connection string

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# edit .env and set MONGO_URI (local or Atlas)
npm run dev
```
Runs on `http://localhost:5000`. You should see "MongoDB connected" and "Server running on port 5000".

### 3. Frontend
Open a second terminal:
```bash
cd frontend
npm install
npm start
```
Runs on `http://localhost:3000`. The API URL is set in `frontend/src/api.js`.

### 4. (Optional) Seed sample data
```bash
cd backend
node seed.js
```
Adds about 50 sample entries per game.

## Makefile shortcuts
| Command | What it does |
|---|---|
| `make install` | Install backend and frontend dependencies |
| `make backend` | Run backend dev server (nodemon) |
| `make frontend` | Run frontend dev server |
| `make seed` | Fill the database with sample scores |
| `make mongo-start` | Start local MongoDB service (Windows) |
| `make mongo-status` | Check MongoDB service status (Windows) |
| `make clean` | Remove `node_modules` from both folders |

Run backend and frontend in **separate terminals**.

## API endpoints
Base URL: `http://localhost:5000/api/scores`

`game` must be one of: `reaction`, `math`, `memory`.

| Method | Route | Purpose |
|---|---|---|
| GET | `/?game=reaction` | Get leaderboard for a game (top 100) |
| GET | `/:id` | Get one entry |
| POST | `/` | Create an entry (`name`, `highScore`, `game`) |
| POST | `/submit` | Submit a run: creates the entry, or updates only if it's a new high score |
| PUT | `/:id` | Update an entry (`name`, `highScore`) |
| DELETE | `/:id` | Delete an entry |

## Environment variables
Copy `backend/.env.example` to `backend/.env`:

| Variable | Default | Meaning |
|---|---|---|
| `MONGO_URI` | `mongodb://127.0.0.1:27017/reaction_game` | MongoDB connection string |
| `PORT` | `5000` | Backend port |

`.env` is ignored by git. Never commit real credentials.

## Deploying
- Backend: Render or Railway (set `MONGO_URI` in their dashboard)
- Frontend: Vercel or Netlify
- Change `API_BASE` in `frontend/src/api.js` from `localhost` to your deployed backend URL

## Ideas to extend
- User login (JWT) so scores belong to accounts
- Difficulty levels
- More games (each new game needs adding to the `game` enum in `Score.js` and `VALID_GAMES` in `scoreRoutes.js`)
- Pagination on the leaderboard