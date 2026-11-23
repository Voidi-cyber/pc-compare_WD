/* compare.js — Список «Порівняння»: додавання/видалення товарів (до 4), лічильники, збереження в localStorage. */
(function () {
  "use strict";

  /* Процесори та накопичувачі мають окремі списки порівняння (data-compare-scope на <body>) */
  const storage = document.body.dataset.compareScope === "storage";
  const KEY = storage ? "pc.compare.storage" : "pc.compare";
  const MAX = 4;
  /* Початковий вибір відповідає прототипу (4 обрані товари) */
  /* Накопичувачі: спочатку нічого не обрано, у порівнянні лише те, що додав користувач */
  const DEFAULT = storage ? [] : ["ryzen-5-7600", "i5-13400", "ryzen-5-7600x", "ryzen-9-7950x"];

  function get() {
    const saved = PC.storage.get(KEY, null);
    return Array.isArray(saved) ? saved : DEFAULT.slice();
  }

  function save(list) {
    PC.storage.set(KEY, list);
  }

  function renderButton(button, on) {
    button.setAttribute("aria-pressed", String(on));
    button.textContent = on
      ? button.dataset.labelOn || "Додано до порівняння"
      : button.dataset.labelOff || "Додати до порівняння";
    const classOn = button.dataset.classOn;
    const classOff = button.dataset.classOff;
    if (classOn && classOff) {
      button.classList.remove(on ? classOff : classOn);
      button.classList.add(on ? classOn : classOff);
    }
  }

  function render() {
    const list = get();
    PC.qsa("[data-compare-toggle]").forEach((button) => {
      renderButton(button, list.indexOf(button.dataset.compareToggle) !== -1);
    });
    PC.qsa("[data-compare-count]").forEach((el) => {
      el.textContent = list.length;
    });
  }

  function toggle(id) {
    const list = get();
    const index = list.indexOf(id);
    if (index !== -1) {
      list.splice(index, 1);
      PC.toast("Прибрано з порівняння");
    } else if (list.length >= MAX) {
      PC.toast("Можна порівняти не більше " + MAX + " товарів", "danger");
      return;
    } else {
      list.push(id);
      PC.toast("Додано до порівняння");
    }
    save(list);
    render();
  }

  PC.compare = { get, toggle, max: MAX };

  /* Делегування подій: працює і для карток, які додаються динамічно */
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-compare-toggle]");
    if (button) toggle(button.dataset.compareToggle);
  });

  /* Для порівняння потрібно щонайменше 2 товари */
  PC.qsa("[data-compare-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (get().length < 2) {
        event.preventDefault();
        PC.toast("Додайте щонайменше 2 товари для порівняння", "danger");
      }
    });
  });

  render();
})();
