/* part-details.js — вікно з детальними характеристиками процесора або накопичувача при натисканні на його назву (каталоги та таблиці порівняння). */
(function () {
  "use strict";

  const U = "Так";
  const cpu = (name, cores, threads, socket, base, boost, cache, tdp, gpu, mem, node, year, rozetka, prom) => ({
    name, kind: "Процесор", sub: socket + " · " + cores + " ядер / " + threads + " потоків",
    specs: [["Кількість ядер", cores], ["Кількість потоків", threads], ["Сокет", socket], ["Базова частота", base], ["Максимальна частота", boost],
      ["Кеш-пам'ять", cache], ["TDP", tdp], ["Вбудована графіка", gpu], ["Підтримувана пам'ять", mem], ["Техпроцес", node], ["Рік випуску", year]],
    prices: [rozetka, prom]
  });
  const ssd = (name, model, type, iface, cap, read, write, mem, wear, cache, warranty, rozetka, prom) => ({
    name, kind: type.indexOf("HDD") === 0 ? "Жорсткий диск" : "SSD-накопичувач", sub: model + " · " + cap,
    specs: [["Модель", model], ["Тип і форм-фактор", type], ["Інтерфейс", iface], ["Об'єм", cap], ["Швидкість читання", read], ["Швидкість запису", write],
      ["Тип пам'яті або RPM", mem], ["TBW або MTBF", wear], ["Кеш", cache], ["Гарантія", warranty]],
    prices: [rozetka, prom]
  });

  PC.PARTS = {
    "ryzen-5-7600": cpu("AMD Ryzen 5 7600", "6", "12", "AM5", "3.8 GHz", "5.1 GHz", "38 МБ (L2 + L3)", "65 Вт", U + " (Radeon, 2 CU)", "DDR5-5200", "5 нм", "2023", 8990, 8900),
    "i5-13400": cpu("Intel Core i5-13400", "10", "16", "LGA 1700", "2.5 GHz", "4.6 GHz", "20 МБ", "65 Вт", U + " (UHD 730)", "DDR4-3200 / DDR5-4800", "Intel 7", "2023", 9590, 9500),
    "ryzen-5-7600x": cpu("AMD Ryzen 5 7600X", "6", "12", "AM5", "4.7 GHz", "5.3 GHz", "38 МБ (L2 + L3)", "105 Вт", U + " (Radeon, 2 CU)", "DDR5-5200", "5 нм", "2022", 10990, 10900),
    "i5-13600k": cpu("Intel Core i5-13600K", "14", "20", "LGA 1700", "3.5 GHz", "5.1 GHz", "24 МБ", "125 Вт", U + " (UHD 770)", "DDR4-3200 / DDR5-5600", "Intel 7", "2022", 14590, 14500),
    "ryzen-7-7700x": cpu("AMD Ryzen 7 7700X", "8", "16", "AM5", "4.5 GHz", "5.4 GHz", "40 МБ (L2 + L3)", "105 Вт", U + " (Radeon, 2 CU)", "DDR5-5200", "5 нм", "2022", 18990, 18900),
    "i7-13700k": cpu("Intel Core i7-13700K", "16", "24", "LGA 1700", "3.4 GHz", "5.4 GHz", "30 МБ", "125 Вт", U + " (UHD 770)", "DDR4-3200 / DDR5-5600", "Intel 7", "2022", 23990, 23900),
    "ryzen-9-7900x": cpu("AMD Ryzen 9 7900X", "12", "24", "AM5", "4.7 GHz", "5.6 GHz", "76 МБ (L2 + L3)", "170 Вт", U + " (Radeon, 2 CU)", "DDR5-5200", "5 нм", "2022", 29990, 29900),
    "i9-13900k": cpu("Intel Core i9-13900K", "24", "32", "LGA 1700", "3.0 GHz", "5.8 GHz", "36 МБ", "125 Вт", U + " (UHD 770)", "DDR4-3200 / DDR5-5600", "Intel 7", "2022", 31590, 31500),
    "ryzen-9-7950x": cpu("AMD Ryzen 9 7950X", "16", "32", "AM5", "4.5 GHz", "5.7 GHz", "80 МБ (L2 + L3)", "170 Вт", U + " (Radeon, 2 CU)", "DDR5-5200", "5 нм", "2022", 34990, 35500),

    sn850x: ssd("WD Black SN850X", "WDS100T2X0E", "SSD · M.2 2280", "NVMe · PCIe 4.0 ×4", "1 ТБ", "7300 МБ/с", "6300 МБ/с", "3D TLC NAND", "600 TBW", "1 ГБ DRAM", "5 років", 3990, 3790),
    "990pro": ssd("Samsung 990 PRO", "MZ-V9P1T0BW", "SSD · M.2 2280", "NVMe · PCIe 4.0 ×4", "1 ТБ", "7450 МБ/с", "6900 МБ/с", "3-bit TLC V-NAND", "600 TBW", "1 ГБ DRAM", "5 років", 4490, 4290),
    "wd-blue": ssd("WD Blue", "WD20EZBX", "HDD · 3.5″", "SATA III", "2 ТБ", "До 215 МБ/с", "Не вказано", "7200 RPM", "MTBF: не вказано", "256 МБ", "2 роки", 2690, 2490),
    barracuda: ssd("Seagate BarraCuda", "ST2000DM008", "HDD · 3.5″", "SATA III", "2 ТБ", "До 220 МБ/с", "Не вказано", "7200 RPM", "MTBF: не вказано", "256 МБ", "2 роки", 2590, 2450),
    nv2: ssd("Kingston NV2", "SNV2S/500G", "SSD · M.2 2280", "NVMe · PCIe 4.0 ×4", "500 ГБ", "3500 МБ/с", "2100 МБ/с", "3D NAND", "160 TBW", "Без DRAM", "3 роки", 1450, 1350),
    "870evo": ssd("Samsung 870 EVO", "MZ-77E1T0BW", "SSD · 2.5″", "SATA III", "1 ТБ", "560 МБ/с", "530 МБ/с", "3-bit MLC V-NAND", "600 TBW", "1 ГБ DRAM", "5 років", 3790, 3600),
    p300: ssd("Toshiba P300", "HDWD110UZSVA", "HDD · 3.5″", "SATA III", "1 ТБ", "До 190 МБ/с", "Не вказано", "7200 RPM", "MTBF: не вказано", "64 МБ", "2 роки", 1950, 1800),
    kc3000: ssd("Kingston KC3000", "SKC3000D/2048G", "SSD · M.2 2280", "NVMe · PCIe 4.0 ×4", "2 ТБ", "7000 МБ/с", "7000 МБ/с", "3D TLC NAND", "1600 TBW", "2 ГБ DRAM", "5 років", 6400, 6100)
  };

  const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const inCatalog = !!PC.qs("[data-catalog]");

  const dialog = document.createElement("dialog");
  dialog.className = "picker details part-details";
  dialog.setAttribute("aria-labelledby", "part-title");
  dialog.innerHTML =
    '<div class="picker__form"><p class="details__author" id="part-kind"></p><h2 class="picker__title" id="part-title"></h2>' +
    '<dl class="spec-list" id="part-specs"></dl>' +
    '<dl class="spec-list part-details__prices" id="part-prices"></dl>' +
    '<div class="picker__actions" id="part-actions"></div></div>';
  document.body.appendChild(dialog);

  let lastTrigger = null;

  function open(id, trigger) {
    const part = PC.PARTS[id];
    if (!part) return false;
    PC.qs("#part-kind").textContent = part.kind + " · " + part.sub;
    PC.qs("#part-title").textContent = part.name;
    PC.qs("#part-specs").innerHTML = part.specs
      .map((s) => '<div class="spec-list__row"><dt>' + s[0] + "</dt><dd>" + esc(s[1]) + "</dd></div>").join("");
    PC.qs("#part-prices").innerHTML = [["Rozetka", part.prices[0]], ["Prom", part.prices[1]]]
      .map((s) => '<div class="spec-list__row"><dt>' + s[0] + "</dt><dd><strong>" + PC.formatNumber(s[1]) + " ₴</strong></dd></div>").join("");

    const on = inCatalog && PC.compare.get().indexOf(id) !== -1;
    PC.qs("#part-actions").innerHTML =
      (inCatalog
        ? '<button class="btn ' + (on ? "btn--success" : "btn--primary") + '" type="button" data-compare-toggle="' + id +
          '" data-label-on="Додано до порівняння" data-label-off="Додати до порівняння" data-class-on="btn--success" data-class-off="btn--primary" aria-pressed="' + on + '">' +
          (on ? "Додано до порівняння" : "Додати до порівняння") + "</button>"
        : "") +
      '<button class="btn btn--outline" type="button" id="part-close">Закрити</button>';
    PC.qs("#part-close").addEventListener("click", () => dialog.close());
    lastTrigger = trigger;
    dialog.showModal();
    return true;
  }

  /* Назва в картці каталогу або в заголовку таблиці порівняння */
  document.addEventListener("click", (event) => {
    const link = event.target.closest(".product-card__title a, [data-part]");
    if (!link) return;
    const holder = link.closest("li[data-id]");
    const id = link.dataset.part || (holder && holder.dataset.id);
    if (id && open(id, link)) event.preventDefault();
  });

  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => { if (lastTrigger) lastTrigger.focus(); });
})();
