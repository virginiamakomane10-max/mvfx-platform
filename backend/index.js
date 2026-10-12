const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const cors = require('cors');

require('dotenv').config();

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
const DB_FILE = process.env.DATABASE_FILE || './mvfx.db';
const POLL_INTERVAL_MS = parseInt(process.env.POLL_INTERVAL_MS || '1000');
const ALPHA_KEY = process.env.ALPHA_VANTAGE_KEY || '';
const OPENAI_KEY = process.env.OPENAI_API_KEY || '';

const db = new Database(DB_FILE);

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Helper DB queries
const createUser = (username, passwordHash) => {
  const stmt = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
  const info = stmt.run(username, passwordHash);
  return info.lastInsertRowid;
};

const getUserByUsername = (username) => db.prepare('SELECT * FROM users WHERE username = ?').get(username);

const createDemoAccountForUser = (userId) => {
  const exists = db.prepare('SELECT * FROM demo_accounts WHERE user_id = ?').get(userId);
  if (exists) return exists;
  const stmt = db.prepare('INSERT INTO demo_accounts (user_id, balance, equity) VALUES (?, 10000, 10000)');
  const info = stmt.run(userId);
  return db.prepare('SELECT * FROM demo_accounts WHERE id = ?').get(info.lastInsertRowid);
};

// Auth
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  const exists = getUserByUsername(username);
  if (exists) return res.status(400).json({ error: 'username exists' });
  const hash = await bcrypt.hash(password, 10);
  const userId = createUser(username, hash);
  createDemoAccountForUser(userId);
  const token = jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = getUserByUsername(username);
  if (!user) return res.status(401).json({ error: 'invalid' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'invalid' });
  const token = jwt.sign({ userId: user.id, username }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

// Middleware
const auth = (req, res, next) => {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: 'missing auth' });
  const token = h.replace('Bearer ', '');
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data; next();
  } catch (e) { return res.status(401).json({ error: 'invalid token' }); }
};

// Demo account endpoints
app.get('/api/demo/account', auth, (req, res) => {
  const account = db.prepare('SELECT * FROM demo_accounts WHERE user_id = ?').get(req.user.userId);
  const positions = db.prepare('SELECT * FROM demo_orders WHERE account_id = ? AND status = "open"').all(account.id);
  const history = db.prepare('SELECT * FROM demo_orders WHERE account_id = ? ORDER BY created_at DESC LIMIT 200').all(account.id);
  res.json({ account, positions, history });
});

app.post('/api/demo/order', auth, (req, res) => {
  const { symbol, side, price, quantity, sl, tp } = req.body;
  const acc = db.prepare('SELECT * FROM demo_accounts WHERE user_id = ?').get(req.user.userId);
  if (!acc) return res.status(400).json({ error: 'no demo account' });
  // very simple execution: open position at price, status=open
  const stmt = db.prepare('INSERT INTO demo_orders (account_id, symbol, side, price, quantity, sl, tp, status) VALUES (?, ?, ?, ?, ?, ?, ?, "open")');
  const info = stmt.run(acc.id, symbol, side, price, quantity, sl || null, tp || null);
  const order = db.prepare('SELECT * FROM demo_orders WHERE id = ?').get(info.lastInsertRowid);
  res.json({ order });
});

// Simple endpoint for live trading placeholder
app.post('/api/live/order', auth, (req, res) => {
  // This is a placeholder. To enable real orders you must implement broker adapter and route orders to broker APIs.
  res.status(501).json({ error: 'Live trading not enabled. Integrate with a broker API and implement order routing.' });
});

// AI assistant proxy (optional OpenAI)
app.post('/api/assistant', auth, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'message required' });
  if (!OPENAI_KEY) {
    // fallback simple assistant
    const text = fallbackAssistant(message);
    return res.json({ reply: text });
  }
  try {
    // Proxy to OpenAI (if key present) — user must set key in env for production
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: [{ role: 'user', content: message }], max_tokens: 300 })
    });
    const j = await r.json();
    const reply = j?.choices?.[0]?.message?.content || 'No reply';
    res.json({ reply });
  } catch (e) { res.status(500).json({ error: 'assistant error', detail: e.message }); }
});

function fallbackAssistant(msg) {
  const m = msg.toLowerCase();
  if (m.includes('demo')) return 'Demo accounts use simulated funds and market data may be simulated. Use the Live connectors with API keys to enable real feeds.';
  if (m.includes('how to deposit')) return 'To accept real-money deposits you must connect a payment processor (Stripe, Adyen) and implement KYC/AML. This starter does not handle payments.';
  return "MVFX assistant: I can answer basic questions. For advanced AI please set OPENAI_API_KEY in backend .env to enable the LLM proxy.";
}

// Price fetcher & broadcaster
const subscribers = new Set();

async function fetchKlinesBinance(symbol = 'BTCUSDT', interval = '1m', limit = 200) {
  try {
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    const res = await fetch(url);
    const data = await res.json();
    // map to OHLC with timestamp
    return data.map(d => ({
      t: d[0], o: parseFloat(d[1]), h: parseFloat(d[2]), l: parseFloat(d[3]), c: parseFloat(d[4]), v: parseFloat(d[5])
    }));
  } catch (e) { return null; }
}

async function fetchKlinesAlpha(symbol = 'EURUSD', interval = '1min', outputsize = 'compact') {
  if (!ALPHA_KEY) return null;
  try {
    // Alpha Vantage uses FX_INTRADAY for FX and DIGITAL_CURRENCY for crypto; for XAUUSD we use FX or commodity endpoint (limited). Use TIME_SERIES_INTRADAY for FX via symbol pair e.g. EURUSD
    const func = 'TIME_SERIES_INTRADAY';
    const url = `https://www.alphavantage.co/query?function=${func}&symbol=${symbol}&interval=1min&apikey=${ALPHA_KEY}&outputsize=${outputsize}`;
    const res = await fetch(url);
    const j = await res.json();
    if (j['Time Series (1min)']) {
      const items = Object.entries(j['Time Series (1min)']).map(([k, v]) => ({ t: new Date(k).getTime(), o: parseFloat(v['1. open']), h: parseFloat(v['2. high']), l: parseFloat(v['3. low']), c: parseFloat(v['4. close']), v: parseFloat(v['5. volume']) }));
      return items.reverse();
    }
    return null;
  } catch (e) { return null; }
}

// Poll loop
const TRACK = [
  { symbol: 'BTCUSDT', source: 'binance', interval: '1m' },
  { symbol: 'ETHUSDT', source: 'binance', interval: '1m' },
  { symbol: 'XAUUSD', source: 'alpha', interval: '1min' },
  { symbol: 'EURUSD', source: 'alpha', interval: '1min' }
];

async function pollLoop() {
  for (const t of TRACK) {
    let klines = null;
    if (t.source === 'binance') klines = await fetchKlinesBinance(t.symbol, '1m', 200);
    if (t.source === 'alpha') klines = await fetchKlinesAlpha(t.symbol.replace('/', ''), '1min', 'compact');
    if (!klines) {
      // fallback to synthetic small random walk
      klines = generateSynthetic(t.symbol);
    }
    // broadcast latest candle
    const latest = klines[klines.length - 1];
    io.emit('price', { symbol: t.symbol, candle: latest });
  }
}

function generateSynthetic(symbol) {
  const now = Date.now();
  const base = 100 + Math.random() * 100;
  const items = [];
  for (let i = 0; i < 60; i++) {
    const t = now - (60 - i) * 60000;
    const o = base + Math.sin(i / 5) + Math.random();
    const c = o + (Math.random() - 0.5) * 2;
    const h = Math.max(o, c) + Math.random();
    const l = Math.min(o, c) - Math.random();
    items.push({ t, o, h, l, c, v: Math.random() * 10 });
  }
  return items;
}

setInterval(pollLoop, POLL_INTERVAL_MS);

io.on('connection', (socket) => {
  console.log('ws connected', socket.id);
  socket.on('subscribe', (sym) => { subscribers.add(socket.id); });
  socket.on('disconnect', () => { subscribers.delete(socket.id); });
});

app.get('/api/ping', (req, res) => res.json({ ok: true }));

server.listen(PORT, () => console.log('MVFX backend running on', PORT));
