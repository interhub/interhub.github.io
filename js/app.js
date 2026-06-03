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

  /* Headline with one terracotta accent word (no <br> breaks). */
  function accentHeadline(before, accent, after, extraClass) {
    return el("h2", { class: "headline " + (extraClass || ""), "data-splitting": "" }, [
      before,
      el("span", { class: "accent-word", "data-accent": "" }, [accent]),
      after,
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
      accentHeadline(t.hero.headlineBefore, t.hero.headlineAccent, t.hero.headlineAfter, "hero__headline"),
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
      el("p", { class: "lead-body approach__lead reveal" }, [a.lead]),
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

  function renderCases(t) {
    var host = $("cases-root");
    clear(host);
    var inner = el("div", { class: "section__inner cases__inner" }, [
      el("span", { class: "section-index", "data-fill": "", "aria-hidden": "true" }, ["04"]),
      el("p", { class: "eyebrow" }, [t.cases.sectionTitle]),
      el("h2", { class: "headline", "data-splitting": "" }, [t.cases.headline]),
    ]);

    var grid = el("div", { class: "cases__grid" });
    t.cases.items.forEach(function (c, i) {
      var shot = S.caseShots[c.title];
      var tile = el("article", { class: "case reveal case--" + (i === 0 || i === 1 ? "feature" : "side") });
      if (shot) {
        tile.appendChild(el("div", { class: "case__shot" }, [
          el("img", { src: shot, alt: c.title, loading: "lazy", decoding: "async" }),
        ]));
      }
      tile.appendChild(el("div", { class: "case__body" }, [
        el("div", { class: "case__head" }, [
          el("h3", { class: "case__title" }, [c.title]),
          el("p", { class: "mono case__role" }, [c.role]),
        ]),
        el("p", { class: "lead-body case__oneline" }, [c.oneline]),
        el("div", { class: "case__tags" }, c.tags.map(function (tag) {
          return el("span", { class: "tag mono" }, [tag]);
        })),
      ]));
      grid.appendChild(tile);
    });
    inner.appendChild(grid);
    host.appendChild(inner);
  }

  function renderWork(t) {
    var host = $("work-root");
    clear(host);
    host.appendChild(el("div", { class: "section__bg", "aria-hidden": "true" }, [el("div", { class: "section__bg-duotone" })]));

    var inner = el("div", { class: "section__inner work__inner" }, [
      el("span", { class: "section-index", "data-fill": "", "aria-hidden": "true" }, ["05"]),
      el("p", { class: "eyebrow" }, [t.work.index]),
      el("h2", { class: "headline", "data-splitting": "" }, [t.work.headline]),
      el("p", { class: "lead-body work__lead" }, [t.work.lead]),
    ]);

    var grid = el("div", { class: "work__grid" });
    t.work.items.forEach(function (w, i) {
      var num = i + 1 < 10 ? "0" + (i + 1) : String(i + 1);
      grid.appendChild(el("article", { class: "work-cell reveal" }, [
        el("div", { class: "work-cell__top" }, [
          el("span", { class: "mono work-cell__num" }, [num]),
          el("h3", { class: "work-cell__title" }, [w.title]),
        ]),
        el("p", { class: "mono work-cell__role" }, [w.role]),
        el("p", { class: "lead-body work-cell__oneline" }, [w.oneline]),
        el("div", { class: "work-cell__tags" }, w.tags.map(function (tag) {
          return el("span", { class: "tag mono" }, [tag]);
        })),
      ]));
    });
    inner.appendChild(grid);

    inner.appendChild(el("div", { class: "credential reveal" }, [
      el("span", { class: "credential__badge mono" }, [t.work.credential.badge]),
      el("p", { class: "credential__text" }, [t.work.credential.text]),
    ]));
    host.appendChild(inner);
  }

  function renderStack(t) {
    var host = $("stack-root");
    clear(host);
    var inner = el("div", { class: "section__inner stack__inner" }, [
      el("span", { class: "section-index", "data-fill": "", "aria-hidden": "true" }, ["06"]),
      el("p", { class: "eyebrow" }, [t.stack.index]),
      el("h2", { class: "headline", "data-splitting": "" }, [t.stack.headline]),
    ]);

    var grid = el("div", { class: "stack__grid" });
    t.stack.clusters.forEach(function (cl) {
      grid.appendChild(el("div", { class: "stack__cluster reveal" + (cl.emphasis ? " stack__cluster--emph" : "") }, [
        el("h3", { class: "stack__cluster-title" }, [cl.title]),
        el("div", { class: "stack__chips" }, cl.chips.map(function (chip) {
          return el("span", { class: "chip mono" }, [chip]);
        })),
      ]));
    });
    inner.appendChild(grid);
    inner.appendChild(el("p", { class: "mono stack__cert" }, [t.stack.cert]));
    host.appendChild(inner);
  }

  function renderAbout(t) {
    var host = $("about-root");
    clear(host);
    host.appendChild(el("div", { class: "section__bg", "aria-hidden": "true" }, [el("div", { class: "section__bg-duotone" })]));

    host.appendChild(el("div", { class: "section__inner about__inner" }, [
      el("span", { class: "section-index", "data-fill": "", "aria-hidden": "true" }, ["07"]),
      el("h2", { class: "headline about__headline", "data-splitting": "" }, [t.about.headline]),
      el("div", { class: "about__col reveal" }, [
        el("p", { class: "lead-body about__body" }, [t.about.body]),
        el("p", { class: "mono about__facts" }, [t.about.facts]),
      ]),
    ]));
  }

  function renderPhotos(t) {
    var host = $("photos-root");
    if (!host) return;
    clear(host);
    var inner = el("div", { class: "section__inner photos__inner" }, [
      el("span", { class: "section-index", "data-fill": "", "aria-hidden": "true" }, ["08"]),
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
      el("span", { class: "section-index", "data-fill": "", "aria-hidden": "true" }, ["09"]),
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
    renderWork(t);
    renderStack(t);
    renderAbout(t);
    renderPhotos(t);
    renderContact(t);
    renderFooter(t);
    initEffects();
  }

  function setLang(code) {
    if (SUPPORTED.indexOf(code) === -1 || code === current) return;
    current = code;
    try { localStorage.setItem(STORE_KEY, code); } catch (e) { console.warn("localStorage unavailable:", e); }
    renderAll();
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
            padding: conf.type === "circle" ? 8 : 2,
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
      { id: "more-work", theme: "dark" },
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
    renderAll();
    initGrain();
    initNavScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
