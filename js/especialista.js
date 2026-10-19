/* BLOCO 6 · O ESPECIALISTA
   Chatbot x agente: duas conversas rodam lado a lado; a do bot trava, a do agente chega ao pagamento.
   Multimídia: estática (imagem do celular + lista de formatos acesa).
   As 6 capacidades entram em cascata (utilitário [data-reveal-group]). Reduzido/sem JS: conversas completas, lista apagada. */
(function () {
  var DRS = (window.DRS = window.DRS || {});
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var vs = $("[data-vs]");
  if (!vs) return;

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

          var tl = gsap.timeline({ scrollTrigger: { trigger: vs, start: "top 90%", once: true } });
          var bot = $$("[data-m]", tracks[0]);
          bot.forEach(function (m, i) { DRS.chat.reveal(tl, tracks[0], m, .4 + i * .8); });

          var ag = $$("[data-m]", tracks[1]), ty = $$("[data-ty]", tracks[1]);
          DRS.chat.reveal(tl, tracks[1], ag[0], .4);
          DRS.chat.reveal(tl, tracks[1], ag[1], 1.2, { typing: .55, typingEl: ty[0] });
          DRS.chat.reveal(tl, tracks[1], ag[2], 2.7);
          DRS.chat.reveal(tl, tracks[1], ag[3], 3.3, { typing: .45, typingEl: ty[1] });
          DRS.chat.reveal(tl, tracks[1], ag[4], 4.4);
          DRS.chat.reveal(tl, tracks[1], ag[5], 5.4);
          DRS.chat.reveal(tl, tracks[1], ag[6], 6.0, { typing: .55, typingEl: ty[2] });
          DRS.chat.reveal(tl, tracks[1], ag[7], 7.5);
          DRS.chat.reveal(tl, tracks[1], ag[8], 8.1, { typing: .45, typingEl: ty[3] });
        }

        return function () { offs.forEach(function (f) { f(); }); };
      });
    }
  };
})();
