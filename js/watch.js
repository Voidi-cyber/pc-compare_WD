/* watch.js — Кнопки «Стежити за ціною» та «Поділитися» на сторінці товару; список зберігається в localStorage. */
(function () {
  "use strict";

  const KEY = "pc.watch";

  function get() {
    const saved = PC.storage.get(KEY, []);
    return Array.isArray(saved) ? saved : [];
  }

  function has(id) {
    return get().some((item) => item.id === id);
  }

  function remove(id) {
    PC.storage.set(KEY, get().filter((item) => item.id !== id));
  }

  PC.watch = { get, has, remove };

  function render() {
    PC.qsa("[data-watch-toggle]").forEach((button) => {
      const on = has(button.dataset.id);
      button.setAttribute("aria-pressed", String(on));
      button.textContent = on ? button.dataset.labelOn : button.dataset.labelOff;
      button.classList.remove(on ? button.dataset.classOff : button.dataset.classOn);
      button.classList.add(on ? button.dataset.classOn : button.dataset.classOff);
    });
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-watch-toggle]");
    if (!button) return;
    const id = button.dataset.id;
    if (has(id)) {
      remove(id);
      PC.toast("Ви більше не стежите за ціною");
    } else {
      const list = get();
      list.push({
        id,
        name: button.dataset.name,
        price: Number(button.dataset.price),
        url: window.location.pathname.split("/").pop() || "product.html"
      });
      PC.storage.set(KEY, list);
      PC.toast("Ми повідомимо, якщо ціна зміниться");
    }
    render();
  });

  /* Поділитися: копіює адресу сторінки в буфер обміну */
  PC.qsa("[data-share]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const url = window.location.href;
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(
          () => PC.toast("Посилання скопійовано"),
          () => PC.toast("Не вдалося скопіювати. Скопіюйте адресу з рядка браузера", "danger")
        );
      } else {
        PC.toast("Скопіюйте адресу з рядка браузера", "danger");
      }
    });
  });

  render();
})();
