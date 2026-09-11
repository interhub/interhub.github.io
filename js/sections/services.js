/* Services section: offer grid, trust strip and the Telegram CTA. */
(function () {
  "use strict";

  var UI = window.SITE_UI;
  var el = UI.el, clear = UI.clear, $ = UI.$;
  var kitIllu = UI.kitIllu;

  var ILLU_KEYS = ["laptop", "rocket", "code", "terminal"];

  /* Header illustration is optional: only a key that really ships in the
     visual kit is drawn, otherwise the header stays text-only. */
  function headIllu() {
    var kit = window.KIT_ILLUS || {};
    for (var i = 0; i < ILLU_KEYS.length; i++) {
      if (kit[ILLU_KEYS[i]]) return kitIllu(ILLU_KEYS[i], "md", "services__illu reveal");
    }
    return null;
  }

  /* Card id doubles as the anchor target used by ad quick links. */
  function renderCard(card) {
    return el("article", { class: "services__card reveal", id: card.id }, [
      el("p", { class: "mono services__kicker" }, [card.kicker]),
      el("h3", { class: "services__card-title" }, [card.title]),
      el("p", { class: "lead-body services__card-body" }, [card.body]),
      el("p", { class: "mono services__who" }, [card.who]),
    ]);
  }

  function renderServices(t) {
    var host = $("services-root");
    clear(host);
    var s = t.services;

    var head = [
      el("span", { class: "section-index", "data-fill": "", "aria-hidden": "true" }, ["03"]),
      el("p", { class: "eyebrow" }, [s.index]),
    ];
    var illu = headIllu();
    if (illu) head.push(illu);
    head.push(
      el("h2", { class: "headline services__headline", "data-splitting": "" }, [
        s.headlineBefore,
        el("span", { class: "services__hl-mark", "data-rn": "underline" }, [s.headlineAccent]),
        s.headlineAfter,
      ])
    );
    head.push(el("p", { class: "lead-body services__lead" }, [s.lead]));

    var inner = el("div", { class: "section__inner services__inner" }, head);

    inner.appendChild(el("div", { class: "services__grid" }, s.cards.map(renderCard)));

    inner.appendChild(
      el("div", { class: "services__trust" }, s.trust.map(function (item) {
        return el("div", { class: "services__trust-cell reveal" }, [
          el("p", { class: "mono services__trust-line" }, [item]),
        ]);
      }))
    );

    inner.appendChild(
      el("a", {
        class: "btn btn--primary services__cta",
        href: "https://t.me/Stepan_Turchenko",
        target: "_blank",
        rel: "noopener",
        "data-goal": "tg_click",
      }, [s.cta])
    );

    inner.appendChild(el("p", { class: "mono services__note" }, [s.note]));
    host.appendChild(inner);
  }

  window.SITE_SECTIONS = window.SITE_SECTIONS || {};
  window.SITE_SECTIONS.services = renderServices;
})();
