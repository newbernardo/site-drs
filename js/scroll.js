/* Comportamentos ligados ao scroll: nav, progresso, ScrollTrigger. Cada bloco registra o seu em DRS.blocks. */
(function () {
  var DRS = (window.DRS = window.DRS || {});
  DRS.blocks = DRS.blocks || {};
  var hasGSAP = !!(window.gsap && window.ScrollTrigger);
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  /* nav ganha fundo ao rolar */
  var nav = document.querySelector("[data-nav]");
  if (nav) {
    var ticking = false;
    var upd = function () { nav.classList.toggle("is-scrolled", window.scrollY > 12); ticking = false; };
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }


  /* menu recolhível (celular), fecha ao escolher um link ou com Esc */
  var menuBtn = document.querySelector("[data-menu-toggle]");
  if (nav && menuBtn) {
    var setMenu = function (open) { nav.classList.toggle("is-open", open); menuBtn.setAttribute("aria-expanded", open ? "true" : "false"); menuBtn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu"); };
    menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest(".nav-menu a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    window.matchMedia("(min-width: 56.01rem)").addEventListener("change", function () { setMenu(false); });
  }

  /* realce da âncora ativa no cabeçalho */
  var links = [].slice.call(document.querySelectorAll(".nav-links a[href^='#']"));
  if (links.length && "IntersectionObserver" in window) {
    var map = {};
    links.forEach(function (a) { var t = document.getElementById(a.getAttribute("href").slice(1)); if (t) map[t.id] = a; });
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (map[e.target.id]) map[e.target.id].classList.toggle("is-active", e.isIntersecting); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) { spy.observe(document.getElementById(id)); });
  }

  /* botão voltar ao topo */
  var topBtn = document.querySelector("[data-top]");
  if (topBtn) {
    var tt = false;
    var tu = function () { var on = window.scrollY > 700; if (on) topBtn.hidden = false; topBtn.classList.toggle("is-visible", on); tt = false; };
    window.addEventListener("scroll", function () { if (!tt) { tt = true; requestAnimationFrame(tu); } }, { passive: true });
    topBtn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); });
    tu();
  }

  /* barra de progresso: fallback para navegadores sem animation-timeline */
  var bar = document.querySelector(".progress");
  if (bar && !(window.CSS && CSS.supports("animation-timeline: scroll()"))) {
    var pt = false;
    var up = function () {
      var h = document.documentElement.scrollHeight - innerHeight;
      bar.style.setProperty("--p", h > 0 ? Math.min(1, scrollY / h) : 0); pt = false;
    };
    window.addEventListener("scroll", function () { if (!pt) { pt = true; requestAnimationFrame(up); } }, { passive: true });
    up();
  }

  /* pausa decoração infinita fora da tela */
  var bg = document.querySelector(".hero-bg"), hero = document.getElementById("hero");
  if (bg && hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (e) { bg.classList.toggle("is-off", !e[0].isIntersecting); }).observe(hero);
  }

  /* marca <html> enquanto alguma seção fixada está ativa  */
  if (hasGSAP) {
    var pinTick = false, root = document.documentElement;
    var pinCheck = function () {
      pinTick = false;
      var on = ScrollTrigger.getAll().some(function (t) { return t.pin && t.isActive; });
      root.classList.toggle("pin-on", on);
    };
    window.addEventListener("scroll", function () { if (!pinTick) { pinTick = true; requestAnimationFrame(pinCheck); } }, { passive: true });
  }

  /* inicia os blocos: cada um registra seus próprios matchMedia em mount(mm) */
  DRS.initScroll = function () {
    if (!hasGSAP) return;
    var mm = gsap.matchMedia();
    Object.keys(DRS.blocks).forEach(function (k) { if (DRS.blocks[k].mount) DRS.blocks[k].mount(mm); });
  };
})();
