/* app.js — Express-застосунок: маршрути REST API (/api/...), захисні заголовки та роздача клієнтської частини. */
"use strict";
const path = require("node:path");
const express = require("express");
const { openDb } = require("./db");
const { createService } = require("./service");

function createApp(db) {
  const service = createService(db || openDb());
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "10kb" }));

  /* Базові захисні заголовки та CORS лише для дозволеного джерела */
  app.use((req, res, next) => {
    res.set("X-Content-Type-Options", "nosniff");
    res.set("X-Frame-Options", "DENY");
    res.set("Referrer-Policy", "no-referrer");
    const origin = process.env.CORS_ORIGIN;
    if (origin) {
      res.set("Access-Control-Allow-Origin", origin);
      res.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      if (req.method === "OPTIONS") return res.sendStatus(204);
    }
    next();
  });

  /* Простий обмежувач частоти запитів: не більше 120 за хвилину з однієї адреси (у пам'яті) */
  const hits = new Map();
  app.use("/api", (req, res, next) => {
    const now = Date.now();
    const entry = hits.get(req.ip) || { count: 0, reset: now + 60000 };
    if (now > entry.reset) { entry.count = 0; entry.reset = now + 60000; }
    entry.count += 1;
    hits.set(req.ip, entry);
    if (entry.count > 120) return res.status(429).json({ error: "Забагато запитів, спробуйте пізніше" });
    next();
  });

  const send = (res, result) =>
    result.body === null ? res.sendStatus(result.status) : res.status(result.status).json(result.body);

  app.get("/api/health", (req, res) => send(res, service.health()));
  app.get("/api/products", (req, res) => send(res, service.listProducts(req.query)));
  app.get("/api/builds", (req, res) => send(res, service.listBuilds(req.query)));
  app.get("/api/builds/:id", (req, res) => send(res, service.getBuild(req.params.id)));
  app.post("/api/builds", (req, res) => send(res, service.createBuild(req.body)));
  app.put("/api/builds/:id", (req, res) => send(res, service.updateBuild(req.params.id, req.body)));
  app.delete("/api/builds/:id", (req, res) => send(res, service.deleteBuild(req.params.id)));

  app.use("/api", (req, res) => res.status(404).json({ error: "Маршрут не знайдено" }));

  /* Клієнтська частина (HTML/CSS/JS з лабораторних робіт № 1–4) лежить в батьківській теці */
  const clientDir = path.join(__dirname, "..");
  app.use("/css", express.static(path.join(clientDir, "css")));
  app.use("/js", express.static(path.join(clientDir, "js")));
  app.get("/", (req, res) => res.sendFile(path.join(clientDir, "index.html")));
  app.get("/:page.html", (req, res, next) => {
    if (!/^[a-z0-9-]+$/.test(req.params.page)) return next();
    res.sendFile(path.join(clientDir, req.params.page + ".html"), (err) => err && next());
  });

  /* Обробка помилок: некоректний JSON та непередбачені збої */
  app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") return res.status(400).json({ error: "Некоректний JSON" });
    if (err.type === "entity.too.large") return res.status(413).json({ error: "Запит завеликий" });
    console.error(err);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  });

  return app;
}

module.exports = { createApp };
