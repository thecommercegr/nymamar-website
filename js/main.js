/* NymaMar — interactions (one small IIFE, no dependencies)
   - Marks <html> as .js so pre-JS content stays visible with JS off/slow
   - Sticky header: transparent over hero, solid after scroll
   - Mobile nav: scroll-lock, Escape to close, focus management, aria-expanded
   - Reveal-on-scroll (and the voyage course-line draw, via the same observer)
   - Services sub-nav: active highlight + auto-scroll the active item into view
   - Footer year, mockup contact form
*/
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var header = document.querySelector(".site-header");
  var body = document.body;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Sticky / solid header ------------------------------------------ */
  function onScrollHeader() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add("is-solid");
    else header.classList.remove("is-solid");
  }

  /* ---- Scroll progress bar -------------------------------------------- */
  var progressBar = document.querySelector(".scroll-progress");
  function updateProgress() {
    if (!progressBar) return;
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    var p = max > 0 ? window.scrollY / max : 0;
    progressBar.style.transform = "scaleX(" + p.toFixed(4) + ")";
  }

  /* ---- Parallax (transform-only, clamped so image edges never show) --- */
  var parallaxEls = reduceMotion ? [] :
    Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  function updateParallax() {
    if (!parallaxEls.length) return;
    var vh = window.innerHeight;
    for (var i = 0; i < parallaxEls.length; i++) {
      var el = parallaxEls[i];
      var rect = el.getBoundingClientRect();
      if (rect.bottom < -240 || rect.top > vh + 240) continue;
      var speed = parseFloat(el.getAttribute("data-parallax")) || 0.12;
      var scaleNum = parseFloat(el.getAttribute("data-parallax-scale")) || 1;
      var mid = rect.top + rect.height / 2;
      // True headroom of a scaled cover image is ((S-1)/2S) of its rendered
      // height; 0.9 keeps a safety margin so the image edges never show.
      var head = rect.height * Math.max(0, (scaleNum - 1) / (2 * scaleNum)) * 0.9;
      var raw = (mid - vh / 2) * -speed;
      var offset = Math.max(-head, Math.min(head, raw));
      el.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0) scale(" + scaleNum + ")";
    }
  }

  /* ---- Mobile nav ------------------------------------------------------ */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  var navLinks = nav ? nav.querySelectorAll("a") : [];

  function navIsMobile() {
    return toggle && getComputedStyle(toggle).display !== "none";
  }
  function openNav() {
    body.classList.add("nav-open");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
    // Defer focus a frame: the panel's visibility flips to visible on the next
    // style recalc, and focus() is refused while it is still computed hidden.
    if (navLinks.length) requestAnimationFrame(function () { navLinks[0].focus(); });
  }
  function closeNav(returnFocus) {
    body.classList.remove("nav-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    if (returnFocus && toggle) toggle.focus();
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      if (body.classList.contains("nav-open")) closeNav(false);
      else openNav();
    });
    navLinks.forEach(function (a) {
      a.addEventListener("click", function () { closeNav(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (!body.classList.contains("nav-open")) return;
      if (e.key === "Escape") { closeNav(true); return; }
      if (e.key === "Tab" && navIsMobile()) {
        // Focus trap. Order the set as it appears in the DOM (links, then the
        // toggle, which comes last), and snap any stray focus back into the panel
        // so Tab can never reach the hidden background content.
        var focusable = Array.prototype.slice.call(navLinks).concat([toggle]);
        var idx = focusable.indexOf(document.activeElement);
        if (idx === -1) { e.preventDefault(); focusable[0].focus(); return; }
        if (e.shiftKey && idx === 0) { e.preventDefault(); focusable[focusable.length - 1].focus(); }
        else if (!e.shiftKey && idx === focusable.length - 1) { e.preventDefault(); focusable[0].focus(); }
      }
    });
    // If resized to desktop while open, reset state
    window.addEventListener("resize", function () {
      if (!navIsMobile() && body.classList.contains("nav-open")) closeNav(false);
    }, { passive: true });
  }

  /* ---- Reveal on scroll (+ course-line draw) -------------------------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-clip, .course");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
    // Above-the-fold hero content must reveal on load regardless of the
    // intersection threshold (on mobile the bottom-aligned hero can leave the
    // big headline just under the observer margin while the photo settles).
    requestAnimationFrame(function () {
      document.querySelectorAll(
        ".hero .reveal, .hero .reveal-clip, .page-hero .reveal, .page-hero .reveal-clip"
      ).forEach(function (el) { el.classList.add("is-in"); io.unobserve(el); });
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---- Auto-stagger children ------------------------------------------ */
  document.querySelectorAll("[data-stagger]").forEach(function (group) {
    var i = 0;
    Array.prototype.forEach.call(group.children, function (child) {
      child.style.setProperty("--i", i++);
    });
  });

  /* ---- Wire scroll/resize -------------------------------------------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      onScrollHeader(); updateProgress(); updateParallax(); ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { updateProgress(); updateParallax(); }, { passive: true });
  onScrollHeader(); updateProgress(); updateParallax();

  /* ---- Services sub-nav: active section + auto-scroll into view ------- */
  var subnav = document.querySelector(".subnav__inner");
  var subnavLinks = document.querySelectorAll(".subnav a");
  if ("IntersectionObserver" in window && subnavLinks.length) {
    var linkFor = {};
    subnavLinks.forEach(function (a) {
      var id = a.getAttribute("href");
      if (id && id.charAt(0) === "#") linkFor[id.slice(1)] = a;
    });
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        subnavLinks.forEach(function (a) { a.classList.remove("active"); });
        var a = linkFor[e.target.id];
        if (a) {
          a.classList.add("active");
          if (subnav) {
            var target = a.offsetLeft - subnav.clientWidth / 2 + a.offsetWidth / 2;
            subnav.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
          }
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(linkFor).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) sio.observe(sec);
    });
  }

  /* ---- Footer year ---------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Contact form (mockup, no backend) ------------------------------ */
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.querySelector("[data-form-note]");
      if (note) note.hidden = false;
      form.reset();
    });
  }
})();
