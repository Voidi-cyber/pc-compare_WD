/* server-builds.js — «Збережені на сервері» у профілі: список, публікація та видалення збірок через REST API. */
(function () {
  "use strict";

  const list = PC.qs("#server-builds");
  if (!list) return;
  const statusEl = PC.qs("#server-builds-status");

  const NAMES = { cpu: "Процесор", motherboard: "Материнська плата", ram: "Пам’ять", ssd: "SSD", psu: "Блок живлення", case: "Корпус", cooler: "Охолодження" };

  function setStatus(text, isError) {
    statusEl.textContent = text;
    statusEl.hidden = !text;
    statusEl.classList.toggle("form-status--danger", Boolean(isError));
  }

  function esc(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function cardHtml(build) {
    const parts = Object.keys(build.parts)
      .map((key) => '<div class="spec-list__row"><dt>' + esc(NAMES[key] || key) + "</dt><dd>" + esc(build.parts[key]) + "</dd></div>")
      .join("");
    return (
      '<li><article class="card build-card" data-server-build="' + build.id + '">' +
      '<h3 class="build-card__title">' + esc(build.name) + "</h3>" +
      '<label class="build-card__visibility"><span>Публічна збірка</span>' +
      '<input class="switch" type="checkbox" role="switch" data-public' + (build.is_public ? " checked" : "") + "></label>" +
      '<dl class="spec-list">' + parts + "</dl>" +
      '<div class="build-card__total"><p class="build-card__total-label">Загальна вартість</p>' +
      '<p class="build-card__price">' + PC.formatPrice(build.total) + "</p>" +
      '<div class="build-card__actions"><button class="btn btn--outline btn--sm" type="button" data-delete>Видалити</button></div>' +
      "</div></article></li>"
    );
  }

  async function load() {
    setStatus("Завантаження…");
    try {
      const builds = await PC.api.builds();
      list.innerHTML = builds.map(cardHtml).join("");
      setStatus(builds.length ? "" : "На сервері ще немає збережених збірок. Створіть її в конструкторі.");
    } catch (error) {
      list.innerHTML = "";
      setStatus(error.message, true);
    }
  }

  /* Делегування подій: один обробник на список обслуговує всі картки, навіть додані пізніше */
  list.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-delete]");
    if (!button) return;
    const card = button.closest("[data-server-build]");
    button.disabled = true;
    try {
      await PC.api.deleteBuild(card.dataset.serverBuild);
      PC.toast("Збірку видалено");
      load();
    } catch (error) {
      button.disabled = false;
      PC.toast(error.message);
    }
  });

  list.addEventListener("change", async (event) => {
    const toggle = event.target.closest("[data-public]");
    if (!toggle) return;
    const card = toggle.closest("[data-server-build]");
    try {
      await PC.api.updateBuild(card.dataset.serverBuild, { is_public: toggle.checked });
      PC.toast(toggle.checked ? "Збірку опубліковано" : "Збірку знято з публікації");
    } catch (error) {
      toggle.checked = !toggle.checked;
      PC.toast(error.message);
    }
  });

  load();
})();
