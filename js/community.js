/* community.js — Збірки спільноти: картки з даних, пошук, фільтр за бюджетом, сортування та вікно з повним списком комплектуючих. */
(function () {
  "use strict";

  const list = PC.qs("[data-builds]");
  if (!list) return;

  const searchForm = PC.qs(".search");
  const searchInput = PC.qs("#search-builds");
  const budgetSelect = PC.qs("#budget");
  const sortSelect = PC.qs("#sort-builds");
  const emptyBox = PC.qs("#builds-empty");

  /* Картки будуються з PC.BUILDS (js/builds-data.js); статична розмітка в HTML — запасний варіант без JS */
  const esc = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

  function cardHtml(b) {
    const search = [b.title, b.author].concat(PC.PART_LABELS.map((p) => b.parts[p[0]])).join(" ").toLowerCase();
    const rows = [["CPU", b.parts.cpu], ["GPU", b.parts.gpu], ["RAM", b.parts.ram]]
      .map((r) => '<div class="spec-list__row"><dt>' + r[0] + "</dt><dd>" + esc(r[1]) + "</dd></div>")
      .join("");
    return (
      '<li><article class="card build-public" data-id="' + b.id + '" data-price="' + b.price + '" data-popular="' + b.popular +
      '" data-date="' + b.date + '" data-search="' + esc(search) + '">' +
      '<div class="build-public__head"><h2 class="build-public__title">' + esc(b.title) + "</h2>" +
      '<p class="author"><span class="icon icon--user" aria-hidden="true"></span>' + esc(b.author) + "</p></div>" +
      '<dl class="spec-list">' + rows + "</dl>" +
      '<div class="build-public__footer"><p class="build-public__price">' + PC.formatPrice(b.price) + "</p>" +
      '<button class="btn btn--outline btn--md" type="button" data-details="' + b.id + '">Детальніше</button>' +
      '<a class="btn btn--primary btn--md" href="builder.html">Відкрити в конструкторі <span class="icon icon--arrow" aria-hidden="true"></span></a>' +
      "</div></article></li>"
    );
  }

  if (PC.BUILDS) list.innerHTML = PC.BUILDS.map(cardHtml).join("");

  /* Вікно з повним списком комплектуючих (делегування кліків на списку) */
  const dialog = PC.qs("#build-details");
  let lastTrigger = null;

  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-details]");
    if (!button || !dialog || !PC.BUILDS) return;
    const b = PC.BUILDS.find((item) => item.id === button.dataset.details);
    if (!b) return;
    PC.qs("#details-title").textContent = b.title;
    PC.qs("#details-author").textContent = "Автор: " + b.author;
    PC.qs("#details-parts").innerHTML = PC.PART_LABELS
      .map((p) => '<div class="spec-list__row"><dt>' + p[1] + "</dt><dd>" + esc(b.parts[p[0]]) + "</dd></div>")
      .join("");
    PC.qs("#details-price").textContent = PC.formatPrice(b.price);
    lastTrigger = button;
    dialog.showModal();
  });

  if (dialog) {
    PC.qs("#details-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener("close", () => { if (lastTrigger) lastTrigger.focus(); });
  }

  const builds = PC.qsa(":scope > li", list).map((li) => {
    const card = PC.qs(".build-public", li);
    return {
      li,
      search: card.dataset.search,
      price: Number(card.dataset.price),
      popular: Number(card.dataset.popular),
      date: card.dataset.date
    };
  });

  const sorters = {
    popular: (a, b) => a.popular - b.popular,
    new: (a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0),
    "price-asc": (a, b) => a.price - b.price
  };

  /* У прототипі при бюджеті «До 50 000 ₴» показано і дорожчу збірку,
     тому фільтр за бюджетом починає діяти лише після зміни користувачем */
  let budgetActive = false;

  function update() {
    const query = searchInput.value.trim().toLowerCase();
    const limit = Number(budgetSelect.value);

    const visible = builds.filter(
      (b) => (!query || b.search.indexOf(query) !== -1) && (!budgetActive || b.price <= limit)
    );

    builds.forEach((b) => {
      b.li.hidden = visible.indexOf(b) === -1;
    });

    visible.sort(sorters[sortSelect.value] || sorters.popular).forEach((b) => list.appendChild(b.li));
    emptyBox.hidden = visible.length > 0;
  }

  searchForm.addEventListener("submit", (event) => event.preventDefault());
  searchInput.addEventListener("input", update);
  sortSelect.addEventListener("change", update);
  budgetSelect.addEventListener("change", () => {
    budgetActive = true;
    update();
  });

  update();
})();
