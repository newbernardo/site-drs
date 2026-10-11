/* BLOCO 4 · COMO FUNCIONA
   A seção fixa (pin = 2× a viewport) e um único celular conta o funil inteiro em scrub:
   anúncio → toque em "Enviar mensagem" → conversa (qualifica, vende, objeção) → comprovativo → confirmação → entrega.
   O trilho à esquerda acompanha (passo ativo abre, passos feitos ficam preenchidos) e os passos são clicáveis.
   Reduzido/sem JS: 5 passos abertos + celular na pose final. */
(function () {
  var DRS = (window.DRS = window.DRS || {});
  var sec = document.getElementById("como-funciona");
  if (!sec) return;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var steps = $$("[data-step]", sec), track = $("[data-track]", sec), ad = $("[data-ad]", sec), cta = $("[data-adcta]", sec);
  var note = $("[data-note]", sec), whoLabel = $("[data-who-label]", sec), steps_el = $("[data-steps]", sec);
  var ms = $$("[data-m]", track), tys = $$("[data-ty]", track);
  var waitEl = $(".sys-wait", sec), okEl = $(".sys-ok", sec), chip = $(".sys-chip", sec);

  DRS.blocks.como = {
    mount: function (mm) {
      mm.add("(prefers-reduced-motion: no-preference) and (min-height: 560px)", function () {
        var pin = $("[data-how-pin]", sec), nav = parseFloat(getComputedStyle(document.documentElement).fontSize) * 4.25;
        var measure = function () { DRS.chat.measure(track); };
        measure(); ScrollTrigger.addEventListener("refreshInit", measure);

        sec.classList.add("is-pinned");
        DRS.chat.hideAll(track);
        gsap.set(okEl, { display: "none" });
        var END = 10, lastIdx = -1;
        var who = ["Quem faz: Você", "Quem faz: O sistema"];

        function setStep(idx) {
          steps.forEach(function (s, i) { s.classList.toggle("is-active", i === idx); s.classList.toggle("is-done", i < idx); });
          var label = idx === 0 ? who[0] : who[1];
          if (whoLabel.textContent !== label) {
            whoLabel.textContent = label;
            gsap.fromTo(whoLabel, { y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: .35, ease: "expo.out", overwrite: true });
          }
        }

        var tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: pin, start: "top " + nav + "px", end: function () { return "+=" + Math.round(innerHeight * 2); },
            pin: true, scrub: .5, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 1
          },
          /* no onUpdate da timeline (e não do ScrollTrigger): continua rodando enquanto o scrub alcança o scroll */
          onUpdate: function () {
            var t = tl.time(), idx = Math.min(4, Math.floor(t / 2));
            steps_el.style.setProperty("--fill", Math.min(1, Math.max(0, t / (END - 1))));
            if (idx !== lastIdx) { lastIdx = idx; setStep(idx); }
          }
        });

        /* PASSO 1: anúncio e toque no botão */
        gsap.set(ad, { display: "flex" });
        tl.fromTo(ad, { autoAlpha: 1, scale: 1 }, { autoAlpha: 1, scale: 1, duration: .01 }, 0)
          .to(cta, { scale: .93, duration: .12, ease: "power2.out" }, 1.1)
          .to(cta, { scale: 1, duration: .25, ease: "back.out(3)" }, 1.22)
          .to(ad, { autoAlpha: 0, scale: .96, duration: .4, ease: "power2.inOut" }, 1.55);

        /* PASSO 2: atende e qualifica */
        DRS.chat.reveal(tl, track, ms[0], 2.1);
        DRS.chat.reveal(tl, track, ms[1], 2.5, { typing: .4, typingEl: tys[0] });
        DRS.chat.reveal(tl, track, ms[2], 3.2);
        DRS.chat.reveal(tl, track, ms[3], 3.5, { typing: .4, typingEl: tys[1] });

        /* PASSO 3: apresenta, objeção, conduz */
        DRS.chat.reveal(tl, track, ms[4], 4.05, { typing: .35, typingEl: tys[2] });
        DRS.chat.reveal(tl, track, ms[5], 4.8);
        DRS.chat.reveal(tl, track, ms[6], 5.1, { typing: .35, typingEl: tys[3] });
        DRS.chat.reveal(tl, track, ms[7], 5.75);

        /* PASSO 4: pagamento e confirmação */
        DRS.chat.reveal(tl, track, ms[8], 6.05, { typing: .3, typingEl: tys[4] });
        DRS.chat.reveal(tl, track, ms[9], 6.7);
        tl.set(waitEl, { display: "inline-flex" }, 7.1);
        DRS.chat.reveal(tl, track, ms[10], 7.1);
        tl.set(waitEl, { display: "none" }, 7.6).set(okEl, { display: "inline-flex" }, 7.6)
          .fromTo(chip, { scale: .94 }, { scale: 1, duration: .5, ease: "back.out(3)" }, 7.6);

        /* PASSO 5: entrega e follow-up */
        DRS.chat.reveal(tl, track, ms[11], 8.05, { typing: .3, typingEl: tys[5] });
        tl.fromTo(note, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .5, ease: "expo.out" }, 9.1)
          .set({}, {}, END);

        /* cliques nos passos: rolam até o trecho da história */
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
          ScrollTrigger.removeEventListener("refreshInit", measure);
          offs.forEach(function (f) { f(); });
          steps.forEach(function (s) { s.classList.remove("is-active", "is-done"); });
          steps_el.style.removeProperty("--fill");
        };
      });
    }
  };
})();
