/* Effects layer - dosed, reduced-motion aware: scroll reveal, Splitting.js
   headline char reveal, hero entrance sequence, RoughNotation accents,
   the cases photo arrow, powerGlitch hovers, grain overlay, back-to-top,
   and nav scroll/theme state. */
(function () {
  "use strict";

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var C = window.SITE_CONTENT;

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
    initLazyVideo();
    initGlitch();
  }

  /* Videos carry their sources in data-lazy-src and only fetch them near the viewport,
     so nothing heavy competes with the first screen. */
  function initLazyVideo() {
    var nodes = document.querySelectorAll("video[data-lazy-src]");
    if (!nodes.length) return;

    function load(video) {
      var sources;
      try { sources = JSON.parse(video.getAttribute("data-lazy-src")); } catch (e) { return; }
      video.removeAttribute("data-lazy-src");
      sources.forEach(function (item) {
        var source = document.createElement("source");
        source.src = item.src;
        source.type = item.type;
        video.appendChild(source);
      });
      video.load();
      var started = video.play();
      if (started && started.catch) started.catch(function () {});
    }

    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(nodes, load);
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        load(entry.target);
      });
    }, { rootMargin: "600px 0px" });

    function observeAll() {
      Array.prototype.forEach.call(nodes, function (node) { obs.observe(node); });
    }
    if (document.readyState === "complete") observeAll();
    else window.addEventListener("load", observeAll, { once: true });
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
    if (window.SITE_SECTIONS.hero.isIntroPending()) return;
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
    if (window.SITE_SECTIONS.hero.isIntroPending()) return;

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
      window.SITE_SECTIONS.nav.closeMenu();
      var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, left: 0, behavior: reduced ? "auto" : "smooth" });
      if (window.location.hash === "#top") {
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    });
  }

  /* Nav scroll state + theme-under-nav. */
  function initNavScroll() {
    var nav = document.getElementById("nav-root");
    var sections = [
      { id: "hero-root", theme: "dark" },
      { id: "proof-root", theme: "light" },
      { id: "infographic-root", theme: "dark" },
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

  window.SITE_EFFECTS = {
    initEffects: initEffects,
    initReveal: initReveal,
    initSplitting: initSplitting,
    initHeroSequence: initHeroSequence,
    initRoughNotation: initRoughNotation,
    initCasesPhotoArrow: initCasesPhotoArrow,
    drawCasesPhotoArrow: drawCasesPhotoArrow,
    initGlitch: initGlitch,
    initGrain: initGrain,
    initBackToTop: initBackToTop,
    initNavScroll: initNavScroll,
    removeHeroAccentAnnotation: removeHeroAccentAnnotation,
    annotateHeroAccent: annotateHeroAccent,
    lockHeroAccentLayout: lockHeroAccentLayout,
  };
})();
