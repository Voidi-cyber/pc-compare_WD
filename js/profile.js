/* profile.js — Профіль: вкладки, публікація збірок і список «Стежу за ціною». */
(function () {
  "use strict";

  const tablist = PC.qs('[role="tablist"]');
  if (!tablist) return;

  /* ---------- Вкладки (з керуванням стрілками) ---------- */
  const tabs = PC.qsa('[role="tab"]', tablist);

  function selectTab(tab, focus) {
    tabs.forEach((t) => {
      const active = t === tab;
      t.setAttribute("aria-selected", String(active));
      t.tabIndex = active ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !active;
    });
    if (focus) tab.focus();
    if (tab.id === "tab-watch") renderWatch();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab, false));
    tab.addEventListener("keydown", (event) => {
      let next = null;
      if (event.key === "ArrowRight") next = tabs[(index + 1) % tabs.length];
      if (event.key === "ArrowLeft") next = tabs[(index - 1 + tabs.length) % tabs.length];
      if (event.key === "Home") next = tabs[0];
      if (event.key === "End") next = tabs[tabs.length - 1];
      if (next) {
        event.preventDefault();
        selectTab(next, true);
      }
    });
  });

  /* ---------- Публікація збірок ---------- */
  const PUBLISH_KEY = "pc.published";
  const published = PC.storage.get(PUBLISH_KEY, {});

  PC.qsa(".build-card").forEach((card) => {
    const id = card.dataset.build;
    const toggle = PC.qs(".switch", card);
    const button = PC.qs("[data-publish]", card);

    function apply() {
      const on = toggle.checked;
      button.textContent = on ? "Зняти з публікації" : "Опублікувати";
      button.classList.toggle("btn--primary", !on);
      button.classList.toggle("btn--outline", on);
    }

    function setPublished(on, announce) {
      toggle.checked = on;
      published[id] = on;
      PC.storage.set(PUBLISH_KEY, published);
      apply();
      if (announce) {
        PC.toast(on ? "Збірку опубліковано у спільноті" : "Збірку знято з публікації");
      }
    }

    toggle.checked = Boolean(published[id]);
    apply();

    toggle.addEventListener("change", () => setPublished(toggle.checked, true));
    button.addEventListener("click", () => setPublished(!toggle.checked, true));
  });

  /* ---------- Вкладка «Стежу за ціною» ---------- */
  const watchList = PC.qs("#watch-list");
  const watchEmpty = PC.qs("#watch-empty");

  function renderWatch() {
    const items = PC.watch ? PC.watch.get() : [];
    watchList.innerHTML = "";
    items.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML =
        '<article class="card build-card">' +
        '<h2 class="build-card__title"></h2>' +
        '<div class="build-card__total"><p class="build-card__total-label">Поточна ціна</p>' +
        '<p class="build-card__price"></p><div class="build-card__actions">' +
        '<a class="btn btn--outline btn--sm">Відкрити</a>' +
        '<button class="btn btn--outline btn--sm" type="button">Більше не стежити</button></div></div></article>';
      PC.qs(".build-card__title", li).textContent = item.name;
      PC.qs(".build-card__price", li).textContent = "від " + PC.formatPrice(item.price);
      PC.qs("a", li).href = item.url;
      PC.qs("button", li).addEventListener("click", () => {
        PC.watch.remove(item.id);
        PC.toast("Ви більше не стежите за ціною");
        renderWatch();
      });
      watchList.appendChild(li);
    });
    watchEmpty.hidden = items.length > 0;
  }

  renderWatch();
})();
