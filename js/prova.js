/* BLOCO 10 · PROVA REAL
   Números contam ao entrar (utilitário [data-counter]); a demonstração acende os 6 passos do funil em sincronia
   com os nós do painel (placeholder). Reduzido/sem JS: tudo aceso e com os valores finais. */
(function () {
  var DRS = (window.DRS = window.DRS || {});
  var demo = document.querySelector("[data-demo]");
  if (!demo) return;
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  DRS.blocks.prova = {
    mount: function (mm) {
      mm.add("(prefers-reduced-motion: no-preference)", function () {
        var items = $$("[data-w]", demo), nodes = $$("[data-n]", demo);
        nodes.forEach(function (n) { n.classList.remove("on"); });
        gsap.set(items, { "--lit": 0 });
        var tl = gsap.timeline({ scrollTrigger: { trigger: $$(".watch", demo)[0], start: "top 92%", once: true } });
        items.forEach(function (it, i) {
          tl.fromTo(it, { "--lit": 0 }, { "--lit": 1, duration: .5, ease: "power2.out" }, i * .55)
            .call(function () { if (nodes[i]) nodes[i].classList.add("on"); }, null, i * .55);
        });
        return function () { nodes.forEach(function (n) { n.classList.add("on"); }); };
      });
    }
  };
})();
