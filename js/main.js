/* ============================================================
   BuildSafe NG — interactions
   Lightweight, dependency-free.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Navbar: shadow on scroll ---------- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = (el.getAttribute('data-decimals') || '0') | 0;
    var dur = 1500, start = null;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = val.toLocaleString('en-US', {
        minimumFractionDigits: decimals, maximumFractionDigits: decimals
      });
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = target.toLocaleString('en-US', {
        minimumFractionDigits: decimals, maximumFractionDigits: decimals
      });
    }
    requestAnimationFrame(frame);
  }
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  }

  /* ---------- Hero stage bars fill ---------- */
  window.addEventListener('load', function () {
    document.querySelectorAll('.bar__fill[data-w]').forEach(function (el) {
      setTimeout(function () { el.style.width = el.getAttribute('data-w') + '%'; }, 300);
    });
  });

  /* ---------- Accordion ---------- */
  document.querySelectorAll('.acc__q').forEach(function (q) {
    q.addEventListener('click', function () {
      var acc = q.closest('.acc');
      var body = acc.querySelector('.acc__a');
      var isOpen = acc.classList.contains('open');
      // close siblings (single-open accordion)
      var group = acc.parentElement;
      group.querySelectorAll('.acc.open').forEach(function (other) {
        if (other !== acc) {
          other.classList.remove('open');
          other.querySelector('.acc__a').style.maxHeight = null;
          other.querySelector('.acc__q').setAttribute('aria-expanded', 'false');
        }
      });
      acc.classList.toggle('open', !isOpen);
      q.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
      body.style.maxHeight = !isOpen ? body.scrollHeight + 'px' : null;
    });
  });

  /* ---------- Project filter tabs ---------- */
  var tabs = document.querySelectorAll('.tab');
  if (tabs.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var f = tab.getAttribute('data-filter');
        document.querySelectorAll('[data-cat]').forEach(function (item) {
          var show = f === 'all' || item.getAttribute('data-cat') === f;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Login role selector ---------- */
  var roles = document.querySelectorAll('.role-opt');
  if (roles.length) {
    roles.forEach(function (r) {
      r.addEventListener('click', function () {
        roles.forEach(function (o) { o.classList.remove('active'); });
        r.classList.add('active');
      });
    });
  }

  /* ---------- Forms (demo + login + contact) ---------- */
  document.querySelectorAll('form[data-mock]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var success = form.querySelector('.form-success');
      var fields = form.querySelector('.form-fields');
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }
      setTimeout(function () {
        if (fields) fields.style.display = 'none';
        if (success) success.classList.add('show');
        if (!success) {
          // login flow → go to dashboard
          if (form.getAttribute('data-mock') === 'login') {
            window.location.href = 'dashboard.html';
          }
        }
      }, 700);
    });
  });

  /* ---------- Theme toggle (light / dark) ---------- */
  var root = document.documentElement;
  function getTheme() {
    try { return localStorage.getItem('bsng-theme') || 'light'; }
    catch (e) { return 'light'; }
  }
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('bsng-theme', t); } catch (e) {}
  }
  // pre-paint inline script normally sets this; ensure it's present as a fallback
  if (!root.getAttribute('data-theme')) setTheme(getTheme());
  document.querySelectorAll('.theme-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  });

  /* ---------- Footer year ---------- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

})();
