/* NymaMar — interactions
   - Sticky header: transparent over hero, solid after scroll
   - Mobile nav toggle
   - Reveal-on-scroll
   - Scroll indicator: colour switch (white on dark / navy on light),
     fade as you scroll, reverse direction near the page bottom.
     Disabled on pages with <body data-no-indicator> (contact / ai-context / policies).
*/
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var body = document.body;

  /* ---- Sticky / solid header ------------------------------------------ */
  function onScrollHeader() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add("is-solid");
    else header.classList.remove("is-solid");
  }

  /* ---- Mobile nav ------------------------------------------------------ */
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      body.classList.toggle("nav-open");
      var open = body.classList.contains("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () { body.classList.remove("nav-open"); });
    });
  }

  /* ---- Reveal on scroll ------------------------------------------------ */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
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

  /* ---- Scroll progress bar -------------------------------------------- */
  var progress = document.querySelector(".scroll-progress");
  function updateProgress() {
    if (!progress) return;
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var p = max > 0 ? window.scrollY / max : 0;
    progress.style.transform = "scaleX(" + p.toFixed(4) + ")";
  }

  /* ---- Parallax -------------------------------------------------------- */
  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var parallaxEls = prefersReduced ? [] : Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  function updateParallax() {
    if (!parallaxEls.length) return;
    parallaxEls.forEach(function (el) {
      var speed = parseFloat(el.getAttribute("data-parallax")) || 0.18;
      var rect = el.getBoundingClientRect();
      var offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -speed;
      el.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
    });
  }

  /* ---- Scroll indicator ----------------------------------------------- */
  var indicator = document.querySelector(".scroll-indicator");
  var darkZones = Array.prototype.slice.call(document.querySelectorAll("[data-dark-zone]"));

  function indicatorOverDark() {
    if (!indicator) return false;
    var r = indicator.getBoundingClientRect();
    var probe = r.top + r.height / 2;
    return darkZones.some(function (z) {
      var b = z.getBoundingClientRect();
      return probe >= b.top && probe <= b.bottom;
    });
  }

  function onScrollIndicator() {
    if (!indicator) return;
    var doc = document.documentElement;
    var scrolled = window.scrollY;
    var max = doc.scrollHeight - window.innerHeight;
    var progress = max > 0 ? scrolled / max : 0;

    // Colour: navy when the line sits over a light section
    indicator.classList.toggle("is-light", !indicatorOverDark());

    // Fade out as the user scrolls down the first viewport...
    var fade = scrolled > window.innerHeight * 0.6;
    // ...but bring it back near the bottom, reversed, as a "back to top" cue
    var nearBottom = progress > 0.92;
    indicator.classList.toggle("is-hidden", fade && !nearBottom);
    indicator.classList.toggle("is-reversed", nearBottom);
  }

  /* ---- Wire up -------------------------------------------------------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      onScrollHeader();
      onScrollIndicator();
      updateProgress();
      updateParallax();
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { onScrollIndicator(); updateProgress(); updateParallax(); }, { passive: true });
  onScrollHeader();
  onScrollIndicator();
  updateProgress();
  updateParallax();

  /* ---- Services sub-nav: highlight the section in view ---------------- */
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
        if (a) a.classList.add("active");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(linkFor).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) sio.observe(sec);
    });
  }

  /* ---- Animated stat counters ----------------------------------------- */
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        cio.unobserve(el);
        var target = parseFloat(el.getAttribute("data-count"));
        var suffix = el.getAttribute("data-suffix") || "";
        var dur = 1400, start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = Math.round(target * eased);
          el.innerHTML = val + (suffix ? '<span class="suffix">' + suffix + "</span>" : "");
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
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
