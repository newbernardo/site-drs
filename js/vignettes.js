/* Vinhetas animadas (SVG + GSAP). Cada builder recebe o .vig e devolve { play, pause }.
   A pose estática do markup é o estado padrão (sem JS / movimento reduzido); aqui só se anima por cima. */
(function () {
  var DRS = (window.DRS = window.DRS || {});
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var NS = "http://www.w3.org/2000/svg";

  /* P1: funil que vaza */
  function funil(root) {
    var anim = $(".anim", root), ring = $(".q-ring", root), mark = $(".q-mark", root);
    root.classList.add("is-live");
    var N = 10, CYCLE = 5.2, tls = [];
    for (var i = 0; i < N; i++) {
      (function (i) {
        var c = document.createElementNS(NS, "circle");
        c.setAttribute("r", 4); c.setAttribute("class", "d-ok"); anim.appendChild(c);
        var x0 = 188 + (i * 17) % 46;
        c.setAttribute("cx", x0); c.setAttribute("cy", 14);
        var  kind = i % 5 === 0 ? "pass" : (i % 5 < 3 ? "g1" : "g2");
        var dir = i % 2 ? 1 : -1, tl = gsap.timeline({ repeat: -1, paused: true });
        tl.set(c, { attr: { cx: x0, cy: 14, class: "d-ok" }, opacity: 0 }, 0).to(c, { opacity: 1, duration: .25 }, 0);
        if (kind === "pass") {
          tl.to(c, { attr: { cy: 232 }, duration: 3.6, ease: "power1.in" }, 0).to(c, { opacity: 0, duration: .3 }, 3.3);
        } else {
          var gy = kind === "g1" ? 106 : 170, fall = kind === "g1" ? 1.5 : 2.5;
          tl.to(c, { attr: { cy: gy }, duration: fall, ease: "power1.in" }, 0)
            .set(c, { attr: { class: "d-leak" } }, fall)
            .to(c, { attr: { cx: x0 + dir * (kind === "g1" ? 92 : 62), cy: gy + 6 }, duration: .35, ease: "power2.out" }, fall)
            .to(c, { attr: { cy: 266 }, duration: 1, ease: "power2.in" }, fall + .3)
            .to(c, { opacity: 0, duration: .3 }, fall + 1);
        }
        tl.set({}, {}, CYCLE);
        tl.progress(i / N);
        tls.push(tl);
      })(i);
    }
    tls.push(gsap.fromTo(ring, { scale: 1, opacity: 1, svgOrigin: "210 246" }, { scale: 1.3, svgOrigin: "210 246", opacity: .45, duration: .9, yoyo: true, repeat: -1, ease: "sine.inOut", paused: true }));
    tls.push(gsap.fromTo(mark, { opacity: 1 }, { opacity: .55, duration: .9, yoyo: true, repeat: -1, ease: "sine.inOut", paused: true }));
    return {
      play: function () { tls.forEach(function (t) { t.play(); }); },
      pause: function () { tls.forEach(function (t) { t.pause(); }); }
    };
  }

  /* P2: WhatsApp banido */
  function ban(root) {
    var chat = $(".chat", root), track = $(".chat-track", root), msgs = $$(".msg", root), overlay = $(".ban", root), st = $(".chat-who small", root);
    var tl = gsap.timeline({ repeat: -1, repeatDelay: .2, paused: true });
    tl.set(chat, { opacity: 1, x: 0 }, 0).set(track, { opacity: 1 }, 0).set(overlay, { opacity: 0, scale: .96 }, 0)
      .call(function () { st.textContent = "online"; st.className = "on"; }, null, 0);
    msgs.forEach(function (m, i) { DRS.chat.pop(tl, m, .3 + i * .7); });
    tl.to(chat, { keyframes: [
        { opacity: .25, x: 3, duration: .06 }, { opacity: 1, x: -3, duration: .06 }, { opacity: .3, x: 2, duration: .05 },
        { opacity: 1, x: -2, duration: .08 }, { opacity: .12, x: 0, duration: .06 }, { opacity: .85, duration: .1 }
      ] }, 3.5)
      .call(function () { st.textContent = "offline"; st.className = ""; }, null, 3.9)
      .to(track, { opacity: .16, duration: .5 }, 3.9)
      .to(overlay, { opacity: 1, scale: 1, duration: .45, ease: "expo.out" }, 3.95)
      .to(chat, { opacity: 0, duration: .4, ease: "power2.in" }, 7.0)
      .set({}, {}, 7.5);
    return { play: function () { tl.play(); }, pause: function () { tl.pause(); } };
  }

  /* P3: bot em loop (menu repetido, rolagem infinita) */
  function loop(root) {
    var track = $("[data-track]", root), count = $("[data-count]", root), ico = $(".loop-ico", root);
    root.classList.add("is-live");
    Array.prototype.slice.call(track.children).forEach(function (n) { var k = n.cloneNode(true); k.setAttribute("aria-hidden", "true"); track.appendChild(k); });
    var last = -1;
    var tw = gsap.to(track, {
      yPercent: -50, duration: 9, ease: "none", repeat: -1, paused: true,
      onUpdate: function () {
        var n = 3 + Math.floor(tw.totalProgress() * 3);
        if (n !== last) { last = n; count.textContent = "menu ×" + n; }
      }
    });
    var spin = gsap.to(ico, { rotation: 360, duration: 2.2, ease: "none", repeat: -1, paused: true });
    return { play: function () { tw.play(); spin.play(); }, pause: function () { tw.pause(); spin.pause(); } };
  }

  /* P4: "vou pensar..." e o silêncio */
  function silencio(root) {
    var track = $(".chat-track", root), msgs = $$(".msg", root), clock = $(".clock", root), hh = $(".h-hour", root), hm = $(".h-min", root),
        days = $("[data-days]", root), ticks = $(".ticks", root);
    var tl = gsap.timeline({ repeat: -1, paused: true });
    tl.set(track, { opacity: 1 }, 0).set(clock, { opacity: 0, scale: .9 }, 0)
      .set(hh, { rotation: 0, svgOrigin: "40 40" }, 0).set(hm, { rotation: 0, svgOrigin: "40 40" }, 0)
      .set(ticks, { color: "var(--ink-3)" }, 0).call(function () { days.textContent = "0 dias"; }, null, 0);
    DRS.chat.pop(tl, msgs[0], .3); DRS.chat.pop(tl, msgs[1], 1.1);
    tl.to(ticks, { color: "var(--accent)", duration: .3 }, 1.9)
      .to(clock, { opacity: 1, scale: 1, duration: .5, ease: "expo.out" }, 2.6)
      .to(hm, { rotation: 2160, svgOrigin: "40 40", duration: 4, ease: "power2.in" }, 2.8)
      .to(hh, { rotation: 180, svgOrigin: "40 40", duration: 4, ease: "power2.in" }, 2.8)
      .to(track, { opacity: .12, duration: 3, ease: "none" }, 2.8)
      .call(function () { days.textContent = "1 dia"; }, null, 3.4)
      .call(function () { days.textContent = "3 dias"; }, null, 4.6)
      .call(function () { days.textContent = "7 dias"; }, null, 5.8)
      .to([clock, track], { opacity: 0, duration: .4, ease: "power2.in" }, 7.4)
      .set({}, {}, 7.9);
    return { play: function () { tl.play(); }, pause: function () { tl.pause(); } };
  }

  var builders = { funil: funil, ban: ban, loop: loop, silencio: silencio }, cache = new WeakMap();

  /* liga/desliga uma vinheta (cria na primeira vez que fica ativa) */
  DRS.vigSet = function (root, on) {
    if (!root || !window.gsap) return;
    var ctl = cache.get(root);
    if (!ctl) {
      if (!on) return;
      var b = builders[root.getAttribute("data-vig")]; if (!b) return;
      ctl = b(root); cache.set(root, ctl);
    }
    if (on) ctl.play(); else ctl.pause();
  };
})();
