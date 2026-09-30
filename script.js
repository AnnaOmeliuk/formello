const translations = {
  uk: {
    code: "UK",
    htmlLang: "uk",
    title: "Formello — дизайн сайтів та логотипів",
    navAria: "Основна навігація",
    navPortfolio: "портфоліо",
    navServices: "послуги",
    navAbout: "про нас",
    navContacts: "контакти",
    langAria: "Мова: українська. Натисніть, щоб перемкнути на англійську",
    heroTitle:
      "Створюємо дизайн сайтів<br />та логотипів, які<br />приводять клієнтів",
    heroSub: "Лендінги, корпоративні сайти та брендинг під ключ",
    cta: "надіслати заявку",
    missionTitle: "Наша місія",
    goalTitle: "Мета",
    goalText:
      "Ми створюємо цифрові продукти, що роблять роботу бізнесу простішою, організованішою та ефективнішою.",
    philosophyTitle: "Філософія",
    philosophyText:
      "Ми віримо в баланс між чіткістю, естетикою та функціональністю в кожному створюваному нами дизайні.",
    fabsAria: "Швидкі дії",
    fabTop: "Вгору",
    fabChat: "Чат",
    formTitle: "Надіслати заявку",
    formLead: "Залиште контакти — ми відповімо протягом робочого дня.",
    formName: "Імʼя",
    formEmail: "Email",
    formPhone: "Телефон",
    formMessage: "Повідомлення",
    formNamePh: "Ваше імʼя",
    formEmailPh: "name@company.com",
    formPhonePh: "+380...",
    formMessagePh: "Коротко опишіть задачу",
    formSubmit: "надіслати",
    formCloseAria: "Закрити",
    formSuccessTitle: "Заявку надіслано",
    formSuccessText: "Дякуємо! Ми отримали вашу заявку і скоро звʼяжемося з вами.",
    formSuccessClose: "закрити",
    errNameRequired: "Вкажіть імʼя",
    errNameShort: "Імʼя має містити щонайменше 2 символи",
    errEmailRequired: "Вкажіть email",
    errEmailInvalid: "Введіть коректний email",
    errPhoneRequired: "Вкажіть телефон",
    errPhoneInvalid: "Введіть коректний номер телефону",
    errMessageRequired: "Додайте повідомлення",
    errMessageShort: "Повідомлення має містити щонайменше 10 символів",
  },
  en: {
    code: "EN",
    htmlLang: "en",
    title: "Formello — website and logo design",
    navAria: "Primary navigation",
    navPortfolio: "portfolio",
    navServices: "services",
    navAbout: "about us",
    navContacts: "contacts",
    langAria: "Language: English. Click to switch to Ukrainian",
    heroTitle:
      "We create website and<br />logo designs that<br />bring in clients",
    heroSub: "Landing pages, corporate websites, and turnkey branding",
    cta: "submit a request",
    missionTitle: "Our mission",
    goalTitle: "Goal",
    goalText:
      "We create digital products that make business work simpler, more organized, and more effective.",
    philosophyTitle: "Philosophy",
    philosophyText:
      "We believe in a balance of clarity, aesthetics, and functionality in every design we create.",
    fabsAria: "Quick actions",
    fabTop: "Back to top",
    fabChat: "Chat",
    formTitle: "Submit a request",
    formLead: "Leave your contacts — we’ll reply within one business day.",
    formName: "Name",
    formEmail: "Email",
    formPhone: "Phone",
    formMessage: "Message",
    formNamePh: "Your name",
    formEmailPh: "name@company.com",
    formPhonePh: "+1...",
    formMessagePh: "Briefly describe your task",
    formSubmit: "send",
    formCloseAria: "Close",
    formSuccessTitle: "Request sent",
    formSuccessText: "Thank you! We’ve received your request and will contact you soon.",
    formSuccessClose: "close",
    errNameRequired: "Please enter your name",
    errNameShort: "Name must be at least 2 characters",
    errEmailRequired: "Please enter your email",
    errEmailInvalid: "Enter a valid email address",
    errPhoneRequired: "Please enter your phone number",
    errPhoneInvalid: "Enter a valid phone number",
    errMessageRequired: "Please add a message",
    errMessageShort: "Message must be at least 10 characters",
  },
};

const FADE_MS = 220;
const MODAL_MS = 240;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s()-]{10,}$/;

const langButton = document.querySelector(".lang");
const langCode = document.querySelector(".lang__code");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const modal = document.getElementById("request-modal");
const form = document.getElementById("request-form");
const formView = modal?.querySelector('[data-view="form"]');
const successView = modal?.querySelector('[data-view="success"]');
const openTriggers = document.querySelectorAll("[data-open-request]");
const closeTriggers = document.querySelectorAll("[data-close-request]");

let isSwitching = false;
let isModalAnimating = false;
let isViewSwitching = false;
let currentLang = "uk";
let lastFocused = null;

function t() {
  return translations[currentLang];
}

function setTexts(lang) {
  const dict = translations[lang];
  if (!dict) return;

  currentLang = lang;
  document.documentElement.lang = dict.htmlLang;
  document.title = dict.title;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key && dict[key] != null) el.textContent = dict[key];
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    if (key && dict[key] != null) el.innerHTML = dict[key];
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    if (key && dict[key] != null) el.setAttribute("aria-label", dict[key]);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (key && dict[key] != null) el.setAttribute("placeholder", dict[key]);
  });

  if (langCode) langCode.textContent = dict.code;
  if (langButton) {
    langButton.dataset.lang = lang;
    langButton.setAttribute("aria-label", dict.langAria);
  }

  refreshVisibleErrors();

  try {
    localStorage.setItem("formello-lang", lang);
  } catch (_) {
    /* ignore */
  }
}

function applyLanguage(lang, { animate = false } = {}) {
  if (!translations[lang]) return;

  if (!animate || reduceMotion) {
    setTexts(lang);
    return;
  }

  if (isSwitching) return;
  isSwitching = true;
  document.body.classList.add("is-lang-fading");

  window.setTimeout(() => {
    setTexts(lang);
    document.body.classList.remove("is-lang-fading");
    isSwitching = false;
  }, FADE_MS);
}

function toggleLanguage() {
  const next = langButton?.dataset.lang === "en" ? "uk" : "en";
  applyLanguage(next, { animate: true });
}

function clearFieldErrors() {
  form?.querySelectorAll(".field").forEach((field) => {
    field.classList.remove("is-invalid");
    const error = field.querySelector(".field__error");
    if (error) {
      error.hidden = true;
      error.textContent = "";
    }
  });
}

function setFieldError(name, message) {
  const input = form?.elements.namedItem(name);
  if (!input || !("closest" in input)) return;
  const field = input.closest(".field");
  const error = field?.querySelector(`[data-error-for="${name}"]`);
  if (!field || !error) return;
  field.classList.add("is-invalid");
  error.hidden = false;
  error.textContent = message;
}

function validateForm() {
  const dict = t();
  const values = {
    name: String(form.name.value || "").trim(),
    email: String(form.email.value || "").trim(),
    phone: String(form.phone.value || "").trim(),
    message: String(form.message.value || "").trim(),
  };

  clearFieldErrors();
  const errors = {};

  if (!values.name) errors.name = dict.errNameRequired;
  else if (values.name.length < 2) errors.name = dict.errNameShort;

  if (!values.email) errors.email = dict.errEmailRequired;
  else if (!EMAIL_RE.test(values.email)) errors.email = dict.errEmailInvalid;

  if (!values.phone) errors.phone = dict.errPhoneRequired;
  else if (!PHONE_RE.test(values.phone)) errors.phone = dict.errPhoneInvalid;

  if (!values.message) errors.message = dict.errMessageRequired;
  else if (values.message.length < 10) errors.message = dict.errMessageShort;

  Object.entries(errors).forEach(([name, message]) => setFieldError(name, message));
  return { ok: Object.keys(errors).length === 0, values, errors };
}

function refreshVisibleErrors() {
  if (!form) return;
  const hasVisibleErrors = [...form.querySelectorAll(".field.is-invalid")].length > 0;
  if (hasVisibleErrors) validateForm();
}

function showFormView() {
  if (!formView || !successView) return;
  formView.classList.remove("is-fading-out", "is-fading-in");
  successView.classList.remove("is-fading-out", "is-fading-in");
  successView.hidden = true;
  formView.hidden = false;
}

function showSuccessView({ animate = true } = {}) {
  if (!formView || !successView || isViewSwitching) return;

  if (!animate || reduceMotion) {
    formView.hidden = true;
    successView.hidden = false;
    formView.classList.remove("is-fading-out", "is-fading-in");
    successView.classList.remove("is-fading-out", "is-fading-in");
    return;
  }

  isViewSwitching = true;
  formView.classList.add("is-fading-out");

  window.setTimeout(() => {
    formView.hidden = true;
    formView.classList.remove("is-fading-out");

    successView.hidden = false;
    successView.classList.add("is-fading-in");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        successView.classList.remove("is-fading-in");
      });
    });

    window.setTimeout(() => {
      isViewSwitching = false;
      successView.querySelector("[data-close-request]")?.focus();
    }, FADE_MS);
  }, FADE_MS);
}

function openModal() {
  if (!modal || isModalAnimating || modal.classList.contains("is-open")) return;

  lastFocused = document.activeElement;
  showFormView();
  clearFieldErrors();
  form?.reset();

  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-modal-open");

  if (reduceMotion) {
    modal.classList.add("is-open");
    form?.elements.namedItem("name")?.focus();
    return;
  }

  isModalAnimating = true;
  requestAnimationFrame(() => {
    modal.classList.add("is-open");
    window.setTimeout(() => {
      isModalAnimating = false;
      form?.elements.namedItem("name")?.focus();
    }, MODAL_MS);
  });
}

function closeModal() {
  if (!modal || isModalAnimating || modal.hidden) return;

  const finish = () => {
    modal.classList.remove("is-open");
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-modal-open");
    showFormView();
    clearFieldErrors();
    form?.reset();
    isModalAnimating = false;
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  };

  if (reduceMotion) {
    finish();
    return;
  }

  isModalAnimating = true;
  modal.classList.remove("is-open");
  window.setTimeout(finish, MODAL_MS);
}

function onSubmit(event) {
  event.preventDefault();
  if (isViewSwitching) return;

  const result = validateForm();
  if (!result.ok) {
    const firstInvalid = form.querySelector(".field.is-invalid input, .field.is-invalid textarea");
    firstInvalid?.focus();
    return;
  }

  showSuccessView({ animate: true });
}

if (langButton) langButton.addEventListener("click", toggleLanguage);
openTriggers.forEach((el) => el.addEventListener("click", openModal));
closeTriggers.forEach((el) => el.addEventListener("click", closeModal));
form?.addEventListener("submit", onSubmit);

form?.querySelectorAll("input, textarea").forEach((el) => {
  el.addEventListener("input", () => {
    const field = el.closest(".field");
    if (!field?.classList.contains("is-invalid")) return;
    validateForm();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal && !modal.hidden) {
    event.preventDefault();
    closeModal();
  }
});

let initial = "uk";
try {
  const saved = localStorage.getItem("formello-lang");
  if (saved === "en" || saved === "uk") initial = saved;
} catch (_) {
  /* ignore */
}

applyLanguage(initial);
