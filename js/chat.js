/* Componente "chat simulado": helpers de animação (Blocos 2, 4, 6, 7). O markup (css/chat.css) já traz a pose final.
   - pop(): balão que entra
   - measure()/reveal(): conversa que cresce em scrub; o que já estava no chat sobe suavemente (FLIP) quando entra um novo balão.
     Itens do chat levam [data-m]; indicadores de "digitando" levam [data-ty]. */
(function () {
  var DRS = (window.DRS = window.DRS || {});
  var H = new WeakMap();

  DRS.chat = {
    pop: function (tl, el, at) {
      var out = el.classList && el.classList.contains("out");
      tl.fromTo(el,
        { opacity: 0, y: 10, scale: .96, transformOrigin: out ? "100% 100%" : "0% 100%" },
        { opacity: 1, y: 0, scale: 1, duration: .45, ease: "expo.out" }, at);
      return tl;
    },

    /* mede a altura (com o gap) de cada balão no estado natural; chamar antes de criar a timeline e a cada refresh */
    measure: function (track) {
      var els = Array.prototype.slice.call(track.querySelectorAll("[data-m],[data-ty]"));
      var prev = els.map(function (e) { return e.style.display; });
      els.forEach(function (e) { e.style.display = ""; });
      var gap = parseFloat(getComputedStyle(track).rowGap) || 0;
      /* [data-ty] é display:none por CSS; mede forçando flex */
      els.forEach(function (e) {
        var ty = e.hasAttribute("data-ty");
        if (ty) e.style.display = "inline-flex";
        H.set(e, e.offsetHeight + gap);
        if (ty) e.style.display = "";
      });
      els.forEach(function (e, i) { e.style.display = prev[i]; });
    },

    /* esconde tudo: estado inicial da conversa */
    hideAll: function (track) {
      /* guarda o display natural de cada balão (grid/flex/block) para o reveal() devolver certo */
      Array.prototype.forEach.call(track.querySelectorAll("[data-m]"), function (e) {
        if (!e.hasAttribute("data-display")) { var d = getComputedStyle(e).display; if (d && d !== "none") e.setAttribute("data-display", d); }
      });
      gsap.set(track.querySelectorAll("[data-m],[data-ty]"), { display: "none" });
    },

    /* revela um balão em `at` (opcional: balão de "digitando" antes, por `o.typing` segundos) */
    reveal: function (tl, track, el, at, o) {
      o = o || {};
      var out = el.classList.contains("out"), origin = out ? "100% 100%" : "0% 100%", t = at;
      var disp = el.getAttribute("data-display") || "block";
      var ty = o.typing ? o.typingEl : null;
      if (ty) {
        tl.set(ty, { display: "inline-flex" }, t)
          .fromTo(track, { y: function () { return H.get(ty) || 0; } }, { y: 0, duration: .35, ease: "expo.out" }, t)
          .fromTo(ty, { opacity: 0, scale: .9, transformOrigin: origin }, { opacity: 1, scale: 1, duration: .3, ease: "expo.out" }, t);
        t += o.typing;
        tl.set(ty, { display: "none" }, t);
      }
      tl.set(el, { display: disp }, t)
        .fromTo(track, { y: function () { return Math.max(0, (H.get(el) || 0) - (ty ? (H.get(ty) || 0) : 0)); } }, { y: 0, duration: .4, ease: "expo.out" }, t)
        .fromTo(el, { opacity: 0, y: 10, scale: .96, transformOrigin: origin }, { opacity: 1, y: 0, scale: 1, duration: .45, ease: "expo.out" }, t);
      return t + .45;
    }
  };
})();
