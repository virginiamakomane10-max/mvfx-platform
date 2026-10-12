# MVFX Platform

MVFX — a professional trading platform starter (frontend + backend) with demo/live accounts, real-time charts, trade ticket UI and AI assistant.

This repository contains a working starter app you can run locally and deploy. It uses free tools where possible and is designed so you can later connect real brokers and market data providers to enable live trading.

Important notes:
- Demo trading uses simulated funds and is clearly labelled in the UI.
- Live charts can use genuine market data. Configure API keys (see below) to enable real feeds for Forex & XAUUSD.
- This starter does NOT execute real-money trades. Order execution and payment processing require third-party broker integrations and regulatory approvals (see ARCHITECTURE.md).

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

Config & optional API keys (to enable genuine market data):
- BINANCE (crypto): no API key needed for public kline REST endpoints. The backend fetches Binance klines for crypto by default.
- ALPHA_VANTAGE (Forex & XAUUSD): set ALPHA_VANTAGE_KEY in backend/.env to use Alpha Vantage intraday klines. Free tier available but limited rate.
- OPENAI_API_KEY: optional; if set in backend/.env, the AI assistant will proxy requests to OpenAI. If not set, a local fallback assistant answers simple questions.

See ARCHITECTURE.md for details about what is required to activate live trading.
