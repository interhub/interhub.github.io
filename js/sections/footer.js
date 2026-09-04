/* Site footer: name/year and back-to-top link. */
(function () {
  "use strict";

  var UI = window.SITE_UI;
  var el = UI.el, clear = UI.clear, $ = UI.$;

  function renderFooter(t) {
    var host = $("footer-root");
    clear(host);
    host.appendChild(el("div", { class: "section__inner footer__inner" }, [
      el("span", { class: "mono footer__name" }, [t.footer.name + " · " + new Date().getFullYear()]),
      el("a", { class: "mono footer__back", href: "#top" }, [t.footer.backToTop]),
    ]));
  }

  window.SITE_SECTIONS = window.SITE_SECTIONS || {};
  window.SITE_SECTIONS.footer = renderFooter;
})();
