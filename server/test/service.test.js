/* service.test.js — автотести CRUD-логіки REST API на тимчасовій базі в пам'яті. */
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { openDb } = require("../db");
const { createService } = require("../service");

const fresh = () => createService(openDb(":memory:"));

test("products: список, фільтр за категорією, сокетом та ціною", () => {
  const s = fresh();
  assert.equal(s.listProducts({}).body.length, 18);
  assert.ok(s.listProducts({ category: "cpu" }).body.every((p) => p.category === "cpu"));
  assert.ok(s.listProducts({ socket: "AM5" }).body.every((p) => p.socket === "AM5"));
  assert.ok(s.listProducts({ maxPrice: "5000" }).body.every((p) => p.price <= 5000));
  assert.equal(s.listProducts({ maxPrice: "abc" }).status, 400);
});

test("create: збірка зберігається, ціна рахується на сервері", () => {
  const s = fresh();
  const r = s.createBuild({ name: "  Офіс  ", parts: { cpu: "r5-7600", motherboard: "b650" }, total: 1 });
  assert.equal(r.status, 201);
  assert.equal(r.body.name, "Офіс");
  assert.equal(r.body.total, 14990 + 12490);
  assert.equal(r.body.is_public, false);
});

test("create: помилки валідації", () => {
  const s = fresh();
  const bad = (input) => s.createBuild(input);
  assert.equal(bad(null).status, 400);
  assert.ok(bad({ name: "", parts: { cpu: "r5-7600" } }).body.fields.name);
  assert.ok(bad({ name: "x".repeat(61), parts: { cpu: "r5-7600" } }).body.fields.name);
  assert.ok(bad({ name: "A", parts: {} }).body.fields.parts);
  assert.ok(bad({ name: "A", parts: { cpu: "nope" } }).body.fields.parts);
  assert.ok(bad({ name: "A", parts: { gpu: "x" } }).body.fields.parts);
  assert.ok(bad({ name: "A", parts: { cpu: "b650" } }).body.fields.parts); /* компонент з іншої категорії */
  assert.ok(bad({ name: "A", parts: { cpu: "r5-7600" }, is_public: "yes" }).body.fields.is_public);
});

test("read: список, один запис, 404 та некоректний id", () => {
  const s = fresh();
  const id = s.createBuild({ name: "A", parts: { cpu: "r5-7600" } }).body.id;
  assert.equal(s.listBuilds({}).body.length, 1);
  assert.equal(s.getBuild(id).body.name, "A");
  assert.equal(s.getBuild(999).status, 404);
  assert.equal(s.getBuild("abc").status, 400);
  assert.equal(s.getBuild("1 OR 1=1").status, 400);
});

test("update: часткове оновлення, перерахунок ціни, публікація", () => {
  const s = fresh();
  const id = s.createBuild({ name: "A", parts: { cpu: "r5-7600" } }).body.id;
  const pub = s.updateBuild(id, { is_public: true });
  assert.equal(pub.status, 200);
  assert.equal(pub.body.is_public, true);
  assert.equal(s.listBuilds({ public: "1" }).body.length, 1);
  const upd = s.updateBuild(id, { parts: { cpu: "r7-7700x", ram: "ddr5-16" } });
  assert.equal(upd.body.total, 18900 + 4990);
  assert.equal(s.updateBuild(id, { name: "" }).status, 400);
  assert.equal(s.updateBuild(999, { name: "B" }).status, 404);
});

test("delete: видалення і повторне видалення", () => {
  const s = fresh();
  const id = s.createBuild({ name: "A", parts: { cpu: "r5-7600" } }).body.id;
  assert.equal(s.deleteBuild(id).status, 204);
  assert.equal(s.deleteBuild(id).status, 404);
  assert.equal(s.listBuilds({}).body.length, 0);
});

test("безпека: SQL-ін'єкція в назві зберігається як текст, таблиця не зачеплена", () => {
  const s = fresh();
  const r = s.createBuild({ name: "x'); DROP TABLE builds;--", parts: { cpu: "r5-7600" } });
  assert.equal(r.status, 201);
  assert.equal(s.listBuilds({}).body.length, 1);
});
