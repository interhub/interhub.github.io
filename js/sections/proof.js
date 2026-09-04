/* Proof strip section: lead line + stat band. */
(function () {
  "use strict";

  var UI = window.SITE_UI;
  var el = UI.el, clear = UI.clear, $ = UI.$;

  /* Splits "100+ agents and harnesses" into an emphasised number and the rest. */
  function leadParts(it) {
    var tail = " · " + it.qualifier;
    var m = /^(\d[^\s]*)\s*([\s\S]*)$/.exec(it.lead);
    if (!m) return [it.lead + tail];
    return [el("span", { class: "proof__num" }, [m[1]]), (m[2] ? " " + m[2] : "") + tail];
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
          el("p", { class: "mono proof__line" }, leadParts(it)),
        ])
      );
    });
    inner.appendChild(band);
    host.appendChild(inner);
  }

  window.SITE_SECTIONS = window.SITE_SECTIONS || {};
  window.SITE_SECTIONS.proof = renderProof;
})();
