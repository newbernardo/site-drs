/* Troca de tema: seletor, ?theme=, tecla T, localStorage, View Transitions (fallback: fade). */
(function () {
  var DRS = (window.DRS = window.DRS || {});
  var root = document.documentElement;
  var KEY = "drs-theme";
  var pill = document.querySelector("[data-theme-pill]");
  var buttons = pill ? Array.prototype.slice.call(pill.querySelectorAll("[data-set-theme]")) : [];
  var thumb = pill && pill.querySelector(".thumb");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var busy = false;

  function current() { return root.getAttribute("data-theme") || "premium"; }

  function syncPill() {
    var t = current();
    buttons.forEach(function (b) {
      var on = b.getAttribute("data-set-theme") === t;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      if (on && thumb) {
        thumb.style.width = b.offsetWidth + "px";
        thumb.style.transform = "translateX(" + (b.offsetLeft - 3) + "px)";
      }
    });
    var meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.setAttribute("content", t === "editorial" ? "light dark" : "dark light");
  }

  function commit(t) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem(KEY, t); } catch (e) {}
    syncPill();
    document.dispatchEvent(new CustomEvent("drs:themechange", { detail: { theme: t } }));
  }

  function setTheme(t, origin) {
    if (t === current() || busy) return;
    if (reduce.matches) { commit(t); return; }

    if (document.startViewTransition) {
      var x = origin ? origin.x : innerWidth / 2, y = origin ? origin.y : innerHeight;
      var r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      busy = true;
      var vt = document.startViewTransition(function () { commit(t); });
      vt.ready.then(function () {
        root.animate(
          { clipPath: ["circle(0px at " + x + "px " + y + "px)", "circle(" + r + "px at " + x + "px " + y + "px)"] },
          { duration: 750, easing: "cubic-bezier(.16,1,.3,1)", pseudoElement: "::view-transition-new(root)" }
        );
      }).catch(function () {});
      vt.finished.finally(function () { busy = false; if (window.ScrollTrigger) ScrollTrigger.refresh(); });
    } else {
      root.classList.add("theme-fade");
      commit(t);
      setTimeout(function () { root.classList.remove("theme-fade"); if (window.ScrollTrigger) ScrollTrigger.refresh(); }, 400);
    }
  }

  buttons.forEach(function (b) {
    b.addEventListener("click", function (e) {
      var rect = b.getBoundingClientRect();
      setTheme(b.getAttribute("data-set-theme"), { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    });
  });

  document.addEventListener("keydown", function (e) {
    if ((e.key !== "t" && e.key !== "T") || e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
    var el = e.target;
    if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
    setTheme(current() === "premium" ? "editorial" : "premium");
  });

  /* discreto: só aparece depois que o CTA do hero sai da tela */
  var cta = document.querySelector("[data-hero-cta]");
  if (pill && cta && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      var e = entries[0];
      pill.classList.toggle("is-visible", !e.isIntersecting && e.boundingClientRect.top < 0);
    }).observe(cta);
  } else if (pill) { pill.classList.add("is-visible"); }

  window.addEventListener("resize", syncPill);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncPill);
  syncPill();

  DRS.theme = { get: current, set: setTheme };
})();
