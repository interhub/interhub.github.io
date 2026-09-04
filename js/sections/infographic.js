/* Profit-vs-automation curve, rendered as a responsive inline SVG. */
(function () {
  "use strict";

  var UI = window.SITE_UI;
  var el = UI.el, clear = UI.clear, $ = UI.$;

  var NS = "http://www.w3.org/2000/svg";
  var CO = { paper: "#f2e9db", paperSoft: "#b7a793", hair: "#4a382c", terra: "#c8552b", clay: "#e0a24e" };

  /* Height of every marker as a fraction of the plot amplitude: a soft shelf
     where the peak still sits clearly above the fourth step. */
  var FRACS = [0.045, 0.43, 0.69, 0.865, 1.0];
  var VALUES = [1, 1.4, 2.1, 2.8, 3.5];
  var CJK = /[\u2e80-\u9fff\uf900-\ufaff\uff00-\uffef]/;

  function E(tag, attrs) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs.hasOwnProperty(k)) n.setAttribute(k, attrs[k]);
    return n;
  }
  function text(str, attrs) {
    var n = E("text", attrs);
    n.textContent = str;
    return n;
  }

  /* Monotone cubic interpolation (Fritsch-Carlson) over evenly spaced indexes. */
  function makeInterp(ys) {
    var n = ys.length, d = [], m = [], i;
    for (i = 0; i < n - 1; i++) d.push(ys[i + 1] - ys[i]);
    m.push(d[0]);
    for (i = 1; i < n - 1; i++) m.push((d[i - 1] + d[i]) / 2);
    m.push(d[n - 2]);
    for (i = 0; i < n - 1; i++) {
      if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
      var a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
      if (s > 9) { var tt = 3 / Math.sqrt(s); m[i] = tt * a * d[i]; m[i + 1] = tt * b * d[i]; }
    }
    return function (t) {
      if (t <= 0) return ys[0];
      if (t >= n - 1) return ys[n - 1];
      var k = Math.floor(t), h = t - k;
      var h00 = 2 * h * h * h - 3 * h * h + 1, h10 = h * h * h - 2 * h * h + h;
      var h01 = -2 * h * h * h + 3 * h * h, h11 = h * h * h - h * h;
      return h00 * ys[k] + h10 * m[k] + h01 * ys[k + 1] + h11 * m[k + 1];
    };
  }

  /* Latin and cyrillic break on spaces, CJK breaks on any glyph. */
  function tokenize(str) {
    var out = [], buf = "", i, ch;
    for (i = 0; i < str.length; i++) {
      ch = str.charAt(i);
      if (ch === " ") { if (buf) { out.push(buf); buf = ""; } continue; }
      if (CJK.test(ch)) { if (buf) { out.push(buf); buf = ""; } out.push(ch); continue; }
      buf += ch;
    }
    if (buf) out.push(buf);
    return out;
  }
  function glue(a, b) {
    return CJK.test(a.charAt(a.length - 1)) && CJK.test(b.charAt(0)) ? "" : " ";
  }
  /* Rough advance width: CJK glyphs are full width, the rest scale with `k`. */
  function measure(str, fs, k) {
    var w = 0;
    for (var i = 0; i < str.length; i++) w += CJK.test(str.charAt(i)) ? fs : fs * k;
    return w;
  }
  function greedy(toks, maxW, fs, k) {
    var lines = [], line = "", i, next;
    for (i = 0; i < toks.length; i++) {
      next = line ? line + glue(line, toks[i]) + toks[i] : toks[i];
      if (line && measure(next, fs, k) > maxW) { lines.push(line); line = toks[i]; }
      else line = next;
    }
    if (line) lines.push(line);
    return lines;
  }
  /* Wrap to the given width, then even out the lines so the last one is never
     left with a single orphan word or glyph. */
  function wrapPx(str, maxW, fs, k) {
    var toks = tokenize(str);
    var lines = greedy(toks, maxW, fs, k);
    if (lines.length > 1) {
      var even = greedy(toks, measure(str, fs, k) / lines.length * 1.06, fs, k);
      if (even.length === lines.length) lines = even;
    }
    return lines;
  }

  /* Vertical room the accent peak block needs above its marker. */
  function peakMetrics(w, narrow, fs, peak, topMin) {
    var pfs = narrow ? Math.max(19, w * 0.055) : Math.max(22, Math.min(34, w * 0.023));
    var maxW = narrow ? w * 0.66 : Math.max(w * 0.32, 320);
    var lines = wrapPx(peak.name.toUpperCase(), maxW, pfs, 0.78);
    var subFs = narrow ? 9.5 : fs;
    var lineH = pfs * 1.14;
    var stem = narrow ? 44 : 54;
    var above = stem + subFs + 12 + pfs * 1.15 + (lines.length - 1) * lineH;
    return { pfs: pfs, lines: lines, subFs: subFs, lineH: lineH, stem: stem, above: above, need: above + pfs * 0.85 + topMin };
  }

  /* Shift a label group horizontally so it never leaves the viewport. */
  function clampGroup(g, min, max, keepX) {
    var box;
    try { box = g.getBBox(); } catch (e) { return; }
    var dx = 0;
    if (box.x < min) dx = min - box.x;
    else if (box.x + box.width > max) dx = max - (box.x + box.width);
    if (!dx) return;
    var nodes = g.querySelectorAll("text"), i;
    for (i = 0; i < nodes.length; i++) nodes[i].setAttribute("x", parseFloat(nodes[i].getAttribute("x")) + dx);
    if (keepX !== undefined) return;
    var marks = g.querySelectorAll("line, circle");
    for (i = 0; i < marks.length; i++) {
      var n = marks[i];
      if (n.tagName === "line") {
        n.setAttribute("x1", parseFloat(n.getAttribute("x1")) + dx);
        n.setAttribute("x2", parseFloat(n.getAttribute("x2")) + dx);
      } else {
        n.setAttribute("cx", parseFloat(n.getAttribute("cx")) + dx);
      }
    }
  }

  function renderInfographic(t) {
    var host = $("infographic-root");
    if (!host) return;
    if (host.__igObs) { host.__igObs.disconnect(); host.__igObs = null; }
    clear(host);

    var g = t.infographic, steps = g.steps, peak = g.peak;

    var block = el("div", { class: "ig-block" });
    var head = el("div", { class: "ig-head reveal" }, [el("div", { class: "ig-eyebrow" }, [g.eyebrow])]);
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "ig-chart");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", g.alt);
    block.appendChild(head);
    block.appendChild(svg);
    host.appendChild(block);

    var geo = null, valueAt = null;
    var curGroup = null, curLine = null, curDot = null, curRead = null;

    function build() {
      var w = svg.clientWidth || block.clientWidth;
      var h = svg.clientHeight || block.clientHeight;
      if (!w || !h) return;

      while (svg.firstChild) svg.removeChild(svg.firstChild);
      svg.setAttribute("viewBox", "0 0 " + w + " " + h);

      var narrow = w <= 760;
      var padL = narrow ? 34 : Math.max(64, w * 0.075);
      var padR = narrow ? 26 : Math.max(96, w * 0.15);
      var baseY = h - (narrow ? 62 : 74);
      var fs = narrow ? 9.5 : Math.max(10, Math.min(13, w * 0.0088));
      /* The accent block has to clear both the eyebrow and the fixed nav that
         floats over the section while the page scrolls past it. */
      var nav = document.getElementById("nav-root");
      var navH = nav ? nav.getBoundingClientRect().height : 68;
      var topMin = Math.max(head.offsetTop + head.offsetHeight + 14, navH + 18);
      var pk = peakMetrics(w, narrow, fs, peak, topMin);
      var topPad = Math.max(pk.need, h * 0.28);
      var ampl = baseY - topPad;
      var stepX = (w - padL - padR) / 4;

      var fracAt = makeInterp(FRACS);
      var valAt = makeInterp(VALUES);
      var xs = [], ys = [], i;
      for (i = 0; i < 5; i++) { xs.push(padL + i * stepX); ys.push(baseY - ampl * FRACS[i]); }

      geo = { w: w, padL: padL, stepX: stepX, baseY: baseY, ampl: ampl, fracAt: fracAt, fs: fs };
      valueAt = function (x) {
        var tt = (x - padL) / stepX;
        if (tt < 0) tt = 0;
        if (tt > 4) tt = 4;
        return valAt(tt);
      };

      var defs = E("defs", {});
      defs.innerHTML =
        '<filter id="igGlow" x="-140%" y="-140%" width="380%" height="380%">' +
          '<feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>' +
        "</filter>" +
        '<linearGradient id="igFill" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="' + CO.terra + '" stop-opacity="0.16"/>' +
          '<stop offset="60%" stop-color="' + CO.terra + '" stop-opacity="0.05"/>' +
          '<stop offset="100%" stop-color="' + CO.terra + '" stop-opacity="0"/>' +
        "</linearGradient>";
      svg.appendChild(defs);

      /* Curve samples: the modelled range plus a flat shelf to the right edge. */
      var pts = [], tt;
      for (tt = 0; tt <= 4.0001; tt += 0.02) pts.push([padL + tt * stepX, baseY - ampl * fracAt(tt)]);
      var tailEnd = w - 6;
      pts.push([tailEnd, ys[4]]);

      var dCurve = "M " + pts.map(function (p) { return p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" L ");
      var dFill = dCurve + " L " + tailEnd.toFixed(1) + " " + baseY.toFixed(1) + " L " + padL.toFixed(1) + " " + baseY.toFixed(1) + " Z";
      svg.appendChild(E("path", { d: dFill, fill: "url(#igFill)", stroke: "none" }));

      svg.appendChild(E("line", { x1: 0, y1: baseY, x2: w, y2: baseY, stroke: CO.hair, "stroke-width": 1.2 }));
      svg.appendChild(E("line", { x1: padL, y1: topPad - 24, x2: padL, y2: baseY, stroke: CO.hair, "stroke-width": 1, opacity: 0.7 }));

      var axisFs = narrow ? 9 : fs - 0.5;
      var yLabY = topPad + Math.min(120, ampl * 0.42);
      var yLab = text(g.axisY + " →", { x: padL - 13, y: yLabY, "class": "ig-axis", "font-size": axisFs, "text-anchor": "start" });
      yLab.setAttribute("transform", "rotate(-90 " + (padL - 13) + " " + yLabY + ")");
      svg.appendChild(yLab);
      svg.appendChild(text(g.axisX + " →", { x: padL, y: baseY + (narrow ? 40 : 46), "class": "ig-axis", "font-size": axisFs, "text-anchor": "start" }));

      for (i = 0; i < 5; i++) {
        svg.appendChild(E("line", { x1: xs[i], y1: baseY, x2: xs[i], y2: baseY + 6, stroke: CO.hair, "stroke-width": 1.2, opacity: i === 4 ? 1 : 0.7 }));
        svg.appendChild(text(String(i + 1), { x: xs[i], y: baseY + 20, "class": "ig-step", "font-size": narrow ? 9 : fs, "text-anchor": "middle" }));
      }

      svg.appendChild(E("path", { d: dCurve, fill: "none", stroke: CO.paperSoft, "stroke-width": 1.6, opacity: 0.68, "stroke-linecap": "round", "stroke-linejoin": "round" }));

      /* Accent peak. */
      var peakX = xs[4], peakY = ys[4];
      var peakAnchor = narrow ? "end" : "middle";
      var peakTextX = narrow ? w - 14 : peakX;
      var pg = E("g", {});
      var subY = peakY - pk.stem;
      var valY2 = subY - pk.subFs - 12;
      var lastLineY = valY2 - pk.pfs * 1.15;
      var topLineY = lastLineY - (pk.lines.length - 1) * pk.lineH;

      pg.appendChild(E("line", { x1: peakX, y1: peakY - 16, x2: peakX, y2: subY + 8, stroke: CO.terra, "stroke-width": 1.4, opacity: 0.75 }));
      for (i = 0; i < pk.lines.length; i++) {
        pg.appendChild(text(pk.lines[i], { x: peakTextX, y: topLineY + i * pk.lineH, "class": "ig-peak", "font-size": pk.pfs, "text-anchor": peakAnchor }));
      }
      pg.appendChild(text(peak.value, { x: peakTextX, y: valY2, "class": "ig-peakval", "font-size": pk.pfs * 0.88, "text-anchor": peakAnchor }));
      pg.appendChild(text(peak.sub, { x: peakTextX, y: subY, "class": "ig-peaksub", "font-size": pk.subFs, "text-anchor": peakAnchor, "letter-spacing": "0.04em" }));
      svg.appendChild(pg);
      clampGroup(pg, 12, w - 12, peakX);

      var peakBox = null;
      try { peakBox = pg.getBBox(); } catch (e) { peakBox = null; }

      svg.appendChild(E("circle", { cx: peakX, cy: peakY, r: 15, fill: CO.terra, opacity: 0.26, filter: "url(#igGlow)" }));
      svg.appendChild(E("circle", { cx: peakX, cy: peakY, r: 10, fill: CO.terra, filter: "url(#igGlow)" }));
      svg.appendChild(E("circle", { cx: peakX, cy: peakY, r: 5, fill: CO.clay }));

      /* Muted labels for the first four steps. */
      var blocks = [], li;
      for (i = 0; i < 4; i++) {
        var lines = wrapPx(steps[i].name, stepX - 14, fs, 0.62);
        var wide = measure(steps[i].value, fs, 0.62);
        for (li = 0; li < lines.length; li++) wide = Math.max(wide, measure(lines[li], fs, 0.62));
        blocks.push({ lines: lines, w: wide, h: (lines.length + 1) * (fs + 4) });
      }
      var crowded = false;
      for (i = 0; i < 3; i++) {
        if (xs[i] + blocks[i].w / 2 + 10 > xs[i + 1] - blocks[i + 1].w / 2) crowded = true;
      }

      for (i = 0; i < 4; i++) {
        var b = blocks[i];
        var lift = (crowded && i % 2 === 1) ? b.h + 14 : 0;
        var valY = ys[i] - 20 - lift;
        var firstY = valY - b.lines.length * (fs + 4);

        /* A label that would run into the accent block drops under the curve. */
        var below = false;
        if (peakBox) {
          var l = xs[i] - b.w / 2, r = xs[i] + b.w / 2;
          if (r > peakBox.x - 10 && l < peakBox.x + peakBox.width + 10 && firstY - fs < peakBox.y + peakBox.height + 10) below = true;
        }
        if (below) {
          firstY = ys[i] + 26;
          valY = firstY + b.lines.length * (fs + 4);
        }

        var lg = E("g", {});
        lg.appendChild(E("line", {
          x1: xs[i], y1: below ? ys[i] + 7 : ys[i] - 7,
          x2: xs[i], y2: below ? firstY - 11 : valY + 5,
          stroke: CO.paperSoft, "stroke-width": 0.8, opacity: 0.3,
        }));
        for (li = 0; li < b.lines.length; li++) {
          lg.appendChild(text(b.lines[li], { x: xs[i], y: firstY + li * (fs + 4), "class": "ig-cname", "font-size": fs, "text-anchor": "middle" }));
        }
        lg.appendChild(text(steps[i].value, { x: xs[i], y: valY, "class": "ig-cval", "font-size": fs, "text-anchor": "middle" }));
        lg.appendChild(E("circle", { cx: xs[i], cy: ys[i], r: 3.4, fill: CO.paper, opacity: 0.85 }));
        svg.appendChild(lg);
        clampGroup(lg, 10, w - 10);
      }

      /* Hover cursor. */
      curGroup = E("g", { opacity: 0 });
      curGroup.style.transition = "opacity .18s ease";
      curLine = E("line", { x1: 0, y1: 0, x2: 0, y2: baseY, stroke: CO.paper, "stroke-width": 1, "stroke-dasharray": "2 4", opacity: 0.42 });
      curDot = E("circle", { cx: 0, cy: baseY, r: 3.2, fill: CO.paper, opacity: 0.9 });
      curRead = text("", { x: 0, y: 0, "class": "ig-read", "font-size": fs + 2, "text-anchor": "start" });
      curGroup.appendChild(curLine);
      curGroup.appendChild(curDot);
      curGroup.appendChild(curRead);
      svg.appendChild(curGroup);
    }

    function pointerX(evt) {
      var r = svg.getBoundingClientRect();
      return (evt.touches ? evt.touches[0].clientX : evt.clientX) - r.left;
    }
    function moveCursor(x) {
      if (!geo || !curGroup) return;
      x = Math.max(geo.padL, Math.min(geo.w - 8, x));
      var tt = Math.max(0, Math.min(4, (x - geo.padL) / geo.stepX));
      var y = geo.baseY - geo.ampl * geo.fracAt(tt);
      curLine.setAttribute("x1", x);
      curLine.setAttribute("x2", x);
      curLine.setAttribute("y1", y);
      curDot.setAttribute("cx", x);
      curDot.setAttribute("cy", y);
      /* The readout sits under the curve so it never runs into the labels. */
      var readX = x + 9, flip = readX + 52 > geo.w - 8;
      curRead.setAttribute("text-anchor", flip ? "end" : "start");
      curRead.setAttribute("x", flip ? x - 9 : readX);
      curRead.setAttribute("y", Math.min(geo.baseY - 8, y + geo.fs + 12));
      curRead.textContent = "×" + valueAt(x).toFixed(2);
      curGroup.setAttribute("opacity", 1);
    }

    svg.addEventListener("pointermove", function (e) { moveCursor(pointerX(e)); });
    svg.addEventListener("pointerleave", function () { if (curGroup) curGroup.setAttribute("opacity", 0); });
    svg.addEventListener("touchmove", function (e) { moveCursor(pointerX(e)); }, { passive: true });

    var rebuildTimer;
    host.__igObs = new ResizeObserver(function () { clearTimeout(rebuildTimer); rebuildTimer = setTimeout(build, 80); });
    host.__igObs.observe(svg);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
    build();
  }

  window.SITE_SECTIONS = window.SITE_SECTIONS || {};
  window.SITE_SECTIONS.infographic = renderInfographic;
})();
