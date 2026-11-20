# Reaction Speed Game (MERN)

A simple game: click the moving red target as many times as you can in 20 seconds.
Name + high score are stored in MongoDB, with a full CRUD leaderboard (edit/delete entries).

## Stack
- **Frontend:** React (Create React App)
- **Backend:** Node.js + Express
- **Database:** MongoDB (via Mongoose)

## Folder structure
```
game-project/
  backend/
    models/Score.js
    routes/scoreRoutes.js
    server.js
    package.json
    .env.example
  frontend/
    public/index.html
    src/
      App.js
      App.css
      index.js
      index.css
      api.js
    package.json
```

## 1. Install MongoDB
- Easiest: create a free cluster on MongoDB Atlas (atlas.mongodb.com) and copy the connection string.
- Or install MongoDB Community locally and use `mongodb://127.0.0.1:27017/reaction_game`.

## 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
# edit .env and paste your MONGO_URI (Atlas string or local)
npm run dev
```
This starts the API on `http://localhost:5000`. You should see "MongoDB connected" and "Server running on port 5000".

### API endpoints (CRUD)
| Method | Route | Purpose |
|---|---|---|
| GET | /api/scores | Get leaderboard (sorted, top 50) |
| GET | /api/scores/:id | Get one entry |
| POST | /api/scores | Create a new entry |
| POST | /api/scores/submit | Submit a run — creates or updates only if it's a new high score |
| PUT | /api/scores/:id | Update an entry |
| DELETE | /api/scores/:id | Delete an entry |

## 3. Frontend setup
Open a new terminal:
```bash
cd frontend
npm install
npm start
```
This runs on `http://localhost:3000` and talks to the backend at `http://localhost:5000` (set in `src/api.js`).

## 4. Play
1. Open `http://localhost:3000`
2. Enter your name, click "Start Game"
3. Click the red target as many times as possible in 20 seconds
4. Your score auto-saves to MongoDB when the game ends (only overwrites if it beats your previous best)
5. Edit or delete any leaderboard entry directly from the table

## Notes / things you could extend for your assignment
- Add user authentication (JWT) so scores are tied to accounts
- Add difficulty levels (smaller target, shorter timer)
- Deploy backend on Render/Railway and frontend on Vercel/Netlify, point `api.js` to the deployed backend URL
- Add pagination or "top 10 only" to the leaderboard query
# FSD-Game-Project
