/* Stepan Turchenko - personal site renderer.
   - Detects language, renders all sections in order, wires the 3-way
     language switch (persisted to localStorage), and boots effects. */
(function () {
  "use strict";

  var STORE_KEY = "st-lang";
  var SUPPORTED = ["ru", "en", "zh"];
  var C = window.SITE_CONTENT;
  var SEC = window.SITE_SECTIONS;
  var FX = window.SITE_EFFECTS;

  var current;

  /* Sections switched off for now: kept in the codebase, not rendered. */
  var HIDDEN = ["infographic", "approach"];
  var SECTION_HOSTS = { infographic: "infographic-root", approach: "approach" };

  /* ---------- language resolution ---------- */
  function detectLang() {
    var saved = null;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) { console.warn("localStorage unavailable:", e); }
    if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    return "ru";
  }

  /* ============================================================
     LANGUAGE + META
     ============================================================ */
  function applyMeta(t) {
    document.documentElement.setAttribute("lang", t.meta.lang);
    document.title = t.meta.title;
    setMeta("name", "description", t.meta.description);
    setMeta("property", "og:title", t.meta.title);
    setMeta("property", "og:description", t.meta.description);
    setMeta("property", "og:locale", t.meta.ogLocale);
    setMeta("name", "twitter:title", t.meta.title);
    setMeta("name", "twitter:description", t.meta.description);
    var skip = document.querySelector(".skip-link");
    if (skip && t.meta.skipLink) skip.textContent = t.meta.skipLink;
  }
  function setMeta(attr, name, value) {
    var node = document.head.querySelector("meta[" + attr + '="' + name + '"]');
    if (!node) {
      node = document.createElement("meta");
      node.setAttribute(attr, name);
      document.head.appendChild(node);
    }
    node.setAttribute("content", value);
  }

  function isHidden(key) { return HIDDEN.indexOf(key) !== -1; }

  /* Drops nav links that point at a hidden section. */
  function withVisibleNav(t) {
    if (!HIDDEN.length) return t;
    var nav = {}, out = {}, k;
    for (k in t.nav) nav[k] = t.nav[k];
    nav.links = t.nav.links.filter(function (link) { return !isHidden(link.id); });
    for (k in t) out[k] = t[k];
    out.nav = nav;
    return out;
  }

  function applyHiddenSections() {
    HIDDEN.forEach(function (key) {
      var host = document.getElementById(SECTION_HOSTS[key] || key);
      var section = host && (host.tagName === "SECTION" ? host : host.closest("section"));
      if (section) section.hidden = true;
    });
  }

  function renderAll() {
    var t = C[current];
    applyMeta(t);
    SEC.nav(withVisibleNav(t));
    SEC.hero(t);
    SEC.proof(t);
    if (!isHidden("infographic")) SEC.infographic(t);
    if (!isHidden("approach")) SEC.approach(t);
    SEC.stack(t);
    SEC.cases(t);
    SEC.about(t);
    SEC.contact(t);
    SEC.footer(t);
    applyHiddenSections();
    FX.initEffects();
  }

  /* Manual switch (language buttons). Respects the user's choice by
     cancelling any pending intro auto-swap, then persists + renders. */
  function setLang(code) {
    SEC.hero.cancelIntro();
    switchLang(code, true);
  }

  /* Core switch path, reused by manual clicks and the intro auto-swap.
     `persist` controls whether the choice is saved to localStorage. */
  function switchLang(code, persist) {
    if (SUPPORTED.indexOf(code) === -1 || code === current) return;
    FX.removeHeroAccentAnnotation();
    current = code;
    if (persist) {
      try { localStorage.setItem(STORE_KEY, code); } catch (e) { console.warn("localStorage unavailable:", e); }
    }
    renderAll();
  }

  /* ============================================================
     BOOT
     ============================================================ */
  function boot() {
    current = detectLang();
    if (current !== "zh") {
      SEC.hero.scheduleIntro(current);
    }
    renderAll();
    FX.initGrain();
    FX.initNavScroll();
    FX.initBackToTop();
  }

  window.SITE_APP = { setLang: setLang };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
