/* chat.js — AI-чат: надсилання повідомлень із валідацією, імітація відповіді та лічильник запитів. */
(function () {
  "use strict";

  const form = PC.qs("#chat-form");
  if (!form) return;

  const input = PC.qs("#chat-input");
  const log = PC.qs(".chat__messages");
  const note = PC.qs(".chat__note");
  const sendButton = PC.qs(".chat__send", form);
  const quotaEl = PC.qs("#quota-left");
  const MAX_LENGTH = 500;

  let left = parseInt(quotaEl.textContent, 10) || 0;
  let waiting = false;

  function now() {
    const d = new Date();
    return PC.pad(d.getHours()) + ":" + PC.pad(d.getMinutes());
  }

  function addMessage(kind, text, author) {
    const wrap = document.createElement("div");
    wrap.className = "message message--" + kind;
    const bubble = document.createElement("p");
    bubble.className = "message__bubble";
    bubble.textContent = text;
    const meta = document.createElement("p");
    meta.className = "message__meta";
    meta.textContent = author + " • " + now();
    wrap.appendChild(bubble);
    wrap.appendChild(meta);
    log.insertBefore(wrap, note);
    log.scrollTop = log.scrollHeight;
    return wrap;
  }

  /* Прості відповіді за ключовими словами */
  function answerFor(question) {
    const q = question.toLowerCase();
    if (/сокет|несум|сумісн|am5|lga/.test(q)) {
      return "Сокет — це роз’єм для процесора на материнській платі. AM5 (AMD) і LGA 1700 (Intel) фізично різні, тому процесор і плата мають бути з однаковим сокетом. Змініть одну з деталей у конструкторі.";
    }
    if (/живлен|потужн|вт\b|ват/.test(q)) {
      return "Орієнтуйтеся на споживання збірки плюс запас 30–40%. Для збірки приблизно на 180 Вт достатньо блока живлення на 550–650 Вт.";
    }
    if (/ssd|hdd|накопичув|диск/.test(q)) {
      return "Для системи оберіть NVMe SSD (від 1 ТБ), а HDD залиште для архівів: він дешевший за гігабайт, але значно повільніший.";
    }
    return "Опишіть, які компоненти ви вже вибрали та для яких завдань збираєте ПК, і я перевірю сумісність і запропоную варіанти.";
  }

  function setQuota(value) {
    left = value;
    quotaEl.textContent = left;
    if (left <= 0) {
      input.disabled = true;
      sendButton.disabled = true;
      input.placeholder = "Ліміт запитів вичерпано";
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (waiting) return;

    const text = input.value.trim();
    if (!text) {
      PC.setFieldError(input, "Введіть повідомлення");
      input.focus();
      return;
    }
    if (text.length > MAX_LENGTH) {
      PC.setFieldError(input, "Повідомлення задовге: максимум " + MAX_LENGTH + " символів");
      input.focus();
      return;
    }
    if (left <= 0) {
      PC.setFieldError(input, "Ліміт запитів на сьогодні вичерпано");
      return;
    }

    PC.setFieldError(input, "");
    addMessage("user", text, "Ви");
    input.value = "";
    setQuota(left - 1);

    /* Індикатор «друкує» перед відповіддю */
    waiting = true;
    sendButton.disabled = true;
    const typing = addMessage("ai", "Друкує…", "AI");
    typing.classList.add("message--typing");
    window.setTimeout(() => {
      typing.classList.remove("message--typing");
      PC.qs(".message__bubble", typing).textContent = answerFor(text);
      PC.qs(".message__meta", typing).textContent = "AI • " + now();
      log.scrollTop = log.scrollHeight;
      waiting = false;
      sendButton.disabled = left <= 0;
    }, 900);
  });

  input.addEventListener("input", () => {
    if (input.hasAttribute("aria-invalid")) PC.setFieldError(input, "");
  });

  log.scrollTop = log.scrollHeight;
})();
