/* BLOCO 3 · A VIRADA — SCROLL CONTÍNUO, SEM PIN
   Parte A (oportunidade): a cadeia de 7 verbos acende como lâmpadas rapidamente, e os 3 "NÃO"
   também acendem, de modo que quando a seção chega ao centro da tela TUDO já esteja aceso.
   Tudo reversível (sobe e desce).
   Parte B (solução): o halo cresce, as negações são riscadas e os pilares contam 01-02-03.
   Movimento reduzido / sem JS: conteúdo visível (CSS). */
(function () {
  var DRS = (window.DRS = window.DRS || {});
  var sec = document.getElementById("oportunidade");
  var sol = document.getElementById("solucao");
  if (!sec || !sol) return;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var nots = $$("[data-not]", sec);
  var chain = $("[data-chain]", sec);
  var nodes = chain ? $$("li", chain) : [];
  var res = $(".turn-result", sec);

  DRS.blocks = DRS.blocks || {};

  DRS.blocks.turn = {
    mount: function (mm) {
      mm.add("(prefers-reduced-motion: no-preference)", function () {

        /* =============================================
           PARTE A · OPORTUNIDADE
           ============================================= */

        /* Estado inicial */
        gsap.set(nots, { "--lit": 0 });
        gsap.set(nodes, { "--lit": 0 });
        if (chain) gsap.set(chain, { "--fill": 0 });
        if (res) gsap.set(res, { opacity: 0, y: 16 });

        /* 1) CADEIA DOS 7 VERBOS — lâmpadas, rápido, termina antes do centro */
        if (chain && nodes.length) {
          var steps = nodes.length;
          gsap.set(nodes, { "--lit": 0 });
          gsap.set(chain, { "--fill": 0 });

          var chainTL = gsap.timeline({
            scrollTrigger: {
              trigger: chain,
              start: "top 95%",
              end: "top 45%",
              scrub: 0.2,
              invalidateOnRefresh: true
            }
          });

          nodes.forEach(function (node, i) {
            var step = i + 1;
            chainTL.fromTo(node,
              { "--lit": 0 },
              { "--lit": 1, duration: 0.01, ease: "none" },
              i * 0.18
            );
            chainTL.fromTo(chain,
              { "--fill": i / steps },
              { "--fill": step / steps, duration: 0.01, ease: "none" },
              i * 0.18
            );
          });
        }

        /* 2) OS 3 "NÃO" — lâmpadas, logo depois dos verbos, terminando antes do centro */
        if (nots.length) {
          gsap.set(nots, { "--lit": 0 });

          var notsTL = gsap.timeline({
            scrollTrigger: {
              trigger: nots[0],
              start: "top 95%",
              end: "top 50%",
              scrub: 0.2,
              invalidateOnRefresh: true
            }
          });

          nots.forEach(function (n, i) {
            notsTL.fromTo(n,
              { "--lit": 0 },
              { "--lit": 1, duration: 0.01, ease: "none" },
              i * 0.3
            );
          });
        }

        /* 3) RESULTADO — aparece depois que os "NÃO" acenderam */
        if (res) {
          gsap.fromTo(res,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, ease: "none",
              scrollTrigger: { trigger: res, start: "top 90%", end: "top 55%", scrub: 0.3, invalidateOnRefresh: true }
            });
        }

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
