/* BLOCOS 12–14 · COMEÇAR/GARANTIA, FAQ/OBJEÇÕES, CTA FINAL
   - Os 3 passos acendem e a linha se desenha; o selo de 14 dias é "carimbado" (impacto + onda).
   - FAQ: acordeão com altura animada (funciona também sem animação).
   - Objeções: 5 abas que avançam sozinhas (pausam com mouse/foco; sem avanço em movimento reduzido).
   - Final: a frase se revela com o scroll, o CTA aparece no fim e é magnético (só mouse).
   Reduzido/sem JS: tudo visível; <details> nativo. */
(function () {
  var DRS = (window.DRS = window.DRS || {});
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var gsapOK = !!(window.gsap && window.ScrollTrigger);

  /* ---------- FAQ (acordeão com altura animada) ---------- */
  $$("[data-qa]").forEach(function (d) {
    var sum = $("summary", d), ans = $(".ans", d);
    sum.addEventListener("click", function (e) {
      if (!gsapOK || reduce.matches) return;           /* comportamento nativo */
      e.preventDefault();
      gsap.killTweensOf(ans);
      if (!d.open) {
        d.open = true;
        gsap.fromTo(ans, { height: 0 }, { height: "auto", duration: .5, ease: "expo.out", onComplete: function () { ans.style.height = ""; } });
      } else {
        gsap.to(ans, { height: 0, duration: .35, ease: "power2.inOut", onComplete: function () { d.open = false; ans.style.height = ""; } });
      }
    });
  });

  /* ---------- objeções: abas + avanço automático ---------- */
  var og = $("[data-objs]");
  var obTabs = og ? $$("[role=tab]", og) : [], obPanels = og ? $$("[data-ob-panel]", og) : [];
  var cur = 0, timer = null, paused = false, PERIOD = 7000, startAt = 0, raf = null;
  function setOb(i, user) {
    cur = i;
    obTabs.forEach(function (t, k) { t.setAttribute("aria-selected", k === i ? "true" : "false"); t.tabIndex = k === i ? 0 : -1; t.style.removeProperty("--ob"); });
    obPanels.forEach(function (p, k) { p.hidden = k !== i; });
    if (gsapOK && !reduce.matches) gsap.fromTo(obPanels[i], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .6, ease: "expo.out", overwrite: true });
    if (user) { paused = true; stopAuto(); }
    else restartAuto();
  }
  function tick(now) {
    if (paused) { raf = null; return; }
    var p = Math.min(1, (now - startAt) / PERIOD);
    obTabs[cur].style.setProperty("--ob", p);
    if (p >= 1) { setOb((cur + 1) % obTabs.length, false); return; }
    raf = requestAnimationFrame(tick);
  }
  function restartAuto() { stopAuto(); if (reduce.matches || paused) return; startAt = performance.now(); raf = requestAnimationFrame(tick); }
  function stopAuto() { if (raf) cancelAnimationFrame(raf); raf = null; }
  if (obTabs.length) {
    obTabs.forEach(function (t, i) {
      t.addEventListener("click", function () { setOb(i, true); });
      t.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") n = (i + 1) % obTabs.length; else if (e.key === "ArrowUp" || e.key === "ArrowLeft") n = (i - 1 + obTabs.length) % obTabs.length;
        if (n !== null) { e.preventDefault(); obTabs[n].focus(); setOb(n, true); }
      });
    });
    obPanels.forEach(function (p, k) { p.hidden = k !== 0; });
    /* só roda o avanço enquanto a seção está na tela e o visitante não interagiu */
    if ("IntersectionObserver" in window && !reduce.matches) {
      new IntersectionObserver(function (e) {
        if (paused) return;
        if (e[0].isIntersecting) { if (!raf) { startAt = performance.now() - (parseFloat(obTabs[cur].style.getPropertyValue("--ob")) || 0) * PERIOD; raf = requestAnimationFrame(tick); } }
        else stopAuto();
      }, { threshold: .3 }).observe(og);
    }
    og.addEventListener("pointerenter", function () { if (!paused) stopAuto(); });
    og.addEventListener("pointerleave", function () { if (!paused && !reduce.matches) { startAt = performance.now() - (parseFloat(obTabs[cur].style.getPropertyValue("--ob")) || 0) * PERIOD; if (!raf) raf = requestAnimationFrame(tick); } });
  }

  DRS.blocks.fecho = {
    mount: function (mm) {
      mm.add("(prefers-reduced-motion: no-preference)", function () {
        /* passos 1-2-3 */
        var mini = $("[data-mini]");
        if (mini) {
          var li = $$("li", mini);
          gsap.set(li, { "--lit": 0 }); mini.style.setProperty("--fill", 0);
          var st = { f: 0 };
          var tl = gsap.timeline({ scrollTrigger: { trigger: mini, start: "top 92%", once: true } });
          li.forEach(function (l, i) { tl.fromTo(l, { "--lit": 0 }, { "--lit": 1, duration: .5, ease: "power2.out" }, i * .6); });
          tl.to(st, { f: 1, duration: 1.2, ease: "none", onUpdate: function () { mini.style.setProperty("--fill", st.f); } }, 0);
        }

        /* selo carimbado */
        var g = $("[data-guar]");
        if (g) {
          var seal = $(".seal", g), shock = $(".seal-shock", g);
          gsap.set(seal, { scale: 2.2, rotation: -24, opacity: 0, transformOrigin: "50% 50%" });
          gsap.timeline({ scrollTrigger: { trigger: seal, start: "top 80%", once: true } })
            .to(seal, { opacity: 1, duration: .15 }, 0)
            .to(seal, { scale: 1, rotation: -8, duration: .35, ease: "power4.in" }, 0)
            .fromTo(shock, { scale: .9, opacity: .9 }, { scale: 1.45, opacity: 0, duration: .7, ease: "power2.out" }, .35)
            .to(seal, { x: 4, y: -3, duration: .05, yoyo: true, repeat: 5, ease: "none" }, .35)
            .to(seal, { x: 0, y: 0, duration: .1 }, ">")
            .to(seal, { rotation: -6, duration: .6, ease: "elastic.out(1, .5)" }, .5);
        }

        /* final: frase por scrub, CTA no fim, botão magnético */
        var punch = $("[data-final-punch]");
        if (punch) {
          var words = DRS.splitWords(punch);
          punch.setAttribute("aria-label", punch.textContent);
          $$(".w", punch).forEach(function (w) { w.setAttribute("aria-hidden", "true"); w.style.overflow = "visible"; w.style.padding = "0"; w.style.margin = "0"; });
          gsap.set(words, { opacity: .12, y: 12 }); /* o botao nunca fica preso ao scrub: sempre visivel */
          var ptl = gsap.timeline({ scrollTrigger: { trigger: punch, start: "top 85%", end: "top 40%", scrub: .6 } });
          ptl.to(words, { opacity: 1, y: 0, stagger: .2, ease: "none" });
        }
        var offs = [];
        $$("[data-magnet]").forEach(function (b) {
          var xt = gsap.quickTo(b, "x", { duration: .5, ease: "power3.out" }), yt = gsap.quickTo(b, "y", { duration: .5, ease: "power3.out" });
          var mv = function (e) { if (e.pointerType !== "mouse") return; var r = b.getBoundingClientRect(); xt((e.clientX - (r.left + r.width / 2)) * .28); yt((e.clientY - (r.top + r.height / 2)) * .35); };
          var lv = function () { xt(0); yt(0); };
          b.addEventListener("pointermove", mv); b.addEventListener("pointerleave", lv);
          offs.push(function () { b.removeEventListener("pointermove", mv); b.removeEventListener("pointerleave", lv); gsap.set(b, { clearProps: "x,y" }); });
        });
        return function () { offs.forEach(function (f) { f(); }); };
      });
    }
  };
})();
