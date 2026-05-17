(function () {
  'use strict';

  var header  = document.getElementById('site-header');
  var waFloat = document.getElementById('wa-float');
  var SCROLL_HEADER = 60;
  var SCROLL_WA     = 200;

  /* ── Sticky header + desktop WA button ─────────────────── */
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('scrolled', y > SCROLL_HEADER);
    if (waFloat) waFloat.classList.toggle('wa-float--visible', y > SCROLL_WA);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── FAQ accordion ──────────────────────────────────────── */
  var triggers = document.querySelectorAll('.faq-item__trigger');
  triggers.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var answerId = btn.getAttribute('aria-controls');
      var answer   = answerId ? document.getElementById(answerId) : null;

      triggers.forEach(function (other) {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          var otherId     = other.getAttribute('aria-controls');
          var otherAnswer = otherId ? document.getElementById(otherId) : null;
          if (otherAnswer) otherAnswer.style.maxHeight = '0';
        }
      });

      var next = !expanded;
      btn.setAttribute('aria-expanded', String(next));
      if (answer) {
        answer.style.maxHeight = next ? answer.scrollHeight + 'px' : '0';
      }
    });
  });

  /* ── Smooth scroll for anchor links ────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id     = link.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      var offset = (header ? header.offsetHeight : 0) + 12;
      var top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ── Scroll-reveal (IntersectionObserver) ───────────────── */
  var REVEAL_GROUPS = [
    { selector: '.trust-bar',             stagger: false },
    { selector: '.section-header',        stagger: false },
    { selector: '.service-card',          stagger: true  },
    { selector: '.why-item',              stagger: true  },
    { selector: '.process__step',         stagger: true  },
    { selector: '.workshops__card',       stagger: false },
    { selector: '.gallery-preview',       stagger: false },
    { selector: '.testimonials-coming',   stagger: false },
    { selector: '.faq-item',              stagger: true  },
    { selector: '.final-cta__title',      stagger: false },
    { selector: '.final-cta__sub',        stagger: false },
    { selector: '.final-cta__actions',    stagger: false }
  ];

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    REVEAL_GROUPS.forEach(function (group) {
      document.querySelectorAll(group.selector).forEach(function (el, i) {
        if (el.closest('#hero')) return; /* skip hero — has CSS entrance */
        el.classList.add('reveal');
        if (group.stagger && i > 0) {
          el.style.transitionDelay = Math.min(i * 0.08, 0.36) + 's';
        }
        revealObserver.observe(el);
      });
    });
  } else {
    /* Fallback for old browsers */
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ── Counter animation for "23 שנות ניסיון" ────────────── */
  var countEl = document.querySelector('.trust-stat__num[data-count]');
  if (countEl && 'IntersectionObserver' in window) {
    var counted = false;
    var countTarget = parseInt(countEl.getAttribute('data-count'), 10) || 23;
    new IntersectionObserver(function (entries) {
      if (!counted && entries[0].isIntersecting) {
        counted = true;
        var n = 0;
        var step = Math.max(1, Math.ceil(countTarget / 35));
        var timer = setInterval(function () {
          n = Math.min(n + step, countTarget);
          countEl.textContent = n;
          if (n >= countTarget) clearInterval(timer);
        }, 28);
      }
    }, { threshold: 0.7 }).observe(countEl);
  }

})();
