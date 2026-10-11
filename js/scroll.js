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

  /* marca <html> enquanto alguma seção fixada está ativa (o seletor de tema se esconde) */
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
