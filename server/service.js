/* service.js — логіка REST API без прив'язки до Express: кожна функція повертає { status, body }. */
"use strict";
const { validateBuild } = require("./validate");

function createService(db) {
  const productRows = db.prepare("SELECT * FROM products ORDER BY category, price").all();
  const productsById = new Map(productRows.map((p) => [p.id, p]));

  const toBuild = (row) => ({
    id: row.id,
    name: row.name,
    parts: JSON.parse(row.parts),
    total: row.total,
    is_public: row.is_public === 1,
    created_at: row.created_at,
    updated_at: row.updated_at
  });

  const parseId = (raw) => {
    const id = Number(raw);
    return Number.isInteger(id) && id > 0 ? id : null;
  };
  const notFound = () => ({ status: 404, body: { error: "Збірку не знайдено" } });
  const badId = () => ({ status: 400, body: { error: "Некоректний id" } });
  const total = (parts) => Object.values(parts).reduce((sum, id) => sum + productsById.get(id).price, 0);

  return {
    health() {
      return { status: 200, body: { status: "ok" } };
    },

    listProducts(query) {
      let rows = productRows;
      if (query.category) rows = rows.filter((p) => p.category === query.category);
      if (query.socket) rows = rows.filter((p) => p.socket === query.socket);
      if (query.maxPrice !== undefined) {
        const max = Number(query.maxPrice);
        if (!Number.isFinite(max) || max < 0) {
          return { status: 400, body: { error: "maxPrice має бути невід'ємним числом" } };
        }
        rows = rows.filter((p) => p.price <= max);
      }
      return { status: 200, body: rows };
    },

    listBuilds(query) {
      const onlyPublic = query.public === "1" || query.public === "true";
      const sql = "SELECT * FROM builds" + (onlyPublic ? " WHERE is_public = 1" : "") + " ORDER BY id DESC";
      return { status: 200, body: db.prepare(sql).all().map(toBuild) };
    },

    getBuild(rawId) {
      const id = parseId(rawId);
      if (!id) return badId();
      const row = db.prepare("SELECT * FROM builds WHERE id = ?").get(id);
      return row ? { status: 200, body: toBuild(row) } : notFound();
    },

    createBuild(input) {
      const { errors, value } = validateBuild(input, productsById);
      if (errors) return { status: 400, body: { error: "Дані не пройшли перевірку", fields: errors } };
      const now = new Date().toISOString();
      const result = db
        .prepare("INSERT INTO builds (name, parts, total, is_public, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)")
        .run(value.name, JSON.stringify(value.parts), total(value.parts), value.is_public ? 1 : 0, now, now);
      const row = db.prepare("SELECT * FROM builds WHERE id = ?").get(Number(result.lastInsertRowid));
      return { status: 201, body: toBuild(row) };
    },

    updateBuild(rawId, input) {
      const id = parseId(rawId);
      if (!id) return badId();
      const existing = db.prepare("SELECT * FROM builds WHERE id = ?").get(id);
      if (!existing) return notFound();
      const merged = Object.assign({ name: existing.name, parts: JSON.parse(existing.parts), is_public: existing.is_public === 1 }, input);
      const { errors, value } = validateBuild(merged, productsById);
      if (errors) return { status: 400, body: { error: "Дані не пройшли перевірку", fields: errors } };
      db.prepare("UPDATE builds SET name = ?, parts = ?, total = ?, is_public = ?, updated_at = ? WHERE id = ?").run(
        value.name, JSON.stringify(value.parts), total(value.parts), value.is_public ? 1 : 0, new Date().toISOString(), id
      );
      return { status: 200, body: toBuild(db.prepare("SELECT * FROM builds WHERE id = ?").get(id)) };
    },

    deleteBuild(rawId) {
      const id = parseId(rawId);
      if (!id) return badId();
      const result = db.prepare("DELETE FROM builds WHERE id = ?").run(id);
      return result.changes ? { status: 204, body: null } : notFound();
    }
  };
}

module.exports = { createService };
