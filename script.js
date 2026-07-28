(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Sticky header shadow on scroll --- */
  var header = document.getElementById('site-header');
  function onScroll() {
    if (window.scrollY > 8) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- Mobile nav toggle --- */
  var navToggle = document.getElementById('nav-toggle');
  var mainNav = document.getElementById('main-nav');

  function closeNav() {
    header.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', function () {
    var isOpen = header.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  mainNav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') closeNav();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  /* --- Reveal-on-scroll for section headers and cards --- */
  var revealTargets = document.querySelectorAll(
    '.section-head, .catalog-card, .service-card, .gallery-tile, .payment-card, .fact-card, .trust-panel'
  );

  if (!reduceMotion && 'IntersectionObserver' in window) {
    revealTargets.forEach(function (el) { el.classList.add('reveal'); });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealTargets.forEach(function (el) { observer.observe(el); });
  }

  /* --- Consultation form -> WhatsApp --- */
  var WHATSAPP_NUMBER = '78126123777';
  var form = document.getElementById('consult-form');

  if (form) {
    var caption = form.querySelector('.form-caption');
    var defaultCaptionText = caption ? caption.textContent : '';

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var message = form.message.value.trim();

      if (!name || !phone) {
        if (caption) {
          caption.textContent = 'Пожалуйста, укажите имя и телефон';
          caption.classList.add('form-error');
        }
        (name ? form.phone : form.name).focus();
        return;
      }

      if (caption) {
        caption.textContent = defaultCaptionText;
        caption.classList.remove('form-error');
      }

      var lines = [
        'Здравствуйте! Хочу обсудить проект в «Ювелирном бюро».',
        'Имя: ' + name,
        'Телефон: ' + phone
      ];
      if (message) lines.push('Комментарий: ' + message);

      var text = encodeURIComponent(lines.join('\n'));
      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + text;

      window.open(url, '_blank', 'noopener');
    });
  }

  /* --- Hero arcade parallax (scroll-driven, rAF-throttled, no fixed-attachment) --- */
  var heroArcade = document.querySelector('.hero-arcade');
  var heroSection = document.getElementById('hero');

  if (heroArcade && heroSection && !reduceMotion) {
    var parallaxSpeed = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--parallax-speed')
    ) || 0.22;
    var parallaxTicking = false;

    function updateParallax() {
      parallaxTicking = false;
      var rect = heroSection.getBoundingClientRect();
      /* Only bother transforming while the hero is anywhere near the viewport */
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      var offset = window.scrollY * parallaxSpeed;
      heroArcade.style.transform = 'translate3d(0, ' + offset + 'px, 0)';
    }

    function requestParallax() {
      if (!parallaxTicking) {
        parallaxTicking = true;
        window.requestAnimationFrame(updateParallax);
      }
    }

    window.addEventListener('scroll', requestParallax, { passive: true });
    updateParallax();
  }

  /* --- Catalog cards: 3D tilt on pointer, with light glare --- */
  var tiltCards = document.querySelectorAll('.catalog-card');
  var supportsHoverTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (tiltCards.length && supportsHoverTilt && !reduceMotion) {
    var tiltMax = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--tilt-max-deg')
    ) || 7;

    tiltCards.forEach(function (card) {
      function onMove(e) {
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;

        var rotY = (px - 0.5) * 2 * tiltMax;
        var rotX = -(py - 0.5) * 2 * tiltMax;

        card.style.setProperty('--tilt-rx', rotX.toFixed(2) + 'deg');
        card.style.setProperty('--tilt-ry', rotY.toFixed(2) + 'deg');
        card.style.setProperty('--glare-x', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--glare-y', (py * 100).toFixed(1) + '%');
      }

      card.addEventListener('mouseenter', function () {
        card.classList.add('is-tilting');
      });

      card.addEventListener('mousemove', onMove);

      card.addEventListener('mouseleave', function () {
        card.classList.remove('is-tilting');
        card.style.setProperty('--tilt-rx', '0deg');
        card.style.setProperty('--tilt-ry', '0deg');
      });
    });
  }
})();
