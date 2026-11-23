/* compare-storage.js — таблиця порівняння SSD та HDD: показує лише накопичувачі, обрані в каталозі (список pc.compare.storage). */
(function () {
  "use strict";

  const wrap = PC.qs("[data-storage-table]");
  if (!wrap) return;

  /* [назва, модель, тип, інтерфейс, об'єм, читання, запис, пам'ять/RPM, TBW/MTBF, кеш, Rozetka, Prom] */
  const DRIVES = {
    sn850x: ["WD Black SN850X", "WDS100T2X0E", "SSD · M.2 2280", "NVMe · PCIe 4.0 ×4", "1 ТБ", "7300 МБ/с", "6300 МБ/с", "3D TLC NAND", "600 TBW", "1 ГБ DRAM", 3990, 3790],
    "990pro": ["Samsung 990 PRO", "MZ-V9P1T0BW", "SSD · M.2 2280", "NVMe · PCIe 4.0 ×4", "1 ТБ", "7450 МБ/с", "6900 МБ/с", "3-bit TLC V-NAND", "600 TBW", "1 ГБ DRAM", 4490, 4290],
    "wd-blue": ["WD Blue", "WD20EZBX", "HDD · 3.5″", "SATA III", "2 ТБ", "До 215 МБ/с", "Не вказано", "7200 RPM", "MTBF: не вказано", "256 МБ", 2690, 2490],
    barracuda: ["Seagate BarraCuda", "ST2000DM008", "HDD · 3.5″", "SATA III", "2 ТБ", "До 220 МБ/с", "Не вказано", "7200 RPM", "MTBF: не вказано", "256 МБ", 2590, 2450],
    nv2: ["Kingston NV2", "SNV2S/500G", "SSD · M.2 2280", "NVMe · PCIe 4.0 ×4", "500 ГБ", "3500 МБ/с", "2100 МБ/с", "3D NAND", "160 TBW", "Без DRAM", 1450, 1350],
    "870evo": ["Samsung 870 EVO", "MZ-77E1T0BW", "SSD · 2.5″", "SATA III", "1 ТБ", "560 МБ/с", "530 МБ/с", "3-bit MLC V-NAND", "600 TBW", "1 ГБ DRAM", 3790, 3600],
    p300: ["Toshiba P300", "HDWD110UZSVA", "HDD · 3.5″", "SATA III", "1 ТБ", "До 190 МБ/с", "Не вказано", "7200 RPM", "MTBF: не вказано", "64 МБ", 1950, 1800],
    kc3000: ["Kingston KC3000", "SKC3000D/2048G", "SSD · M.2 2280", "NVMe · PCIe 4.0 ×4", "2 ТБ", "7000 МБ/с", "7000 МБ/с", "3D TLC NAND", "1600 TBW", "2 ГБ DRAM", 6400, 6100]
  };

  const ROWS = [
    ["Тип і форм-фактор", 2], ["Інтерфейс (SATA III / NVMe)", 3], ["Об'єм", 4], ["Швидкість читання", 5],
    ["Швидкість запису", 6], ["Тип пам'яті або RPM", 7], ["TBW або MTBF", 8], ["Кеш", 9]
  ];

  const esc = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const price = (n) => PC.formatNumber(n) + " ₴";

  function render() {
    /* Спершу вибір із посилання (?ids=...), інакше — збережений список */
    const fromUrl = new URLSearchParams(window.location.search).get("ids");
    const ids = fromUrl ? fromUrl.split(",").slice(0, PC.compare.max) : PC.compare.get();
    const drives = ids.filter((id) => DRIVES[id]).map((id) => DRIVES[id].concat(id));

    if (drives.length < 2) {
      wrap.innerHTML =
        '<div class="empty-state"><p>Для порівняння оберіть щонайменше 2 накопичувачі.</p>' +
        '<a class="btn btn--primary btn--sm" href="components-storage.html">Перейти до каталогу</a></div>';
      return;
    }

    const head = drives.map((d) => '<th scope="col"><a href="#" data-part="' + d[12] + '">' + esc(d[0]) + "</a><br>" + esc(d[1]) + "</th>").join("");
    const rows = ROWS.map((r) => '<tr><th scope="row">' + r[0] + "</th>" + drives.map((d) => "<td>" + esc(d[r[1]]) + "</td>").join("") + "</tr>").join("");
    const shops = [["Rozetka", 10], ["Prom", 11]]
      .map((s) => '<tr><th scope="row">' + s[0] + "</th>" + drives.map((d) => "<td>" + price(d[s[1]]) + "</td>").join("") + "</tr>")
      .join("");

    wrap.innerHTML =
      '<table class="compare compare--storage"><caption class="visually-hidden">Порівняння характеристик та цін накопичувачів</caption>' +
      '<thead><tr><th scope="col">Характеристики</th>' + head + "</tr></thead><tbody>" + rows + "</tbody>" +
      '<tbody class="compare__prices">' + shops + "</tbody></table>" +
      '<p class="compare-edit"><a class="btn btn--outline btn--sm" href="components-storage.html">Змінити вибір</a></p>';
  }

  render();
})();
