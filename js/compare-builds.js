/* compare-builds.js — порівняння збірок ПК: вибір 2–4 збірок і таблиця їхніх комплектуючих та вартості. */
(function () {
  "use strict";

  const root = PC.qs("[data-compare-builds]");
  if (!root || !PC.BUILDS) return;

  const pick = PC.qs("#build-pick");
  const statusEl = PC.qs("#build-pick-status");
  const wrap = PC.qs("#builds-table-wrap");
  const MIN = 2, MAX = 4;

  const esc = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const selected = PC.BUILDS.slice(0, 3).map((b) => b.id);

  pick.insertAdjacentHTML(
    "beforeend",
    PC.BUILDS.map(
      (b) =>
        '<label class="build-pick__item"><input type="checkbox" value="' + b.id + '"' + (selected.indexOf(b.id) !== -1 ? " checked" : "") + ">" +
        "<span><strong>" + esc(b.title) + "</strong><small>" + esc(b.author) + " · " + PC.formatPrice(b.price) + "</small></span></label>"
    ).join("")
  );

  function setStatus(text) {
    statusEl.textContent = text;
    statusEl.hidden = !text;
  }

  function render() {
    const builds = selected.map((id) => PC.BUILDS.find((b) => b.id === id));
    if (builds.length < MIN) {
      wrap.innerHTML = "";
      setStatus("Оберіть щонайменше " + MIN + " збірки для порівняння");
      return;
    }
    setStatus("");
    const head = builds.map((b) => '<th scope="col">' + esc(b.title) + "<br><small>" + esc(b.author) + "</small></th>").join("");
    const rows = PC.PART_LABELS.map(
      (p) => '<tr><th scope="row">' + p[1] + "</th>" + builds.map((b) => "<td>" + esc(b.parts[p[0]]) + "</td>").join("") + "</tr>"
    ).join("");
    const min = Math.min.apply(null, builds.map((b) => b.price));
    const price = builds
      .map((b) => "<td><strong>" + PC.formatPrice(b.price) + "</strong>" + (b.price === min ? "<br><small>найдешевша</small>" : "") + "</td>")
      .join("");
    wrap.innerHTML =
      '<table class="compare"><caption class="visually-hidden">Порівняння збірок ПК</caption>' +
      '<thead><tr><th scope="col">Комплектуючі</th>' + head + "</tr></thead><tbody>" + rows +
      '<tr class="compare__price"><th scope="row">Орієнтовна вартість</th>' + price + "</tr></tbody></table>";
  }

  pick.addEventListener("change", (event) => {
    const box = event.target;
    if (box.type !== "checkbox") return;
    if (box.checked) {
      if (selected.length >= MAX) {
        box.checked = false;
        PC.toast("Можна порівняти не більше " + MAX + " збірок");
        return;
      }
      selected.push(box.value);
    } else {
      selected.splice(selected.indexOf(box.value), 1);
    }
    render();
  });

  render();
})();
