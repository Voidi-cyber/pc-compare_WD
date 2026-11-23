/* api.js — звернення до REST API (fetch + async/await): запит із тайм-аутом і зрозумілими повідомленнями про помилки. */
(function () {
  "use strict";

  const PC = (window.PC = window.PC || {});
  const BASE = window.PC_API_BASE || ""; /* порожній рядок = той самий домен, що й сторінка */
  const TIMEOUT_MS = 8000;

  class ApiError extends Error {
    constructor(message, status, fields) {
      super(message);
      this.status = status;
      this.fields = fields || null;
    }
  }

  async function request(method, url, body) {
    if (location.protocol === "file:" && !BASE) {
      throw new ApiError("Сервер недоступний: відкрийте сайт через http://localhost:3000 (команда npm start)", 0);
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch(BASE + url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal
      });
      if (response.status === 204) return null;
      let data = null;
      try { data = await response.json(); } catch (e) { /* відповідь без JSON */ }
      if (!response.ok) {
        throw new ApiError((data && data.error) || "Помилка сервера (" + response.status + ")", response.status, data && data.fields);
      }
      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error.name === "AbortError") throw new ApiError("Сервер не відповідає. Спробуйте пізніше", 0);
      throw new ApiError("Не вдалося з'єднатися із сервером", 0);
    } finally {
      clearTimeout(timer);
    }
  }

  PC.api = {
    ApiError,
    products: (query) => request("GET", "/api/products" + (query ? "?" + new URLSearchParams(query) : "")),
    builds: (query) => request("GET", "/api/builds" + (query ? "?" + new URLSearchParams(query) : "")),
    createBuild: (data) => request("POST", "/api/builds", data),
    updateBuild: (id, data) => request("PUT", "/api/builds/" + encodeURIComponent(id), data),
    deleteBuild: (id) => request("DELETE", "/api/builds/" + encodeURIComponent(id))
  };
})();
