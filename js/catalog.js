/* catalog.js — Каталог: фільтри (виробник, сокет, ціна), сортування та порожній стан без перезавантаження сторінки. */
(function () {
  "use strict";

  const grid = PC.qs("[data-catalog]");
  if (!grid) return;

  const form = PC.qs("#catalog-filters");
  const sortSelect = PC.qs("#sort");
  const minInput = PC.qs("#price-min");
  const maxInput = PC.qs("#price-max");
  const minLabel = PC.qs("#price-min-label");
  const maxLabel = PC.qs("#price-max-label");
  const emptyBox = PC.qs("#catalog-empty");
  const resetButton = PC.qs("#catalog-reset");
  const liveCount = PC.qs("#catalog-count");

  const products = PC.qsa("li[data-id]", grid).map((el) => ({
    el,
    name: el.dataset.name,
    brand: el.dataset.brand,
    price: Number(el.dataset.price),
    socket: el.dataset.socket,
    type: el.dataset.type
  }));

  const sorters = {
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    name: (a, b) => a.name.localeCompare(b.name, "uk")
  };

  function update() {
    const min = Number(minInput.value);
    const max = Number(maxInput.value);
    minLabel.textContent = "від " + PC.formatPrice(min);
    maxLabel.textContent = "до " + PC.formatPrice(max);

    /* Якщо жоден бренд не вибрано, фільтр за брендом не застосовується */
    const brands = PC.qsa('input[name="brand"]:checked', form).map((i) => i.value);
    const socket = form.elements.socket ? form.elements.socket.value : "";
    const type = form.elements.type ? form.elements.type.value : "";

    const visible = products.filter(
      (p) =>
        (!brands.length || brands.indexOf(p.brand) !== -1) &&
        p.price >= min &&
        p.price <= max &&
        (!socket || p.socket === socket) &&
        (!type || p.type === type)
    );

    products.forEach((p) => {
      p.el.hidden = visible.indexOf(p) === -1;
    });

    /* Сортування: порядок елементів у DOM змінюється відповідно до вибору */
    const sorter = sorters[sortSelect.value] || sorters["price-asc"];
    visible.sort(sorter).forEach((p) => grid.appendChild(p.el));

    emptyBox.hidden = visible.length > 0;
    liveCount.textContent =
      "Знайдено " + visible.length + " " + PC.plural(visible.length, ["товар", "товари", "товарів"]);
  }

  /* Мінімальна ціна не може перевищувати максимальну і навпаки */
  minInput.addEventListener("input", () => {
    if (Number(minInput.value) > Number(maxInput.value)) minInput.value = maxInput.value;
  });
  maxInput.addEventListener("input", () => {
    if (Number(maxInput.value) < Number(minInput.value)) maxInput.value = minInput.value;
  });

  form.addEventListener("input", update);
  form.addEventListener("change", update);
  form.addEventListener("submit", (event) => event.preventDefault());
  sortSelect.addEventListener("change", update);

  resetButton.addEventListener("click", () => {
    form.reset();
    sortSelect.value = "price-asc";
    update();
  });

  update();
})();
