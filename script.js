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
})();
