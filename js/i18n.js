Und was muss ich hier anpassen:

// js/i18n.js
(function () {

  // ─── DARK MODE ────────────────────────────────────────────────────────────
  // Das <head>-Script setzt schon die Klasse; hier nur den Toggle-Button sync.
  function initDarkMode() {
    const toggle = document.getElementById('theme-toggle');
    const sun    = document.getElementById('sun');
    const moon   = document.getElementById('moon');
    if (!toggle || !sun || !moon) return;

    function syncIcons() {
      const dark = document.documentElement.classList.contains('dark');
      sun.classList.toggle('hidden', !dark);
      moon.classList.toggle('hidden',  dark);
    }

    syncIcons(); // sofort beim Laden korrekt anzeigen

    toggle.addEventListener('click', function () {
      document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme',
        document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      );
      syncIcons();
    });
  }

  // ─── SPRACHE ──────────────────────────────────────────────────────────────
  function applyTranslations(lang) {
    // RTL nur für Soranî – Kurmanjî (ku) ist lateinschriftlich → LTR
    document.documentElement.lang = lang;
    document.documentElement.dir  = (lang === 'ckb') ? 'rtl' : 'ltr';

    if (typeof translations === 'undefined') return;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = translations[lang] && translations[lang][key];
      if (!val) return;
      // data-i18n-html → innerHTML erlaubt (z.B. <strong> in kontakt.html)
      if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    });
  }

  function initLanguage() {
    var sel  = document.getElementById('language-select');
    // Sprache aus localStorage lesen – Fallback Deutsch
    var lang = localStorage.getItem('language') || 'de';

    // Dropdown ZUERST setzen, dann Texte tauschen
    if (sel) sel.value = lang;
    applyTranslations(lang);

    if (sel) {
      sel.addEventListener('change', function (e) {
        var chosen = e.target.value;
        localStorage.setItem('language', chosen);
        applyTranslations(chosen);
      });
    }
  }

  // ─── INIT ─────────────────────────────────────────────────────────────────
  // DOMContentLoaded ist sicher, weil dieses Script am Ende von <body> steht
  // und zu dem Zeitpunkt das DOM bereits fertig ist – aber sicherheitshalber:
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initDarkMode();
      initLanguage();
    });
  } else {
    // DOM ist schon bereit (Script nach dem DOM geladen)
    initDarkMode();
    initLanguage();
  }

})();