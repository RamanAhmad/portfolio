// js/i18n.js
(function () {

  // ─── DARK MODE ────────────────────────────────────────────────────────────
  function initDarkMode() {
    const toggle = document.getElementById('theme-toggle');
    const sun    = document.getElementById('sun');
    const moon   = document.getElementById('moon');

    if (!toggle || !sun || !moon) return;

    function syncIcons() {
      const isDark = document.documentElement.classList.contains('dark');
      sun.classList.toggle('hidden', !isDark);
      moon.classList.toggle('hidden',  isDark);
    }

    // Sofort beim Laden syncen
    syncIcons();

    // Toggle-Event
    toggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
      syncIcons();
    });

    // Wichtig: Bei jedem Seitenaufruf erneut syncen (localStorage → DOM)
    syncIcons();
  }

  // ─── SPRACHE ──────────────────────────────────────────────────────────────
  function applyTranslations(lang) {
    if (!lang) lang = 'de';

    // Sprache und Richtung setzen
    document.documentElement.lang = lang;
    document.documentElement.dir  = (lang === 'ckb') ? 'rtl' : 'ltr';

    // Zusätzliche Klasse für RTL-spezifisches Styling (optional, aber hilfreich)
    document.body.classList.toggle('rtl', lang === 'ckb');

    if (typeof translations === 'undefined' || !translations[lang]) {
      console.warn(`Keine Übersetzungen für Sprache "${lang}" gefunden. Verwende Fallback.`);
      return;
    }

    // Alle Elemente mit data-i18n aktualisieren (inkl. mobile Menü!)
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = translations[lang][key];

      if (val) {
        if (el.hasAttribute('data-i18n-html')) {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // Dark-Mode-Icons nochmal syncen (falls Sprache gewechselt wurde)
    const sun = document.getElementById('sun');
    const moon = document.getElementById('moon');
    if (sun && moon) {
      const isDark = document.documentElement.classList.contains('dark');
      sun.classList.toggle('hidden', !isDark);
      moon.classList.toggle('hidden', isDark);
    }
  }

  function initLanguage() {
    const sel = document.getElementById('language-select');
    let lang = localStorage.getItem('language') || 'de';

    // Dropdown setzen
    if (sel) {
      sel.value = lang;

      sel.addEventListener('change', e => {
        lang = e.target.value;
        localStorage.setItem('language', lang);
        applyTranslations(lang);
      });
    }

    // Erste Anwendung der Sprache
    applyTranslations(lang);
  }

  // ─── INIT ─────────────────────────────────────────────────────────────────
  // Script steht am Ende von <body> → DOM ist bereit
  initDarkMode();
  initLanguage();

})();