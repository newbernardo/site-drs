/* WatSeller · versão 2 — interações leves, sem dependências.
   Tudo é opcional: sem JS a página mostra a pose final completa. */
(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- cabeçalho: menu, âncora ativa, progresso, voltar ao topo ---------- */
  var nav = $("[data-nav]"), btn = $("[data-menu-toggle]");
  if (nav && btn) {
    var setMenu = function (o) { nav.classList.toggle("is-open", o); btn.setAttribute("aria-expanded", o ? "true" : "false"); btn.setAttribute("aria-label", o ? "Fechar menu" : "Abrir menu"); };
    btn.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest(".nav-menu a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    window.matchMedia("(min-width: 56.01rem)").addEventListener("change", function () { setMenu(false); });
  }
  var links = $$(".nav-links a[href^='#']");
  if (links.length && "IntersectionObserver" in window) {
    var map = {};
    links.forEach(function (a) { var t = document.getElementById(a.getAttribute("href").slice(1)); if (t) map[t.id] = a; });
    var spy = new IntersectionObserver(function (es) { es.forEach(function (e) { if (map[e.target.id]) map[e.target.id].classList.toggle("is-active", e.isIntersecting); }); }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) { spy.observe(document.getElementById(id)); });
  }
  var bar = $(".progress"), top = $("[data-top]"), tick = false;
  var onScroll = function () {
    var h = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.setProperty("--p", h > 0 ? Math.min(1, scrollY / h) : 0);
    if (top) { var on = scrollY > 700; if (on) top.hidden = false; top.classList.toggle("is-visible", on); }
    tick = false;
  };
  window.addEventListener("scroll", function () { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  if (top) top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  /* ---------- reveal único por bloco ---------- */
  var rv = $$(".rv");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px", threshold: .05 });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add("in"); });

  /* ---------- holofote que segue o cursor nas células ---------- */
  var spots = $$(".bento > *, .turn-result, .band");
  spots.forEach(function (el) { el.classList.add("spot"); });
  if (window.matchMedia("(hover: hover)").matches) {
    document.addEventListener("pointermove", function (e) {
      var t = e.target.closest && e.target.closest(".spot"); if (!t) return;
      var r = t.getBoundingClientRect(); t.style.setProperty("--mx", (e.clientX - r.left) + "px"); t.style.setProperty("--my", (e.clientY - r.top) + "px");
    }, { passive: true });
  }

  /* ---------- inclinação suave do painel do hero ---------- */
  var tilt = $("[data-tilt]");
  if (tilt && !reduce && window.matchMedia("(hover: hover)").matches) {
    var wrap = tilt.parentElement;
    wrap.addEventListener("pointermove", function (e) { var r = wrap.getBoundingClientRect(); var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; tilt.style.setProperty("--ry", (x * 5).toFixed(2) + "deg"); tilt.style.setProperty("--rx", (4 - y * 4).toFixed(2) + "deg"); });
    wrap.addEventListener("pointerleave", function () { tilt.style.removeProperty("--ry"); tilt.style.removeProperty("--rx"); });
  }
  if (tilt && !reduce) {
    var onS = function () { var r = tilt.getBoundingClientRect(); var p = Math.min(1, Math.max(0, 1 - r.top / innerHeight)); tilt.style.setProperty("--rx", (5 - p * 5).toFixed(2) + "deg"); };
    var st = false; window.addEventListener("scroll", function () { if (!st) { st = true; requestAnimationFrame(function () { onS(); st = false; }); } }, { passive: true }); onS();
  }

  /* ---------- Como funciona: passos clicáveis ---------- */
  var how = $("[data-how]");
  if (how) {
    var steps = $$(".step", how);
    var setStep = function (i) { steps.forEach(function (s, k) { s.classList.toggle("is-active", k === i); s.classList.toggle("is-done", k < i); }); };
    steps.forEach(function (s, i) { var b = $(".step-btn", s); if (b) b.addEventListener("click", function () { setStep(i); }); });
    setStep(0);
    if (!reduce && "IntersectionObserver" in window) {
      var auto = null, user = false, cur = 0;
      var stop = function () { user = true; if (auto) clearInterval(auto); };
      steps.forEach(function (s, i) { s.addEventListener("click", function () { cur = i; stop(); }); });
      new IntersectionObserver(function (es) { es.forEach(function (e) {
        if (e.isIntersecting && !user && !auto) auto = setInterval(function () { cur = (cur + 1) % steps.length; setStep(cur); }, 5200);
        if (!e.isIntersecting && auto) { clearInterval(auto); auto = null; }
      }); }, { threshold: .35 }).observe(how);
    }
  }

  /* ---------- conversas: toca ao entrar na tela ---------- */
  var timers = new WeakMap();
  function play(root) {
    var track = $("[data-track]", root); if (!track) return;
    var items = $$("[data-m], [data-ty]", track);
    (timers.get(root) || []).forEach(clearTimeout);
    var ts = []; timers.set(root, ts);
    items.forEach(function (it) { if (it.hasAttribute("data-ty")) it.classList.remove("is-on"); else it.classList.add("is-off"); });
    var t = 350;
    items.forEach(function (it) {
      if (it.hasAttribute("data-ty")) {
        ts.push(setTimeout(function () { it.classList.add("is-on"); }, t)); t += 700;
        ts.push(setTimeout(function () { it.classList.remove("is-on"); }, t));
      } else { ts.push(setTimeout(function () { it.classList.remove("is-off"); }, t)); t += 650; }
    });
  }
  var chats = $$(".stage .phone, .panel .phone");
  if ("IntersectionObserver" in window && !reduce) {
    var cio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && !e.target._played) { e.target._played = true; play(e.target); } }); }, { threshold: .45 });
    chats.forEach(function (c) { cio.observe(c); c.addEventListener("click", function () { play(c); }); });
  }

  /* ---------- cenários de pagamento: abas ---------- */
  var scen = $("[data-scen]");
  if (scen) {
    var tabs = $$("[role=tab]", scen), panels = $$("[data-panel]", scen), ind = $(".tab-ind", scen);
    var moveInd = function () { var b = tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0]; if (b && ind) { ind.style.width = b.offsetWidth + "px"; ind.style.transform = "translateX(" + (b.offsetLeft - 4) + "px)"; } };
    var show = function (i) {
      tabs.forEach(function (t, k) { t.setAttribute("aria-selected", k === i ? "true" : "false"); t.tabIndex = k === i ? 0 : -1; });
      panels.forEach(function (p, k) { p.hidden = k !== i; });
      moveInd(); var ph = $(".phone", panels[i]); if (ph && !reduce) { ph._played = true; play(ph); }
    };
    tabs.forEach(function (t, i) { t.addEventListener("click", function () { show(i); }); t.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (!d) return; var n = (i + d + tabs.length) % tabs.length; show(n); tabs[n].focus(); e.preventDefault(); }); });
    show(0); window.addEventListener("resize", moveInd);
  }

  /* ---------- objeções: abas verticais ---------- */
  var ob = $(".objs-grid");
  if (ob) {
    var ot = $$("[role=tab]", ob), op = $$("[role=tabpanel]", ob);
    var oshow = function (i) { ot.forEach(function (t, k) { t.setAttribute("aria-selected", k === i ? "true" : "false"); t.tabIndex = k === i ? 0 : -1; }); op.forEach(function (p, k) { p.hidden = k !== i; }); };
    ot.forEach(function (t, i) { t.addEventListener("click", function () { oshow(i); }); t.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0; if (!d) return; var n = (i + d + ot.length) % ot.length; oshow(n); ot[n].focus(); e.preventDefault(); }); });
    oshow(0);
  }

  /* ---------- FAQ: uma pergunta aberta de cada vez ---------- */
  var qas = $$(".qa");
  qas.forEach(function (q) { q.addEventListener("toggle", function () { if (q.open) qas.forEach(function (o) { if (o !== q) o.open = false; }); }); });

  /* ---------- números que contam ao entrar ---------- */
  var nums = $$("[data-counter]");
  if (nums.length && "IntersectionObserver" in window && !reduce) {
    var fmt = function (v, d) { return v.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d }); };
    var nio = new IntersectionObserver(function (es) { es.forEach(function (e) {
      if (!e.isIntersecting) return; nio.unobserve(e.target);
      var el = e.target, to = parseFloat(el.getAttribute("data-counter")), d = +(el.getAttribute("data-decimals") || 0), suf = el.getAttribute("data-suffix") || "", t0 = performance.now(), dur = 1400;
      (function f(t) { var p = Math.min(1, (t - t0) / dur), v = to * (1 - Math.pow(1 - p, 3)); el.textContent = fmt(v, d) + suf; if (p < 1) requestAnimationFrame(f); })(t0);
    }); }, { threshold: .6 });
    nums.forEach(function (n) { nio.observe(n); });
  }
})();
