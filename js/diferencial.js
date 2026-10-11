/* BLOCO 5 · DIFERENCIAL
   Esquerda: o fluxo "organizado" vira um emaranhado de blocos/IFs/ELSEs conforme a seção passa (scrub).
   Direita: o seletor de tipo de produto. Ao entrar na tela o "clique" acontece sozinho e o funil aparece pronto,
   passo a passo; o visitante pode trocar o tipo e ver o funil se refazer.
   Reduzido/sem JS: emaranhado já embaraçado e funil digital completo; o seletor continua funcionando (sem animação). */
(function () {
  var DRS = (window.DRS = window.DRS || {});
  var sec = document.getElementById("diferencial");
  if (!sec) return;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var gsapOK = !!(window.gsap && window.ScrollTrigger);

  /* ---------- seletor de tipo de produto (funciona sempre) ---------- */
  var picker = $("[data-picker]", sec), opts = $$("[role=radio]", picker);
  var cks = $$(".fs-ck", picker), texts = $$(".fs-t", picker), titleCk = $(".funnel-title svg", picker);
  var s5 = $("[data-step5]", picker), s6 = $("[data-step6]", picker);
  var LAST = { digital: ["Pagamento", "Entrega"], fisico: ["Pagamento", "Envio"], entrega: ["Pedido", "Envio"] };
  var current = "digital";

  function paint(type) {
    current = type;
    opts.forEach(function (b) {
      var on = b.getAttribute("data-type") === type;
      b.setAttribute("aria-checked", on ? "true" : "false");
      b.tabIndex = on ? 0 : -1;
    });
    s5.textContent = LAST[type][0]; s6.textContent = LAST[type][1];
  }
  function fill(animate) {                       /* o funil "monta" passo a passo */
    if (!animate) { gsap && gsap.set([cks, texts, titleCk], { clearProps: "all" }); return; }
    gsap.killTweensOf([cks, texts, titleCk]);
    gsap.set(cks, { scale: 0 }); gsap.set(texts, { opacity: .35, x: -4 }); gsap.set(titleCk, { scale: 0 });
    var tl = gsap.timeline();
    tl.to(cks, { scale: 1, duration: .45, ease: "back.out(2.4)", stagger: .1 }, 0)
      .to(texts, { opacity: 1, x: 0, duration: .5, ease: "expo.out", stagger: .1 }, 0)
      .to(titleCk, { scale: 1, duration: .5, ease: "back.out(3)" }, ".7");
    return tl;
  }
  function choose(type, user) {
    if (type === current && user) return;
    paint(type);
    fill(gsapOK && !reduce.matches);
  }
  opts.forEach(function (b) {
    b.addEventListener("click", function () { choose(b.getAttribute("data-type"), true); });
    b.addEventListener("keydown", function (e) {
      var i = opts.indexOf(b), n = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") n = opts[(i + 1) % opts.length];
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = opts[(i - 1 + opts.length) % opts.length];
      if (n) { e.preventDefault(); n.focus(); choose(n.getAttribute("data-type"), true); }
    });
  });

  /* ---------- emaranhado ---------- */
  var svg = $("[data-tangle]", sec), nodes = [], edges = [];
  if (svg) {
    nodes = $$(".tg-node", svg).map(function (g, i) {
      var tx = +g.getAttribute("data-tx"), ty = +g.getAttribute("data-ty"), tr = +g.getAttribute("data-tr");
      var col = i % 4, row = Math.floor(i / 4);
      return { g: g, tx: tx, ty: ty, tr: tr, ox: 90 + col * 100, oy: 55 + row * 83, x: tx, y: ty, r: tr, d: (i / 16) * .3 };
    });
    edges = $$(".tg-edge", svg).map(function (p) {
      var a = +p.getAttribute("data-a"), b = +p.getAttribute("data-b");
      return { p: p, a: a, b: b, chain: b === a + 1 };
    });
  }
  function smooth(x, a, b) { var t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
  function renderTangle(p) {
    nodes.forEach(function (n) {
      var q = smooth((p - n.d) / (1 - n.d), 0, 1);
      n.x = n.ox + (n.tx - n.ox) * q; n.y = n.oy + (n.ty - n.oy) * q; n.r = n.tr * q;
      n.g.setAttribute("transform", "translate(" + n.x.toFixed(1) + " " + n.y.toFixed(1) + ") rotate(" + n.r.toFixed(1) + ")");
    });
    var show = smooth(p, .2, .6);
    edges.forEach(function (e) {
      var A = nodes[e.a], B = nodes[e.b], cx = Math.min(120, Math.abs(B.x - A.x) * .5 + 30);
      e.p.setAttribute("d", "M" + A.x.toFixed(1) + " " + A.y.toFixed(1) + " C" + (A.x + cx).toFixed(1) + " " + A.y.toFixed(1) + "," + (B.x - cx).toFixed(1) + " " + B.y.toFixed(1) + "," + B.x.toFixed(1) + " " + B.y.toFixed(1));
      e.p.style.opacity = e.chain ? 1 : show;
    });
  }

  DRS.blocks.diferencial = {
    mount: function (mm) {
      mm.add("(prefers-reduced-motion: no-preference)", function () {
        var contrast = $("[data-contrast]", sec);
        /* esquerda: organizado -> emaranhado, preso ao scroll */
        var st = { p: 0 };
        renderTangle(0);
        gsap.to(st, { p: 1, ease: "none", onUpdate: function () { renderTangle(st.p); },
          scrollTrigger: { trigger: contrast, start: "top 78%", end: "center 38%", scrub: .6 } });

        /* direita: o "clique" automático e o funil montando */
        paint("digital");
        opts.forEach(function (b) { b.setAttribute("aria-checked", "false"); });
        gsap.set(cks, { scale: 0 }); gsap.set(texts, { opacity: .35, x: -4 }); gsap.set(titleCk, { scale: 0 });
        var first = opts[0];
        gsap.timeline({ scrollTrigger: { trigger: picker, start: "top 70%", once: true } })
          .to(first, { scale: .95, duration: .12, ease: "power2.out" }, .5)
          .to(first, { scale: 1, duration: .3, ease: "back.out(3)" }, .62)
          .add(function () { paint("digital"); fill(true); }, .6);

        return function () { paint("digital"); renderTangle(1); gsap.set([cks, texts, titleCk, first], { clearProps: "all" }); };
      });
    }
  };
})();
