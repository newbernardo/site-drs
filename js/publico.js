/* BLOCOS 8 e 9 · PÚBLICO, CASOS DE USO E COMPARATIVO
   Ícones animados (SVG + GSAP) que rodam só quando visíveis; fluxos dos casos acendem nó a nó;
   comparativo marca "com o DRS" linha a linha.
   Reduzido/sem JS: tudo estático e visível. */
(function () {
  var DRS = (window.DRS = window.DRS || {});
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  if (!document.getElementById("para-quem")) return;

  DRS.blocks.publico = {
    mount: function (mm) {
      mm.add("(prefers-reduced-motion: no-preference)", function () {
        /* ---- ícones ---- */
        var dig = $('[data-ico="digital"]'), fis = $('[data-ico="fisico"]');
        var loops = [];
        if (dig) {
          var t1 = gsap.timeline({ repeat: -1, paused: true });
          t1.fromTo($(".dl", dig), { y: -16, opacity: 0 }, { y: 4, opacity: 1, duration: .9, ease: "power2.in" }, 0)
            .to($(".dl", dig), { opacity: 0, duration: .25 }, .9)
            .fromTo($(".ic-cover", dig), { opacity: .5 }, { opacity: 1, duration: .3, yoyo: true, repeat: 1 }, .8)
            .to({}, { duration: .6 });
          loops.push([dig, t1]);
        }
        if (fis) {
          var t2 = gsap.timeline({ repeat: -1, paused: true });
          t2.set($(".pkg", fis), { opacity: 0, y: 8 }, 0)
            .fromTo($(".lid", fis), { rotation: 0, svgOrigin: "24 54" }, { rotation: -32, svgOrigin: "24 54", duration: .6, ease: "power3.out" }, 0)
            .to($(".pkg", fis), { opacity: 1, y: -6, duration: .5, ease: "back.out(2.4)" }, .3)
            .to({}, { duration: .9 })
            .to($(".pkg", fis), { opacity: 0, y: 8, duration: .3 }, ">")
            .to($(".lid", fis), { rotation: 0, svgOrigin: "24 54", duration: .5, ease: "power2.inOut" }, "<")
            .to({}, { duration: .7 });
          loops.push([fis, t2]);
        }
        loops.forEach(function (p) {
          ScrollTrigger.create({ trigger: p[0], start: "top 95%", end: "bottom 5%", onToggle: function (s) { s.isActive ? p[1].play() : p[1].pause(); } });
        });

        /* ---- fluxos dos casos ---- */
        $$("[data-flow]").forEach(function (f) {
          var li = $$("li", f);
          gsap.set(li, { "--lit": 0 });
          gsap.to(li, { "--lit": 1, duration: .5, ease: "power2.out", stagger: .22, scrollTrigger: { trigger: f, start: "top 88%", once: true } });
        });

        /* ---- comparativo ---- */
        var rows = $$("[data-row]");
        if (rows.length) {
          var no = rows.map(function (r) { return $(".cmp-no", r); }), ck = rows.map(function (r) { return $(".cmp-yes svg", r); }), yes = rows.map(function (r) { return $(".cmp-yes .cmp-t", r); });
          gsap.set(ck, { scale: 0 }); gsap.set(yes, { opacity: .35, x: -6 });
          var tl = gsap.timeline({ scrollTrigger: { trigger: $("[data-cmp] .cmp-list"), start: "top 90%", once: true } });
          rows.forEach(function (r, i) {
            tl.to(ck[i], { scale: 1, duration: .45, ease: "back.out(3)" }, i * .4 + .35)
              .to(yes[i], { opacity: 1, x: 0, duration: .5, ease: "expo.out" }, i * .4 + .35);
          });
        }
      });
    }
  };
})();
