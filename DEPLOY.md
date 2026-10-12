# How to preview & publish MVFX (Free plan)

This guide shows how to preview MVFX locally (recommended) and quickly publish the frontend for free. The backend can be hosted on free-tier services but you must check each provider's current free tier offering and limits.

Local preview (recommended)
1. Backend
   - cd backend
   - cp .env.example .env
   - npm install
   - npm run init-db
   - npm run dev
   Backend default: http://localhost:4000

2. Frontend
   - cd web
   - cp .env.example .env
   - npm install
   - npm run dev
   Frontend default: http://localhost:5173

3. Android preview
   - Ensure your PC and phone are on the same Wi‑Fi network.
   - In web/.env set VITE_BACKEND_URL and VITE_WS_URL to http://<PC_LOCAL_IP>:4000
   - Run `npm run dev` in the web folder. Vite shows a LAN URL (http://<PC_LOCAL_IP>:5173) — open that in your Android browser.

Publish frontend (free options)
- Option A — Vercel (recommended for simplicity)
  1. Create an account at https://vercel.com (free tier available).
  2. Import this GitHub repository and deploy the web/ folder as a Vite project.
  3. Configure environment variables on Vercel if needed (the frontend primarily needs BACKEND URL).

- Option B — GitHub Pages (fully free, static only)
  1. From the project root: cd web
  2. npm run build
  3. Use a tool (gh-pages) or create a gh-pages branch to host the `dist` folder. (GitHub Actions can automate this.)

Backend hosting (free-tier candidates)
- Railway, Render, Fly, and similar services historically offer free starter tiers that can run small Node.js services. Choose one and deploy the backend folder there, adding environment variables (JWT_SECRET, ALPHA_VANTAGE_KEY if used, OPENAI_API_KEY if used).

Important: when deploying publicly, set JWT_SECRET to a strong secret and do NOT commit .env files to the repository.

What you CANNOT do on the free preview/publish:
- Accept real-money deposits or execute live orders without integrating a licensed broker and complying with legal/regulatory requirements. See LIVE_TRADING.md.

If you want, I can add deployment CI workflows (GitHub Actions) that build and publish the frontend automatically to GitHub Pages or Vercel. Tell me which provider you prefer and I will add the configuration.
