/* index.js — точка входу: запускає сервер на порту з змінної середовища PORT (за замовчуванням 3000). */
"use strict";
const { createApp } = require("./app");

const port = Number(process.env.PORT) || 3000;
createApp().listen(port, () => console.log("PC Compare: http://localhost:" + port));
