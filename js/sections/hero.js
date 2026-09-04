/* Hero section: headline render, CTA links, and the "hero starts in Chinese,
   then letter-morphs to site language" intro flourish. */
(function () {
  "use strict";

  var UI = window.SITE_UI;
  var el = UI.el, clear = UI.clear, $ = UI.$;
  var C = window.SITE_CONTENT;
  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var heroIntroMode = false;
  var heroIntroPending = false;
  var introTimer = null;
  var heroMorphTimers = [];

  function cancelHeroIntro() {
    if (introTimer !== null) {
      clearTimeout(introTimer);
      introTimer = null;
    }
    heroMorphTimers.forEach(function (id) { clearTimeout(id); });
    heroMorphTimers = [];
    heroIntroPending = false;
    heroIntroMode = false;
  }

  function scheduleHeroIntro(lang) {
    heroIntroMode = true;
    heroIntroPending = true;
    introTimer = setTimeout(function () { runHeroIntroMorph(lang); }, 1000);
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
    accents.forEach(function (node) { window.SITE_EFFECTS.lockHeroAccentLayout(node); });
  }

  function buildHeroHeadlineChildren(hero) {
    return [
      el("span", { class: "hero__hl-before" }, [hero.headlineBefore || ""]),
    ].concat(heroAccentSpans(hero), [
      el("span", { class: "hero__hl-after" }, heroAfterChildren(hero)),
    ]);
  }

  /* Renders headlineAfter, wrapping headlineSelect (if present) in a selection-styled span. */
  function heroAfterChildren(hero) {
    var text = hero.headlineAfter || "";
    var word = hero.headlineSelect || "";
    var at = word ? text.indexOf(word) : -1;
    if (at === -1) return [text];
    return [
      text.slice(0, at),
      el("span", { class: "hero__hl-sel" }, [word]),
      text.slice(at + word.length),
    ];
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

  function ctaLink(label, href, cls, glitch, heroCta) {
    var attrs = { class: cls, href: href };
    if (glitch) attrs["data-glitch-cta"] = "";
    if (heroCta) attrs["data-hero-cta"] = heroCta;
    return el("a", attrs, [label]);
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
      el("div", { class: "hero__marker mono", "aria-hidden": "true" }, [
        "Mobile · Web · Serverless · Tg bots · Agentic · Analytics · Infrastructure",
      ]),
    ]));
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

  function runHeroIntroMorph(lang) {
    introTimer = null;
    if (!heroIntroPending) return;
    heroIntroPending = false;
    heroIntroMode = false;

    var target = C[lang].hero;
    var eyebrow = document.querySelector(".hero__eyebrow");
    var primaryBtn = document.querySelector(".hero__ctas [data-hero-cta='primary']");
    var secondaryBtn = document.querySelector(".hero__ctas [data-hero-cta='secondary']");
    var charMs = 22;

    window.SITE_EFFECTS.removeHeroAccentAnnotation();
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
        window.SITE_EFFECTS.annotateHeroAccent();
      }
    }

    function runParallelMorphs(nodes, texts, done) {
      var left = 0;
      nodes.forEach(function (node) {
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

  window.SITE_SECTIONS = window.SITE_SECTIONS || {};
  window.SITE_SECTIONS.hero = renderHero;
  window.SITE_SECTIONS.hero.scheduleIntro = scheduleHeroIntro;
  window.SITE_SECTIONS.hero.cancelIntro = cancelHeroIntro;
  window.SITE_SECTIONS.hero.isIntroPending = function () { return heroIntroPending; };
  /* Exposed for setLiveHeadline reuse by other hero-headline consumers, if any. */
  window.SITE_SECTIONS.hero.setLiveHeadline = setLiveHeadline;
})();
