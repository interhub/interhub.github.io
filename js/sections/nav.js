/* Top nav bar (renderNav) and mobile menu overlay (renderMobileMenu). */
(function () {
  "use strict";

  var UI = window.SITE_UI;
  var el = UI.el, clear = UI.clear, $ = UI.$;
  var S = window.SITE_STATIC;

  var lastT = null;

  function renderNav(t) {
    lastT = t;
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
          class: "lang__btn" + (lng.code === t.meta.lang ? " is-active" : ""),
          type: "button",
          "data-lang": lng.code,
        }, [lng.label]);
        btn.addEventListener("click", function () { window.SITE_APP.setLang(lng.code); });
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
    lastT = t;
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
          class: "lang__btn" + (lng.code === t.meta.lang ? " is-active" : ""),
          type: "button",
        }, [lng.label]);
        b.addEventListener("click", function () { window.SITE_APP.setLang(lng.code); closeMenu(); });
        return b;
      })
    ));
    host.appendChild(panel);
  }

  function toggleMenu() {
    var menu = $("mobile-menu");
    menu.getAttribute("data-open") === "true" ? closeMenu() : openMenu();
  }
  function openMenu() {
    $("mobile-menu").setAttribute("data-open", "true");
    document.body.classList.add("menu-open");
    var b = document.querySelector(".nav__burger");
    if (b && lastT) { b.setAttribute("aria-expanded", "true"); b.setAttribute("aria-label", lastT.nav.menuClose); }
  }
  function closeMenu() {
    $("mobile-menu").setAttribute("data-open", "false");
    document.body.classList.remove("menu-open");
    var b = document.querySelector(".nav__burger");
    if (b && lastT) { b.setAttribute("aria-expanded", "false"); b.setAttribute("aria-label", lastT.nav.menuOpen); }
  }

  window.SITE_SECTIONS = window.SITE_SECTIONS || {};
  window.SITE_SECTIONS.nav = renderNav;
  window.SITE_SECTIONS.nav.closeMenu = closeMenu;
})();
