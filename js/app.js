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

  /* Decorative hand-drawn visual-kit illustration.
     - Inlines the source SVG markup so stroke="currentColor" inherits the
       container's text color (paper on dark sections, ink on light ones).
     - One .kit-illu base class + size modifier; size lives only in CSS.
     - key: name in window.KIT_ILLUS; size: "sm" | "md" | "hero" | "divider".
     - extra: optional extra class names (e.g. "reveal"). */
  function kitIllu(key, size, extra) {
    var svg = (window.KIT_ILLUS || {})[key] || "";
    var cls = "kit-illu kit-illu--" + (size || "md") + (extra ? " " + extra : "");
    var span = el("span", { class: cls, "aria-hidden": "true" });
    span.innerHTML = svg;
    return span;
  }

  /* Decorative full-color editorial side image (variety vs. duotone). */
  function sideFigure(figClass, imgClass, src) {
    return el("figure", { class: figClass + " reveal", "aria-hidden": "true" }, [
      el("img", { class: imgClass, src: src, alt: "", loading: "lazy", decoding: "async" }),
    ]);
  }

  function casesPhotoWrap(note, figClass, imgClass, src) {
    return el("div", { class: "cases__photo-wrap reveal" }, [
      el("p", { class: "cases__photo-note mono" }, [note]),
      el("svg", { class: "cases__photo-arrow", "aria-hidden": "true" }),
      el("figure", { class: figClass, "aria-hidden": "true" }, [
        el("img", { class: imgClass, src: src, alt: "", loading: "lazy", decoding: "async" }),
      ]),
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
    return "ru";
  }

  var current = detectLang();

  /* Intro flourish: hero starts in Chinese, then letter-morphs to site language.
     Rest of the page renders in the target language immediately. */
  var introTimer = null;
  var heroIntroMode = false;
  var heroIntroPending = false;
  var heroMorphTimers = [];

  function cancelIntro() {
    if (introTimer !== null) {
      clearTimeout(introTimer);
      introTimer = null;
    }
    heroMorphTimers.forEach(function (id) { clearTimeout(id); });
    heroMorphTimers = [];
    heroIntroPending = false;
    heroIntroMode = false;
  }

  /* ============================================================
     SECTION RENDERERS
     ============================================================ */

  function renderNav(t) {
    var host = $("nav-root");
    clear(host);

    var inner = el("div", { class: "nav__inner" });

    var brand = el("div", { class: "nav__brand" }, [
      el("a", { class: "nav__wordmark", href: "#top", "data-glitch-wordmark": "" }, [t.nav.wordmark]),
    ]);
    if (t.nav.tagline) {
      brand.appendChild(el("span", { class: "nav__tagline" }, [t.nav.tagline]));
    }

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

    inner.appendChild(brand);
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

  function joinHeadline(h) {
    return (h.headlineBefore || "") + (h.headlineAccent || "") + (h.headlineMid || "") +
      (h.headlineAccent2 || "") + (h.headlineAfter || "");
  }

  function readLiveHeadline(live) {
    var accents = live.querySelectorAll(".hero__accent");
    return {
      headlineBefore: (live.querySelector(".hero__hl-before") || {}).textContent || "",
      headlineAccent: accents[0] ? accents[0].textContent : "",
      headlineMid: (live.querySelector(".hero__hl-mid") || {}).textContent || "",
      headlineAccent2: accents[1] ? accents[1].textContent : "",
      headlineAfter: (live.querySelector(".hero__hl-after") || {}).textContent || "",
    };
  }

  function setLiveHeadline(live, h) {
    var before = live.querySelector(".hero__hl-before");
    var mid = live.querySelector(".hero__hl-mid");
    var after = live.querySelector(".hero__hl-after");
    var accents = live.querySelectorAll(".hero__accent");
    if (before) before.textContent = h.headlineBefore || "";
    if (accents[0]) accents[0].textContent = h.headlineAccent || "";
    if (mid) mid.textContent = h.headlineMid || "";
    if (accents[1]) accents[1].textContent = h.headlineAccent2 || "";
    if (after) after.textContent = h.headlineAfter || "";
    accents.forEach(lockHeroAccentLayout);
  }

  function buildHeroHeadlineChildren(hero) {
    return [
      el("span", { class: "hero__hl-before" }, [hero.headlineBefore || ""]),
    ].concat(heroAccentSpans(hero), [
      el("span", { class: "hero__hl-after" }, [hero.headlineAfter || ""]),
    ]);
  }

  function heroAccentSpans(hero) {
    var mark1 = hero.headlineAccentMark || "underline";
    var mark2 = hero.headlineAccent2Mark || "circle";
    var nodes = [
      el("span", {
        class: "accent-word hero__accent",
        "data-accent": "",
        "data-rn": mark1,
      }, [hero.headlineAccent]),
    ];
    nodes.push(el("span", { class: "hero__hl-mid" }, [hero.headlineMid || ""]));
    if (hero.headlineAccent2) {
      nodes.push(el("span", {
        class: "accent-word hero__accent hero__accent--second",
        "data-accent": "",
        "data-rn": mark2,
      }, [hero.headlineAccent2]));
    }
    return nodes;
  }

  function rebuildLiveHeadline(live, h) {
    while (live.firstChild) live.removeChild(live.firstChild);
    buildHeroHeadlineChildren(h).forEach(function (node) { live.appendChild(node); });
  }

  function heroContentFor(t) {
    if (!heroIntroMode) return t.hero;
    return {
      eyebrow: C.zh.hero.eyebrow,
      headlineBefore: C.zh.hero.headlineBefore,
      headlineAccent: C.zh.hero.headlineAccent,
      headlineAccentMark: C.zh.hero.headlineAccentMark,
      headlineMid: C.zh.hero.headlineMid || "",
      headlineAccent2: C.zh.hero.headlineAccent2 || "",
      headlineAccent2Mark: C.zh.hero.headlineAccent2Mark,
      headlineAfter: C.zh.hero.headlineAfter,
      subtext: t.hero.subtext,
      ctaPrimary: C.zh.hero.ctaPrimary,
      ctaSecondary: C.zh.hero.ctaSecondary,
    };
  }

  function heroHeadlineMeasure(t, hero) {
    var m = heroIntroMode ? t.hero : hero;
    return el("span", { class: "hero__headline-measure", "aria-hidden": "true" }, buildHeroHeadlineChildren(m));
  }

  function morphUnifiedHeadline(target, charMs, done) {
    var live = document.querySelector(".hero__headline-live");
    if (!live) {
      if (done) done();
      return;
    }

    var fromText = joinHeadline(readLiveHeadline(live));
    var toText = joinHeadline(target);
    var len = Math.max(fromText.length, toText.length);
    var step = 0;

    function finish() {
      if (morphEl.parentNode) morphEl.remove();
      rebuildLiveHeadline(live, target);
      if (done) done();
    }

    if (REDUCED) {
      rebuildLiveHeadline(live, target);
      if (done) done();
      return;
    }

    live.querySelectorAll(".hero__hl-before, .hero__accent, .hero__hl-mid, .hero__hl-after").forEach(function (node) {
      node.setAttribute("hidden", "");
    });

    var morphEl = el("span", { class: "hero__headline-morph" });
    live.appendChild(morphEl);

    function tick() {
      var plain = "";
      for (var i = 0; i < len; i++) {
        plain += i < step ? (toText[i] || "") : (fromText[i] || "");
      }
      morphEl.textContent = plain;
      step += 1;
      if (step <= len) {
        heroMorphTimers.push(setTimeout(tick, charMs));
      } else {
        finish();
      }
    }
    tick();
  }

  function renderHero(t) {
    var hero = heroContentFor(t);
    var host = $("hero-root");
    clear(host);
    host.appendChild(el("div", { class: "section__bg hero__bg", "aria-hidden": "true" }, [el("div", { class: "section__bg-duotone" })]));

    host.appendChild(el("div", { class: "section__inner hero__inner" }, [
      el("p", { class: "eyebrow hero__eyebrow hero__seq hero__seq--1" }, [hero.eyebrow]),
      el("h2", { class: "headline hero__headline hero__seq hero__seq--2" }, [
        heroHeadlineMeasure(t, hero),
        el("span", { class: "hero__headline-live" }, buildHeroHeadlineChildren(hero)),
      ]),
      el("p", { class: "lead-body hero__subtext hero__seq hero__seq--3" }, [hero.subtext]),
      el("div", { class: "hero__ctas hero__seq hero__seq--4" }, [
        ctaLink(hero.ctaPrimary, "#work", "btn btn--primary", true, "primary"),
        ctaLink(hero.ctaSecondary, "#contact", "btn btn--ghost", false, "secondary"),
      ]),
      el("div", { class: "hero__marker mono", "aria-hidden": "true" }, ["ST"]),
    ]));
  }

  function ctaLink(label, href, cls, glitch, heroCta) {
    var attrs = { class: cls, href: href };
    if (glitch) attrs["data-glitch-cta"] = "";
    if (heroCta) attrs["data-hero-cta"] = heroCta;
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
          el("p", { class: "mono proof__line" }, [it.lead + " · " + it.qualifier]),
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

    /* Five-level maturity scale - compact light strip. */
    var ladder = el("div", { class: "ladder-strip" }, [
      el("div", { class: "ladder-strip__inner" }, [
        el("div", { class: "ladder-strip__head" }, [
          el("h3", { class: "ladder-strip__title" }, [a.ladder.title]),
          el("p", { class: "ladder-strip__caption mono" }, [a.ladder.caption]),
        ]),
      ]),
    ]);
    var steps = el("ol", { class: "ladder-strip__steps", "aria-label": a.ladder.title });
    a.ladder.levels.forEach(function (lvl, i) {
      steps.appendChild(
        el("li", {
          class: "ladder-strip__step" + (i === a.ladder.levels.length - 1 ? " is-peak" : ""),
          "data-level": String(i + 1),
        }, [
          el("span", { class: "ladder-strip__meter", "aria-hidden": "true" }, [
            el("span", { class: "ladder-strip__fill" }),
          ]),
          el("span", { class: "ladder-strip__num mono" }, [String(i + 1)]),
          el("span", { class: "ladder-strip__label" }, [lvl.label]),
        ])
      );
    });
    ladder.querySelector(".ladder-strip__inner").appendChild(steps);

    /* Agent swap examples - compact light editorial strip. */
    var ex = el("div", { class: "ai-swap-strip" }, [
      el("div", { class: "ai-swap-strip__inner" }, [
        el("div", { class: "ai-swap-strip__head" }, [
          kitIllu("nodeFan", "md", "ai-swap-strip__illu"),
          el("h3", { class: "ai-swap-strip__title" }, [a.examples.title]),
          el("p", { class: "ai-swap-strip__caption mono" }, [a.examples.caption]),
        ]),
      ]),
    ]);
    var exGrid = el("div", { class: "ai-swap-strip__grid" });
    a.examples.items.forEach(function (it, idx) {
      var num = idx + 1 < 10 ? "0" + (idx + 1) : String(idx + 1);
      exGrid.appendChild(
        el("article", { class: "ai-swap reveal ai-swap--" + (idx + 1) }, [
          el("span", { class: "mono ai-swap__stamp", "data-glitch-aside": "" }, [it.glitchTag || "+ more"]),
          el("div", { class: "ai-swap__top" }, [
            el("span", { class: "mono ai-swap__num" }, [num]),
            el("span", { class: "mono ai-swap__area" }, [it.area]),
          ]),
          el("p", { class: "ai-swap__before" }, [it.before]),
          el("p", { class: "ai-swap__after" }, [it.after]),
          el("p", { class: "mono ai-swap__more" }, [it.more || ""]),
        ])
      );
    });
    ex.querySelector(".ai-swap-strip__inner").appendChild(exGrid);

    var lightPanel = el("div", { class: "approach-light-panel reveal" }, [
      ladder,
      el("div", { class: "approach-light-panel__seam", "aria-hidden": "true" }),
      ex,
    ]);
    /* 3 pillars: gbrain, automation + memory, unified layer. */
    var pillars = el("div", { class: "ai-block ai-pillars" }, [
      el("div", { class: "ai-block__head reveal" }, [
        kitIllu("laptop", "md", "ai-block__illu"),
        el("h3", { class: "ai-block__title" }, [a.pillars.title]),
      ]),
    ]);
    var pGrid = el("div", { class: "ai-pillars__grid" });
    a.pillars.items.forEach(function (it) {
      var parts = [];
      if (it.icon) parts.push(createPillarCornerIcon(it.icon));
      parts.push(
        el("h4", { class: "ai-pillar__title" }, [it.title]),
        el("p", { class: "ai-pillar__body" }, [it.body])
      );
      pGrid.appendChild(el("article", { class: "ai-pillar reveal" }, parts));
    });
    pillars.appendChild(pGrid);

    var moreInner = el("div", { class: "approach__more-inner" }, [lightPanel, pillars]);
    var more = el("div", { class: "approach__more" }, [moreInner]);
    moreInner.querySelectorAll(".reveal").forEach(function (node) { node.classList.add("is-in"); });
    var toggle = el("button", { class: "btn btn--ghost approach__toggle", type: "button" }, [
      a.expandMore,
      el("span", { class: "approach__toggle-icon", "aria-hidden": "true" }, ["▾"]),
    ]);
    toggle.setAttribute("aria-expanded", "false");
    toggle.addEventListener("click", function () {
      var open = !more.classList.contains("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.firstChild.nodeValue = open ? a.collapse : a.expandMore;
      if (open) {
        more.classList.add("is-open");
        more.style.height = moreInner.offsetHeight + "px";
        var onEnd = function (e) {
          if (e.propertyName !== "height") return;
          more.style.height = "auto";
          more.removeEventListener("transitionend", onEnd);
        };
        more.addEventListener("transitionend", onEnd);
      } else {
        more.style.height = moreInner.offsetHeight + "px";
        void more.offsetHeight;
        more.classList.remove("is-open");
        more.style.height = "0px";
      }
    });
    inner.appendChild(toggle);
    inner.appendChild(more);

    host.appendChild(inner);
  }

  function createPillarCornerIcon(type) {
    if (type === "graph") return createPillarGraphSvg();
    if (type === "workflow") return createPillarWorkflowSvg();
    return null;
  }

  function createPillarGraphSvg() {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "ai-pillar__corner-icon ai-pillar__corner-icon--graph");
    svg.setAttribute("viewBox", "0 0 72 72");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    var edges = [
      "M14 26 L32 14 L58 24",
      "M14 26 L18 52",
      "M58 24 L50 54",
      "M18 52 L50 54",
      "M32 14 L36 38",
      "M36 38 L18 52",
      "M36 38 L50 54",
    ];
    edges.forEach(function (d) {
      var path = document.createElementNS(ns, "path");
      path.setAttribute("d", d);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "currentColor");
      path.setAttribute("stroke-width", "1.4");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("opacity", "0.72");
      svg.appendChild(path);
    });

    [[14, 26], [32, 14], [58, 24], [18, 52], [50, 54], [36, 38]].forEach(function (pt) {
      var dot = document.createElementNS(ns, "circle");
      dot.setAttribute("cx", String(pt[0]));
      dot.setAttribute("cy", String(pt[1]));
      dot.setAttribute("r", "3.2");
      dot.setAttribute("fill", "currentColor");
      svg.appendChild(dot);
    });
    return svg;
  }

  function createPillarWorkflowSvg() {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "ai-pillar__corner-icon ai-pillar__corner-icon--workflow");
    svg.setAttribute("viewBox", "0 0 92 36");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    function node(x, y) {
      var rect = document.createElementNS(ns, "rect");
      rect.setAttribute("x", String(x));
      rect.setAttribute("y", String(y));
      rect.setAttribute("width", "18");
      rect.setAttribute("height", "16");
      rect.setAttribute("rx", "4");
      rect.setAttribute("fill", "none");
      rect.setAttribute("stroke", "currentColor");
      rect.setAttribute("stroke-width", "1.6");
      svg.appendChild(rect);

      var portIn = document.createElementNS(ns, "circle");
      portIn.setAttribute("cx", String(x - 1));
      portIn.setAttribute("cy", String(y + 8));
      portIn.setAttribute("r", "1.8");
      portIn.setAttribute("fill", "currentColor");
      svg.appendChild(portIn);

      var portOut = document.createElementNS(ns, "circle");
      portOut.setAttribute("cx", String(x + 19));
      portOut.setAttribute("cy", String(y + 8));
      portOut.setAttribute("r", "1.8");
      portOut.setAttribute("fill", "currentColor");
      svg.appendChild(portOut);
    }

    [[4, 10], [37, 10], [70, 10]].forEach(function (pos) { node(pos[0], pos[1]); });

    var links = [
      "M23 18 H31",
      "M56 18 H64",
    ];
    links.forEach(function (d) {
      var path = document.createElementNS(ns, "path");
      path.setAttribute("d", d);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "currentColor");
      path.setAttribute("stroke-width", "1.4");
      path.setAttribute("stroke-linecap", "round");
      svg.appendChild(path);
    });
    return svg;
  }

  function createMajorStarSvg() {
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

  function projectStars(count) {
    var wrap = el("div", { class: "work-cell__stars", "aria-hidden": "true" });
    for (var i = 0; i < count; i++) wrap.appendChild(createMajorStarSvg());
    return wrap;
  }

  function projectStarCount(p) {
    if (p.stars) return p.stars;
    if (p.major) return 3;
    return 0;
  }

  function projectStarClass(count) {
    if (count === 3) return " work-cell--major";
    if (count === 2) return " work-cell--medium";
    return "";
  }

  function renderCases(t) {
    var host = $("cases-root");
    clear(host);
    var c = t.cases;

    var inner = el("div", { class: "section__inner cases__inner" }, [
      el("span", { class: "section-index", "data-fill": "", "aria-hidden": "true" }, ["04"]),
      el("div", { class: "cases__intro" }, [
        el("div", { class: "cases__intro-copy" }, [
          kitIllu("storefront", "md", "cases__intro-illu reveal"),
          el("p", { class: "eyebrow" }, [c.sectionTitle]),
          el("h2", { class: "headline", "data-splitting": "" }, [c.headline]),
          el("p", { class: "lead-body cases__lead" }, [c.lead]),
        ]),
        casesPhotoWrap(c.photoNote, "cases__figure", "cases__img", "./assets/stock/still-life-vase-orange-01.jpg"),
      ]),
      el("div", { class: "cases__legends" }, [
        el("div", { class: "cases__legend" }, [
          projectStars(3),
          el("span", { class: "mono" }, [c.legend]),
        ]),
        el("div", { class: "cases__legend" }, [
          projectStars(2),
          el("span", { class: "mono" }, [c.legendMedium]),
        ]),
      ]),
    ]);

    var grid = el("div", { class: "cases__grid" });
    c.items.forEach(function (p, i) {
      var num = i + 1 < 10 ? "0" + (i + 1) : String(i + 1);
      var head = el("div", { class: "work-cell__top" }, [
        el("span", { class: "mono work-cell__num" }, [num]),
        projectTitle("h3", "work-cell__title", p.title, c.visit),
      ]);
      var stars = projectStarCount(p);
      var cell = el("article", { class: "work-cell reveal" + projectStarClass(stars) }, [
        head,
        el("p", { class: "mono work-cell__role" }, [p.role]),
        el("p", { class: "lead-body work-cell__oneline" }, [p.oneline]),
        el("div", { class: "work-cell__tags" }, p.tags.map(function (tag) {
          return el("span", { class: "tag mono" }, [tag]);
        })),
      ]);
      if (stars) cell.appendChild(projectStars(stars));
      grid.appendChild(cell);
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
      el("p", { class: "mono stack__note" }, [
        kitIllu("terminal", "sm", "stack__note-icon"),
        t.stack.note,
      ]),
      el("p", { class: "eyebrow" }, [t.stack.index]),
      el("h2", { class: "headline", "data-splitting": "" }, [t.stack.headline]),
    ]);

    var grid = el("div", { class: "stack__grid" });
    t.stack.clusters.forEach(function (cl) {
      var titleAttrs = { class: "stack__cluster-title" };
      if (cl.emphasis) titleAttrs["data-rn"] = "box";
      var clusterClass = "stack__cluster" + (cl.emphasis ? " stack__cluster--emph" : " reveal");
      var chipsWrapClass = "stack__chips" + (cl.emphasis ? " reveal" : "");
      var isInfra = /DevOps|Cloud|облак|инфра/i.test(cl.title);
      var titleChildren = isInfra
        ? [kitIllu("gear", "sm", "stack__cluster-icon"), cl.title]
        : [cl.title];
      grid.appendChild(el("div", { class: clusterClass }, [
        el("h3", titleAttrs, titleChildren),
        el("div", { class: chipsWrapClass }, cl.chips.map(function (chip) {
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
    inner.appendChild(kitIllu("waveDivider", "divider", "stack__divider"));
    host.appendChild(inner);
  }

  function renderAboutTiles(t) {
    var tiles = el("div", { class: "about__tiles reveal" });
    tiles.appendChild(kitIllu("eucalyptus", "md", "about__tiles-plant"));
    S.photos.forEach(function (src, i) {
      tiles.appendChild(
        el("figure", { class: "about__tile" + (i === 0 ? " about__tile--lead" : "") }, [
          el("div", { class: "about__tile-frame" }, [
            el("img", {
              src: src,
              alt: t.photos.caption + " " + (i + 1),
              loading: "lazy",
              decoding: "async",
            }),
          ]),
          el("figcaption", { class: "mono about__tile-cap" }, [t.photos.caption + " / 0" + (i + 1)]),
        ])
      );
    });
    return tiles;
  }

  function renderAbout(t) {
    var host = $("about-root");
    clear(host);
    host.appendChild(el("div", { class: "section__bg", "aria-hidden": "true" }, [el("div", { class: "section__bg-duotone" })]));

    host.appendChild(el("div", { class: "section__inner about__inner" }, [
      el("span", { class: "section-index", "data-fill": "", "aria-hidden": "true" }, ["06"]),
      el("div", { class: "about__headline-row" }, [
        el("h2", { class: "headline about__headline", "data-splitting": "" }, [t.about.headline]),
        kitIllu("mountain", "md", "about__headline-illu reveal"),
      ]),
      el("div", { class: "about__grid" }, [
        renderAboutTiles(t),
        el("div", { class: "about__col reveal" }, [
          el("p", { class: "lead-body about__body" }, [t.about.body]),
          el("p", { class: "mono about__facts" }, [t.about.facts]),
        ]),
      ]),
    ]));
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
      el("span", { class: "section-index", "data-fill": "", "aria-hidden": "true" }, ["07"]),
      kitIllu("chat", "md", "contact__illu reveal"),
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
      el("span", { class: "mono footer__name" }, [t.footer.name + " · " + new Date().getFullYear()]),
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

  function renderInfographic(t){
    var host = $("infographic-root");
    if(!host) return;
    clear(host);
    var g = t.infographic;
    var c = g.cluster;
    var wrap = document.createElement("div");
    wrap.className = "section__inner ig-section";
    wrap.innerHTML =
      '<div class="ig-wrap reveal">'
        + '<div class="ig-eyebrow">'+g.eyebrow+'</div>'
        + '<p class="ig-lead">'+g.lead+'</p>'
        + '<div class="ig-panel">'
        + `<svg viewBox="0 0 760 480" xmlns="http://www.w3.org/2000/svg" class="ig-svg" role="img" aria-label="${g.lead}">
  <defs><filter id="igGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
  <g><circle cx="125.8" cy="192.8" r="0.8" fill="#f2e9db" opacity="0.61"/><circle cx="198.3" cy="373.1" r="1.3" fill="#f2e9db" opacity="0.21"/><circle cx="123.9" cy="262.8" r="0.8" fill="#f2e9db" opacity="0.31"/><circle cx="148.8" cy="218.2" r="0.8" fill="#f2e9db" opacity="0.61"/><circle cx="197.9" cy="220.2" r="0.8" fill="#f2e9db" opacity="0.48"/><circle cx="197.1" cy="285.9" r="0.9" fill="#f2e9db" opacity="0.2"/><circle cx="199.2" cy="359.0" r="0.8" fill="#f2e9db" opacity="0.48"/><circle cx="89.3" cy="252.7" r="1.5" fill="#f2e9db" opacity="0.27"/><circle cx="32.5" cy="347.6" r="1.3" fill="#f2e9db" opacity="0.55"/><circle cx="83.8" cy="257.9" r="1.3" fill="#f2e9db" opacity="0.29"/><circle cx="107.7" cy="307.2" r="1.3" fill="#f2e9db" opacity="0.66"/><circle cx="59.6" cy="328.0" r="0.9" fill="#f2e9db" opacity="0.59"/><circle cx="127.7" cy="216.2" r="1.3" fill="#f2e9db" opacity="0.44"/><circle cx="82.9" cy="314.2" r="1.1" fill="#f2e9db" opacity="0.33"/><circle cx="197.0" cy="279.6" r="1.0" fill="#f2e9db" opacity="0.26"/><circle cx="144.1" cy="239.0" r="0.8" fill="#f2e9db" opacity="0.68"/><circle cx="256.7" cy="271.0" r="1.0" fill="#f2e9db" opacity="0.36"/><circle cx="206.6" cy="305.2" r="1.1" fill="#f2e9db" opacity="0.48"/><circle cx="199.2" cy="131.4" r="1.1" fill="#f2e9db" opacity="0.54"/><circle cx="290.6" cy="369.8" r="1.3" fill="#f2e9db" opacity="0.7"/><circle cx="210.8" cy="184.2" r="1.0" fill="#f2e9db" opacity="0.55"/><circle cx="216.2" cy="163.1" r="1.0" fill="#f2e9db" opacity="0.27"/><circle cx="93.1" cy="368.3" r="0.8" fill="#f2e9db" opacity="0.29"/><circle cx="113.9" cy="278.8" r="1.1" fill="#f2e9db" opacity="0.22"/><circle cx="300.5" cy="363.4" r="1.3" fill="#f2e9db" opacity="0.32"/><circle cx="215.4" cy="260.6" r="1.5" fill="#f2e9db" opacity="0.4"/><circle cx="226.0" cy="317.1" r="1.1" fill="#f2e9db" opacity="0.68"/><circle cx="184.3" cy="328.8" r="0.9" fill="#f2e9db" opacity="0.19"/><circle cx="197.8" cy="161.8" r="0.9" fill="#f2e9db" opacity="0.32"/><circle cx="248.4" cy="333.0" r="1.3" fill="#f2e9db" opacity="0.35"/><circle cx="152.5" cy="358.6" r="1.3" fill="#f2e9db" opacity="0.67"/><circle cx="62.8" cy="305.7" r="1.5" fill="#f2e9db" opacity="0.59"/><circle cx="21.8" cy="353.1" r="1.1" fill="#f2e9db" opacity="0.38"/><circle cx="55.1" cy="363.9" r="0.9" fill="#f2e9db" opacity="0.41"/><circle cx="161.1" cy="364.0" r="1.3" fill="#f2e9db" opacity="0.21"/><circle cx="204.1" cy="372.1" r="1.0" fill="#f2e9db" opacity="0.5"/><circle cx="150.1" cy="376.8" r="0.9" fill="#f2e9db" opacity="0.5"/><circle cx="192.9" cy="297.7" r="1.0" fill="#f2e9db" opacity="0.43"/><circle cx="207.9" cy="369.1" r="1.1" fill="#f2e9db" opacity="0.7"/><circle cx="43.8" cy="385.9" r="0.8" fill="#f2e9db" opacity="0.57"/><circle cx="173.0" cy="163.6" r="1.1" fill="#f2e9db" opacity="0.61"/><circle cx="160.8" cy="88.4" r="1.3" fill="#f2e9db" opacity="0.37"/><circle cx="167.3" cy="176.5" r="0.8" fill="#f2e9db" opacity="0.57"/><circle cx="109.6" cy="372.8" r="1.0" fill="#f2e9db" opacity="0.45"/><circle cx="279.5" cy="293.5" r="1.0" fill="#f2e9db" opacity="0.58"/><circle cx="116.6" cy="298.4" r="0.9" fill="#f2e9db" opacity="0.5"/><circle cx="188.1" cy="341.1" r="0.9" fill="#f2e9db" opacity="0.61"/><circle cx="145.7" cy="229.4" r="1.0" fill="#f2e9db" opacity="0.56"/><circle cx="82.4" cy="153.8" r="1.0" fill="#f2e9db" opacity="0.43"/><circle cx="194.7" cy="299.6" r="1.5" fill="#f2e9db" opacity="0.69"/><circle cx="270.8" cy="272.0" r="1.0" fill="#f2e9db" opacity="0.22"/><circle cx="235.3" cy="328.9" r="1.1" fill="#f2e9db" opacity="0.5"/><circle cx="213.8" cy="168.8" r="0.8" fill="#f2e9db" opacity="0.43"/><circle cx="53.0" cy="384.4" r="1.5" fill="#f2e9db" opacity="0.24"/><circle cx="36.1" cy="370.5" r="0.9" fill="#f2e9db" opacity="0.41"/><circle cx="246.0" cy="281.2" r="0.8" fill="#f2e9db" opacity="0.6"/><circle cx="243.4" cy="322.7" r="0.8" fill="#f2e9db" opacity="0.56"/><circle cx="133.2" cy="344.9" r="0.9" fill="#f2e9db" opacity="0.19"/><circle cx="61.0" cy="267.3" r="1.3" fill="#f2e9db" opacity="0.61"/><circle cx="92.9" cy="135.5" r="1.5" fill="#f2e9db" opacity="0.67"/><circle cx="216.4" cy="394.6" r="1.5" fill="#f2e9db" opacity="0.52"/><circle cx="248.9" cy="305.0" r="0.9" fill="#f2e9db" opacity="0.41"/><circle cx="272.4" cy="372.4" r="1.0" fill="#f2e9db" opacity="0.29"/><circle cx="22.5" cy="339.4" r="1.3" fill="#f2e9db" opacity="0.35"/><circle cx="100.7" cy="382.7" r="1.5" fill="#f2e9db" opacity="0.36"/><circle cx="29.2" cy="278.7" r="1.1" fill="#f2e9db" opacity="0.61"/><circle cx="182.5" cy="128.5" r="0.9" fill="#f2e9db" opacity="0.46"/><circle cx="131.8" cy="257.7" r="0.9" fill="#f2e9db" opacity="0.5"/><circle cx="147.3" cy="144.0" r="0.9" fill="#f2e9db" opacity="0.27"/><circle cx="175.2" cy="223.4" r="1.0" fill="#f2e9db" opacity="0.53"/><circle cx="43.5" cy="272.7" r="1.3" fill="#f2e9db" opacity="0.21"/><circle cx="129.2" cy="338.5" r="0.8" fill="#f2e9db" opacity="0.58"/><circle cx="28.8" cy="298.8" r="0.8" fill="#f2e9db" opacity="0.41"/><circle cx="144.1" cy="198.3" r="1.3" fill="#f2e9db" opacity="0.5"/><circle cx="173.8" cy="238.1" r="1.1" fill="#f2e9db" opacity="0.44"/><circle cx="222.3" cy="340.8" r="1.3" fill="#f2e9db" opacity="0.64"/><circle cx="218.5" cy="261.8" r="0.9" fill="#f2e9db" opacity="0.62"/><circle cx="124.0" cy="356.6" r="0.8" fill="#f2e9db" opacity="0.38"/><circle cx="93.2" cy="284.1" r="0.9" fill="#f2e9db" opacity="0.53"/><circle cx="279.0" cy="307.4" r="0.9" fill="#f2e9db" opacity="0.67"/><circle cx="94.0" cy="331.2" r="0.9" fill="#f2e9db" opacity="0.68"/><circle cx="79.2" cy="346.8" r="0.8" fill="#f2e9db" opacity="0.39"/><circle cx="172.9" cy="134.0" r="0.9" fill="#f2e9db" opacity="0.55"/><circle cx="246.0" cy="321.3" r="1.0" fill="#f2e9db" opacity="0.35"/><circle cx="146.4" cy="161.9" r="0.8" fill="#f2e9db" opacity="0.36"/><circle cx="187.8" cy="283.9" r="1.3" fill="#f2e9db" opacity="0.5"/><circle cx="115.7" cy="97.8" r="0.9" fill="#f2e9db" opacity="0.69"/><circle cx="147.3" cy="365.4" r="1.0" fill="#f2e9db" opacity="0.32"/><circle cx="199.7" cy="185.8" r="1.1" fill="#f2e9db" opacity="0.62"/><circle cx="116.7" cy="191.7" r="1.0" fill="#f2e9db" opacity="0.39"/><circle cx="39.3" cy="323.3" r="1.0" fill="#f2e9db" opacity="0.23"/><circle cx="124.1" cy="381.8" r="1.5" fill="#f2e9db" opacity="0.28"/><circle cx="209.2" cy="395.5" r="0.8" fill="#f2e9db" opacity="0.6"/><circle cx="104.3" cy="375.7" r="0.9" fill="#f2e9db" opacity="0.21"/><circle cx="217.6" cy="315.6" r="1.3" fill="#f2e9db" opacity="0.4"/><circle cx="71.1" cy="194.3" r="1.3" fill="#f2e9db" opacity="0.25"/><circle cx="81.2" cy="373.0" r="0.9" fill="#f2e9db" opacity="0.32"/><circle cx="138.3" cy="340.7" r="1.0" fill="#f2e9db" opacity="0.51"/><circle cx="87.1" cy="284.8" r="1.5" fill="#f2e9db" opacity="0.27"/><circle cx="137.5" cy="286.6" r="0.8" fill="#f2e9db" opacity="0.7"/><circle cx="167.7" cy="236.3" r="0.9" fill="#f2e9db" opacity="0.45"/><circle cx="154.2" cy="319.0" r="1.1" fill="#f2e9db" opacity="0.24"/><circle cx="192.2" cy="253.6" r="1.1" fill="#f2e9db" opacity="0.68"/><circle cx="58.7" cy="339.3" r="0.9" fill="#f2e9db" opacity="0.69"/><circle cx="51.8" cy="271.5" r="1.5" fill="#f2e9db" opacity="0.25"/><circle cx="299.1" cy="317.3" r="0.8" fill="#f2e9db" opacity="0.62"/><circle cx="281.9" cy="300.8" r="1.1" fill="#f2e9db" opacity="0.26"/><circle cx="161.8" cy="372.4" r="1.1" fill="#f2e9db" opacity="0.63"/><circle cx="113.2" cy="326.5" r="1.0" fill="#f2e9db" opacity="0.2"/><circle cx="82.5" cy="353.8" r="1.0" fill="#f2e9db" opacity="0.41"/><circle cx="129.9" cy="86.9" r="1.3" fill="#f2e9db" opacity="0.35"/><circle cx="199.0" cy="347.9" r="1.0" fill="#f2e9db" opacity="0.38"/><circle cx="105.4" cy="261.5" r="1.3" fill="#f2e9db" opacity="0.52"/><circle cx="151.9" cy="370.0" r="0.8" fill="#f2e9db" opacity="0.25"/><circle cx="313.5" cy="362.8" r="1.1" fill="#f2e9db" opacity="0.19"/><circle cx="127.0" cy="213.0" r="1.3" fill="#f2e9db" opacity="0.62"/><circle cx="214.8" cy="360.5" r="1.5" fill="#f2e9db" opacity="0.59"/><circle cx="18.0" cy="318.9" r="1.1" fill="#f2e9db" opacity="0.26"/><circle cx="58.4" cy="257.6" r="1.5" fill="#f2e9db" opacity="0.26"/><circle cx="217.9" cy="272.6" r="1.1" fill="#f2e9db" opacity="0.56"/><circle cx="16.5" cy="310.8" r="0.9" fill="#f2e9db" opacity="0.65"/><circle cx="152.2" cy="131.8" r="0.8" fill="#f2e9db" opacity="0.61"/><circle cx="27.5" cy="323.7" r="1.5" fill="#f2e9db" opacity="0.54"/><circle cx="126.2" cy="390.1" r="0.9" fill="#f2e9db" opacity="0.51"/><circle cx="86.0" cy="154.2" r="1.1" fill="#f2e9db" opacity="0.61"/><circle cx="26.0" cy="320.0" r="1.5" fill="#f2e9db" opacity="0.31"/><circle cx="102.2" cy="324.4" r="1.1" fill="#f2e9db" opacity="0.59"/><circle cx="148.8" cy="223.4" r="1.5" fill="#f2e9db" opacity="0.45"/><circle cx="38.3" cy="286.1" r="1.1" fill="#f2e9db" opacity="0.31"/><circle cx="216.3" cy="216.5" r="0.9" fill="#f2e9db" opacity="0.3"/><circle cx="183.5" cy="199.9" r="1.1" fill="#f2e9db" opacity="0.44"/><circle cx="70.2" cy="247.8" r="0.8" fill="#f2e9db" opacity="0.5"/><circle cx="222.6" cy="246.8" r="0.8" fill="#f2e9db" opacity="0.49"/><circle cx="82.6" cy="227.3" r="1.3" fill="#f2e9db" opacity="0.48"/><circle cx="219.4" cy="235.3" r="1.5" fill="#f2e9db" opacity="0.29"/><circle cx="177.8" cy="246.0" r="1.5" fill="#f2e9db" opacity="0.45"/><circle cx="46.7" cy="379.8" r="1.3" fill="#f2e9db" opacity="0.28"/><circle cx="173.3" cy="87.9" r="1.1" fill="#f2e9db" opacity="0.19"/><circle cx="194.6" cy="117.5" r="1.1" fill="#f2e9db" opacity="0.7"/><circle cx="287.4" cy="304.3" r="0.8" fill="#f2e9db" opacity="0.48"/><circle cx="222.4" cy="172.6" r="0.9" fill="#f2e9db" opacity="0.49"/><circle cx="239.5" cy="272.9" r="1.0" fill="#f2e9db" opacity="0.64"/><circle cx="130.2" cy="110.9" r="1.1" fill="#f2e9db" opacity="0.38"/><circle cx="84.4" cy="359.8" r="1.1" fill="#f2e9db" opacity="0.53"/><circle cx="23.8" cy="348.6" r="1.1" fill="#f2e9db" opacity="0.34"/><circle cx="235.3" cy="223.0" r="0.8" fill="#f2e9db" opacity="0.35"/><circle cx="99.8" cy="134.5" r="0.9" fill="#f2e9db" opacity="0.55"/><circle cx="231.0" cy="201.5" r="1.0" fill="#f2e9db" opacity="0.31"/><circle cx="236.3" cy="218.6" r="0.8" fill="#f2e9db" opacity="0.37"/><circle cx="187.3" cy="270.4" r="1.0" fill="#f2e9db" opacity="0.62"/><circle cx="144.1" cy="182.0" r="1.5" fill="#f2e9db" opacity="0.67"/><circle cx="180.2" cy="322.2" r="1.0" fill="#f2e9db" opacity="0.41"/><circle cx="84.8" cy="200.7" r="1.1" fill="#f2e9db" opacity="0.64"/><circle cx="299.1" cy="332.1" r="1.5" fill="#f2e9db" opacity="0.39"/><circle cx="235.3" cy="357.2" r="0.8" fill="#f2e9db" opacity="0.21"/><circle cx="65.5" cy="244.5" r="1.1" fill="#f2e9db" opacity="0.5"/><circle cx="272.9" cy="336.9" r="1.3" fill="#f2e9db" opacity="0.25"/><circle cx="295.8" cy="358.1" r="1.0" fill="#f2e9db" opacity="0.33"/><circle cx="144.4" cy="185.0" r="1.1" fill="#f2e9db" opacity="0.52"/><circle cx="304.7" cy="377.4" r="1.3" fill="#f2e9db" opacity="0.53"/><circle cx="249.1" cy="386.5" r="1.3" fill="#f2e9db" opacity="0.65"/><circle cx="242.7" cy="303.5" r="0.9" fill="#f2e9db" opacity="0.42"/><circle cx="70.7" cy="304.3" r="1.3" fill="#f2e9db" opacity="0.28"/><circle cx="288.4" cy="390.8" r="1.0" fill="#f2e9db" opacity="0.47"/><circle cx="111.8" cy="155.9" r="0.9" fill="#f2e9db" opacity="0.64"/><circle cx="232.1" cy="236.9" r="1.1" fill="#f2e9db" opacity="0.38"/><circle cx="148.3" cy="310.8" r="0.8" fill="#f2e9db" opacity="0.44"/><circle cx="85.1" cy="253.8" r="1.0" fill="#f2e9db" opacity="0.25"/><circle cx="16.8" cy="304.7" r="0.9" fill="#f2e9db" opacity="0.23"/><circle cx="147.2" cy="104.2" r="1.1" fill="#f2e9db" opacity="0.39"/><circle cx="228.2" cy="208.0" r="0.8" fill="#f2e9db" opacity="0.25"/><circle cx="222.7" cy="208.5" r="1.3" fill="#f2e9db" opacity="0.43"/><circle cx="345.5" cy="371.0" r="1.3" fill="#f2e9db" opacity="0.62"/><circle cx="246.7" cy="219.9" r="0.9" fill="#f2e9db" opacity="0.59"/><circle cx="158.9" cy="80.8" r="0.8" fill="#f2e9db" opacity="0.67"/><circle cx="203.5" cy="200.5" r="1.5" fill="#f2e9db" opacity="0.62"/><circle cx="181.5" cy="158.8" r="0.8" fill="#f2e9db" opacity="0.59"/><circle cx="125.6" cy="326.0" r="0.8" fill="#f2e9db" opacity="0.52"/><circle cx="133.6" cy="318.3" r="1.5" fill="#f2e9db" opacity="0.41"/><circle cx="196.7" cy="179.6" r="0.8" fill="#f2e9db" opacity="0.22"/><circle cx="26.5" cy="350.0" r="0.9" fill="#f2e9db" opacity="0.59"/><circle cx="76.1" cy="334.4" r="1.0" fill="#f2e9db" opacity="0.52"/><circle cx="230.0" cy="347.8" r="0.9" fill="#f2e9db" opacity="0.2"/><circle cx="78.4" cy="301.0" r="1.5" fill="#f2e9db" opacity="0.34"/><circle cx="260.0" cy="294.5" r="1.1" fill="#f2e9db" opacity="0.22"/><circle cx="165.1" cy="325.9" r="1.1" fill="#f2e9db" opacity="0.66"/><circle cx="153.6" cy="288.5" r="1.1" fill="#f2e9db" opacity="0.37"/><circle cx="174.6" cy="274.0" r="0.8" fill="#f2e9db" opacity="0.59"/><circle cx="142.4" cy="332.5" r="0.9" fill="#f2e9db" opacity="0.34"/><circle cx="38.2" cy="274.9" r="0.9" fill="#f2e9db" opacity="0.42"/><circle cx="131.3" cy="364.8" r="1.3" fill="#f2e9db" opacity="0.44"/><circle cx="347.4" cy="394.4" r="0.9" fill="#f2e9db" opacity="0.43"/><circle cx="177.2" cy="212.5" r="1.1" fill="#f2e9db" opacity="0.21"/><circle cx="132.8" cy="392.3" r="1.3" fill="#f2e9db" opacity="0.25"/><circle cx="181.5" cy="277.9" r="1.5" fill="#f2e9db" opacity="0.64"/><circle cx="160.7" cy="159.9" r="0.8" fill="#f2e9db" opacity="0.66"/><circle cx="121.1" cy="106.7" r="1.5" fill="#f2e9db" opacity="0.42"/><circle cx="203.2" cy="313.6" r="1.5" fill="#f2e9db" opacity="0.38"/><circle cx="90.4" cy="355.1" r="0.8" fill="#f2e9db" opacity="0.22"/><circle cx="210.4" cy="378.7" r="1.1" fill="#f2e9db" opacity="0.68"/><circle cx="323.9" cy="389.4" r="1.0" fill="#f2e9db" opacity="0.58"/><circle cx="321.1" cy="383.3" r="1.1" fill="#f2e9db" opacity="0.23"/><circle cx="132.7" cy="224.6" r="1.1" fill="#f2e9db" opacity="0.28"/><circle cx="90.1" cy="303.7" r="1.1" fill="#f2e9db" opacity="0.2"/><circle cx="241.8" cy="249.6" r="0.8" fill="#f2e9db" opacity="0.38"/><circle cx="188.2" cy="381.3" r="0.9" fill="#f2e9db" opacity="0.57"/><circle cx="219.1" cy="333.1" r="1.3" fill="#f2e9db" opacity="0.2"/><circle cx="98.8" cy="190.5" r="1.5" fill="#f2e9db" opacity="0.34"/><circle cx="148.7" cy="150.7" r="1.5" fill="#f2e9db" opacity="0.67"/><circle cx="158.1" cy="378.5" r="0.9" fill="#f2e9db" opacity="0.24"/><circle cx="127.3" cy="151.8" r="1.0" fill="#f2e9db" opacity="0.66"/><circle cx="46.7" cy="260.9" r="0.9" fill="#f2e9db" opacity="0.66"/><circle cx="219.6" cy="219.3" r="1.5" fill="#f2e9db" opacity="0.58"/><circle cx="305.3" cy="354.8" r="1.0" fill="#f2e9db" opacity="0.63"/><circle cx="190.3" cy="222.2" r="1.3" fill="#f2e9db" opacity="0.28"/><circle cx="151.3" cy="378.6" r="0.8" fill="#f2e9db" opacity="0.43"/><circle cx="78.8" cy="268.6" r="0.9" fill="#f2e9db" opacity="0.69"/><circle cx="358.7" cy="394.1" r="0.8" fill="#f2e9db" opacity="0.29"/><circle cx="284.3" cy="294.7" r="0.9" fill="#f2e9db" opacity="0.3"/><circle cx="36.0" cy="300.2" r="1.5" fill="#f2e9db" opacity="0.46"/><circle cx="215.6" cy="204.2" r="0.8" fill="#f2e9db" opacity="0.59"/><circle cx="129.2" cy="314.0" r="1.0" fill="#f2e9db" opacity="0.56"/><circle cx="223.6" cy="353.0" r="0.9" fill="#f2e9db" opacity="0.28"/><circle cx="157.0" cy="101.4" r="0.9" fill="#f2e9db" opacity="0.35"/><circle cx="226.5" cy="308.9" r="0.9" fill="#f2e9db" opacity="0.44"/><circle cx="170.1" cy="189.7" r="0.8" fill="#f2e9db" opacity="0.23"/><circle cx="320.6" cy="374.0" r="0.9" fill="#f2e9db" opacity="0.62"/><circle cx="173.3" cy="306.3" r="0.8" fill="#f2e9db" opacity="0.21"/><circle cx="136.1" cy="204.2" r="1.3" fill="#f2e9db" opacity="0.28"/><circle cx="250.9" cy="368.7" r="1.3" fill="#f2e9db" opacity="0.32"/><circle cx="201.5" cy="182.1" r="0.8" fill="#f2e9db" opacity="0.24"/><circle cx="41.8" cy="365.1" r="1.0" fill="#f2e9db" opacity="0.36"/><circle cx="75.3" cy="389.7" r="1.0" fill="#f2e9db" opacity="0.2"/><circle cx="126.7" cy="140.0" r="1.0" fill="#f2e9db" opacity="0.39"/><circle cx="58.8" cy="384.6" r="0.8" fill="#f2e9db" opacity="0.59"/><circle cx="244.9" cy="296.3" r="0.8" fill="#f2e9db" opacity="0.39"/><circle cx="189.6" cy="353.7" r="1.3" fill="#f2e9db" opacity="0.23"/><circle cx="16.2" cy="382.1" r="1.5" fill="#f2e9db" opacity="0.32"/><circle cx="289.9" cy="358.8" r="0.8" fill="#f2e9db" opacity="0.34"/><circle cx="139.6" cy="214.3" r="1.0" fill="#f2e9db" opacity="0.4"/><circle cx="310.2" cy="345.7" r="1.5" fill="#f2e9db" opacity="0.28"/><circle cx="168.4" cy="164.7" r="0.9" fill="#f2e9db" opacity="0.67"/><circle cx="99.5" cy="368.0" r="0.8" fill="#f2e9db" opacity="0.39"/><circle cx="172.2" cy="117.4" r="1.1" fill="#f2e9db" opacity="0.58"/><circle cx="171.1" cy="354.2" r="1.1" fill="#f2e9db" opacity="0.23"/><circle cx="172.4" cy="201.0" r="1.0" fill="#f2e9db" opacity="0.56"/><circle cx="191.3" cy="351.9" r="0.9" fill="#f2e9db" opacity="0.66"/><circle cx="227.0" cy="375.1" r="1.1" fill="#f2e9db" opacity="0.57"/><circle cx="194.7" cy="312.0" r="0.8" fill="#f2e9db" opacity="0.69"/><circle cx="118.9" cy="112.1" r="1.1" fill="#f2e9db" opacity="0.22"/><circle cx="153.4" cy="165.1" r="1.5" fill="#f2e9db" opacity="0.61"/><circle cx="238.6" cy="354.9" r="1.1" fill="#f2e9db" opacity="0.5"/><circle cx="290.2" cy="380.8" r="1.1" fill="#f2e9db" opacity="0.28"/><circle cx="169.0" cy="232.9" r="1.1" fill="#f2e9db" opacity="0.37"/><circle cx="243.6" cy="371.3" r="1.5" fill="#f2e9db" opacity="0.6"/><circle cx="219.2" cy="193.1" r="1.5" fill="#f2e9db" opacity="0.2"/><circle cx="333.5" cy="365.4" r="0.8" fill="#f2e9db" opacity="0.38"/><circle cx="200.5" cy="180.6" r="1.5" fill="#f2e9db" opacity="0.4"/><circle cx="63.6" cy="262.9" r="1.1" fill="#f2e9db" opacity="0.44"/><circle cx="100.6" cy="349.3" r="0.8" fill="#f2e9db" opacity="0.5"/><circle cx="80.9" cy="212.3" r="1.1" fill="#f2e9db" opacity="0.62"/><circle cx="154.6" cy="132.9" r="1.1" fill="#f2e9db" opacity="0.24"/><circle cx="219.4" cy="377.5" r="1.1" fill="#f2e9db" opacity="0.44"/><circle cx="222.4" cy="243.2" r="0.8" fill="#f2e9db" opacity="0.51"/><circle cx="283.6" cy="314.8" r="1.3" fill="#f2e9db" opacity="0.22"/><circle cx="225.9" cy="226.1" r="1.1" fill="#f2e9db" opacity="0.52"/><circle cx="154.6" cy="378.1" r="1.3" fill="#f2e9db" opacity="0.56"/><circle cx="128.9" cy="138.4" r="0.9" fill="#f2e9db" opacity="0.25"/><circle cx="208.6" cy="183.5" r="0.9" fill="#f2e9db" opacity="0.54"/><circle cx="98.8" cy="197.6" r="0.9" fill="#f2e9db" opacity="0.21"/><circle cx="56.0" cy="369.6" r="1.3" fill="#f2e9db" opacity="0.32"/><circle cx="277.9" cy="302.0" r="0.9" fill="#f2e9db" opacity="0.31"/><circle cx="255.4" cy="301.6" r="1.3" fill="#f2e9db" opacity="0.44"/><circle cx="126.0" cy="298.4" r="0.8" fill="#f2e9db" opacity="0.28"/><circle cx="39.5" cy="356.8" r="1.0" fill="#f2e9db" opacity="0.65"/><circle cx="226.6" cy="361.3" r="1.0" fill="#f2e9db" opacity="0.24"/><circle cx="18.1" cy="359.4" r="1.1" fill="#f2e9db" opacity="0.47"/><circle cx="124.2" cy="216.3" r="0.8" fill="#f2e9db" opacity="0.31"/><circle cx="108.6" cy="181.0" r="1.0" fill="#f2e9db" opacity="0.32"/><circle cx="273.8" cy="353.8" r="0.8" fill="#f2e9db" opacity="0.41"/><circle cx="142.6" cy="341.9" r="1.5" fill="#f2e9db" opacity="0.68"/><circle cx="117.3" cy="304.2" r="1.3" fill="#f2e9db" opacity="0.66"/><circle cx="259.1" cy="258.2" r="1.5" fill="#f2e9db" opacity="0.18"/><circle cx="202.5" cy="228.6" r="1.1" fill="#f2e9db" opacity="0.4"/><circle cx="161.3" cy="280.8" r="0.8" fill="#f2e9db" opacity="0.25"/><circle cx="169.6" cy="392.8" r="0.8" fill="#f2e9db" opacity="0.47"/><circle cx="286.1" cy="368.1" r="1.3" fill="#f2e9db" opacity="0.37"/><circle cx="170.1" cy="210.4" r="0.9" fill="#f2e9db" opacity="0.37"/><circle cx="273.5" cy="293.3" r="0.9" fill="#f2e9db" opacity="0.25"/><circle cx="215.1" cy="362.1" r="0.8" fill="#f2e9db" opacity="0.21"/><circle cx="122.6" cy="354.4" r="1.5" fill="#f2e9db" opacity="0.59"/><circle cx="89.6" cy="397.0" r="1.5" fill="#f2e9db" opacity="0.61"/><circle cx="192.8" cy="136.9" r="1.3" fill="#f2e9db" opacity="0.52"/><circle cx="226.9" cy="232.0" r="0.9" fill="#f2e9db" opacity="0.27"/><circle cx="183.7" cy="392.2" r="0.9" fill="#f2e9db" opacity="0.3"/><circle cx="150.1" cy="380.7" r="0.8" fill="#f2e9db" opacity="0.19"/><circle cx="79.3" cy="365.5" r="0.9" fill="#f2e9db" opacity="0.45"/><circle cx="64.8" cy="312.5" r="1.3" fill="#f2e9db" opacity="0.27"/><circle cx="43.4" cy="349.4" r="1.0" fill="#f2e9db" opacity="0.51"/><circle cx="301.6" cy="361.8" r="1.3" fill="#f2e9db" opacity="0.18"/></g>
  <path d="M 10.5 300.7 L 15.0 292.9 L 19.5 284.7 L 24.0 276.1 L 28.5 267.3 L 33.0 258.2 L 37.5 248.9 L 42.0 239.4 L 46.5 229.7 L 51.0 219.8 L 55.5 209.8 L 60.0 199.8 L 64.5 189.8 L 69.0 179.9 L 73.5 170.1 L 78.0 160.4 L 82.5 150.9 L 87.0 141.7 L 91.5 132.8 L 96.0 124.4 L 100.5 116.3 L 105.0 108.8 L 109.5 101.8 L 114.0 95.4 L 118.5 89.6 L 123.0 84.5 L 127.5 80.2 L 132.0 76.5 L 136.5 73.7 L 141.0 71.6 L 145.5 70.4 L 150.0 70.0 L 154.5 70.4 L 159.0 71.6 L 163.5 73.7 L 168.0 76.5 L 172.5 80.2 L 177.0 84.5 L 181.5 89.6 L 186.0 95.4 L 190.5 101.8 L 195.0 108.8 L 199.5 116.3 L 204.0 124.4 L 208.5 132.8 L 213.0 141.7 L 217.5 150.9 L 222.0 160.4 L 226.5 170.1 L 231.0 179.9 L 235.5 189.8 L 240.0 199.8 L 244.5 209.8 L 249.0 219.8 L 253.5 229.7 L 258.0 239.4 L 262.5 248.9 L 267.0 258.2 L 271.5 267.3 L 276.0 276.1 L 280.5 284.7 L 285.0 292.9 L 289.5 300.7 L 294.0 308.2 L 298.5 315.4 L 303.0 322.2 L 307.5 328.6 L 312.0 334.7 L 316.5 340.4 L 321.0 345.7 L 325.5 350.7 L 330.0 355.3 L 334.5 359.6 L 339.0 363.6 L 343.5 367.3 L 348.0 370.7 L 352.5 373.7 L 357.0 376.6 L 361.5 379.1 L 366.0 381.5 L 370.5 383.6 L 375.0 385.5 L 379.5 387.2 L 384.0 388.8 L 388.5 390.1 L 393.0 391.4 L 397.5 392.5 L 402.0 393.5 L 406.5 394.3 L 411.0 395.1 L 415.5 395.7 L 420.0 396.3 L 424.5 396.8 L 429.0 397.3 L 433.5 397.7 L 438.0 398.0 L 442.5 398.3 L 447.0 398.6 L 451.5 398.8 L 456.0 399.0 L 460.5 399.1 L 465.0 399.3 L 469.5 399.4 L 474.0 399.5 L 478.5 399.6 L 483.0 399.6 L 487.5 399.7 L 492.0 399.8 L 496.5 399.8 L 501.0 399.8 L 505.5 399.9 L 510.0 399.9 L 514.5 399.9 L 519.0 399.9 L 523.5 399.9 L 528.0 400.0 L 532.5 400.0 L 537.0 400.0 L 541.5 400.0 L 546.0 400.0 L 550.5 400.0 L 555.0 400.0 L 559.5 400.0 L 564.0 400.0 L 568.5 400.0 L 573.0 400.0 L 577.5 400.0 L 582.0 400.0 L 586.5 400.0 L 591.0 400.0 L 595.5 400.0 L 600.0 400.0 L 604.5 400.0 L 609.0 400.0 L 613.5 400.0 L 618.0 400.0" fill="none" stroke="#b7a793" stroke-width="1.1" opacity="0.5"/>
  <line x1="20" y1="400" x2="705" y2="400" stroke="#4a382c" stroke-width="1.2"/>
  <line x1="240" y1="400" x2="240" y2="406" class="ig-ax"/><text x="240" y="420" text-anchor="middle" class="ig-tick">1σ</text><line x1="330" y1="400" x2="330" y2="406" class="ig-ax"/><text x="330" y="420" text-anchor="middle" class="ig-tick">2σ</text><line x1="420" y1="400" x2="420" y2="406" class="ig-ax"/><text x="420" y="420" text-anchor="middle" class="ig-tick">3σ</text><line x1="510" y1="400" x2="510" y2="406" class="ig-ax"/><text x="510" y="420" text-anchor="middle" class="ig-tick">4σ</text><line x1="600" y1="400" x2="600" y2="406" class="ig-ax"/><text x="600" y="420" text-anchor="middle" class="ig-tick">5σ</text><line x1="690" y1="400" x2="690" y2="406" class="ig-ax"/><text x="690" y="420" text-anchor="middle" class="ig-tick">6σ</text>
  <circle cx="150" cy="400" r="3.4" fill="#f2e9db"/><text x="150" y="434" text-anchor="middle" class="ig-avg">${g.avg}</text>
  <line x1="456" y1="400" x2="456" y2="318" class="ig-stem"/><circle cx="456" cy="400" r="3.2" fill="#f2e9db" opacity="0.9"/><text x="456" y="296" text-anchor="middle" class="ig-cname">${c[0][0]}</text><text x="456" y="311" text-anchor="middle" class="ig-csig">${c[0][1]}</text><line x1="501" y1="400" x2="501" y2="348" class="ig-stem"/><circle cx="501" cy="400" r="3.2" fill="#f2e9db" opacity="0.9"/><text x="501" y="326" text-anchor="middle" class="ig-cname">${c[1][0]}</text><text x="501" y="341" text-anchor="middle" class="ig-csig">${c[1][1]}</text><line x1="546" y1="400" x2="546" y2="378" class="ig-stem"/><circle cx="546" cy="400" r="3.2" fill="#f2e9db" opacity="0.9"/><text x="546" y="356" text-anchor="middle" class="ig-cname">${c[2][0]}</text><text x="546" y="371" text-anchor="middle" class="ig-csig">${c[2][1]}</text>
  <line x1="681" y1="158" x2="681" y2="395" stroke="#c8552b" stroke-width="1.6"/>
  <circle cx="681" cy="400" r="14" fill="#c8552b" opacity="0.28" filter="url(#igGlow)"/>
  <circle cx="681" cy="400" r="10.5" fill="#c8552b" filter="url(#igGlow)"/>
  <circle cx="681" cy="400" r="5.5" fill="#e0a24e"/>
  <text x="681" y="120" text-anchor="middle" class="ig-name">${g.name}</text><text x="681" y="146" text-anchor="middle" class="ig-namesig">${g.sig}</text>
  </svg>`
        + '</div>'
        + '<p class="ig-caption">'+g.caption+'</p>'
      + '</div>';
    host.appendChild(wrap);
  }

  function renderAll() {
    var t = C[current];
    applyMeta(t);
    renderNav(t);
    renderHero(t);
    renderInfographic(t);
    renderProof(t);
    renderApproach(t);
    renderCases(t);
    renderStack(t);
    renderAbout(t);
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
    removeHeroAccentAnnotation();
    current = code;
    if (persist) {
      try { localStorage.setItem(STORE_KEY, code); } catch (e) { console.warn("localStorage unavailable:", e); }
    }
    renderAll();
  }

  function morphTextContent(node, toText, charMs, done) {
    if (!node) {
      if (done) done();
      return;
    }
    if (REDUCED) {
      node.textContent = toText;
      if (done) done();
      return;
    }
    var from = Array.from(node.textContent);
    var to = Array.from(toText);
    var len = Math.max(from.length, to.length);
    var step = 0;

    function tick() {
      var out = "";
      for (var i = 0; i < len; i++) {
        if (i < step) out += to[i] || "";
        else out += from[i] || "";
      }
      node.textContent = out;
      step += 1;
      if (step <= len) {
        heroMorphTimers.push(setTimeout(tick, charMs));
      } else {
        node.textContent = toText;
        if (done) done();
      }
    }
    tick();
  }

  function runHeroIntroMorph() {
    introTimer = null;
    if (!heroIntroPending) return;
    heroIntroPending = false;
    heroIntroMode = false;

    var target = C[current].hero;
    var eyebrow = document.querySelector(".hero__eyebrow");
    var primaryBtn = document.querySelector(".hero__ctas [data-hero-cta='primary']");
    var secondaryBtn = document.querySelector(".hero__ctas [data-hero-cta='secondary']");
    var charMs = 22;

    removeHeroAccentAnnotation();
    document.querySelectorAll(".hero__headline-live .hero__accent").forEach(function (node) {
      node.removeAttribute("data-rn-done");
    });

    var headline = document.querySelector(".hero__headline");
    if (headline) headline.classList.add("is-morphing");

    var sectionsLeft = 3;
    function sectionDone() {
      sectionsLeft -= 1;
      if (sectionsLeft <= 0) {
        if (headline) headline.classList.remove("is-morphing");
        annotateHeroAccent();
      }
    }

    function runParallelMorphs(nodes, texts, done) {
      var left = 0;
      nodes.forEach(function (node, i) {
        if (!node) return;
        left += 1;
      });
      if (left === 0) {
        done();
        return;
      }
      function partDone() {
        left -= 1;
        if (left <= 0) done();
      }
      nodes.forEach(function (node, i) {
        if (!node) return;
        morphTextContent(node, texts[i], charMs, partDone);
      });
    }

    morphTextContent(eyebrow, target.eyebrow, charMs, sectionDone);
    morphUnifiedHeadline(target, charMs, sectionDone);
    runParallelMorphs(
      [primaryBtn, secondaryBtn],
      [target.ctaPrimary, target.ctaSecondary],
      sectionDone
    );
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
  var heroSeqTimers = [];
  var heroEntranceDone = false;
  var heroAccentAnns = [];
  var heroAccentDrawTimer = null;

  function initEffects() {
    initReveal();
    initSplitting();
    initHeroSequence();
    initRoughNotation();
    initCasesPhotoArrow();
    initGlitch();
  }

  function clearHeroSequence() {
    heroSeqTimers.forEach(function (id) { clearTimeout(id); });
    heroSeqTimers = [];
  }

  function clearHeroAccentDrawTimer() {
    if (heroAccentDrawTimer !== null) {
      clearTimeout(heroAccentDrawTimer);
      heroAccentDrawTimer = null;
    }
  }

  function removeHeroAccentAnnotation() {
    clearHeroAccentDrawTimer();
    heroAccentAnns.forEach(function (ann) {
      try { ann.remove(); } catch (e) { console.warn("hero accent annotation remove failed:", e); }
    });
    heroAccentAnns = [];
  }

  function showHeroImmediately() {
    document.querySelectorAll(".hero__seq").forEach(function (node) {
      node.classList.add("is-visible");
    });
    if (heroIntroPending) return;
    annotateHeroAccent();
  }

  function lockHeroAccentLayout(node) {
    node.style.display = "inline";
    node.style.padding = "0";
    node.style.margin = "0";
    node.style.border = "0";
    node.style.fontWeight = "inherit";
    node.style.lineHeight = "inherit";
    node.style.letterSpacing = "inherit";
    node.style.verticalAlign = "baseline";
    node.style.boxSizing = "content-box";
  }

  function lockHeroAccentSvg(node) {
    var mark = node.getAttribute("data-rn");
    var svg = node.querySelector("svg");
    if (!svg) return;
    svg.style.position = "absolute";
    svg.style.left = "0";
    svg.style.top = "0";
    svg.style.overflow = "visible";
    svg.style.pointerEvents = "none";
    if (mark === "underline") return;
    svg.style.width = "100%";
    svg.style.height = "100%";
  }

  function heroRoughNotationConf(mark) {
    var map = {
      underline: { type: "underline", color: "#C8552B", strokeWidth: 2.4, padding: 2, multiline: true },
      circle: { type: "circle", color: "#E0A24E", strokeWidth: 2.2, padding: 0, multiline: false },
      box: { type: "box", color: "#C8552B", strokeWidth: 2.4, padding: 8, multiline: false },
      highlight: { type: "highlight", color: "#E0A24E", strokeWidth: 14, padding: 2, multiline: true },
    };
    return map[mark] || map.underline;
  }

  function annotateHeroAccent() {
    if (heroIntroPending) return;

    if (REDUCED || !window.RoughNotation) {
      document.querySelectorAll(".hero__accent[data-rn]").forEach(function (plain) {
        plain.classList.add("rn-plain");
      });
      return;
    }

    var nodes = Array.prototype.slice.call(
      document.querySelectorAll(".hero__accent[data-rn]:not([data-rn-done])")
    );
    if (!nodes.length) return;

    removeHeroAccentAnnotation();

    function draw() {
      heroAccentDrawTimer = null;
      nodes.forEach(function (node) {
        if (!node.textContent.trim()) return;
        if (!node.isConnected || node.hasAttribute("data-rn-done")) return;
        node.setAttribute("data-rn-done", "");
        lockHeroAccentLayout(node);
        var conf = heroRoughNotationConf(node.getAttribute("data-rn"));
        try {
          var ann = window.RoughNotation.annotate(node, {
            type: conf.type,
            color: conf.color,
            strokeWidth: conf.strokeWidth,
            padding: conf.padding,
            iterations: 2,
            animationDuration: 700,
            multiline: conf.multiline,
          });
          ann.show();
          lockHeroAccentSvg(node);
          heroAccentAnns.push(ann);
        } catch (err) {
          console.error("RoughNotation hero accent failed:", err);
          node.classList.add("rn-plain");
        }
      });
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        heroAccentDrawTimer = setTimeout(draw, 100);
      });
    });
  }

  function initHeroSequence() {
    clearHeroSequence();
    var steps = document.querySelectorAll(".hero__seq");
    if (!steps.length) return;

    if (REDUCED) {
      showHeroImmediately();
      heroEntranceDone = true;
      return;
    }

    if (heroEntranceDone) {
      showHeroImmediately();
      return;
    }

    heroEntranceDone = true;

    steps.forEach(function (node) {
      node.classList.remove("is-visible");
    });

    heroSeqTimers.push(setTimeout(function () {
      document.querySelectorAll(".hero__seq").forEach(function (node) {
        node.classList.add("is-visible");
      });
    }, 0));
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
    heads.forEach(function (h) {
      if (h.hasAttribute("data-hero-headline")) return;
      io.observe(h);
    });
  }
  var rnObserver = null;

  function whenRevealStable(node, cb) {
    var reveal = node.closest(".reveal");
    if (!reveal) {
      requestAnimationFrame(function () { requestAnimationFrame(cb); });
      return;
    }

    function afterTransition() {
      requestAnimationFrame(function () { requestAnimationFrame(cb); });
    }

    function watchTransition() {
      var duration = parseFloat(getComputedStyle(reveal).transitionDuration) || 0;
      if (duration <= 0) {
        afterTransition();
        return;
      }
      var done = false;
      function finish() {
        if (done) return;
        done = true;
        reveal.removeEventListener("transitionend", onEnd);
        afterTransition();
      }
      function onEnd(ev) {
        if (ev.target !== reveal || ev.propertyName !== "transform") return;
        finish();
      }
      reveal.addEventListener("transitionend", onEnd);
      setTimeout(finish, Math.ceil(duration * 1000) + 80);
    }

    if (reveal.classList.contains("is-in")) {
      watchTransition();
      return;
    }

    var mo = new MutationObserver(function () {
      if (!reveal.classList.contains("is-in")) return;
      mo.disconnect();
      watchTransition();
    });
    mo.observe(reveal, { attributes: true, attributeFilter: ["class"] });
  }

  function showRoughNotation(node, conf, attempt) {
    attempt = attempt || 0;
    whenRevealStable(node, function () {
      if (!node.isConnected || node.hasAttribute("data-rn-done")) return;
      var rect = node.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) {
        if (attempt >= 8) {
          node.classList.add("rn-plain");
          return;
        }
        requestAnimationFrame(function () { showRoughNotation(node, conf, attempt + 1); });
        return;
      }
      node.setAttribute("data-rn-done", "");
      try {
        var ann = window.RoughNotation.annotate(node, {
          type: conf.type, color: conf.color,
          strokeWidth: conf.type === "highlight" ? 14 : 2.4,
          padding: conf.type === "circle" || conf.type === "box" ? 8 : 2,
          iterations: 2, animationDuration: 700,
          multiline: conf.type === "underline" || conf.type === "highlight",
        });
        ann.show();
      } catch (err) {
        console.error("RoughNotation failed:", err);
        node.classList.add("rn-plain");
      }
    });
  }

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
    var nodes = document.querySelectorAll("[data-rn]:not([data-rn-done]):not(.hero__accent)");
    if (!("IntersectionObserver" in window)) return;
    if (rnObserver) rnObserver.disconnect();
    rnObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var n = e.target;
        if (n.hasAttribute("data-rn-done")) return;
        var conf = typeMap[n.getAttribute("data-rn")] || typeMap.underline;
        showRoughNotation(n, conf);
        rnObserver.unobserve(n);
      });
    }, { threshold: 0.6 });
    nodes.forEach(function (n) { rnObserver.observe(n); });
  }

  var casesPhotoArrowResizeTimer = null;

  function drawCasesPhotoArrow(wrap) {
    if (!wrap) return;
    var svg = wrap.querySelector(".cases__photo-arrow");
    var note = wrap.querySelector(".cases__photo-note");
    var fig = wrap.querySelector(".cases__figure");
    if (!svg || !note || !fig) return;

    var wr = wrap.getBoundingClientRect();
    if (wr.width < 1 || wr.height < 1) return;

    var nr = note.getBoundingClientRect();
    var fr = fig.getBoundingClientRect();
    var x1 = nr.right - wr.left + 4;
    var y1 = nr.top + nr.height * 0.55 - wr.top;
    var x2 = fr.left - wr.left + fr.width * 0.22;
    var y2 = fr.top - wr.top + fr.height * 0.28;
    var cx = x1 + (x2 - x1) * 0.42;
    var cy = Math.min(y1, y2) - Math.max(18, wr.height * 0.08);

    svg.setAttribute("width", String(Math.ceil(wr.width)));
    svg.setAttribute("height", String(Math.ceil(wr.height)));
    svg.setAttribute("viewBox", "0 0 " + wr.width + " " + wr.height);
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    var strokeOpts = {
      stroke: "#C8552B",
      strokeWidth: 2,
      roughness: 1.35,
      bowing: 1.15,
      fill: "none",
    };

    if (window.rough && !REDUCED) {
      var rc = window.rough.svg(svg);
      svg.appendChild(rc.path("M" + x1 + " " + y1 + " Q" + cx + " " + cy + " " + x2 + " " + y2, strokeOpts));
      var dx = x2 - cx;
      var dy = y2 - cy;
      var ang = Math.atan2(dy, dx);
      var ah = Math.max(8, wr.width * 0.028);
      svg.appendChild(rc.line(
        x2, y2,
        x2 - ah * Math.cos(ang - 0.42), y2 - ah * Math.sin(ang - 0.42),
        strokeOpts
      ));
      svg.appendChild(rc.line(
        x2, y2,
        x2 - ah * Math.cos(ang + 0.42), y2 - ah * Math.sin(ang + 0.42),
        strokeOpts
      ));
    } else {
      var ns = "http://www.w3.org/2000/svg";
      var path = document.createElementNS(ns, "path");
      path.setAttribute("d", "M" + x1 + " " + y1 + " Q" + cx + " " + cy + " " + x2 + " " + y2);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "#C8552B");
      path.setAttribute("stroke-width", "2");
      path.setAttribute("stroke-linecap", "round");
      svg.appendChild(path);
    }

    wrap.classList.add("is-arrow-drawn");
  }

  function initCasesPhotoArrow() {
    var wrap = document.querySelector(".cases__photo-wrap");
    if (!wrap) return;

    function scheduleDraw() {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { drawCasesPhotoArrow(wrap); });
      });
    }

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          scheduleDraw();
          io.unobserve(wrap);
        });
      }, { threshold: 0.35 });
      io.observe(wrap);
    } else {
      scheduleDraw();
    }

    window.addEventListener("resize", function () {
      if (!wrap.classList.contains("is-arrow-drawn")) return;
      clearTimeout(casesPhotoArrowResizeTimer);
      casesPhotoArrowResizeTimer = setTimeout(function () { drawCasesPhotoArrow(wrap); }, 120);
    });
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
      window.PowerGlitch.glitch("[data-glitch-aside]", {
        playMode: "always",
        createContainers: true,
        hideOverflow: true,
        timing: { duration: 2800, iterations: Infinity },
        glitchTimeSpan: { start: 0.82, end: 0.98 },
        shake: { velocity: 10, amplitudeX: 0.05, amplitudeY: 0.035 },
        slice: { count: 3, velocity: 10, minHeight: 0.015, maxHeight: 0.07, hueRotate: false },
      });
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

  function initBackToTop() {
    document.addEventListener("click", function (e) {
      var link = e.target.closest('a[href="#top"]');
      if (!link) return;
      e.preventDefault();
      closeMenu();
      var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, left: 0, behavior: reduced ? "auto" : "smooth" });
      if (window.location.hash === "#top") {
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    });
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
    current = detectLang();
    if (current !== "zh") {
      heroIntroMode = true;
      heroIntroPending = true;
      introTimer = setTimeout(runHeroIntroMorph, 1000);
    }
    renderAll();
    initGrain();
    initNavScroll();
    initBackToTop();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
