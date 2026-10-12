const Database = require('better-sqlite3');
const db = new Database(process.env.DATABASE_FILE || './mvfx.db');

// users, demo_accounts, demo_orders
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password_hash TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS demo_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  balance REAL DEFAULT 10000,
  equity REAL DEFAULT 10000,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS demo_orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER,
  symbol TEXT,
  side TEXT,
  price REAL,
  quantity REAL,
  sl REAL,
  tp REAL,
  status TEXT,
  profit REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

console.log('Database initialized at', process.env.DATABASE_FILE || './mvfx.db');
