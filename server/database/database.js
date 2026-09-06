const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "shophub.db");

const db = new Database(dbPath);

console.log("SQLite database connected successfully");

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT,
    image TEXT,
    stock INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;