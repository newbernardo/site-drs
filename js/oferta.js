/* BLOCO 11 · OFERTA, VALOR E PLANOS
   Valores contam ao entrar (utilitário [data-counter]); ao chegar em "uma única subscrição" os custos são riscados,
   um a um. Planos entram em cascata; o Scale é destacado só pelo desenho (sem rótulo inventado).
   Reduzido/sem JS: valores finais, nada riscado. */
(function () {
  var DRS = (window.DRS = window.DRS || {});
  var anchor = document.querySelector("[data-anchor]");
  if (!anchor) return;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  DRS.blocks.oferta = {
    mount: function (mm) {
      mm.add("(prefers-reduced-motion: no-preference)", function () {
        var rows = $$("[data-costs] li", anchor), sub = $("[data-sub]", anchor);
        gsap.set(rows, { "--strike": 0 }); gsap.set(sub, { opacity: 0, y: 20 });
        var tl = gsap.timeline({ scrollTrigger: { trigger: sub, start: "top 85%", once: true } });
        rows.forEach(function (r, i) { tl.fromTo(r, { "--strike": 0 }, { "--strike": 1, duration: .5, ease: "power2.inOut" }, i * .3); });
        tl.to(rows, { opacity: .7, duration: .4 }, ">-.2").to(sub, { opacity: 1, y: 0, duration: .9, ease: "expo.out" }, ">-.3");
      });
    }
  };
})();
