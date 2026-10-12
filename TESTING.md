# Manual testing checklist (what I tested and how to reproduce)

Follow these steps locally to verify the app works on the free plan.

1) Setup
- Run backend and frontend following README instructions.

2) Authentication
- Register a new user. Expect success and automatic creation of a demo account with starting balance.
- Login with the created user.

3) Navigation
- Check top navigation (Trade, Dashboard, Live, Assistant).
- Ensure MVFX logo is visible and the DEMO/LIVE mode toggle (top-right) shows current mode.

4) Trade page
- Open Trade page. Confirm watchlist is present and you can add/remove symbols.
- Select BTCUSDT. Chart should display and update (crypto uses Binance WS for live klines).
- Switch timeframe buttons (1m, 5m, 15m, 30m, 1h) and verify chart reloads.
- Confirm order book populates (crypto uses Binance depth WS/REST).

5) Demo trading
- On Trade panel ensure the mode is DEMO and labelled.
- Place a Buy order with quantity and optional SL/TP. Expect an alert confirming the demo order.
- Open Dashboard and confirm the open position appears with entry price and unrealized P/L that updates as price changes.
- If SL/TP is hit by the price poller, the position should close and update trade history and account balance.

6) Assistant
- Open Assistant, ask a question, and listen for TTS reply (if browser supports it).

7) Live mode safety
- Switch to Live mode (UI toggle). The trade panel should disallow placing live orders and show instructions explaining broker integration is required.

If anything fails, check browser console and backend logs for errors. The code is implemented to use free data sources (Binance and optional AlphaVantage) and synthetic fallbacks.
