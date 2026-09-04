/* About section: bio copy + photo tile grid. */
(function () {
  "use strict";

  var UI = window.SITE_UI;
  var el = UI.el, clear = UI.clear, $ = UI.$;
  var kitIllu = UI.kitIllu;
  var S = window.SITE_STATIC;

  /* Tile image that opens full screen on click; click anywhere or Esc closes it. */
  function photoTile(src, alt) {
    var img = el("img", { src: src, alt: alt, loading: "lazy", decoding: "async" });
    img.addEventListener("click", function () { openLightbox(src, alt); });
    return img;
  }

  function openLightbox(src, alt) {
    var box = el("div", { class: "photo-lightbox", role: "dialog", "aria-label": alt }, [
      el("img", { src: src, alt: alt }),
    ]);
    function close() {
      box.remove();
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    }
    function onKey(e) { if (e.key === "Escape") close(); }
    box.addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    document.body.appendChild(box);
  }

  function renderAboutTiles(t) {
    var tiles = el("div", { class: "about__tiles reveal" });
    S.photos.forEach(function (src, i) {
      tiles.appendChild(
        el("figure", { class: "about__tile" }, [
          el("div", { class: "about__tile-frame" }, [
            photoTile(src, t.photos.caption + " " + (i + 1)),
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
          el("p", { class: "mono about__facts" }, [
            t.about.facts,
            " · ",
            el("a", {
              class: "about__facts-link",
              href: "https://www.instagram.com/stepan_turchenko/",
              target: "_blank",
              rel: "noopener noreferrer",
            }, ["Instagram"]),
          ]),
          el("p", { class: "mono about__facts" }, [t.about.interests]),
        ]),
      ]),
    ]));
  }

  window.SITE_SECTIONS = window.SITE_SECTIONS || {};
  window.SITE_SECTIONS.about = renderAbout;
})();
