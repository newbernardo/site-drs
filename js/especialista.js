/* BLOCO 6 · O ESPECIALISTA
   Chatbot x agente: duas conversas rodam lado a lado; a do bot trava, a do agente chega ao pagamento.
   Multimídia: o chat mostra texto, áudio (onda), imagem, vídeo e PDF, e a lista de formatos acende em sincronia.
   As 6 capacidades entram em cascata (utilitário [data-reveal-group]). Reduzido/sem JS: conversas completas, lista apagada. */
(function () {
  var DRS = (window.DRS = window.DRS || {});
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var vs = $("[data-vs]"), mm = $("[data-mm]");
  if (!vs && !mm) return;

  DRS.blocks.especialista = {
    mount: function (mm_) {
      mm_.add("(prefers-reduced-motion: no-preference)", function () {
        var offs = [];

        /* ---- chatbot x agente ---- */
        if (vs) {
          var tracks = $$("[data-track]", vs);
          var measure = function () { tracks.forEach(function (t) { DRS.chat.measure(t); }); };
          measure(); ScrollTrigger.addEventListener("refreshInit", measure); offs.push(function () { ScrollTrigger.removeEventListener("refreshInit", measure); });
          tracks.forEach(function (t) { DRS.chat.hideAll(t); });

          var tl = gsap.timeline({ scrollTrigger: { trigger: vs, start: "top 72%", once: true } });
          var bot = $$("[data-m]", tracks[0]);
          bot.forEach(function (m, i) { DRS.chat.reveal(tl, tracks[0], m, .4 + i * .8); });

          var ag = $$("[data-m]", tracks[1]), ty = $$("[data-ty]", tracks[1]);
          DRS.chat.reveal(tl, tracks[1], ag[0], .4);
          DRS.chat.reveal(tl, tracks[1], ag[1], 1.2, { typing: .55, typingEl: ty[0] });
          DRS.chat.reveal(tl, tracks[1], ag[2], 2.7);
          DRS.chat.reveal(tl, tracks[1], ag[3], 3.3, { typing: .55, typingEl: ty[1] });
          DRS.chat.reveal(tl, tracks[1], ag[4], 4.9);
          DRS.chat.reveal(tl, tracks[1], ag[5], 5.7, { typing: .55, typingEl: ty[2] });
        }

        /* ---- multimídia ---- */
        if (mm) {
          var track = $("[data-track]", mm), items = $$("[data-m]", track), chips = $$("[data-f]", $("[data-formats]", mm));
          var meas = function () { DRS.chat.measure(track); };
          meas(); ScrollTrigger.addEventListener("refreshInit", meas); offs.push(function () { ScrollTrigger.removeEventListener("refreshInit", meas); });
          DRS.chat.hideAll(track);
          chips.forEach(function (c) { c.classList.remove("on"); });
          var on = function (f) { chips.forEach(function (c) { c.classList.toggle("on", c.getAttribute("data-f") === f); }); };

          var tl2 = gsap.timeline({ scrollTrigger: { trigger: mm, start: "top 70%", once: true } });
          var bars = $$(".wave i", track);
          items.forEach(function (m, i) {
            var at = .5 + i * 1.15;
            DRS.chat.reveal(tl2, track, m, at);
            tl2.call(on, [m.getAttribute("data-f")], at);
          });
          tl2.call(function () { chips.forEach(function (c) { c.classList.add("on"); }); }, null, .5 + items.length * 1.15);
          /* onda do áudio "tocando" */
          tl2.to(bars, { scaleY: "random(.35, 1.1)", duration: .22, ease: "sine.inOut", stagger: { each: .03, repeat: 7, yoyo: true } }, .5 + 1.15 + .3);
        }

        return function () { offs.forEach(function (f) { f(); }); };
      });
    }
  };
})();
