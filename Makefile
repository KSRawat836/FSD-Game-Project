# Makefile for Mini Arcade (React + Node/Express + MongoDB)
# Run `make help` to see all available commands.

.PHONY: help install install-backend install-frontend \
        backend frontend dev seed \
        clean clean-backend clean-frontend \
        mongo-start mongo-status

help:
	@echo "Available commands:"
	@echo "  make install          - install dependencies for both backend and frontend"
	@echo "  make install-backend  - install backend dependencies only"
	@echo "  make install-frontend - install frontend dependencies only"
	@echo "  make backend          - run backend dev server (nodemon)"
	@echo "  make frontend         - run frontend dev server (react-scripts)"
	@echo "  make seed             - populate MongoDB with sample leaderboard data"
	@echo "  make mongo-start      - start the local MongoDB service"
	@echo "  make mongo-status     - check the local MongoDB service status"
	@echo "  make clean            - remove node_modules from backend and frontend"

# ---- Install ----

install: install-backend install-frontend

install-backend:
	cd backend && npm install

install-frontend:
	cd frontend && npm install

# ---- Run ----
# NOTE: backend and frontend each block the terminal, so run them
# in two separate terminal windows/tabs rather than one after another.

backend:
	cd backend && npm run dev

frontend:
	cd frontend && npm start

# ---- Database ----

seed:
	cd backend && node seed.js

mongo-start:
	net start MongoDB

mongo-status:
	sc query MongoDB

# ---- Cleanup ----

clean: clean-backend clean-frontend

clean-backend:
	rm -rf backend/node_modules

clean-frontend:
	rm -rf frontend/node_modules
