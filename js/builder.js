/* builder.js — Конструктор збірки: вибір компонентів у діалозі, перевірка сумісності (сокет) та перерахунок ціни й потужності. */
(function () {
  "use strict";

  const root = PC.qs("[data-builder]");
  if (!root) return;

  const listEl = PC.qs("#builder-list");
  const summaryEl = PC.qs("#builder-summary");
  const subtitleEl = PC.qs("#builder-subtitle");
  const dialog = PC.qs("#picker");
  const pickerForm = PC.qs("#picker-form");
  const pickerTitle = PC.qs("#picker-title");
  const pickerOptions = PC.qs("#picker-options");
  const pickerRemove = PC.qs("#picker-remove");

  /* ---------- Дані ---------- */
  const SLOTS = [
    { key: "cpu", icon: "cpu", title: "Процесор", hint: "Виберіть процесор для збірки.", dialog: "Оберіть процесор" },
    { key: "motherboard", icon: "drive", title: "Материнська плата", hint: "Виберіть материнську плату під сокет процесора.", dialog: "Оберіть материнську плату" },
    { key: "ram", icon: "gear", title: "Оперативна пам’ять", hint: "Виберіть модулі оперативної пам’яті.", dialog: "Оберіть оперативну пам’ять" },
    { key: "ssd", icon: "drive", title: "SSD", hint: "Виберіть накопичувач для швидкого завантаження системи.", dialog: "Оберіть накопичувач" },
    { key: "psu", icon: "drive", title: "Блок живлення", hint: "Виберіть блок живлення з достатньою потужністю для збірки.", dialog: "Оберіть блок живлення" },
    { key: "case", icon: "drive", title: "Корпус", hint: "Виберіть корпус під розмір материнської плати та блок живлення.", dialog: "Оберіть корпус" },
    { key: "cooler", icon: "drive", title: "Система охолодження", hint: "Виберіть радіатор або кулер для процесора.", dialog: "Оберіть систему охолодження" }
  ];

  const CATALOG = {
    cpu: [
      { id: "r5-7600", name: "AMD Ryzen 5 7600", desc: "6 ядер, 12 потоків, 3.8–5.1 ГГц", price: 14990, socket: "AM5", power: 65 },
      { id: "i5-12400", name: "Intel Core i5-12400", desc: "6 ядер, 12 потоків, 2.5–4.4 ГГц, сокет LGA1700", price: 14990, socket: "LGA1700", power: 65 },
      { id: "r7-7700x", name: "AMD Ryzen 7 7700X", desc: "8 ядер, 16 потоків, 4.5–5.4 ГГц", price: 18900, socket: "AM5", power: 105 },
      { id: "i5-13600k", name: "Intel Core i5-13600K", desc: "14 ядер, 20 потоків, 3.5–5.1 ГГц, сокет LGA1700", price: 14500, socket: "LGA1700", power: 125 }
    ],
    motherboard: [
      { id: "b650", name: "ASUS B650", desc: "Материнська плата, Socket AM5, DDR5, USB 3.2 Gen 2", price: 12490, socket: "AM5", power: 80 },
      { id: "z790", name: "ASUS Z790", desc: "Материнська плата, Socket LGA1700, DDR5, USB 3.2 Gen 2", price: 15990, socket: "LGA1700", power: 80 }
    ],
    ram: [
      { id: "ddr5-16", name: "DDR5 16GB", desc: "Оперативна пам’ять, 5200 МГц, C40, 1×16 ГБ", price: 4990, power: 35 },
      { id: "ddr5-32", name: "DDR5 32GB", desc: "Оперативна пам’ять, 5600 МГц, C36, 2×16 ГБ", price: 8990, power: 45 }
    ],
    ssd: [
      { id: "990pro", name: "Samsung 990 PRO 1TB", desc: "NVMe M.2, PCIe 4.0 ×4, 1 ТБ, до 7450 МБ/с", price: 4490, power: 5 },
      { id: "sn850x", name: "WD Black SN850X 1TB", desc: "NVMe M.2, PCIe 4.0 ×4, 1 ТБ, до 7300 МБ/с", price: 3990, power: 5 },
      { id: "barracuda", name: "Seagate BarraCuda 2TB", desc: "HDD 3.5″, SATA III, 2 ТБ, 7200 RPM", price: 2450, power: 8 }
    ],
    psu: [
      { id: "psu-550", name: "Seasonic Focus 550W", desc: "Блок живлення, 550 Вт, 80+ Gold", price: 3290, power: 0, watts: 550 },
      { id: "psu-650", name: "Corsair RM650", desc: "Блок живлення, 650 Вт, 80+ Gold", price: 4290, power: 0, watts: 650 },
      { id: "psu-750", name: "be quiet! Pure Power 12 M", desc: "Блок живлення, 750 Вт, 80+ Gold", price: 5190, power: 0, watts: 750 }
    ],
    case: [
      { id: "h5", name: "NZXT H5 Flow", desc: "Корпус, ATX, Mid-Tower, скляна панель", price: 3490, power: 0 },
      { id: "popair", name: "Fractal Design Pop Air", desc: "Корпус, ATX, Mid-Tower, перфорована передня панель", price: 3990, power: 0 }
    ],
    cooler: [
      { id: "ak400", name: "DeepCool AK400", desc: "Кулер для процесора, башта, до 220 Вт TDP", price: 1290, power: 10 },
      { id: "nh-d15", name: "Noctua NH-D15", desc: "Кулер для процесора, двобаштовий, до 250 Вт TDP", price: 4490, power: 10 }
    ]
  };

  const DEFAULT_POWER_LIMIT = 650; /* рекомендована потужність, поки блок живлення не обрано */

  /* Початковий стан залежить від сторінки: «сумісна» або «з конфліктом» */
  const state = root.dataset.builder === "empty" ? {} : { cpu: "r5-7600", motherboard: "b650", ram: "ddr5-16" };
  if (root.dataset.builder === "conflict") state.cpu = "i5-12400";

  function getItem(key) {
    const id = state[key];
    return id ? CATALOG[key].find((item) => item.id === id) : null;
  }

  /* ---------- Сумісність ---------- */
  function findConflicts() {
    const cpu = getItem("cpu");
    const board = getItem("motherboard");
    if (cpu && board && cpu.socket !== board.socket) {
      return [
        {
          slots: ["cpu", "motherboard"],
          text: "Сокет процесора (" + cpu.socket + ") не відповідає сокету материнської плати (" + board.socket + ")"
        }
      ];
    }
    return [];
  }

  /* ---------- Рендер списку ---------- */
  function componentHtml(slot, conflicts) {
    const item = getItem(slot.key);
    if (!item) {
      return (
        '<li><article class="card component component--empty">' +
        '<span class="icon-tile icon-tile--muted" aria-hidden="true"><span class="icon icon--' + slot.icon + '"></span></span>' +
        '<div class="component__body"><div class="component__head"><h2 class="component__title">' + slot.title + "</h2></div>" +
        '<p class="component__desc">' + slot.hint + "</p></div>" +
        '<button class="btn btn--outline btn--sm" type="button" data-slot="' + slot.key + '">Додати</button>' +
        "</article></li>"
      );
    }
    const conflicted = conflicts.some((c) => c.slots.indexOf(slot.key) !== -1);
    /* У стані конфлікту до назви додається сокет — як у прототипі */
    const name = conflicts.length && item.socket ? item.name + " (" + item.socket + ")" : item.name;
    return (
      '<li><article class="card component' + (conflicted ? " component--conflict" : "") + '">' +
      '<span class="icon-tile" aria-hidden="true"><span class="icon icon--' + slot.icon + '"></span></span>' +
      '<div class="component__body"><div class="component__head"><h2 class="component__title">' + name + "</h2>" +
      '<span class="badge badge--' + (conflicted ? "danger" : "success") + '">' + (conflicted ? "Несумісно" : "Сумісно") + "</span></div>" +
      '<p class="component__desc">' + item.desc + "</p>" +
      '<p class="component__price">' + PC.formatPrice(item.price) + "</p></div>" +
      '<button class="btn btn--outline btn--sm" type="button" data-slot="' + slot.key + '">Змінити</button>' +
      "</article></li>"
    );
  }

  /* ---------- Рендер підсумку ---------- */
  /* Збереження збірки на сервері через REST API */
  let buildName = "";
  let saving = false;

  function saveHtml(count, bad) {
    const off = count === 0 || bad || saving;
    return (
      '<form class="save-build" id="save-build" novalidate>' +
      '<label class="save-build__label" for="build-name">Назва збірки</label>' +
      '<input class="input" id="build-name" name="name" maxlength="60" autocomplete="off" placeholder="Наприклад, Домашній ПК" value="' + buildName.replace(/"/g, "&quot;") + '">' +
      '<p class="field__error" id="build-name-error" role="alert" hidden></p>' +
      '<button class="btn btn--primary btn--md" type="submit"' + (off ? " disabled" : "") + ">" + (saving ? "Збереження…" : "Зберегти на сервері") + "</button>" +
      (bad ? '<p class="save-build__hint">Усуньте несумісність, щоб зберегти збірку.</p>' : "") +
      "</form>"
    );
  }

  function summaryHtml(conflicts) {
    const chosen = SLOTS.filter((slot) => state[slot.key]);
    const count = chosen.length;
    const total = chosen.reduce((sum, slot) => sum + getItem(slot.key).price, 0);
    const used = chosen.reduce((sum, slot) => sum + (getItem(slot.key).power || 0), 0);
    const psu = getItem("psu");
    const limit = psu ? psu.watts : DEFAULT_POWER_LIMIT;
    const bad = conflicts.length > 0;
    const cpu = getItem("cpu");
    const board = getItem("motherboard");

    let itemHtml = "";
    if (cpu) {
      const badge = board
        ? '<span class="badge badge--' + (bad ? "danger" : "success") + '">' + (bad ? "Несумісно" : "Сумісно") + "</span>"
        : "";
      itemHtml =
        '<div class="summary-item"><span class="icon-tile" aria-hidden="true"><span class="icon icon--cpu"></span></span>' +
        '<div class="summary-item__body"><p class="summary-item__title">' + cpu.name + "</p>" +
        '<p class="summary-item__sub">' + (board ? "Материнська плата: " + board.name : "Материнську плату не вибрано") + "</p></div>" +
        badge + "</div>";
    }

    let conflictHtml = "";
    if (bad) {
      conflictHtml =
        '<div class="conflict" role="alert"><h3 class="conflict__title">Несумісність</h3><ul class="conflict__list">' +
        conflicts.map((c) => "<li>" + c.text + "</li>").join("") +
        '</ul><a class="btn btn--primary btn--sm" href="assistant.html">Запитати AI про причину</a></div>';
    }

    return (
      '<section class="card summary" aria-labelledby="summary-title"><div class="summary__head"><div>' +
      '<h2 class="summary__title" id="summary-title">Резюме збірки</h2>' +
      '<p class="summary__sub">' + count + " " + PC.plural(count, ["компонент вибрано", "компоненти вибрано", "компонентів вибрано"]) + "</p></div>" +
      '<span class="badge badge--' + (bad ? "danger" : "success") + '">' + (bad ? "Несумісно" : "Конфліктів немає") + "</span></div>" +
      '<div class="stat"><p class="stat__label">Загальна ціна</p><p class="stat__value">' + PC.formatPrice(total) + "</p></div>" +
      '<div class="stat"><p class="stat__label">Потужність</p><p class="stat__value">' + used + " / " + limit + " Вт</p></div>" +
      itemHtml + conflictHtml + saveHtml(count, bad) + "</section>"
    );
  }

  function render() {
    const conflicts = findConflicts();
    listEl.innerHTML = SLOTS.map((slot) => componentHtml(slot, conflicts)).join("");
    summaryEl.innerHTML = summaryHtml(conflicts);

    const count = SLOTS.filter((slot) => state[slot.key]).length;
    subtitleEl.textContent =
      count + " " + PC.plural(count, ["компонент", "компоненти", "компонентів"]) + " вибрано. " +
      (conflicts.length
        ? "Виявлено несумісність між процесором та материнською платою."
        : "Сумісність перевірена автоматично.");
  }

  summaryEl.addEventListener("input", (event) => {
    if (event.target.id === "build-name") {
      buildName = event.target.value;
      event.target.removeAttribute("aria-invalid");
      PC.qs("#build-name-error", summaryEl).hidden = true;
    }
  });

  summaryEl.addEventListener("submit", async (event) => {
    event.preventDefault();
    const nameInput = PC.qs("#build-name", summaryEl);
    const errorEl = PC.qs("#build-name-error", summaryEl);
    const name = nameInput.value.trim();
    if (!name) {
      errorEl.textContent = "Введіть назву збірки";
      errorEl.hidden = false;
      nameInput.setAttribute("aria-invalid", "true");
      nameInput.setAttribute("aria-describedby", "build-name-error");
      nameInput.focus();
      return;
    }
    const parts = {};
    SLOTS.forEach((slot) => { if (state[slot.key]) parts[slot.key] = state[slot.key]; });
    saving = true;
    render();
    try {
      await PC.api.createBuild({ name: name, parts: parts });
      buildName = "";
      PC.toast("Збірку «" + name + "» збережено на сервері");
    } catch (error) {
      PC.toast(error.fields && error.fields.name ? error.fields.name : error.message);
    } finally {
      saving = false;
      render();
    }
  });

  /* ---------- Діалог вибору ---------- */
  let currentSlot = null;

  /* Підказка про несумісність у списку варіантів */
  function incompatibleNote(slotKey, item) {
    const other = slotKey === "cpu" ? getItem("motherboard") : slotKey === "motherboard" ? getItem("cpu") : null;
    if (other && item.socket && other.socket && item.socket !== other.socket) {
      return "Несумісно з обраним: " + other.name + " (" + other.socket + ")";
    }
    return "";
  }

  function openPicker(key) {
    currentSlot = SLOTS.find((slot) => slot.key === key);
    pickerTitle.textContent = currentSlot.dialog;
    pickerOptions.innerHTML =
      '<legend class="visually-hidden">' + currentSlot.dialog + "</legend>" +
      CATALOG[key]
        .map((item) => {
          const note = incompatibleNote(key, item);
          return (
            '<label class="picker__option"><input type="radio" name="item" value="' + item.id + '" required' +
            (state[key] === item.id ? " checked" : "") + ">" +
            '<span class="picker__name">' + item.name + "</span>" +
            '<span class="picker__price">' + PC.formatPrice(item.price) + "</span>" +
            '<span class="picker__desc">' + item.desc + "</span>" +
            (note ? '<span class="picker__note">' + note + "</span>" : "") +
            "</label>"
          );
        })
        .join("");
    pickerRemove.hidden = !state[key];
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    const checked = pickerOptions.querySelector("input:checked") || pickerOptions.querySelector("input");
    if (checked) checked.focus();
  }

  listEl.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-slot]");
    if (button) openPicker(button.dataset.slot);
  });

  /* Вибір застосовується одразу в обробнику submit (синхронно з кліком),
     а подія close лише повертає фокус на кнопку, що відкривала діалог */
  pickerForm.addEventListener("submit", (event) => {
    if (!currentSlot) return;
    const action = event.submitter ? event.submitter.value : "";
    if (action !== "ok") return;
    const checked = pickerForm.querySelector('input[name="item"]:checked');
    if (checked) {
      state[currentSlot.key] = checked.value;
      render();
      PC.toast("Обрано: " + getItem(currentSlot.key).name);
    }
  });

  pickerRemove.addEventListener("click", () => {
    if (!currentSlot) return;
    const removed = getItem(currentSlot.key);
    delete state[currentSlot.key];
    render();
    PC.toast("Прибрано: " + removed.name);
    dialog.close("removed");
  });

  /* Клік по затемненню закриває діалог */
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close("cancel");
  });

  dialog.addEventListener("close", () => {
    if (!currentSlot) return;
    const key = currentSlot.key;
    currentSlot = null;
    const trigger = listEl.querySelector('button[data-slot="' + key + '"]');
    if (trigger) trigger.focus();
  });

  render();
})();
