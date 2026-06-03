/* ============================================================
   Stepan Turchenko - personal site renderer.
   - Renders the whole page from SITE_CONTENT (RU / EN / ZH).
   - 3-way language switch, persisted to localStorage.
   - Effects: Splitting.js, rough-notation, powerGlitch, grained,
     IntersectionObserver scroll-reveal. All dosed, all wrapped
     in prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";

  var STORE_KEY = "st-lang";
  var SUPPORTED = ["ru", "en", "zh"];
  var C = window.SITE_CONTENT;
  var S = window.SITE_STATIC;
  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- small helpers ---------- */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (attrs[k] == null) return;
        if (k === "class") node.className = attrs[k];
        else if (k === "text") node.textContent = attrs[k];
        else if (k.indexOf("data-") === 0 || k === "aria-label" || k === "aria-hidden" || k === "role" || k === "rel" || k === "target")
          node.setAttribute(k, attrs[k]);
        else node[k] = attrs[k];
      });
    }
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }
  function $(id) { return document.getElementById(id); }

  /* Decorative full-color editorial side image (variety vs. duotone). */
  function sideFigure(figClass, imgClass, src) {
    return el("figure", { class: figClass + " reveal", "aria-hidden": "true" }, [
      el("img", { class: imgClass, src: src, alt: "", loading: "lazy", decoding: "async" }),
    ]);
  }

  /* A project title rendered as a tasteful external link when a real URL
     exists, otherwise as plain heading text. */
  function projectTitle(tag, cls, title, viewLabel) {
    var url = S.projectUrls[title];
    if (!url) return el(tag, { class: cls }, [title]);
    return el(tag, { class: cls }, [
      el("a", {
        class: "project-link",
        href: url,
        target: "_blank",
        rel: "noopener",
        "aria-label": viewLabel + ": " + title,
      }, [title]),
    ]);
  }

  /* ---------- language resolution ---------- */
  function detectLang() {
    var saved = null;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) { console.warn("localStorage unavailable:", e); }
    if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    var nav = (navigator.language || navigator.userLanguage || "en").toLowerCase();
    if (nav.indexOf("ru") === 0) return "ru";
    if (nav.indexOf("zh") === 0) return "zh";
    return "en";
  }

  var current = detectLang();

  /* Intro language flourish: first paint in zh, then auto-swap to ru.
     Cancelled if the user picks a language manually within the window. */
  var introTimer = null;
  function cancelIntro() {
    if (introTimer !== null) {
      clearTimeout(introTimer);
      introTimer = null;
    }
  }

  /* ============================================================
     SECTION RENDERERS
     ============================================================ */

  function renderNav(t) {
    var host = $("nav-root");
    clear(host);

    var inner = el("div", { class: "nav__inner" });

    var wordmark = el("a", { class: "nav__wordmark", href: "#top", "data-glitch-wordmark": "" }, [t.nav.wordmark]);

    var links = el("nav", { class: "nav__links", "aria-label": "Primary" },
      t.nav.links.map(function (l) {
        return el("a", { class: "nav__link", href: "#" + l.id }, [l.label]);
      })
    );

    var langCtl = el("div", { class: "lang", role: "group", "aria-label": "Language" },
      S.langs.map(function (lng) {
        var btn = el("button", {
          class: "lang__btn" + (lng.code === current ? " is-active" : ""),
          type: "button",
          "data-lang": lng.code,
        }, [lng.label]);
        btn.addEventListener("click", function () { setLang(lng.code); });
        return btn;
      })
    );

    var burger = el("button", {
      class: "nav__burger", type: "button",
      "aria-label": t.nav.menuOpen, "aria-expanded": "false",
    }, [el("span", { class: "nav__burger-bar" }), el("span", { class: "nav__burger-bar" }), el("span", { class: "nav__burger-bar" })]);
    burger.addEventListener("click", toggleMenu);

    inner.appendChild(wordmark);
    inner.appendChild(links);
    inner.appendChild(el("div", { class: "nav__right" }, [langCtl, burger]));
    host.appendChild(inner);

    renderMobileMenu(t);
  }

  function renderMobileMenu(t) {
    var host = $("mobile-menu");
    clear(host);
    var panel = el("div", { class: "mobile-menu__panel" });
    t.nav.links.forEach(function (l) {
      var a = el("a", { class: "mobile-menu__link", href: "#" + l.id }, [l.label]);
      a.addEventListener("click", closeMenu);
      panel.appendChild(a);
    });
    var cta = el("a", { class: "mobile-menu__cta btn btn--primary", href: "#contact" }, [t.nav.cta]);
    cta.addEventListener("click", closeMenu);
    panel.appendChild(cta);

    panel.appendChild(el("div", { class: "mobile-menu__langs" },
      S.langs.map(function (lng) {
        var b = el("button", {
          class: "lang__btn" + (lng.code === current ? " is-active" : ""),
          type: "button",
        }, [lng.label]);
        b.addEventListener("click", function () { setLang(lng.code); closeMenu(); });
        return b;
      })
    ));
    host.appendChild(panel);
  }

  function renderHero(t) {
    var host = $("hero-root");
    clear(host);
    host.appendChild(el("div", { class: "section__bg hero__bg", "aria-hidden": "true" }, [el("div", { class: "section__bg-duotone" })]));

    host.appendChild(el("div", { class: "section__inner hero__inner" }, [
      el("p", { class: "eyebrow hero__eyebrow" }, [t.hero.eyebrow]),
      el("h2", { class: "headline hero__headline", "data-splitting": "" }, [
        t.hero.headlineBefore,
        el("span", { class: "accent-word hero__accent", "data-accent": "", "data-rn": "underline" }, [t.hero.headlineAccent]),
        t.hero.headlineAfter,
      ]),
      el("p", { class: "lead-body hero__subtext" }, [t.hero.subtext]),
      el("div", { class: "hero__ctas" }, [
        ctaLink(t.hero.ctaPrimary, "#work", "btn btn--primary", true),
        ctaLink(t.hero.ctaSecondary, "#contact", "btn btn--ghost", false),
      ]),
      el("div", { class: "hero__marker mono", "aria-hidden": "true" }, ["ST"]),
    ]));
  }

  function ctaLink(label, href, cls, glitch) {
    var attrs = { class: cls, href: href };
    if (glitch) attrs["data-glitch-cta"] = "";
    return el("a", attrs, [label]);
  }

  function renderProof(t) {
    var host = $("proof-root");
    clear(host);
    var inner = el("div", { class: "section__inner proof__inner" });

    inner.appendChild(
      el("h2", { class: "headline proof__lead", "data-splitting": "" }, [
        t.proof.leadBefore,
        el("span", { class: "proof__lead-mark", "data-rn": "underline" }, [t.proof.leadAccent]),
        t.proof.leadAfter,
      ])
    );

    var band = el("div", { class: "proof__band" });
    t.proof.items.forEach(function (it, i) {
      band.appendChild(
        el("div", { class: "proof__item reveal", "data-w": String(i + 1) }, [
          el("p", { class: "mono proof__qual" }, [it.qualifier]),
          el("p", { class: "proof__lead-line" }, [it.lead]),
        ])
      );
    });
    inner.appendChild(band);
    host.appendChild(inner);
  }

  function renderApproach(t) {
    var host = $("approach-root");
    var a = t.approach;
    clear(host);
    host.appendChild(el("div", { class: "section__bg", "aria-hidden": "true" }, [el("div", { class: "section__bg-duotone" })]));

    var inner = el("div", { class: "section__inner approach__inner" }, [
      el("span", { class: "section-index", "data-fill": "", "aria-hidden": "true" }, ["03"]),
      el("p", { class: "eyebrow" }, [a.index]),
      el("h2", { class: "headline approach__headline", "data-splitting": "" }, [
        a.headlineBefore,
        el("span", { class: "approach__hl-mark", "data-rn": "underline" }, [a.headlineAccent]),
        a.headlineAfter,
      ]),
      el("div", { class: "approach__intro" }, [
        el("p", { class: "lead-body approach__lead reveal" }, [a.lead]),
        sideFigure("approach__figure", "approach__img", "./assets/stock/geometric-shapes-terracotta-01.jpg"),
      ]),
    ]);

    /* The 5-level maturity ladder - the central model. */
    var ladder = el("div", { class: "ladder reveal" }, [
      el("div", { class: "ladder__head" }, [
        el("h3", { class: "ai-block__title" }, [a.ladder.title]),
        el("p", { class: "ai-block__caption" }, [a.ladder.caption]),
      ]),
    ]);
    var rungs = el("ol", { class: "ladder__rungs" });
    a.ladder.levels.forEach(function (lvl, i) {
      rungs.appendChild(
        el("li", { class: "ladder__rung", "data-level": String(i + 1) }, [
          el("span", { class: "ladder__num mono", "aria-hidden": "true" }, [String(i + 1)]),
          el("span", { class: "ladder__bars", "aria-hidden": "true" },
            [0, 1, 2, 3, 4].map(function (b) {
              return el("span", { class: "ladder__bar" + (b <= i ? " is-on" : "") });
            })
          ),
          el("span", { class: "ladder__label" }, [lvl.label]),
        ])
      );
    });
    ladder.appendChild(rungs);
    inner.appendChild(ladder);

    /* 4 concrete examples: manual before -> with an agent. */
    var ex = el("div", { class: "ai-block ai-examples" }, [
      el("div", { class: "ai-block__head reveal" }, [
        el("h3", { class: "ai-block__title" }, [a.examples.title]),
        el("p", { class: "ai-block__caption" }, [a.examples.caption]),
      ]),
    ]);
    var exGrid = el("div", { class: "ai-examples__grid" });
    a.examples.items.forEach(function (it) {
      exGrid.appendChild(
        el("article", { class: "ai-ex reveal" }, [
          el("p", { class: "mono ai-ex__area" }, [it.area]),
          el("p", { class: "ai-ex__before" }, [it.before]),
          el("p", { class: "ai-ex__after" }, [it.after]),
        ])
      );
    });
    ex.appendChild(exGrid);
    inner.appendChild(ex);

    /* 3 pillars: gbrain, automation + memory, unified layer. */
    var pillars = el("div", { class: "ai-block ai-pillars" }, [
      el("div", { class: "ai-block__head reveal" }, [
        el("h3", { class: "ai-block__title" }, [a.pillars.title]),
      ]),
    ]);
    var pGrid = el("div", { class: "ai-pillars__grid" });
    a.pillars.items.forEach(function (it) {
      pGrid.appendChild(
        el("article", { class: "ai-pillar reveal" }, [
          el("h4", { class: "ai-pillar__title" }, [it.title]),
          el("p", { class: "ai-pillar__body" }, [it.body]),
        ])
      );
    });
    pillars.appendChild(pGrid);
    inner.appendChild(pillars);

    host.appendChild(inner);
  }

  /* Minimalist 4-point spark/star marking a major project. */
  function majorStar() {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "work-cell__star");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    var path = document.createElementNS(ns, "path");
    path.setAttribute("d", "M12 1c.4 4.6 2.4 6.6 7 7-4.6.4-6.6 2.4-7 7-.4-4.6-2.4-6.6-7-7 4.6-.4 6.6-2.4 7-7z");
    path.setAttribute("fill", "currentColor");
    svg.appendChild(path);
    return svg;
  }

  function renderCases(t) {
    var host = $("cases-root");
    clear(host);
    var c = t.cases;

    var inner = el("div", { class: "section__inner cases__inner" }, [
      el("span", { class: "section-index", "data-fill": "", "aria-hidden": "true" }, ["04"]),
      el("div", { class: "cases__intro" }, [
        el("div", { class: "cases__intro-copy" }, [
          el("p", { class: "eyebrow" }, [c.sectionTitle]),
          el("h2", { class: "headline", "data-splitting": "" }, [c.headline]),
          el("p", { class: "lead-body cases__lead" }, [c.lead]),
        ]),
        sideFigure("cases__figure", "cases__img", "./assets/stock/still-life-vase-orange-01.jpg"),
      ]),
      el("div", { class: "cases__legend" }, [
        majorStar(),
        el("span", { class: "mono" }, [c.legend]),
      ]),
    ]);

    var grid = el("div", { class: "cases__grid" });
    c.items.forEach(function (p, i) {
      var num = i + 1 < 10 ? "0" + (i + 1) : String(i + 1);
      var head = el("div", { class: "work-cell__top" }, [
        el("span", { class: "mono work-cell__num" }, [num]),
        projectTitle("h3", "work-cell__title", p.title, c.visit),
      ]);
      if (p.major) head.appendChild(majorStar());
      grid.appendChild(el("article", { class: "work-cell reveal" + (p.major ? " work-cell--major" : "") }, [
        head,
        el("p", { class: "mono work-cell__role" }, [p.role]),
        el("p", { class: "lead-body work-cell__oneline" }, [p.oneline]),
        el("div", { class: "work-cell__tags" }, p.tags.map(function (tag) {
          return el("span", { class: "tag mono" }, [tag]);
        })),
      ]));
    });
    inner.appendChild(grid);

    inner.appendChild(el("div", { class: "credential reveal" }, [
      el("span", { class: "credential__badge mono" }, [c.credential.badge]),
      el("p", { class: "credential__text" }, [c.credential.text]),
    ]));
    host.appendChild(inner);
  }

  function renderStack(t) {
    var host = $("stack-root");
    clear(host);
    var inner = el("div", { class: "section__inner stack__inner" }, [
      el("span", { class: "section-index", "data-fill": "", "aria-hidden": "true" }, ["05"]),
      el("p", { class: "mono stack__note" }, [t.stack.note]),
      el("p", { class: "eyebrow" }, [t.stack.index]),
      el("h2", { class: "headline", "data-splitting": "" }, [t.stack.headline]),
    ]);

    var grid = el("div", { class: "stack__grid" });
    t.stack.clusters.forEach(function (cl) {
      var titleAttrs = { class: "stack__cluster-title" };
      if (cl.emphasis) titleAttrs["data-rn"] = "box";
      grid.appendChild(el("div", { class: "stack__cluster reveal" + (cl.emphasis ? " stack__cluster--emph" : "") }, [
        el("h3", titleAttrs, [cl.title]),
        el("div", { class: "stack__chips" }, cl.chips.map(function (chip) {
          return el("span", { class: "chip mono" }, [chip]);
        })),
      ]));
    });
    inner.appendChild(grid);

    inner.appendChild(el("div", { class: "stack__mgmt reveal" }, [
      el("h3", { class: "stack__cluster-title stack__mgmt-title" }, [t.stack.management.title]),
      el("p", { class: "lead-body stack__mgmt-body" }, [t.stack.management.body]),
    ]));

    inner.appendChild(el("p", { class: "mono stack__cert" }, [t.stack.cert]));
    host.appendChild(inner);
  }

  function renderAbout(t) {
    var host = $("about-root");
    clear(host);
    host.appendChild(el("div", { class: "section__bg", "aria-hidden": "true" }, [el("div", { class: "section__bg-duotone" })]));

    host.appendChild(el("div", { class: "section__inner about__inner" }, [
      el("span", { class: "section-index", "data-fill": "", "aria-hidden": "true" }, ["06"]),
      el("h2", { class: "headline about__headline", "data-splitting": "" }, [t.about.headline]),
      el("div", { class: "about__grid" }, [
        sideFigure("about__figure", "about__img", "./assets/stock/warm-sand-dune-01.jpg"),
        el("div", { class: "about__col reveal" }, [
          el("p", { class: "lead-body about__body" }, [t.about.body]),
          el("p", { class: "mono about__facts" }, [t.about.facts]),
        ]),
      ]),
    ]));
  }

  function renderPhotos(t) {
    var host = $("photos-root");
    if (!host) return;
    clear(host);
    var inner = el("div", { class: "section__inner photos__inner" }, [
      el("span", { class: "section-index", "data-fill": "", "aria-hidden": "true" }, ["07"]),
      el("p", { class: "eyebrow" }, [t.photos.kicker]),
    ]);

    var triptych = el("div", { class: "photos__triptych" });
    S.photos.forEach(function (src, i) {
      triptych.appendChild(
        el("figure", { class: "photo reveal photo--" + (i === 0 ? "lead" : "small") }, [
          el("div", { class: "photo__frame" }, [
            el("img", { src: src, alt: t.photos.caption, loading: "lazy", decoding: "async" }),
          ]),
          el("figcaption", { class: "mono photo__cap" }, [t.photos.caption + " / 0" + (i + 1)]),
        ])
      );
    });
    inner.appendChild(triptych);
    host.appendChild(inner);
  }

  function renderContact(t) {
    var host = $("contact-root");
    clear(host);
    host.appendChild(el("div", { class: "section__bg", "aria-hidden": "true" }, [el("div", { class: "section__bg-duotone" })]));

    var channels = el("ul", { class: "contact__channels" },
      S.channels.map(function (ch) {
        var label = ch.labelKey ? t.contact[ch.labelKey] : ch.label;
        var isExternal = ch.href.indexOf("http") === 0;
        return el("li", { class: "contact__channel" }, [
          el("span", { class: "mono contact__ch-label" }, [label]),
          el("a", {
            class: "contact__ch-value", href: ch.href,
            target: isExternal ? "_blank" : null,
            rel: isExternal ? "noopener" : null,
          }, [ch.value]),
        ]);
      })
    );

    host.appendChild(el("div", { class: "section__inner contact__inner" }, [
      el("span", { class: "section-index", "data-fill": "", "aria-hidden": "true" }, ["08"]),
      el("h2", { class: "headline contact__headline", "data-splitting": "" }, [
        t.contact.headlineBefore,
        el("span", { class: "contact__hl-mark", "data-rn": "circle" }, [t.contact.headlineAccent]),
        t.contact.headlineAfter,
      ]),
      el("p", { class: "lead-body contact__subline" }, [t.contact.subline]),
      channels,
      el("a", { class: "btn btn--primary contact__cta", href: "mailto:stepanstepan4@gmail.com", "data-glitch-cta": "" }, [t.contact.cta]),
    ]));
  }

  function renderFooter(t) {
    var host = $("footer-root");
    clear(host);
    host.appendChild(el("div", { class: "section__inner footer__inner" }, [
      el("span", { class: "mono footer__name" }, [t.footer.name]),
      el("a", { class: "mono footer__back", href: "#top" }, [t.footer.backToTop]),
    ]));
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

  function renderAll() {
    var t = C[current];
    applyMeta(t);
    renderNav(t);
    renderHero(t);
    renderProof(t);
    renderApproach(t);
    renderCases(t);
    renderStack(t);
    renderAbout(t);
    renderPhotos(t);
    renderContact(t);
    renderFooter(t);
    initEffects();
  }

  /* Manual switch (language buttons). Respects the user's choice by
     cancelling any pending intro auto-swap, then persists + renders. */
  function setLang(code) {
    cancelIntro();
    switchLang(code, true);
  }

  /* Core switch path, reused by manual clicks and the intro auto-swap.
     `persist` controls whether the choice is saved to localStorage. */
  function switchLang(code, persist) {
    if (SUPPORTED.indexOf(code) === -1 || code === current) return;
    current = code;
    if (persist) {
      try { localStorage.setItem(STORE_KEY, code); } catch (e) { console.warn("localStorage unavailable:", e); }
    }
    renderAll();
  }

  /* Intro auto-swap zh -> ru with a short crossfade on the main content.
     Under reduced motion the swap is instant. Not persisted: the visitor
     made no manual choice, so we don't override saved/detected language. */
  function introSwitch(code) {
    introTimer = null;
    var main = $("main");
    if (REDUCED || !main) {
      switchLang(code, false);
      return;
    }
    main.classList.add("lang-swap");
    /* force style flush so the transition runs from the current opacity */
    void main.offsetWidth;
    main.classList.add("lang-swap--out");
    var done = false;
    function finish() {
      if (done) return;
      done = true;
      main.removeEventListener("transitionend", finish);
      switchLang(code, false);
      main.classList.remove("lang-swap--out");
      void main.offsetWidth;
      main.addEventListener("transitionend", function onIn() {
        main.removeEventListener("transitionend", onIn);
        main.classList.remove("lang-swap");
      });
    }
    main.addEventListener("transitionend", finish);
    /* safety fallback if transitionend never fires */
    setTimeout(finish, 500);
  }

  /* ============================================================
     MOBILE MENU
     ============================================================ */
  function toggleMenu() {
    var menu = $("mobile-menu");
    menu.getAttribute("data-open") === "true" ? closeMenu() : openMenu();
  }
  function openMenu() {
    $("mobile-menu").setAttribute("data-open", "true");
    document.body.classList.add("menu-open");
    var b = document.querySelector(".nav__burger");
    if (b) { b.setAttribute("aria-expanded", "true"); b.setAttribute("aria-label", C[current].nav.menuClose); }
  }
  function closeMenu() {
    $("mobile-menu").setAttribute("data-open", "false");
    document.body.classList.remove("menu-open");
    var b = document.querySelector(".nav__burger");
    if (b) { b.setAttribute("aria-expanded", "false"); b.setAttribute("aria-label", C[current].nav.menuOpen); }
  }

  /* ============================================================
     EFFECTS - dosed, reduced-motion aware
     ============================================================ */
  var revealObserver = null;

  function initEffects() {
    initReveal();
    initSplitting();
    initRoughNotation();
    initGlitch();
  }

  /* IntersectionObserver scroll-reveal (sections, rows, tiles). */
  function initReveal() {
    var nodes = document.querySelectorAll(".reveal:not(.is-in)");
    if (REDUCED || !("IntersectionObserver" in window)) {
      nodes.forEach(function (n) { n.classList.add("is-in"); });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            revealObserver.unobserve(e.target);
          }
        });
      }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
    }
    nodes.forEach(function (n) { revealObserver.observe(n); });
  }

  /* Splitting.js - headline char reveal, runs once on scroll-in. */
  function initSplitting() {
    var heads = document.querySelectorAll("[data-splitting]:not([data-split-done])");
    if (REDUCED || typeof window.Splitting !== "function") {
      heads.forEach(function (h) { h.setAttribute("data-split-done", ""); h.classList.add("is-revealed"); });
      return;
    }
    heads.forEach(function (h) {
      h.setAttribute("data-split-done", "");
      try { window.Splitting({ target: h, by: "chars" }); } catch (e) { console.error("Splitting failed:", e); }
    });
    if (!("IntersectionObserver" in window)) {
      heads.forEach(function (h) { h.classList.add("is-revealed"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-revealed"); io.unobserve(e.target); }
      });
    }, { threshold: 0.2 });
    heads.forEach(function (h) { io.observe(h); });
  }

  /* rough-notation - a few key words, draw on scroll-in. */
  var rnObserver = null;
  function initRoughNotation() {
    if (REDUCED || !window.RoughNotation) {
      document.querySelectorAll("[data-rn]").forEach(function (n) { n.classList.add("rn-plain"); });
      return;
    }
    var typeMap = {
      underline: { type: "underline", color: "#C8552B" },
      highlight: { type: "highlight", color: "#E0A24E" },
      circle: { type: "circle", color: "#C8552B" },
      box: { type: "box", color: "#C8552B" },
    };
    var nodes = document.querySelectorAll("[data-rn]:not([data-rn-done])");
    if (!("IntersectionObserver" in window)) return;
    if (rnObserver) rnObserver.disconnect();
    rnObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var n = e.target;
        n.setAttribute("data-rn-done", "");
        var conf = typeMap[n.getAttribute("data-rn")] || typeMap.underline;
        try {
          var ann = window.RoughNotation.annotate(n, {
            type: conf.type, color: conf.color,
            strokeWidth: conf.type === "highlight" ? 14 : 2.4,
            padding: conf.type === "circle" || conf.type === "box" ? 8 : 2,
            iterations: 2, animationDuration: 700,
            multiline: conf.type === "underline" || conf.type === "highlight",
          });
          ann.show();
        } catch (err) { console.error("RoughNotation failed:", err); }
        rnObserver.unobserve(n);
      });
    }, { threshold: 0.6 });
    nodes.forEach(function (n) { rnObserver.observe(n); });
  }

  /* powerGlitch - 1-2 hover accents only (primary CTAs + wordmark). */
  function initGlitch() {
    if (REDUCED || typeof window.PowerGlitch === "undefined") return;
    var opts = {
      playMode: "hover",
      createContainers: true,
      hideOverflow: false,
      timing: { duration: 350, iterations: 1 },
      glitchTimeSpan: { start: 0, end: 1 },
      shake: { velocity: 12, amplitudeX: 0.06, amplitudeY: 0.04 },
      slice: { count: 4, velocity: 14, minHeight: 0.02, maxHeight: 0.1, hueRotate: false },
    };
    try {
      window.PowerGlitch.glitch(".nav__wordmark", opts);
      window.PowerGlitch.glitch("[data-glitch-cta]", opts);
    } catch (e) { console.error("PowerGlitch failed:", e); }
  }

  /* grained - ONE fixed full-page grain overlay. */
  function initGrain() {
    if (REDUCED) return;
    var inner = document.getElementById("grain-inner");
    if (!inner || typeof window.grained === "undefined") return;
    try {
      window.grained("#grain-inner", {
        animate: false,
        patternWidth: 120, patternHeight: 120,
        grainOpacity: 0.07, grainDensity: 1.1,
        grainWidth: 1.1, grainHeight: 1.1,
      });
    } catch (e) { console.error("grained failed:", e); }
  }

  /* ============================================================
     NAV SCROLL STATE + theme-under-nav
     ============================================================ */
  function initNavScroll() {
    var nav = $("nav-root");
    var sections = [
      { id: "hero-root", theme: "dark" },
      { id: "proof-root", theme: "light" },
      { id: "approach", theme: "dark" },
      { id: "work", theme: "light" },
      { id: "stack", theme: "light" },
      { id: "about", theme: "dark" },
      { id: "photos", theme: "light" },
      { id: "contact", theme: "dark" },
    ];
    function onScroll() {
      var y = window.scrollY || window.pageYOffset;
      nav.setAttribute("data-scrolled", y > 24 ? "true" : "false");
      var probe = y + 36;
      var theme = "dark";
      for (var i = 0; i < sections.length; i++) {
        var s = document.getElementById(sections[i].id);
        if (!s) continue;
        if (probe >= s.offsetTop) theme = sections[i].theme;
      }
      nav.setAttribute("data-theme", theme);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     BOOT
     ============================================================ */
  function boot() {
    /* Intro flourish: force the first paint to Chinese regardless of
       saved/detected language, then auto-swap to Russian after ~1s. */
    current = "zh";
    renderAll();
    initGrain();
    initNavScroll();
    introTimer = setTimeout(function () { introSwitch("ru"); }, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
