/* Royal Home Appliances — cinematic interactions
   Loader, scroll-aware nav, scroll-reveal, animated counters, mobile menu. */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- site-wide fixed crystal background (every page) ---- */
  (function injectBg() {
    if (document.querySelector('.cin-bg')) return;
    var body = document.body;
    if (!body) return;
    var scrim = document.createElement('div');
    scrim.className = 'cin-bg-scrim';
    scrim.setAttribute('aria-hidden', 'true');
    var v = document.createElement('video');
    v.className = 'cin-bg';
    v.setAttribute('aria-hidden', 'true');
    v.muted = true; v.defaultMuted = true; v.loop = true; v.autoplay = true;
    v.playsInline = true; v.setAttribute('playsinline', ''); v.setAttribute('muted', '');
    v.setAttribute('preload', 'auto');
    v.src = 'images/hero-abstract.mp4';
    body.insertBefore(scrim, body.firstChild);
    body.insertBefore(v, body.firstChild);
    var p = v.play(); if (p && p.catch) p.catch(function () {});
  })();

  /* ---- loader ---- */
  function hideLoader() {
    var l = document.querySelector('.cin-loader');
    if (l) l.classList.add('done');
  }
  window.addEventListener('load', function () { setTimeout(hideLoader, reduced ? 0 : 900); });
  // safety: never trap the user behind the loader
  setTimeout(hideLoader, 3500);

  document.addEventListener('DOMContentLoaded', function () {

    /* ---- nav solid-on-scroll ---- */
    var nav = document.querySelector('.cin-nav');
    function onScroll() {
      if (!nav) return;
      if (window.scrollY > 40) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---- mobile menu ---- */
    var burger = document.querySelector('.cin-burger');
    var links = document.querySelector('.cin-links');
    if (burger && links) {
      burger.addEventListener('click', function () {
        var open = links.style.display === 'flex';
        links.style.display = open ? '' : 'flex';
        links.style.position = 'absolute';
        links.style.top = '82px';
        links.style.left = '0';
        links.style.right = '0';
        links.style.flexDirection = 'column';
        links.style.gap = '0';
        links.style.background = 'rgba(6,12,26,.97)';
        links.style.padding = open ? '0' : '18px 26px';
        links.style.borderBottom = open ? 'none' : '1px solid rgba(255,255,255,.1)';
      });
      links.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { if (window.innerWidth <= 760) links.style.display = ''; });
      });
    }

    /* ---- scroll reveal ---- */
    var reveals = document.querySelectorAll('.reveal');
    if (reduced || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
      reveals.forEach(function (el) { io.observe(el); });
    }

    /* ---- animated counters ---- */
    function animateCount(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var decimals = (String(target).split('.')[1] || '').length;
      if (reduced) { el.textContent = target.toFixed(decimals) + suffix; return; }
      var dur = 1600, start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(decimals) + suffix;
      }
      requestAnimationFrame(step);
    }
    var counters = document.querySelectorAll('[data-count]');
    if ('IntersectionObserver' in window) {
      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { co.observe(el); });
    } else {
      counters.forEach(animateCount);
    }

    /* ---- subtle hero parallax (desktop, motion-ok only) ---- */
    if (!reduced && window.matchMedia('(pointer:fine)').matches) {
      var hero = document.querySelector('.cin-hero');
      var layer = document.querySelector('.cin-hero::after');
      if (hero) {
        hero.addEventListener('mousemove', function (ev) {
          var x = (ev.clientX / window.innerWidth - 0.5) * 14;
          var y = (ev.clientY / window.innerHeight - 0.5) * 14;
          hero.style.setProperty('--px', x + 'px');
          hero.style.setProperty('--py', y + 'px');
          var copy = hero.querySelector('.cin-hero-copy');
          if (copy) copy.style.transform = 'translate(' + (x * 0.3) + 'px,' + (y * 0.3) + 'px)';
        });
      }
    }
  });
})();
