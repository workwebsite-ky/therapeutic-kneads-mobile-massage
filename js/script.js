/* Therapeutic Kneads — interactions */
(function () {
  "use strict";

  /* Page loader */
  window.addEventListener("load", function () {
    setTimeout(function () { document.body.classList.add("loaded"); }, 350);
  });
  // fallback so content never stays hidden
  setTimeout(function () { document.body.classList.add("loaded"); }, 2200);

  document.addEventListener("DOMContentLoaded", function () {

    /* Sticky nav on scroll */
    var nav = document.querySelector(".nav");
    function onScroll() {
      if (window.scrollY > 40) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");

      var tt = document.querySelector(".to-top");
      if (tt) {
        if (window.scrollY > 500) tt.classList.add("show");
        else tt.classList.remove("show");
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* Mobile menu */
    var toggle = document.querySelector(".nav__toggle");
    var links = document.querySelector(".nav__links");
    if (toggle && links) {
      toggle.addEventListener("click", function () {
        toggle.classList.toggle("open");
        links.classList.toggle("open");
      });
      links.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          toggle.classList.remove("open");
          links.classList.remove("open");
        });
      });
    }

    /* Scroll reveal */
    var reveals = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { threshold: 0.14, rootMargin: "0px 0px -50px 0px" });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add("in"); });
    }

    /* Animated counters */
    var counters = document.querySelectorAll("[data-count]");
    var started = false;
    function runCounters() {
      counters.forEach(function (c) {
        var target = parseFloat(c.getAttribute("data-count"));
        var suffix = c.getAttribute("data-suffix") || "";
        var decimals = (target % 1 !== 0) ? 1 : 0;
        var dur = 1600, start = 0, t0 = null;
        function tick(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = (start + (target - start) * eased).toFixed(decimals);
          c.textContent = val + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }
    var statsBand = document.querySelector(".stats");
    if (statsBand && counters.length) {
      var so = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !started) { started = true; runCounters(); }
        });
      }, { threshold: 0.4 });
      so.observe(statsBand);
    }

    /* FAQ accordion */
    document.querySelectorAll(".faq__q").forEach(function (q) {
      q.addEventListener("click", function () {
        var item = q.closest(".faq__item");
        var a = item.querySelector(".faq__a");
        var open = item.classList.contains("open");
        document.querySelectorAll(".faq__item.open").forEach(function (o) {
          o.classList.remove("open");
          o.querySelector(".faq__a").style.maxHeight = null;
        });
        if (!open) {
          item.classList.add("open");
          a.style.maxHeight = a.scrollHeight + "px";
        }
      });
    });

    /* Back to top */
    var tt = document.querySelector(".to-top");
    if (tt) tt.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    /* Footer year */
    var yr = document.getElementById("year");
    if (yr) yr.textContent = new Date().getFullYear();

    /* Highlight today's opening hours */
    var todayIdx = new Date().getDay(); // 0=Sun
    var rows = document.querySelectorAll(".hours__row[data-day]");
    rows.forEach(function (r) {
      if (parseInt(r.getAttribute("data-day"), 10) === todayIdx) r.classList.add("today");
    });

    /* Contact form -> mailto fallback */
    var form = document.getElementById("bookingForm");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var name = (form.name && form.name.value || "").trim();
        var email = (form.email && form.email.value || "").trim();
        var phone = (form.phone && form.phone.value || "").trim();
        var service = (form.service && form.service.value || "").trim();
        var message = (form.message && form.message.value || "").trim();
        var subject = encodeURIComponent("Booking request — " + (name || "New client"));
        var body = encodeURIComponent(
          "Name: " + name + "\n" +
          "Email: " + email + "\n" +
          "Phone: " + phone + "\n" +
          "Service / event: " + service + "\n\n" +
          message
        );
        window.location.href = "mailto:christmasmorgan@yahoo.com?subject=" + subject + "&body=" + body;
      });
    }
  });
})();
