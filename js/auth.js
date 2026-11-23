/* auth.js — Форми входу та реєстрації: валідація полів, повідомлення про помилки, показ пароля, відновлення пароля. */
(function () {
  "use strict";

  const forms = PC.qsa("form[data-auth]");
  if (!forms.length) return;

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* Правила перевірки: повертають текст помилки або порожній рядок */
  const rules = {
    email(value) {
      const v = value.trim();
      if (!v) return "Введіть email";
      if (!EMAIL_RE.test(v)) return "Введіть коректну адресу, наприклад example@email.com";
      return "";
    },
    password(value, form) {
      if (!value) return "Введіть пароль";
      if (value.length < 8) return "Пароль має містити щонайменше 8 символів";
      if (form.dataset.auth === "register" && !(/[A-Za-zА-Яа-яІіЇїЄєҐґ]/.test(value) && /\d/.test(value))) {
        return "Пароль має містити літери та цифри";
      }
      return "";
    },
    password2(value, form) {
      if (!value) return "Повторіть пароль";
      if (value !== form.elements.password.value) return "Паролі не збігаються";
      return "";
    }
  };

  function validateField(input, form) {
    const rule = rules[input.dataset.rule];
    const message = rule ? rule(input.value, form) : "";
    PC.setFieldError(input, message);
    return !message;
  }

  function showStatus(form, message, type) {
    const box = PC.qs(".form-status", form);
    box.textContent = message;
    box.className = "form-status form-status--" + type;
    box.hidden = false;
  }

  function hideStatus(form) {
    const box = PC.qs(".form-status", form);
    box.hidden = true;
    box.textContent = "";
  }

  const loginForm = PC.qs("#panel-login");
  const registerForm = PC.qs("#panel-register");
  const tabLogin = PC.qs("#tab-login");
  const tabRegister = PC.qs("#tab-register");

  forms.forEach((form) => {
    const inputs = PC.qsa("input[data-rule]", form);

    inputs.forEach((input) => {
      /* Перевірка після виходу з поля */
      input.addEventListener("blur", () => {
        if (input.value !== "") validateField(input, form);
      });
      /* Якщо помилка вже показана — прибираємо її одразу, як тільки дані стали коректними */
      input.addEventListener("input", () => {
        hideStatus(form);
        if (input.hasAttribute("aria-invalid")) validateField(input, form);
        if (input.dataset.rule === "password" && form.elements.password2 && form.elements.password2.value) {
          validateField(form.elements.password2, form);
        }
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      hideStatus(form);

      const invalid = inputs.filter((input) => !validateField(input, form));
      if (invalid.length) {
        invalid[0].focus();
        showStatus(form, "Перевірте виділені поля та виправте помилки.", "danger");
        return;
      }

      if (form.dataset.auth === "login") {
        showStatus(form, "Вхід виконано. Перенаправляємо на головну…", "success");
        window.setTimeout(() => {
          window.location.href = "index.html";
        }, 1200);
      } else {
        /* Після реєстрації перемикаємо на вкладку «Вхід» і підставляємо email */
        const email = form.elements.email.value.trim();
        form.reset();
        inputs.forEach((input) => PC.setFieldError(input, ""));
        tabLogin.checked = true;
        PC.qsa("input[data-rule]", loginForm).forEach((input) => {
          input.value = "";
          PC.setFieldError(input, "");
        });
        loginForm.elements.email.value = email;
        showStatus(loginForm, "Акаунт створено. Тепер увійдіть.", "success");
        loginForm.elements.password.focus();
      }
    });
  });

  /* Показати / сховати пароль */
  PC.qsa("[data-toggle-password]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.getAttribute("aria-controls"));
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      button.textContent = show ? "Сховати" : "Показати";
      button.setAttribute("aria-pressed", String(show));
    });
  });

  /* «Забули пароль?» — перевіряє email і показує повідомлення */
  const forgot = PC.qs("[data-forgot]");
  if (forgot) {
    forgot.addEventListener("click", (event) => {
      event.preventDefault();
      const emailInput = loginForm.elements.email;
      if (validateField(emailInput, loginForm)) {
        showStatus(
          loginForm,
          "Інструкції для відновлення пароля надіслано на " + emailInput.value.trim() + ".",
          "success"
        );
      } else {
        emailInput.focus();
      }
    });
  }

  /* Перехід за посиланням login.html#register відкриває вкладку «Реєстрація» */
  function selectTabFromHash() {
    if (window.location.hash === "#register") tabRegister.checked = true;
    if (window.location.hash === "#login") tabLogin.checked = true;
  }
  window.addEventListener("hashchange", selectTabFromHash);
  selectTabFromHash();
})();
