/* builds-data.js — демонстраційні збірки спільноти (повний список комплектуючих) для сторінок «Збірки» та «Порівняння збірок». */
(function () {
  "use strict";

  const PC = (window.PC = window.PC || {});

  PC.PART_LABELS = [
    ["cpu", "Процесор"],
    ["gpu", "Відеокарта"],
    ["motherboard", "Материнська плата"],
    ["ram", "Оперативна пам’ять"],
    ["storage", "Накопичувач"],
    ["psu", "Блок живлення"],
    ["case", "Корпус"],
    ["cooler", "Охолодження"]
  ];

  PC.BUILDS = [
    { id: "gamer-start", title: "Геймерський старт", author: "Олександр К.", price: 32450, date: "2024-05-02", popular: 0,
      parts: { cpu: "AMD Ryzen 5 7600", gpu: "NVIDIA GeForce RTX 4060", motherboard: "ASUS B650", ram: "16 GB DDR5 5200 MHz", storage: "WD Black SN850X 1TB", psu: "Corsair RM650", case: "NZXT H5 Flow", cooler: "DeepCool AK400" } },
    { id: "studio-4k", title: "4K Студія", author: "Марія Д.", price: 84900, date: "2024-04-11", popular: 1,
      parts: { cpu: "AMD Ryzen 9 7950X", gpu: "NVIDIA GeForce RTX 4080", motherboard: "ASUS ProArt X670E-Creator", ram: "64 GB DDR5 6400 MHz", storage: "Samsung 990 PRO 2TB", psu: "be quiet! Straight Power 1000W", case: "Fractal Design Meshify 2", cooler: "Noctua NH-D15" } },
    { id: "office-compact", title: "Офісний компакт", author: "Іван П.", price: 24100, date: "2024-06-20", popular: 2,
      parts: { cpu: "Intel Core i5-13400", gpu: "Intel Iris Xe (вбудована)", motherboard: "MSI PRO B660M-A", ram: "16 GB DDR4 3200 MHz", storage: "Kingston NV2 500GB", psu: "Chieftec 500W", case: "Cooler Master Q300L", cooler: "Штатний кулер Intel" } },
    { id: "budget-gaming", title: "Бюджетний ігровий", author: "Денис Л.", price: 21800, date: "2024-03-15", popular: 3,
      parts: { cpu: "AMD Ryzen 5 5600", gpu: "AMD Radeon RX 6600", motherboard: "Gigabyte B550M DS3H", ram: "16 GB DDR4 3200 MHz", storage: "Kingston NV2 500GB", psu: "Chieftec 550W", case: "Zalman S2", cooler: "AMD Wraith Stealth" } },
    { id: "streamer", title: "Для стрімінгу", author: "Анастасія Т.", price: 56700, date: "2024-06-02", popular: 4,
      parts: { cpu: "Intel Core i7-13700K", gpu: "NVIDIA GeForce RTX 4070", motherboard: "ASUS Z790", ram: "32 GB DDR5 5600 MHz", storage: "Samsung 990 PRO 1TB", psu: "Corsair RM750", case: "NZXT H5 Flow", cooler: "Noctua NH-D15" } },
    { id: "quiet-work", title: "Тихий робочий", author: "Олег М.", price: 38900, date: "2024-05-24", popular: 5,
      parts: { cpu: "AMD Ryzen 7 7700X", gpu: "AMD Radeon RX 7600", motherboard: "ASUS B650", ram: "32 GB DDR5 5600 MHz", storage: "WD Black SN850X 1TB", psu: "be quiet! Pure Power 12 M 750W", case: "Fractal Design Define 7 Compact", cooler: "Noctua NH-D15" } },
    { id: "mini-itx", title: "Мінімалістичний ITX", author: "Софія Р.", price: 47300, date: "2024-02-19", popular: 6,
      parts: { cpu: "Intel Core i5-13600K", gpu: "NVIDIA GeForce RTX 4060 Ti", motherboard: "ASUS ROG Strix B760-I (Mini-ITX)", ram: "32 GB DDR5 5600 MHz", storage: "WD Black SN850X 1TB", psu: "Corsair SF750", case: "Cooler Master NR200", cooler: "Рідинне охолодження 240 мм" } },
    { id: "home-server", title: "Домашній сервер", author: "Андрій Г.", price: 29600, date: "2024-01-30", popular: 7,
      parts: { cpu: "AMD Ryzen 5 5600G", gpu: "AMD Radeon Graphics (вбудована)", motherboard: "ASRock B450M Pro4", ram: "32 GB DDR4 3200 MHz", storage: "Seagate BarraCuda 2TB (HDD)", psu: "Seasonic Focus 550W", case: "Fractal Design Node 804", cooler: "AMD Wraith Stealth" } },
    { id: "max-2024", title: "Максимум 2024", author: "Віктор Н.", price: 129500, date: "2024-06-28", popular: 8,
      parts: { cpu: "Intel Core i9-13900K", gpu: "NVIDIA GeForce RTX 4090", motherboard: "ASUS ROG Maximus Z790 Hero", ram: "64 GB DDR5 6400 MHz", storage: "Samsung 990 PRO 2TB", psu: "be quiet! Dark Power 13 1000W", case: "Lian Li O11 Dynamic", cooler: "Рідинне охолодження 360 мм" } }
  ];
})();
