# KrishiConnect – Starter Structure

A starter scaffold for the TechZen Farmer Marketplace & Community Portal.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB (Atlas recommended)
- ODM: Mongoose

## First run
1. Install Node.js LTS.
2. Open this folder in VS Code.
3. Open two terminals.

Frontend:
```bash
cd frontend
npm install
npm run dev
```

Backend (second terminal):
```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Add your MongoDB Atlas connection string to `backend/.env` as `MONGODB_URI`.
The frontend runs on the Vite URL shown in the terminal (usually http://localhost:5173).
The backend runs on http://localhost:5000.

Note: This is only the initial project scaffold. Features will be implemented step by step.
