/* validate.js — перевірка вхідних даних збірки на сервері (клієнтській валідації довіряти не можна). */
"use strict";

const CATEGORIES = ["cpu", "motherboard", "ram", "ssd", "psu", "case", "cooler"];

function validateBuild(input, productsById) {
  const errors = {};
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { errors: { body: "Очікується JSON-об'єкт" }, value: null };
  }

  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (name.length < 1) errors.name = "Введіть назву збірки";
  else if (name.length > 60) errors.name = "Назва задовга: максимум 60 символів";

  const parts = {};
  if (typeof input.parts !== "object" || input.parts === null || Array.isArray(input.parts)) {
    errors.parts = "Передайте об'єкт parts, наприклад { \"cpu\": \"r5-7600\" }";
  } else {
    for (const [category, id] of Object.entries(input.parts)) {
      if (!CATEGORIES.includes(category)) {
        errors.parts = "Невідома категорія: " + category;
        break;
      }
      const product = typeof id === "string" ? productsById.get(id) : null;
      if (!product || product.category !== category) {
        errors.parts = "Невідомий компонент «" + id + "» для категорії " + category;
        break;
      }
      parts[category] = id;
    }
    if (!errors.parts && Object.keys(parts).length === 0) errors.parts = "Оберіть хоча б один компонент";
  }

  if (input.is_public !== undefined && typeof input.is_public !== "boolean") {
    errors.is_public = "Поле is_public має бути true або false";
  }

  if (Object.keys(errors).length) return { errors, value: null };
  return { errors: null, value: { name, parts, is_public: input.is_public === true } };
}

module.exports = { validateBuild, CATEGORIES };
