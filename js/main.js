/* Orquestração: assets reais, divisão de texto, entradas e blocos. */
(function () {
  var DRS = (window.DRS = window.DRS || {});
  var gsapOK = !!(window.gsap && window.ScrollTrigger);
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- imagens reais (só carrega o que existe, sem 404 no console) ---------- */
  var cfg = (DRS.config && DRS.config.images) || {};
  $$("img[data-asset]").forEach(function (img) {
    if (!cfg[img.getAttribute("data-asset")]) return;
    img.addEventListener("load", function () { var host = img.closest(".shot, .pic, .vig-img"); if (host) host.classList.add("has-img"); });
    img.src = img.getAttribute("data-src");
  });

  /* ---------- utilitário: divide em palavras mantendo elementos inline ---------- */
  DRS.splitWords = function (el) {
    var words = [];
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var parts = n.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(" ")); return; }
            var w = document.createElement("span"), i = document.createElement("span");
            w.className = "w"; i.className = "wi"; i.textContent = p; w.appendChild(i); frag.appendChild(w); words.push(i);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) { walk(n); }
      });
    })(el);
    return words;
  };

  /* ====================================================================
     BLOCO 1 · HERO
     Entrada: palavras sobem de máscaras (stagger), subhead, realces, CTA, painel.
     Scroll: painel desinclina (rotateX → 0) e o halo faz parallax.
     Micro: brilho do botão, luz que segue o cursor na borda do painel.
     ==================================================================== */
  var heroTitle = $(".hero-title");

  function heroIntro() {
    if (!heroTitle) return;
    var words = DRS.splitWords(heroTitle);
    heroTitle.setAttribute("aria-label", heroTitle.textContent.replace(/\s+/g, " ").trim());
    $$(".w", heroTitle).forEach(function (w) { w.setAttribute("aria-hidden", "true"); });
    heroTitle.classList.add("is-ready");

    var sub = $("[data-hero-sub]"), marks = $$(".mk", sub), cta = $("[data-hero-cta]"), frame = $(".shot-frame");
    if (!gsapOK || reduce.matches) { return; }           /* conteúdo já visível por padrão */

    gsap.set(words, { yPercent: 118 });
    gsap.set([sub, cta], { opacity: 0, y: 18 });
    gsap.set(marks, { "--mk": "0%" });
    gsap.set(frame, { opacity: 0, y: 48 });

    var tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: .08 });
    tl.to(words, { yPercent: 0, duration: 1.15, stagger: .04 }, 0)
      .to(sub, { opacity: 1, y: 0, duration: .9 }, .5)
      .to(marks, { "--mk": "100%", duration: .9, stagger: .14, ease: "power3.out" }, .95)
      .to(cta, { opacity: 1, y: 0, duration: .8 }, .75)
      .to(frame, { opacity: 1, y: 0, duration: 1.2 }, .85)
      .add(function () { DRS.blocks.hero.dash && DRS.blocks.hero.dash(); }, 1.4);
  }

  /* painel esquemático: preenche-se quando visível (só placeholder; a imagem real o cobre) */
  function dashBuild() {
    if (!gsapOK || reduce.matches) return;
    var shot = $("[data-shot]"); if (!shot || shot.classList.contains("has-img")) return;
    var tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.from(".dash-side i", { scaleX: 0, transformOrigin: "0 50%", duration: .8, stagger: .06 }, 0)
      .from(".kpi", { opacity: 0, y: 14, duration: .8, stagger: .1 }, .1)
      .from(".kpi b", { scaleX: 0, duration: 1, stagger: .1 }, .35)
      .fromTo(".kpi svg", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.2, stagger: .1, ease: "power3.inOut" }, .4)
      .from(".dash-chart", { opacity: 0, y: 14, duration: .8 }, .45)
      .fromTo(".dash-chart svg", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.8, ease: "power3.inOut" }, .6)
      .from(".dash-rows i", { scaleX: 0, duration: 1.1, stagger: .09 }, .9);
  }

  DRS.blocks.hero = {
    dash: dashBuild,
    mount: function (mm) {
    mm.add("(prefers-reduced-motion: no-preference)", function () {
      /* painel desinclina conforme sobe */
      gsap.fromTo(".hero .shot", { rotateX: 18, scale: .9, y: 24 }, {
        rotateX: 0, scale: 1, y: 0, ease: "none",
        scrollTrigger: { trigger: ".hero-shot-wrap", start: "top 94%", end: "top 36%", scrub: .6 }
      });
      /* halo do hero anda mais devagar que a página */
      gsap.to(".hero-bg", {
        yPercent: 14, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
      });
      /* o bloco de texto recua e esmaece de leve ao sair */
      gsap.to(".hero-in", {
        yPercent: -5, opacity: .35, ease: "none",
        scrollTrigger: { trigger: ".hero-shot-wrap", start: "top 70%", end: "top 5%", scrub: true }
      });
    });
    }
  };

  /* TITULOS DE SECAO: qualquer [data-split-reveal] sobe de mascaras ao entrar na tela */
  var splitHeads = $$("[data-split-reveal]");
  splitHeads.forEach(function (h) {
    h.setAttribute("aria-label", h.textContent.replace(/\s+/g, " ").trim());
    h._words = DRS.splitWords(h);
    $$(".w", h).forEach(function (w) { w.setAttribute("aria-hidden", "true"); });
  });
  DRS.blocks.headings = {
    mount: function (mm) {
      mm.add("(prefers-reduced-motion: no-preference)", function () {
        splitHeads.forEach(function (h) {
          gsap.set(h._words, { yPercent: 118 });
          /* revelação logo à entrada: começa assim que o topo aparece e termina em ~0,8 s, mesmo em títulos longos */
          gsap.to(h._words, { yPercent: 0, duration: .65, stagger: Math.min(DRS.motion().stagger, .25 / Math.max(1, h._words.length)), ease: DRS.motion().ease, scrollTrigger: { trigger: h, start: "top 98%", once: true } });
        });
      });
    }
  };

  /* ====================================================================
     UTILIDADES GERAIS
     [data-reveal]: sobe e aparece ao entrar; irmãos dentro de [data-reveal-group] entram em cascata.
     [data-counter]: número que conta até data-counter (data-decimals, data-prefix, data-suffix).
     ==================================================================== */
  /* personalidade de movimento por tema: lida dos tokens (--m-dur, --m-stagger, --m-ease) */
  DRS.motion = function () {
    var cs = getComputedStyle(document.documentElement);
    var dur = parseFloat(cs.getPropertyValue("--m-dur")) || .9, st = parseFloat(cs.getPropertyValue("--m-stagger")) || .05;
    var ease = (cs.getPropertyValue("--m-ease") || "expo.out").replace(/["' ]/g, "") || "expo.out";
    return { dur: dur, stagger: st, ease: ease };
  };
  var nfmt = function (v, d) { return v.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d }); };
  DRS.fmt = nfmt;
  DRS.blocks.utils = {
    mount: function (mm) {
      mm.add("(prefers-reduced-motion: no-preference)", function () {
        $$("[data-reveal-group]").forEach(function (g) {
          var items = $$("[data-reveal]", g);
          if (!items.length) return;
          gsap.set(items, { opacity: 0, y: 28 });
          gsap.to(items, { opacity: 1, y: 0, duration: .7, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: g, start: "top 94%", once: true } });
        });
        $$("[data-reveal]").forEach(function (el) {
          if (el.closest("[data-reveal-group]")) return;
          gsap.fromTo(el, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: .7, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 96%", once: true } });
        });
        $$("[data-counter]").forEach(function (el) {
          var to = parseFloat(el.getAttribute("data-counter")), d = +(el.getAttribute("data-decimals") || 0), o = { v: 0 };
          var pre = el.getAttribute("data-prefix") || "", suf = el.getAttribute("data-suffix") || "";
          el.textContent = pre + nfmt(0, d) + suf;
          gsap.to(o, { v: to, duration: 1.6, ease: "power2.out", onUpdate: function () { el.textContent = pre + nfmt(o.v, d) + suf; },
            scrollTrigger: { trigger: el, start: "top 88%", once: true } });
        });
      });
    }
  };

  /* luz na borda do painel, só com mouse */
  var frameEl = $("[data-glow]");
  if (frameEl && !reduce.matches) {
    frameEl.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      var r = frameEl.getBoundingClientRect();
      frameEl.style.setProperty("--mx", (e.clientX - r.left) + "px");
      frameEl.style.setProperty("--my", (e.clientY - r.top) + "px");
      frameEl.style.setProperty("--glow", 1);
    });
    frameEl.addEventListener("pointerleave", function () { frameEl.style.setProperty("--glow", 0); });
  }

  /* ---------- partida ---------- */
  function start() {
    heroIntro();
    DRS.initScroll && DRS.initScroll();
    $$("a[data-cta]").forEach(function (a) { /* links de CTA: WhatsApp/checkout quando configurados */
      var c = DRS.config || {};
      if (c.checkoutUrl) { a.href = c.checkoutUrl; return; }
      if (!c.whatsapp) return;
      var plan = a.getAttribute("data-plan");
      var text = plan ? "Olá! Quero começar com o plano " + plan.charAt(0).toUpperCase() + plan.slice(1) + " do DRS."
                      : "Olá! Quero escalar as minhas vendas no WhatsApp com o DRS.";
      a.href = "https://wa.me/" + c.whatsapp + "?text=" + encodeURIComponent(text);
      a.target = "_blank"; a.rel = "noopener";
    });
  }
  function boot() { if (document.fonts && document.fonts.ready) { document.fonts.ready.then(start); } else { start(); } }
  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", boot); } else { boot(); }
  /* failsafe: nunca deixa o título escondido */
  setTimeout(function () { if (heroTitle) heroTitle.classList.add("is-ready"); }, 2500);
})();
