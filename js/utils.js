/* utils.js — Спільні допоміжні функції (вибір елементів, localStorage, тости). Підключається першим; усе зберігається в об'єкті PC. */
(function () {
  "use strict";

  const PC = (window.PC = window.PC || {});

  /* ---------- DOM ---------- */
  PC.qs = (selector, root) => (root || document).querySelector(selector);
  PC.qsa = (selector, root) =>
    Array.prototype.slice.call((root || document).querySelectorAll(selector));

  /* ---------- localStorage (з try/catch: у приватному режимі може бути недоступний) ---------- */
  PC.storage = {
    get(key, fallback) {
      try {
        const raw = window.localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        return false;
      }
    }
  };

  /* ---------- Форматування ---------- */
  PC.formatNumber = (n) =>
    String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  PC.formatPrice = (n) => PC.formatNumber(n) + " ₴";

  /* Відмінювання: forms = [1 компонент, 2 компоненти, 5 компонентів] */
  PC.plural = (n, forms) => {
    const m10 = n % 10;
    const m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return forms[0];
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return forms[1];
    return forms[2];
  };

  PC.pad = (n) => (n < 10 ? "0" + n : String(n));

  /* ---------- Спливаюче повідомлення (toast) ---------- */
  let toastTimer = null;
  const toastEl = document.createElement("div");
  toastEl.className = "toast";
  toastEl.setAttribute("role", "status");
  toastEl.setAttribute("aria-live", "polite");
  document.body.appendChild(toastEl);

  PC.toast = (message, type) => {
    toastEl.textContent = message;
    toastEl.classList.toggle("toast--danger", type === "danger");
    toastEl.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toastEl.classList.remove("is-visible");
    }, 3200);
  };

  /* ---------- Помилки полів форми ---------- */
  /* Повідомлення виводиться в елемент з id = <id поля>-error */
  PC.setFieldError = (input, message) => {
    const box = document.getElementById(input.id + "-error");
    if (message) {
      input.setAttribute("aria-invalid", "true");
      if (box) {
        box.textContent = message;
        box.hidden = false;
      }
    } else {
      input.removeAttribute("aria-invalid");
      if (box) {
        box.textContent = "";
        box.hidden = true;
      }
    }
  };
})();
