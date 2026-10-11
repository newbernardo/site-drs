/* BLOCO 3 · A VIRADA
   Parte A (oportunidade): estática, sem animação.
   Parte B (solução): o halo cresce, as negações são riscadas e os pilares contam 01-02-03.
   Movimento reduzido / sem JS: conteúdo visível (CSS). */
(function () {
  var DRS = (window.DRS = window.DRS || {});
  var sec = document.getElementById("oportunidade");
  var sol = document.getElementById("solucao");
  if (!sec || !sol) return;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  DRS.blocks = DRS.blocks || {};

  DRS.blocks.turn = {
    mount: function (mm) {
      mm.add("(prefers-reduced-motion: no-preference)", function () {

        /* =============================================
           PARTE B · SOLUÇÃO
           ============================================= */

        var wake = $(".wake", sol);
        if (wake) {
          gsap.fromTo(wake,
            { scale: 0.35, opacity: 0 },
            { scale: 1.15, opacity: 1, ease: "none",
              scrollTrigger: { trigger: sol, start: "top 85%", end: "top 10%", scrub: 0.5, invalidateOnRefresh: true }
            });
        }

        var pillars = $("[data-pillars]", sol);
        var cols = pillars ? $$("li", pillars) : [];
        if (pillars && cols.length) {
          gsap.set(cols, { opacity: 0, y: 32 });
          gsap.to(cols, {
            opacity: 1,
            y: 0,
            duration: .9,
            ease: "expo.out",
            stagger: .18,
            scrollTrigger: { trigger: pillars, start: "top 82%", once: true }
          });
        }
      });
    }
  };
})();
