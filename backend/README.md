# Backend (Express + Socket.IO)

This backend provides:
- Authentication (register/login) using JWT
- SQLite database for users and demo accounts
- Price feed poller (Binance for crypto; Alpha Vantage for Forex/XAU if API key provided)
- Socket.IO live price broadcast
- Demo trading endpoints: create orders, view balance, positions, history
- AI assistant proxy (optional OpenAI)

Run:
  cd backend
  npm install
  cp .env.example .env
  npm run init-db
  npm run dev
