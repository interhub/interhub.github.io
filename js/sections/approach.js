/* AI-integration approach section: compact header, the agent-harness map
   (SVG wires + HTML nodes) and the collapsible task-run strip. */
(function () {
  "use strict";

  var UI = window.SITE_UI;
  var el = UI.el, clear = UI.clear, $ = UI.$;

  var NS = "http://www.w3.org/2000/svg";
  var STAGE_DELAY = 0.62;
  var TICK_MIN_WIDTH = 900;
  var mapObserver = null;
  var resizeBound = false;
  var activeMap = null;

  function svgEl(tag, attrs) {
    var node = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  function node(kind, data, isolatedLabel) {
    var parts = [
      el("span", { class: "hnode__label" }, [data.label]),
      el("span", { class: "hnode__note mono" }, [data.note]),
    ];
    if (isolatedLabel) parts.unshift(el("span", { class: "hnode__ctx mono" }, [isolatedLabel]));
    return el("div", { class: "hnode hnode--" + kind, "data-hnode": kind }, parts);
  }

  /* Curved connector between two boxes: side to side on wide layouts,
     top to bottom once the columns stack. */
  function edgePath(a, b) {
    var d;
    if (b.x >= a.x + a.w - 4) {
      var x1 = a.x + a.w, y1 = a.y + a.h / 2, x2 = b.x, y2 = b.y + b.h / 2;
      var mx = (x1 + x2) / 2;
      d = "M" + x1 + " " + y1 + " C" + mx + " " + y1 + " " + mx + " " + y2 + " " + x2 + " " + y2;
    } else {
      var vx1 = a.x + a.w / 2, vy1 = a.y + a.h, vx2 = b.x + b.w / 2, vy2 = b.y;
      var my = (vy1 + vy2) / 2;
      d = "M" + vx1 + " " + vy1 + " C" + vx1 + " " + my + " " + vx2 + " " + my + " " + vx2 + " " + vy2;
    }
    return d;
  }

  function drawWires(host) {
    if (!host || !host.isConnected) return;
    var svg = host.querySelector(".hmap__wires");
    var rail = host.querySelector(".hmap__rail");
    if (!svg || !rail) return;
    var box = host.getBoundingClientRect();
    var w = Math.round(box.width), h = Math.round(box.height);
    if (!w || !h) return;

    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    var rel = function (node) {
      var r = node.getBoundingClientRect();
      return { x: r.left - box.left, y: r.top - box.top, w: r.width, h: r.height };
    };
    var pick = function (sel) { return Array.prototype.map.call(host.querySelectorAll(sel), rel); };

    var input = pick('[data-hnode="in"]')[0];
    var main = pick('[data-hnode="main"]')[0];
    var subs = pick('[data-hnode="sub"]');
    var gate = pick('[data-hnode="gate"]')[0];
    var out = pick('[data-hnode="out"]')[0];
    if (!input || !main || !gate || !out || !subs.length) return;

    var wires = [{ d: edgePath(input, main), stage: 0 }];
    subs.forEach(function (s) {
      wires.push({ d: edgePath(main, s), stage: 1 });
      wires.push({ d: edgePath(s, gate), stage: 2 });
    });
    wires.push({ d: edgePath(gate, out), stage: 3 });

    wires.forEach(function (wire) { svg.appendChild(svgEl("path", { d: wire.d, class: "hmap__wire" })); });

    if (w >= TICK_MIN_WIDTH) {
      var railY = rel(rail).y;
      [input, main, gate, out].concat(subs).forEach(function (r) {
        var x = Math.round(r.x + r.w / 2);
        if (r.y + r.h >= railY) return;
        svg.appendChild(svgEl("path", { d: "M" + x + " " + railY + " V" + (r.y + r.h), class: "hmap__tick" }));
      });
    }

    wires.forEach(function (wire) {
      var pulse = svgEl("path", { d: wire.d, class: "hmap__pulse", pathLength: "100" });
      pulse.style.animationDelay = (wire.stage * STAGE_DELAY).toFixed(2) + "s";
      svg.appendChild(pulse);
    });
  }

  function watchMap(host) {
    activeMap = host;
    if (window.ResizeObserver) {
      if (mapObserver) mapObserver.disconnect();
      mapObserver = new ResizeObserver(function () { drawWires(activeMap); });
      mapObserver.observe(host);
    }
    if (!resizeBound) {
      resizeBound = true;
      window.addEventListener("resize", function () { drawWires(activeMap); });
    }
    requestAnimationFrame(function () { drawWires(host); });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { drawWires(activeMap); });
    }
  }

  function buildMap(m) {
    var wires = svgEl("svg", { class: "hmap__wires", "aria-hidden": "true", focusable: "false", preserveAspectRatio: "none" });

    var fan = el("div", { class: "hmap__stage hmap__stage--fan" });
    m.agents.forEach(function (agent) { fan.appendChild(node("sub", agent, m.isolated)); });

    var flow = el("div", { class: "hmap__flow" }, [
      el("div", { class: "hmap__stage hmap__stage--in" }, [node("in", m.input)]),
      el("div", { class: "hmap__stage hmap__stage--main" }, [node("main", m.main)]),
      fan,
      el("div", { class: "hmap__stage hmap__stage--gate" }, [node("gate", m.gate)]),
      el("div", { class: "hmap__stage hmap__stage--out" }, [node("out", m.output)]),
    ]);

    var busItems = el("ul", { class: "hmap__bus-items" });
    m.bus.forEach(function (it) {
      busItems.appendChild(el("li", { class: "hmap__bus-item" }, [
        el("span", { class: "hmap__bus-label mono" }, [it.label]),
        el("span", { class: "hmap__bus-note" }, [it.note]),
      ]));
    });

    var bus = el("div", { class: "hmap__bus" }, [
      el("div", { class: "hmap__rail" }, [el("span", { class: "hmap__rail-label mono" }, [m.busTitle])]),
      busItems,
    ]);

    return el("div", { class: "hmap" }, [wires, flow, bus]);
  }

  function buildRun(item, idx, labels) {
    var chain = el("ol", { class: "run__chain" });
    item.steps.forEach(function (step) { chain.appendChild(el("li", { class: "run__step mono" }, [step])); });

    var ratio = item.manualMin > 0 ? (item.agentMin / item.manualMin) * 100 : 100;
    var row = function (mod, label, value, pct) {
      return el("div", { class: "run__row run__row--" + mod }, [
        el("span", { class: "run__row-label mono" }, [label]),
        el("span", { class: "run__bar" }, [el("span", { class: "run__fill", style: "width:" + pct + "%" })]),
        el("span", { class: "run__val mono" }, [value]),
      ]);
    };

    return el("article", { class: "run reveal" }, [
      el("div", { class: "run__top" }, [
        el("span", { class: "run__num mono" }, ["0" + (idx + 1)]),
        el("span", { class: "run__area mono" }, [item.area]),
      ]),
      chain,
      el("div", { class: "run__times" }, [
        row("manual", labels.manualLabel, item.manual, 100),
        row("agent", labels.agentLabel, item.agent, Math.max(4, Math.round(ratio))),
      ]),
    ]);
  }

  function buildDetail(item) {
    return el("article", { class: "run-detail reveal" }, [
      el("span", { class: "run-detail__area mono" }, [item.area]),
      el("p", { class: "run-detail__before" }, [item.before]),
      el("p", { class: "run-detail__after" }, [item.after]),
      el("p", { class: "run-detail__more mono" }, [item.more]),
    ]);
  }

  function renderApproach(t) {
    var host = $("approach-root");
    var a = t.approach;
    clear(host);
    host.appendChild(el("div", { class: "section__bg", "aria-hidden": "true" }, [el("div", { class: "section__bg-duotone" })]));

    var head = el("div", { class: "approach__head" }, [
      el("div", { class: "approach__head-main" }, [
        el("p", { class: "eyebrow" }, [a.index]),
        el("h2", { class: "headline approach__headline", "data-splitting": "" }, [
          a.headlineBefore,
          el("span", { class: "approach__hl-mark", "data-rn": "underline" }, [a.headlineAccent]),
          a.headlineAfter,
        ]),
      ]),
      el("p", { class: "lead-body approach__lead reveal" }, [a.lead]),
    ]);

    var inner = el("div", { class: "section__inner approach__inner" }, [
      el("span", { class: "section-index", "data-fill": "", "aria-hidden": "true" }, ["03"]),
      head,
    ]);

    var map = buildMap(a.map);
    inner.appendChild(el("div", { class: "approach__block approach__block--map" }, [
      el("div", { class: "approach__block-head reveal" }, [
        el("h3", { class: "approach__block-title" }, [a.map.title]),
        el("p", { class: "approach__block-caption mono" }, [a.map.caption]),
      ]),
      map,
    ]));

    var runGrid = el("div", { class: "run-strip__grid" });
    a.runs.items.forEach(function (item, idx) { runGrid.appendChild(buildRun(item, idx, a.runs)); });
    inner.appendChild(el("div", { class: "approach__block approach__block--runs" }, [
      el("div", { class: "approach__block-head reveal" }, [
        el("h3", { class: "approach__block-title" }, [a.runs.title]),
        el("p", { class: "approach__block-caption mono" }, [a.runs.caption]),
      ]),
      runGrid,
    ]));

    var details = el("div", { class: "run-details" });
    a.runs.items.forEach(function (item) { details.appendChild(buildDetail(item)); });
    var moreInner = el("div", { class: "approach__more-inner" }, [details]);
    var more = el("div", { class: "approach__more" }, [moreInner]);
    moreInner.querySelectorAll(".reveal").forEach(function (n) { n.classList.add("is-in"); });

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
    watchMap(map);
  }

  window.SITE_SECTIONS = window.SITE_SECTIONS || {};
  window.SITE_SECTIONS.approach = renderApproach;
})();
