(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme ---------- */
  var THEME_KEY = "cv-theme";
  var stored = null;
  try { stored = localStorage.getItem(THEME_KEY); } catch (e) { stored = null; }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#f7f8fc" : "#0b1020");
  }

  applyTheme(stored || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));

  var themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  /* ---------- Mobile menu ---------- */
  var menuToggle = document.getElementById("menuToggle");
  var nav = document.getElementById("nav");
  function closeMenu() {
    if (!nav) return;
    nav.classList.remove("is-open");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
  }
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });
  }

  /* ---------- Progress + topbar + to-top ---------- */
  var progressBar = document.getElementById("progressBar");
  var topbar = document.getElementById("topbar");
  var toTop = document.getElementById("toTop");

  function onScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var progress = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progressBar) progressBar.style.width = progress.toFixed(2) + "%";

    var scrolled = window.scrollY > 40;
    if (topbar) topbar.classList.toggle("is-scrolled", scrolled);
    if (toTop) toTop.classList.toggle("is-visible", window.scrollY > 500);
  }

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(function () { onScroll(); ticking = false; });
    }
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealItems.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Skill bars ---------- */
  var bars = Array.prototype.slice.call(document.querySelectorAll(".bar i"));
  function fillBars(scope) {
    (scope || bars).forEach(function (bar) {
      bar.style.width = (bar.getAttribute("data-level") || 0) + "%";
    });
  }

  var barsWrap = document.querySelector(".bars");
  if (barsWrap && "IntersectionObserver" in window && !reduceMotion) {
    var barsObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        fillBars();
        barsObserver.disconnect();
      }
    }, { threshold: 0.3 });
    barsObserver.observe(barsWrap);
  } else {
    fillBars();
  }

  /* ---------- Languages ---------- */
  var langs = document.querySelector(".langs");
  if (langs) {
    if ("IntersectionObserver" in window && !reduceMotion) {
      var langsObserver = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          langs.classList.add("is-visible");
          langsObserver.disconnect();
        }
      }, { threshold: 0.4 });
      langsObserver.observe(langs);
    } else {
      langs.classList.add("is-visible");
    }
  }

  /* ---------- Counters ---------- */
  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (reduceMotion) { el.textContent = String(target); return; }
    var duration = 1200;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  if (counters.length && "IntersectionObserver" in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute("data-count"); });
  }

  /* ---------- Active nav link ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav a"));
  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute("id");
          navLinks.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { threshold: 0.25, rootMargin: "-20% 0px -55% 0px" });
    sections.forEach(function (section) { navObserver.observe(section); });
  }

  /* ---------- Toast + copy email ---------- */
  var toast = document.getElementById("toast");
  var toastTimer = null;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("is-visible"); }, 2200);
  }

  Array.prototype.slice.call(document.querySelectorAll("[data-email]")).forEach(function (btn) {
    btn.addEventListener("click", function () {
      var email = btn.getAttribute("data-email") || "";
      function done() { showToast("Email copiado: " + email); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done).catch(function () {
          window.location.href = "mailto:" + email;
        });
      } else {
        window.location.href = "mailto:" + email;
      }
    });
  });

  /* ---------- Print / Download PDF ---------- */
  Array.prototype.slice.call(document.querySelectorAll("[id^='printBtn']")).forEach(function (btn) {
    btn.addEventListener("click", function () { window.print(); });
  });

  window.addEventListener("beforeprint", function () {
    revealItems.forEach(function (el) { el.classList.add("is-visible"); });
    fillBars();
    if (langs) langs.classList.add("is-visible");
    counters.forEach(function (el) { el.textContent = el.getAttribute("data-count"); });
  });

  /* ---------- Year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
