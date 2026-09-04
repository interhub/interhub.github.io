/* Contact section: channel list + CTA. */
(function () {
  "use strict";

  var UI = window.SITE_UI;
  var el = UI.el, clear = UI.clear, $ = UI.$;
  var kitIllu = UI.kitIllu;
  var S = window.SITE_STATIC;

  function renderContact(t) {
    var host = $("contact-root");
    clear(host);
    host.appendChild(el("div", { class: "section__bg", "aria-hidden": "true" }, [el("div", { class: "section__bg-duotone" })]));

    var channels = el("ul", { class: "contact__channels" },
      S.channels.map(function (ch) {
        var label = ch.labelKey ? t.contact[ch.labelKey] : ch.label;
        var isExternal = ch.href.indexOf("http") === 0;
        return el("li", { class: "contact__channel" }, [
          el("span", { class: "mono contact__ch-label" }, [label]),
          el("a", {
            class: "contact__ch-value", href: ch.href,
            target: isExternal ? "_blank" : null,
            rel: isExternal ? "noopener" : null,
          }, [ch.value]),
        ]);
      })
    );

    host.appendChild(el("div", { class: "section__inner contact__inner" }, [
      el("span", { class: "section-index", "data-fill": "", "aria-hidden": "true" }, ["07"]),
      kitIllu("chat", "md", "contact__illu reveal"),
      el("h2", { class: "headline contact__headline", "data-splitting": "" }, [
        t.contact.headlineBefore,
        el("span", { class: "contact__hl-mark", "data-rn": "circle" }, [t.contact.headlineAccent]),
        t.contact.headlineAfter,
      ]),
      el("p", { class: "lead-body contact__subline" }, [t.contact.subline]),
      channels,
      el("a", { class: "btn btn--primary contact__cta", href: "mailto:stepanstepan4@gmail.com", "data-glitch-cta": "" }, [t.contact.cta]),
    ]));
  }

  window.SITE_SECTIONS = window.SITE_SECTIONS || {};
  window.SITE_SECTIONS.contact = renderContact;
})();
