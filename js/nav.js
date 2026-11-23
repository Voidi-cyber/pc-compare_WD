/* nav.js — Інтерактивна навігація: мобільне меню (гамбургер) відкривається кліком і закривається Esc, кліком поза меню або зміною ширини екрана. */
(function () {
  "use strict";

  const button = PC.qs(".burger");
  const nav = PC.qs(".main-nav");
  if (!button || !nav) return;

  const label = PC.qs(".visually-hidden", button);

  function isOpen() {
    return nav.classList.contains("is-open");
  }

  function setOpen(open) {
    nav.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", String(open));
    if (label) label.textContent = open ? "Закрити меню" : "Відкрити меню";
  }

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    setOpen(!isOpen());
  });

  /* Клік поза меню закриває його */
  document.addEventListener("click", (event) => {
    if (isOpen() && !nav.contains(event.target) && !button.contains(event.target)) {
      setOpen(false);
    }
  });

  /* Клік по пункту меню закриває його */
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  /* Esc закриває меню і повертає фокус на кнопку */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      setOpen(false);
      button.focus();
    }
  });

  /* При розширенні екрана меню скидається до звичайного вигляду */
  const desktop = window.matchMedia("(min-width: 769px)");
  desktop.addEventListener("change", (event) => {
    if (event.matches) setOpen(false);
  });
})();
