/* BLOCO 2 · O PROBLEMA
   Desktop: a seção fixa (pin ≤ 1,9× a altura da viewport), os 4 cartões se cobrem em scrub e a "verdade dura"
   aparece palavra a palavra no fim. Mobile/baixo: fluxo normal, cada cartão entra ao rolar.
   Micro: sublinhado vermelho desenha ao entrar; hover = inclinação 3D leve (só mouse).
   Reduzido/sem JS: coluna estática, tudo visível. */
(function () {
  var DRS = (window.DRS = window.DRS || {});
  var sec = document.getElementById("problema");
  if (!sec) return;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var cards = $$("[data-card]", sec), vigs = cards.map(function (c) { return $(".vig", c); });
  var uls = cards.map(function (c) { return $(".ul-err", c); });
  var truth = $("[data-truth]", sec), pre = $(".truth-pre", sec), post = $(".truth-post", sec), big = $("[data-truth-big]", sec);
  var dots = $$(".pdots i", sec);
  var words = null;
  function splitTruth() {
    if (!words) {
      big.setAttribute("aria-label", big.textContent);
      words = DRS.splitWords(big);
      $$(".w", big).forEach(function (w) { w.setAttribute("aria-hidden", "true"); });
    }
    return words;
  }

  function setActive(idx) { vigs.forEach(function (v, i) { DRS.vigSet(v, i === idx); }); }

  /* inclinação 3D leve, só com mouse; devolve a função de limpeza */
  function tilt() {
    var offs = [];
    cards.forEach(function (c) {
      var inn = $(".pcard-in", c);
      var rx = gsap.quickTo(inn, "rotationX", { duration: .6, ease: "power3.out" });
      var ry = gsap.quickTo(inn, "rotationY", { duration: .6, ease: "power3.out" });
      function mv(e) {
        if (e.pointerType !== "mouse") return;
        var r = inn.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - .5) * 5);
        rx(-((e.clientY - r.top) / r.height - .5) * 4);
      }
      function lv() { rx(0); ry(0); }
      c.addEventListener("pointermove", mv); c.addEventListener("pointerleave", lv);
      offs.push(function () { c.removeEventListener("pointermove", mv); c.removeEventListener("pointerleave", lv); });
    });
    return function () { offs.forEach(function (f) { f(); }); };
  }

  DRS.blocks.problem = {
    mount: function (mm) {
      mm.add({
        full: "(prefers-reduced-motion: no-preference) and (min-width: 900px) and (min-height: 600px)",
        flow: "(prefers-reduced-motion: no-preference) and (max-width: 899px), (prefers-reduced-motion: no-preference) and (max-height: 599px)"
      }, function (ctx) {
        var w = splitTruth(), offTilt = tilt();
        gsap.set(uls, { "--ul": "0%" });
        gsap.set(w, { opacity: .1, y: 14 });

        if (false && ctx.conditions.full) {
          var pin = $("[data-pin]", sec), nav = parseFloat(getComputedStyle(document.documentElement).fontSize) * 4.25;
          sec.classList.add("is-stacked");
          gsap.set(cards.slice(1), { y: 130, autoAlpha: 0, scale: .97 });
          gsap.set([pre, post], { opacity: 0, y: 16 });
          gsap.set(truth, { opacity: 0 });

          var starts = [1.5, 3.4, 5.3], END = 10, lastIdx = -2;
          var tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: pin, start: "top " + nav + "px", end: function () { return "+=" + Math.round(innerHeight * 1.9); },
              pin: true, scrub: .5, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 3
            },
            onUpdate: function () {
              var t = tl.time(), idx = t >= 7.1 ? -1 : t >= 5.3 ? 3 : t >= 3.4 ? 2 : t >= 1.5 ? 1 : 0;
              if (idx !== lastIdx) {
                lastIdx = idx; setActive(idx);
                dots.forEach(function (d, i) { d.classList.toggle("on", i === idx); });
              }
            }
          });
          starts.forEach(function (s, n) {
            var i = n + 1;
            /* o cartão que chega é opaco desde o primeiro frame: cobre o anterior sem transparência (texto nunca se sobrepõe) */
            tl.set(cards[i], { autoAlpha: 1 }, s)
              .to(cards[i], { y: 0, scale: 1, duration: .9, ease: "power2.out" }, s);
            for (var k = 0; k < i; k++) {
              tl.to(cards[k], { scale: 1 - .035 * (i - k), y: -16 * (i - k), duration: .9, ease: "power2.out" }, s);
            }
            tl.to(uls[i], { "--ul": "100%", duration: .5, ease: "power1.out" }, s + .45);
          });
          tl.to(cards, { autoAlpha: 0, duration: .45, ease: "power2.in" }, 7)
            .to(truth, { opacity: 1, duration: .3 }, 7.45)
            .to(pre, { opacity: 1, y: 0, duration: .5, ease: "power2.out" }, 7.5)
            .to(w, { opacity: 1, y: 0, duration: .3, stagger: .16, ease: "power1.out" }, 8)
            .to(post, { opacity: 1, y: 0, duration: .4, ease: "power2.out" }, 9.5)
            .set({}, {}, END);

          /* sublinhado do primeiro cartão desenha quando a pilha entra na tela */
          gsap.to(uls[0], { "--ul": "100%", duration: .8, ease: "power2.out", delay: .2, scrollTrigger: { trigger: pin, start: "top 80%", once: true } });

          return function () { sec.classList.remove("is-stacked"); offTilt(); setActive(-1); };
        }

        /* fluxo: sem pin */
        cards.forEach(function (c, i) {
          gsap.from($(".pcard-in", c), { y: 40, opacity: 0, duration: .9, ease: "expo.out", scrollTrigger: { trigger: c, start: "top 88%", once: true } });
          gsap.to(uls[i], { "--ul": "100%", duration: .8, ease: "power2.out", delay: .3, scrollTrigger: { trigger: c, start: "top 80%", once: true } });
          ScrollTrigger.create({ trigger: c, start: "top 85%", end: "bottom 15%", onToggle: function (s) { DRS.vigSet(vigs[i], s.isActive); } });
        });
        gsap.set([pre, post], { opacity: 0, y: 16 });
        gsap.to(pre, { opacity: 1, y: 0, duration: .8, ease: "power2.out", scrollTrigger: { trigger: pre, start: "top 88%", once: true } });
        gsap.to(w, { opacity: 1, y: 0, stagger: .12, ease: "none", scrollTrigger: { trigger: big, start: "top 85%", end: "bottom 55%", scrub: true } });
        gsap.to(post, { opacity: 1, y: 0, duration: .8, ease: "power2.out", scrollTrigger: { trigger: post, start: "top 92%", once: true } });
        return function () { offTilt(); setActive(-1); };
      });
    }
  };
})();
