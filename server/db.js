/* db.js — підключення до SQLite (вбудований модуль node:sqlite), створення таблиць і початкові дані. */
"use strict";
const { DatabaseSync } = require("node:sqlite");
const path = require("node:path");
const products = require("./data/products.json");

function openDb(file) {
  const db = new DatabaseSync(file || process.env.DB_FILE || path.join(__dirname, "pc-compare.db"));
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      price INTEGER NOT NULL CHECK (price >= 0),
      socket TEXT,
      power INTEGER NOT NULL DEFAULT 0,
      watts INTEGER
    );
    CREATE TABLE IF NOT EXISTS builds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      parts TEXT NOT NULL,
      total INTEGER NOT NULL,
      is_public INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  const count = db.prepare("SELECT COUNT(*) AS n FROM products").get().n;
  if (count === 0) {
    const insert = db.prepare(
      "INSERT INTO products (id, category, name, description, price, socket, power, watts) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    for (const p of products) {
      insert.run(p.id, p.category, p.name, p.description, p.price, p.socket, p.power, p.watts);
    }
  }
  return db;
}

module.exports = { openDb };
