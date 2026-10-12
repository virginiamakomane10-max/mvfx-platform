# MVFX — Public README (Launch instructions)

This README explains exactly how to preview locally and publish MVFX using free hosting (Vercel or Netlify). It also covers backend deployment on free-tier hosts and how to connect live market data and brokers (what remains manual/paid).

1) Preview locally (recommended)

- Clone the repo
  git clone https://github.com/virginiamakomane10-max/mvfx-platform.git
  cd mvfx-platform

- Start Backend
  cd backend
  cp .env.example .env
  (edit .env: set JWT_SECRET to a strong secret; optionally add ALPHA_VANTAGE_KEY)
  npm install
  npm run init-db
  npm run dev
  Backend runs at http://localhost:4000

- Start Frontend
  Open a new terminal
  cd web
  cp .env.example .env
  (optional) set VITE_BACKEND_URL and VITE_WS_URL to http://localhost:4000
  npm install
  npm run dev
  Frontend runs at http://localhost:5173 (Vite prints a LAN URL you can open on mobile)

- Preview on Android (same Wi‑Fi)
  * Find your PC local IP (e.g. 192.168.1.12)
  * In web/.env set VITE_BACKEND_URL=http://<PC_IP>:4000 and VITE_WS_URL=http://<PC_IP>:4000
  * Start backend and frontend, and open the Vite LAN URL (http://<PC_IP>:5173) on your Android browser.

2) Publish frontend for free

Option A — Vercel (recommended)
- Create a free account at https://vercel.com and connect your GitHub account.
- Import the repository and set the root to the project (the vercel.json is configured to build the web folder).
- Environment variables: (optional) set VITE_BACKEND_URL to the public backend URL you will use.
- Deploy. Vercel provides HTTPS and a public URL.

Option B — Netlify
- Create a free account at https://app.netlify.com and connect your GitHub account.
- Add a new site from Git and pick this repository.
- Set the build command: cd web && npm ci && npm run build
- Set the publish directory: web/dist
- Add VITE_BACKEND_URL in Netlify environment variables if needed.

Option C — GitHub Pages (static)
- Build the static site locally: cd web && npm run build
- Publish the contents of web/dist to GitHub Pages (gh-pages branch) using a GitHub Action or the gh-pages package.

3) Publish backend on free-tier (examples)

- Railway, Render, Fly and similar providers often offer free tiers that can run Node.js apps. Steps are similar:
  - Create account on provider (Railway/Render)
  - Create a new service and connect your GitHub repo
  - Set the project root to backend
  - Set build command: npm install
  - Set start command: npm run dev OR node index.js (for production use a process manager)
  - Add environment variables: JWT_SECRET (required), ALPHA_VANTAGE_KEY (optional), OPENAI_API_KEY (optional)
  - Deploy

Notes: free tiers may sleep after inactivity and have request/CPU limits.

4) How DEMO vs LIVE is handled
- DEMO mode uses the demo endpoints in the backend (/api/demo/*) and simulated funds stored in SQLite.
- LIVE mode in the UI is only a selection state; live order endpoints are intentionally disabled and return 501 until you implement a broker adapter and obtain credentials.
- The UI always shows a clear DEMO label when operating in demo mode. Live mode shows instructions and is disabled.

5) What you must do to enable genuine live trading
- Obtain a licensed broker or execution provider and their API credentials.
- Implement a broker adapter on the backend to route orders, handle fills, margins, and account lifecycle.
- Integrate a production-quality market-data provider for FX & XAU (paid feed recommended) and verify licensing.
- Add payment processing, KYC/AML onboarding, legal/regulatory compliance, and audits.
- Use secure hosting, secrets management, and monitoring.

6) Important safety rules
- This starter NEVER accepts real money. Do NOT connect payment processors or enable live order execution until you have the broker integration and compliance in place.
- Demo mode is clearly labeled and uses simulated funds only.

If you want, I can add GitHub Actions to build and auto-deploy the frontend to GitHub Pages or prepare a one-click Vercel/Netlify configuration — tell me which provider.
