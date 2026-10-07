/* NymaMar · interactions v3 (one IIFE, no dependencies)
   - html.js / html.is-ready flags (a <head> snippet adds .js early and removes
     it again if this file never boots, so content can never stay hidden)
   - Quadrant curtain: first-visit intro + page-to-page transitions
   - Header: glass after scroll, hides on scroll down / returns on scroll up
   - Mobile nav: scroll-lock, Escape, focus trap, aria-expanded
   - Word-split headings, scroll reveals, image wipes, stagger groups
   - Clamped parallax, expanding hero windows, mobile quick-contact bar
   - Contact form inline validation
   - Scroll progress, services sub-nav spy, live Athens clock, magnetic CTAs
   Every motion path is skipped under prefers-reduced-motion. */
(function () {
  "use strict";

  var root = document.documentElement;
  var body = document.body;
  root.classList.add("js");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  function ready() { root.classList.add("is-ready"); }

  /* ---- Word splitting (keeps inline markup such as <em>, <span>, <br>) -- */
  var wordIndex = 0;
  function splitNode(node) {
    Array.prototype.slice.call(node.childNodes).forEach(function (child) {
      if (child.nodeType === 3) {
        var parts = child.textContent.split(/(\s+)/);
        var frag = document.createDocumentFragment();
        parts.forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
          var w = document.createElement("span"); w.className = "w";
          var i = document.createElement("span"); i.className = "w__i";
          i.style.setProperty("--wi", wordIndex++);
          i.textContent = part; w.appendChild(i); frag.appendChild(w);
        });
        child.parentNode.replaceChild(frag, child);
      } else if (child.nodeType === 1 && child.tagName !== "BR") {
        splitNode(child);
      }
    });
  }
  $$("[data-split]").forEach(function (el) {
    wordIndex = 0;
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    splitNode(el);
    $$(".w", el).forEach(function (w) { w.setAttribute("aria-hidden", "true"); });
  });

  /* ---- Header ----------------------------------------------------------- */
  var header = document.querySelector(".site-header");
  var lastY = window.scrollY;
  function updateHeader() {
    if (!header) return;
    var y = window.scrollY;
    header.classList.toggle("is-solid", y > 30);
    var hide = y > lastY && y > 320 && !body.classList.contains("nav-open");
    if (Math.abs(y - lastY) > 4) {
      header.classList.toggle("is-hidden", hide);
      body.classList.toggle("header-hidden", hide);
    }
    lastY = y;
  }

  /* ---- Scroll progress ------------------------------------------------- */
  var progressBar = document.querySelector(".scroll-progress");
  function updateProgress() {
    if (!progressBar) return;
    var max = root.scrollHeight - root.clientHeight;
    progressBar.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0).toFixed(4) + ")";
  }

  /* ---- Parallax (transform-only, clamped to the scale headroom) ------- */
  var parallaxEls = reduceMotion ? [] : $$("[data-parallax]");
  function updateParallax() {
    var vh = window.innerHeight;
    for (var i = 0; i < parallaxEls.length; i++) {
      var el = parallaxEls[i];
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      var speed = parseFloat(el.getAttribute("data-parallax")) || 0.1;
      var s = parseFloat(el.getAttribute("data-parallax-scale")) || 1.1;
      // Real headroom of a centred, scaled cover image is ((S-1)/2S) of its height.
      var head = r.height * Math.max(0, (s - 1) / (2 * s)) * 0.9;
      var off = Math.max(-head, Math.min(head, (r.top + r.height / 2 - vh / 2) * -speed));
      el.style.transform = "translate3d(0," + off.toFixed(1) + "px,0) scale(" + s + ")";
    }
  }

  /* ---- Expanding windows (inset to the content column → full-bleed) -- */
  var expandEls = reduceMotion ? [] : $$("[data-expand]");
  function updateExpand() {
    var vh = window.innerHeight;
    expandEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var p = (vh - r.top) / (vh * 0.75);
      el.style.setProperty("--p", Math.max(0, Math.min(1, p)).toFixed(3));
    });
  }
  expandEls.forEach(function (el) { el.style.setProperty("--p", "0"); });

  /* ---- Mobile quick-contact bar: shows after the hero, hides at the footer */
  var bar = document.querySelector(".mbar");
  var footerEl = document.querySelector(".site-footer");
  function updateBar() {
    if (!bar) return;
    var vh = window.innerHeight;
    var pastHero = window.scrollY > vh * 0.7;
    var atFooter = footerEl && footerEl.getBoundingClientRect().top < vh - 40;
    bar.classList.toggle("is-on", pastHero && !atFooter);
  }

  /* ---- Scroll loop ---------------------------------------------------- */
  var ticking = false;
  function frame() { updateHeader(); updateProgress(); updateParallax(); updateExpand(); updateBar(); ticking = false; }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  frame();

  /* ---- Reveals (IntersectionObserver) -------------------------------- */
  $$("[data-stagger]").forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty("--i", i); });
  });
  var revealEls = $$(".reveal, [data-split]").filter(function (el) { return !el.closest(".hero, .phero__inner"); });
  // A fully clipped element never "intersects", so image wipes are triggered
  // by their parent container instead.
  var wipeParents = [];
  $$(".reveal-img").forEach(function (el) {
    var p = el.parentElement;
    if (wipeParents.indexOf(p) === -1) { wipeParents.push(p); p.setAttribute("data-wipe-parent", ""); }
  });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var t = e.target;
        if (t.hasAttribute("data-wipe-parent")) {
          Array.prototype.forEach.call(t.children, function (c) { if (c.classList.contains("reveal-img")) c.classList.add("is-in"); });
        }
        t.classList.add("is-in");
        io.unobserve(t);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.concat(wipeParents).forEach(function (el) { io.observe(el); });
  } else {
    $$(".reveal, .reveal-img, [data-split]").forEach(function (el) { el.classList.add("is-in"); });
  }
  // Above-the-fold hero headings play once the page is "ready".
  function playHero() {
    ready();
    $$(".hero [data-split], .phero__inner [data-split], .hero .reveal, .phero__inner .reveal").forEach(function (el) {
      el.style.setProperty("--sd", "0.25s");
      el.classList.add("is-in");
    });
  }

  /* ---- Quadrant curtain (intro + page transitions) ------------------- */
  var GLYPHS = [
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="4" y="4" width="3.2" height="16"/><rect x="16.8" y="4" width="3.2" height="16"/><polygon points="4,4 7.2,4 20,20 16.8,20"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M3 7 q3 -3 6 0 t6 0 t6 0"/><path d="M3 12 q3 -3 6 0 t6 0 t6 0"/><path d="M3 17 q3 -3 6 0 t6 0 t6 0"/></svg>',
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><g transform="translate(12 12)"><path d="M0 0 A9 9 0 0 1 0 -18 Z"/><path d="M0 0 A9 9 0 0 1 0 -18 Z" transform="rotate(90)"/><path d="M0 0 A9 9 0 0 1 0 -18 Z" transform="rotate(180)"/><path d="M0 0 A9 9 0 0 1 0 -18 Z" transform="rotate(270)"/></g></svg>',
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="8" r="4.2"/><path d="M4.5 21 a7.5 7.5 0 0 1 15 0 Z"/></svg>'
  ];
  var curtain = null;
  function makeCurtain(cls) {
    curtain = document.createElement("div");
    curtain.className = "curtain " + (cls || "");
    curtain.setAttribute("aria-hidden", "true");
    curtain.innerHTML = GLYPHS.map(function (g) { return '<i class="curtain__p">' + g + "</i>"; }).join("");
    body.appendChild(curtain);
    void curtain.offsetWidth; // commit the starting state before animating
    return curtain;
  }
  function openCurtain(delay) {
    setTimeout(function () {
      curtain.classList.remove("no-anim", "is-intro");
      void curtain.offsetWidth;
      curtain.classList.remove("is-cover");
      setTimeout(playHero, 200);
      setTimeout(function () { if (curtain) curtain.style.visibility = "hidden"; }, 900);
    }, delay);
  }

  var store = { get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
                set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} } };

  if (reduceMotion) {
    playHero();
  } else if (store.get("nyma-nav") === "1") {
    store.set("nyma-nav", "0");          // arriving from an internal link
    makeCurtain("is-cover no-anim");
    openCurtain(80);
  } else if (store.get("nyma-intro") !== "1") {
    store.set("nyma-intro", "1");        // first page of the session
    makeCurtain("is-cover is-intro no-anim");
    openCurtain(620);
  } else {
    requestAnimationFrame(playHero);
  }

  // Outbound: panels close in, then navigate.
  if (!reduceMotion) {
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      var url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
      if (url.pathname === location.pathname && url.hash) return; // same-page anchor
      e.preventDefault();
      if (!curtain) makeCurtain("");
      curtain.style.visibility = "visible";
      curtain.classList.remove("is-intro", "no-anim");
      void curtain.offsetWidth;
      curtain.classList.add("is-cover");
      store.set("nyma-nav", "1");
      setTimeout(function () { location.href = url.href; }, 520);
    });
  }
  // Back/forward cache: never restore a closed curtain.
  window.addEventListener("pageshow", function (e) {
    if (e.persisted && curtain) {
      curtain.classList.add("no-anim"); curtain.classList.remove("is-cover");
      curtain.style.visibility = "hidden"; store.set("nyma-nav", "0"); ready();
    }
  });

  /* ---- Mobile nav ----------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  var navItems = nav ? $$("a", nav) : [];
  function navIsMobile() { return toggle && getComputedStyle(toggle).display !== "none"; }
  function openNav() {
    body.classList.add("nav-open");
    toggle.setAttribute("aria-expanded", "true");
    if (header) header.classList.remove("is-hidden");
    // Focus once the panel is visible (focus() is refused while still hidden).
    setTimeout(function () { if (navItems[0]) navItems[0].focus(); }, 60);
  }
  function closeNav(returnFocus) {
    body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    if (returnFocus) toggle.focus();
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      if (body.classList.contains("nav-open")) closeNav(false); else openNav();
    });
    document.addEventListener("keydown", function (e) {
      if (!body.classList.contains("nav-open")) return;
      if (e.key === "Escape") { closeNav(true); return; }
      if (e.key === "Tab" && navIsMobile()) {
        var f = navItems.concat([toggle]);
        var i = f.indexOf(document.activeElement);
        if (i === -1) { e.preventDefault(); f[0].focus(); }
        else if (e.shiftKey && i === 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
    window.addEventListener("resize", function () {
      if (!navIsMobile() && body.classList.contains("nav-open")) closeNav(false);
    }, { passive: true });
  }

  /* ---- Services sub-nav: active pill + keep it in view --------------- */
  var subnav = document.querySelector(".subnav__inner");
  var subLinks = $$(".subnav a");
  if ("IntersectionObserver" in window && subLinks.length) {
    var byId = {};
    subLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        subLinks.forEach(function (a) { a.classList.remove("active"); });
        var a = byId[e.target.id];
        if (!a) return;
        a.classList.add("active");
        if (subnav) subnav.scrollTo({ left: Math.max(0, a.offsetLeft - 24), behavior: reduceMotion ? "auto" : "smooth" });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) sio.observe(s); });
  }

  /* ---- Live Athens clock --------------------------------------------- */
  var clocks = $$("[data-clock]");
  if (clocks.length && window.Intl) {
    var fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Europe/Athens" });
    var tick = function () { var t = fmt.format(new Date()); clocks.forEach(function (c) { c.textContent = t; }); };
    tick(); setInterval(tick, 15000);
  }

  /* ---- Magnetic CTAs (fine pointers only) ----------------------------- */
  if (finePointer && !reduceMotion) {
    $$(".magnetic").forEach(function (el) {
      var k = parseFloat(el.getAttribute("data-magnetic")) || 0.3;
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * k, y = (e.clientY - r.top - r.height / 2) * k;
        el.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ---- Back to top, footer year, mockup form --------------------------- */
  $$("[data-to-top]").forEach(function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); });
  });
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    // Inline validation: plain-language messages next to the field, focus the first error.
    var check = function (input) {
      var field = input.closest(".field");
      var msg = "";
      if (input.required && !input.value.trim()) msg = "Please fill in this field.";
      else if (input.type === "email" && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) msg = "Please enter a valid email address.";
      var err = field.querySelector(".field__err");
      if (msg && !err) {
        err = document.createElement("span"); err.className = "field__err"; err.id = input.id + "-err";
        field.appendChild(err); input.setAttribute("aria-describedby", err.id);
      }
      if (err) err.textContent = msg;
      field.classList.toggle("is-invalid", !!msg);
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      return !msg;
    };
    var inputs = $$("input, textarea", form);
    inputs.forEach(function (i) {
      i.addEventListener("blur", function () { if (i.value || i.closest(".field").classList.contains("is-invalid")) check(i); });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = inputs.filter(function (i) { return !check(i); });
      if (bad.length) { bad[0].focus(); return; }
      var note = form.querySelector("[data-form-note]");
      if (note) note.hidden = false;
      form.reset();
    });
  }

  window.__nymaBooted = true;
})();
