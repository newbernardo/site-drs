/* BLOCO 4 · COMO FUNCIONA
   A seção fixa (pin = 2× a viewport) e, ao rolar, os 5 passos abrem um a um à esquerda
   (passo ativo abre, passos feitos ficam preenchidos, passos são clicáveis). As duas imagens à direita ficam estáticas.
   Reduzido / sem JS / telas estreitas: 5 passos abertos. */
(function () {
  var DRS = (window.DRS = window.DRS || {});
  var sec = document.getElementById("como-funciona");
  if (!sec) return;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var steps = $$("[data-step]", sec), steps_el = $("[data-steps]", sec);

  DRS.blocks = DRS.blocks || {};
  DRS.blocks.como = {
    mount: function (mm) {
      mm.add("(prefers-reduced-motion: no-preference) and (min-height: 560px) and (min-width: 57rem)", function () {
        var pin = $("[data-how-pin]", sec), nav = parseFloat(getComputedStyle(document.documentElement).fontSize) * 4.25;
        sec.classList.add("is-pinned");
        var END = 10, lastIdx = -1;

        function setStep(idx) {
          steps.forEach(function (s, i) { s.classList.toggle("is-active", i === idx); s.classList.toggle("is-done", i < idx); });
        }

        var tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: pin, start: "top " + nav + "px", end: function () { return "+=" + Math.round(innerHeight * 2); },
            pin: true, scrub: .5, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 1
          },
          onUpdate: function () {
            var t = tl.time(), idx = Math.min(4, Math.floor(t / 2));
            steps_el.style.setProperty("--fill", Math.min(1, Math.max(0, t / (END - 1))));
            if (idx !== lastIdx) { lastIdx = idx; setStep(idx); }
          }
        });
        tl.set({}, {}, END);

        /* cliques nos passos: rolam até o trecho correspondente */
        var offs = [];
        steps.forEach(function (s, i) {
          var b = $(".step-btn", s);
          var fn = function () {
            var st = tl.scrollTrigger; if (!st) return;
            window.scrollTo({ top: st.start + (st.end - st.start) * ((i * 2 + .15) / END), behavior: "smooth" });
          };
          b.addEventListener("click", fn);
          offs.push(function () { b.removeEventListener("click", fn); });
        });
        setStep(0);

        return function () {
          sec.classList.remove("is-pinned");
          offs.forEach(function (f) { f(); });
          steps.forEach(function (s) { s.classList.remove("is-active", "is-done"); });
          steps_el.style.removeProperty("--fill");
        };
      });
    }
  };
})();
