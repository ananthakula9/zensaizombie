/* =====================================================================
   ZensaiZombie — tiny progressive-enhancement script.
   No frameworks, no dependencies, ~2 KB. Everything degrades gracefully.
   ===================================================================== */
(function () {
  "use strict";

  /* --------------------------------------------------------------
     1. Mobile navigation (hamburger)
     -------------------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function setNav(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNav(toggle.getAttribute("aria-expanded") !== "true");
    });

    // close after tapping a link, and on Escape
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setNav(false);
    });
    // reset state when resizing up to the desktop layout
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 896) setNav(false);
    });
  }

  /* --------------------------------------------------------------
     2. Click-to-load YouTube embeds
     Thumbnails are plain images (lazy-loaded) so nothing from
     youtube.com is requested until the visitor presses play.
     -------------------------------------------------------------- */
  var frames = document.querySelectorAll(".video-frame[data-video-id]");

  Array.prototype.forEach.call(frames, function (frame) {
    frame.addEventListener("click", function (e) {
      var btn = e.target.closest(".video-play");
      if (!btn || frame.dataset.loaded === "true") return;
      frame.dataset.loaded = "true";

      var id = frame.dataset.videoId;
      var title = frame.dataset.videoTitle || "YouTube video";
      var iframe = document.createElement("iframe");
      iframe.src =
        "https://www.youtube-nocookie.com/embed/" +
        encodeURIComponent(id) +
        "?autoplay=1&rel=0&modestbranding=1";
      iframe.title = title;
      iframe.loading = "lazy";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";

      frame.innerHTML = "";
      frame.appendChild(iframe);
    });
  });

  /* --------------------------------------------------------------
     3. Scroll reveal (skipped entirely for reduced-motion users)
     -------------------------------------------------------------- */
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealables = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !prefersReduced) {
    document.documentElement.classList.add("js-reveal");

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    Array.prototype.forEach.call(revealables, function (el) {
      io.observe(el);
    });
  }
})();
