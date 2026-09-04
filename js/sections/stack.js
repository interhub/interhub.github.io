/* Tech stack grid and technical management blurb. */
(function () {
  "use strict";

  var UI = window.SITE_UI;
  var el = UI.el, clear = UI.clear, $ = UI.$;
  var kitIllu = UI.kitIllu;

  function renderStack(t) {
    var host = $("stack-root");
    clear(host);
    var inner = el("div", { class: "section__inner stack__inner" }, [
      el("span", { class: "section-index", "data-fill": "", "aria-hidden": "true" }, ["04"]),
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
    inner.appendChild(el("p", { class: "mono stack__cert stack__cert--note" }, [t.stack.note]));
    inner.appendChild(el("p", { class: "mono stack__cert stack__cert--note" }, [t.stack.hackathon]));
    inner.appendChild(kitIllu("waveDivider", "divider", "stack__divider"));
    host.appendChild(inner);
  }

  window.SITE_SECTIONS = window.SITE_SECTIONS || {};
  window.SITE_SECTIONS.stack = renderStack;
})();
