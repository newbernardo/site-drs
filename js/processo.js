/* BLOCO 7 · O PROCESSO NÃO PARA
   Follow-up: diagrama de duas faixas (Cliente / Sistema), estático. Pagamentos: abas animadas para os 3 cenários; cada aba roda uma conversa
   (comprovativo → confirmação → entrega / dados → processo de envio no painel do vendedor).
   Reduzido/sem JS: os 3 cenários aparecem um abaixo do outro, completos. */
(function () {
  var DRS = (window.DRS = window.DRS || {});
  var fu = document.getElementById("follow-up"), scen = document.querySelector("[data-scen]");
  if (!fu && !scen) return;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var gsapOK = !!(window.gsap && window.ScrollTrigger);

  /* ---------- abas (funcionam sempre) ---------- */
  var tabs = [], panels = [], tlCache = new WeakMap(), played = false;
  if (scen) {
    tabs = $$("[role=tab]", scen); panels = $$("[data-panel]", scen);
    var ind = $(".tab-ind", scen);
    scen.classList.add("is-tabs");
    var moveInd = function () {
      var b = tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0]; if (!b || !ind) return;
      ind.style.width = b.offsetWidth + "px"; ind.style.transform = "translateX(" + (b.offsetLeft - 4) + "px)";
    };
    var show = function (i, user) {
      tabs.forEach(function (t, k) { t.setAttribute("aria-selected", k === i ? "true" : "false"); t.tabIndex = k === i ? 0 : -1; });
      panels.forEach(function (p, k) { p.hidden = k !== i; });
      moveInd();
      play(panels[i], user);
    };
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { show(i, true); });
      t.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight") n = (i + 1) % tabs.length; else if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
        if (n !== null) { e.preventDefault(); tabs[n].focus(); show(n, true); }
      });
    });
    panels.forEach(function (p, k) { p.hidden = k !== 0; });
    window.addEventListener("resize", moveInd);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveInd);
    moveInd();
  }

  function build(panel) {
    var track = $("[data-track]", panel), ms = $$("[data-m]", track), ty = $$("[data-ty]", track), order = $("[data-order]", panel);
    DRS.chat.measure(track); DRS.chat.hideAll(track);
    var chip = $(".sys-chip", track), wait = chip && $(".sys-wait", chip), ok = chip && $(".sys-ok", chip);
    var tl = gsap.timeline({ paused: true }), idx = panels.indexOf(panel);
    if (order) tl.set(order, { autoAlpha: 0, y: 16 }, 0);
    function chipRun(at) {
      DRS.chat.reveal(tl, track, chip, at);
      tl.set(wait, { display: "inline-flex" }, at).set(ok, { display: "none" }, at)
        .set(wait, { display: "none" }, at + 1).set(ok, { display: "inline-flex" }, at + 1)
        .fromTo(chip, { scale: .94 }, { scale: 1, duration: .5, ease: "back.out(3)" }, at + 1);
    }
    if (idx === 0) {                      /* digital */
      DRS.chat.reveal(tl, track, ms[0], .3); chipRun(.9);
      DRS.chat.reveal(tl, track, ms[2], 2.4, { typing: .5, typingEl: ty[0] });
      DRS.chat.reveal(tl, track, ms[3], 3.4);
    } else if (idx === 1) {               /* físico */
      chipRun(.3);
      DRS.chat.reveal(tl, track, ms[1], 1.6, { typing: .5, typingEl: ty[0] });
      DRS.chat.reveal(tl, track, ms[2], 3);
    } else {                              /* pagamento na entrega */
      DRS.chat.reveal(tl, track, ms[0], .3);
      DRS.chat.reveal(tl, track, ms[1], 1, { typing: .5, typingEl: ty[0] });
      DRS.chat.reveal(tl, track, ms[2], 2.6);
    }
    if (order) {
      var at = idx === 1 ? 4 : 3.7;
      tl.to(order, { autoAlpha: 1, y: 0, duration: .7, ease: "expo.out" }, at)
        .from($$("li", order), { opacity: 0, x: -8, duration: .5, ease: "expo.out", stagger: .12 }, at + .2)
        .from($(".order-s", order), { opacity: 0, y: 6, duration: .5, ease: "expo.out" }, at + .8);
    }
    return tl;
  }
  function play(panel, user) {
    if (!gsapOK || reduce.matches || !panel) return;
    var tl = tlCache.get(panel);
    if (!tl) { tl = build(panel); tlCache.set(panel, tl); }
    if (!user && played) return;
    tl.restart();
    gsap.fromTo(panel, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .5, ease: "expo.out", overwrite: true });
  }

  DRS.blocks.processo = {
    mount: function (mm) {
      /* diagrama do follow-up, preso ao scroll */
      /* cenários: toca o primeiro quando a seção entra na tela */
      if (scen) {
        mm.add("(prefers-reduced-motion: no-preference)", function () {
          ScrollTrigger.create({ trigger: scen, start: "top 85%", once: true, onEnter: function () { play(panels[0], false); played = true; } });
          /* se a janela ainda estiver acima, o primeiro painel começa vazio (pose é preparada ao tocar) */
        });
      }
    }
  };
})();
