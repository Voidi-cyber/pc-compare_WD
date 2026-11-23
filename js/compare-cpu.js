/* compare-cpu.js — таблиця порівняння процесорів: показує лише процесори, обрані в каталозі (список pc.compare або ?ids=...). */
(function () {
  "use strict";

  const wrap = PC.qs("[data-cpu-table]");
  if (!wrap) return;

  /* [назва, ядра, потоки, сокет, базова частота, вбудована графіка, TDP, пам'ять, Rozetka, Prom] */
  const CPUS = {
    "ryzen-5-7600": ["AMD Ryzen 5 7600", "6", "12", "AM5", "3.8 GHz", "Так", "65 Вт", "DDR5", 8990, 8900],
    "i5-13400": ["Intel Core i5-13400", "10", "16", "LGA 1700", "2.5 GHz", "Так", "65 Вт", "DDR4 / DDR5", 9590, 9500],
    "ryzen-5-7600x": ["AMD Ryzen 5 7600X", "6", "12", "AM5", "4.7 GHz", "Так", "105 Вт", "DDR5", 10990, 10900],
    "i5-13600k": ["Intel Core i5-13600K", "14", "20", "LGA 1700", "3.5 GHz", "Так", "125 Вт", "DDR4 / DDR5", 14590, 14500],
    "ryzen-7-7700x": ["AMD Ryzen 7 7700X", "8", "16", "AM5", "4.5 GHz", "Так", "105 Вт", "DDR5", 18990, 18900],
    "i7-13700k": ["Intel Core i7-13700K", "16", "24", "LGA 1700", "3.4 GHz", "Так", "125 Вт", "DDR4 / DDR5", 23990, 23900],
    "ryzen-9-7900x": ["AMD Ryzen 9 7900X", "12", "24", "AM5", "4.7 GHz", "Так", "170 Вт", "DDR5", 29990, 29900],
    "i9-13900k": ["Intel Core i9-13900K", "24", "32", "LGA 1700", "3.0 GHz", "Так", "125 Вт", "DDR4 / DDR5", 31590, 31500],
    "ryzen-9-7950x": ["AMD Ryzen 9 7950X", "16", "32", "AM5", "4.5 GHz", "Так", "170 Вт", "DDR5", 34990, 35500]
  };

  const ROWS = [
    ["Кількість ядер", 1], ["Кількість потоків", 2], ["Сокет", 3], ["Базова частота", 4],
    ["Чи є вбудована графіка", 5], ["TDP", 6], ["Тип пам’яті", 7]
  ];

  const price = (n) => PC.formatNumber(n) + " ₴";

  function render() {
    /* Спершу вибір із посилання (?ids=...), інакше — збережений список */
    const fromUrl = new URLSearchParams(window.location.search).get("ids");
    const ids = fromUrl ? fromUrl.split(",").slice(0, PC.compare.max) : PC.compare.get();
    const cpus = ids.filter((id) => CPUS[id]).map((id) => CPUS[id]);

    if (cpus.length < 2) {
      wrap.innerHTML =
        '<div class="empty-state"><p>Для порівняння оберіть щонайменше 2 процесори.</p>' +
        '<a class="btn btn--primary btn--sm" href="components.html">Перейти до каталогу</a></div>';
      return;
    }

    const head = cpus.map((c) => '<th scope="col">' + c[0] + "</th>").join("");
    const rows = ROWS.map((r) => '<tr><th scope="row">' + r[0] + "</th>" + cpus.map((c) => "<td>" + c[r[1]] + "</td>").join("") + "</tr>").join("");
    const shops = [["Rozetka", 8], ["Prom", 9]]
      .map((s) => '<tr><th scope="row">' + s[0] + "</th>" + cpus.map((c) => "<td>" + price(c[s[1]]) + "</td>").join("") + "</tr>")
      .join("");

    wrap.innerHTML =
      '<table class="compare"><caption class="visually-hidden">Порівняння характеристик та цін процесорів</caption>' +
      '<thead><tr><th scope="col">Характеристики</th>' + head + "</tr></thead><tbody>" + rows + "</tbody>" +
      '<tbody class="compare__prices">' + shops + "</tbody></table>" +
      '<p class="compare-edit"><a class="btn btn--outline btn--sm" href="components.html">Змінити вибір</a></p>';
  }

  render();
})();
