# MVFX Platform

MVFX — a professional trading platform starter (frontend + backend) with demo/live accounts, real-time charts, trade ticket UI and AI assistant.

This repository contains a working starter app you can run locally and deploy. It uses free tools where possible and is designed so you can later connect real brokers and market data providers to enable live trading.

Important notes:
- Demo trading uses simulated funds and is clearly labelled in the UI.
- Live charts can use genuine market data. Configure API keys (see below) to enable real feeds for Forex & XAUUSD.
- This starter does NOT execute real-money trades. Order execution and payment processing require third-party broker integrations and regulatory approvals (see LIVE_TRADING.md and ARCHITECTURE.md).

Quick start (development):

1. Clone the repo
   git clone https://github.com/virginiamakomane10-max/mvfx-platform.git
   cd mvfx-platform

2. Start the backend
   cd backend
   cp .env.example .env
   npm install
   npm run init-db
   npm run dev

3. Start the frontend
   cd ../web
   cp .env.example .env
   npm install
   npm run dev

Open http://localhost:5173 (frontend) and the backend runs on http://localhost:4000

Preview on Android phone:
- With the backend and frontend running locally, make sure your machine and phone are on the same network.
- Update web/.env VITE_BACKEND_URL and VITE_WS_URL to `http://<your-computer-ip>:4000`.
- Run `npm run dev` in the web folder and open the printed URL (vite shows a LAN URL) on your Android browser.

Free hosting summary (short):
- Frontend (static): Vercel, Netlify or GitHub Pages (all support free hosting of the built SPA).
- Backend: Railway, Render or Fly offer free starter tiers; check provider terms and select the one that fits. Keep credentials and environment values secret.

See LIVE_TRADING.md for a complete list of steps, legal and security requirements to enable genuine live trading and broker integrations.
