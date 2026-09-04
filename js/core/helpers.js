/* Shared DOM-building helpers reused by every section renderer. */
(function () {
  "use strict";

  var S = window.SITE_STATIC;

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

  function casesPhotoWrap(note, figClass, mediaClass, sources, poster) {
    var video = el("video", {
      class: mediaClass,
      poster: poster,
      preload: "none",
      "aria-hidden": "true",
    });
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.controls = false;
    video.setAttribute("playsinline", "");
    video.setAttribute("data-lazy-src", JSON.stringify(sources));
    return el("div", { class: "cases__photo-wrap reveal" }, [
      el("p", { class: "cases__photo-note mono" }, [note]),
      el("svg", { class: "cases__photo-arrow", "aria-hidden": "true" }),
      el("figure", { class: figClass, "aria-hidden": "true" }, [video]),
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

  window.SITE_UI = {
    el: el,
    clear: clear,
    $: $,
    kitIllu: kitIllu,
    sideFigure: sideFigure,
    casesPhotoWrap: casesPhotoWrap,
    projectTitle: projectTitle,
    createMajorStarSvg: createMajorStarSvg,
    projectStars: projectStars,
    projectStarCount: projectStarCount,
    projectStarClass: projectStarClass,
  };
})();
