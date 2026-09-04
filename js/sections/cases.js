/* Projects and companies grid (cases / work section). */
(function () {
  "use strict";

  var UI = window.SITE_UI;
  var el = UI.el, clear = UI.clear, $ = UI.$;
  var casesPhotoWrap = UI.casesPhotoWrap, projectTitle = UI.projectTitle;
  var projectStars = UI.projectStars, projectStarCount = UI.projectStarCount, projectStarClass = UI.projectStarClass;

  function renderCases(t) {
    var host = $("cases-root");
    clear(host);
    var c = t.cases;

    var inner = el("div", { class: "section__inner cases__inner" }, [
      el("span", { class: "section-index", "data-fill": "", "aria-hidden": "true" }, ["05"]),
      el("div", { class: "cases__intro" }, [
        el("div", { class: "cases__intro-copy" }, [
          el("p", { class: "eyebrow" }, [c.sectionTitle]),
          el("h2", { class: "headline", "data-splitting": "" }, [c.headline]),
          el("p", { class: "lead-body cases__lead" }, [c.lead]),
        ]),
        casesPhotoWrap(
          c.photoNote,
          "cases__figure",
          "cases__video",
          [
            { src: "./assets/video/work-vibe.webm", type: "video/webm" },
            { src: "./assets/video/work-vibe.mp4", type: "video/mp4" },
          ],
          "./assets/video/work-vibe-poster.webp"
        ),
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
      el("p", { class: "credential__text" }, [c.credential.text]),
    ]));
    host.appendChild(inner);
  }

  window.SITE_SECTIONS = window.SITE_SECTIONS || {};
  window.SITE_SECTIONS.cases = renderCases;
})();
