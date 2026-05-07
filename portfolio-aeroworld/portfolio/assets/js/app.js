/* =============================================
   Mohammed Abbakar Portfolio — Interactivity
   ============================================= */

(function () {
  'use strict';

  // ---------------------------------------------
  // 1. Bilingual toggle (EN ↔ FR)
  // ---------------------------------------------
  const STORAGE_KEY = 'mohammed-portfolio-lang';
  let currentLang = localStorage.getItem(STORAGE_KEY) || 'en';

  const langBtn  = document.getElementById('langBtn');
  const labels   = { en: '🇫🇷 FR', fr: '🇬🇧 EN' };

  function applyLang(lang, instant = false) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    if (langBtn) langBtn.textContent = labels[lang];

    const els = document.querySelectorAll('.t');
    if (instant) {
      els.forEach(el => {
        const txt = el.getAttribute('data-' + lang);
        if (txt) el.innerHTML = txt;
      });
      return;
    }

    document.body.classList.add('lang-switching');
    setTimeout(() => {
      els.forEach(el => {
        const txt = el.getAttribute('data-' + lang);
        if (txt) el.innerHTML = txt;
      });
      requestAnimationFrame(() => {
        document.body.classList.remove('lang-switching');
      });
    }, 200);
  }

  if (langBtn) {
    langBtn.addEventListener('click', () => {
      applyLang(currentLang === 'en' ? 'fr' : 'en');
    });
  }
  // Apply saved language on first paint
  applyLang(currentLang, true);


  // ---------------------------------------------
  // 2. Sticky header scroll state
  // ---------------------------------------------
  const header = document.getElementById('siteHeader');
  const toTop  = document.getElementById('toTop');

  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 30);
    if (toTop)  toTop.classList.toggle('visible',   y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Back to top
  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // ---------------------------------------------
  // 3. Mobile menu toggle
  // ---------------------------------------------
  const menuBtn = document.getElementById('menuBtn');
  const nav     = document.getElementById('siteNav');

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('open');
      nav.classList.toggle('open');
    });

    // Close menu when a nav link is clicked
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menuBtn.classList.remove('open');
        nav.classList.remove('open');
      });
    });
  }


  // ---------------------------------------------
  // 4. Active nav link based on section in view
  // ---------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => navObserver.observe(s));


  // ---------------------------------------------
  // 5. Reveal-on-scroll for non-hero sections
  // ---------------------------------------------
  const revealTargets = [
    '.section-label',
    '.section-title-lg',
    '.section-title',
    '.about-text > *',
    '.about-aside',
    '.skill-cat',
    '.project-card',
    '.tl-item',
    '.education-title',
    '.edu-card',
    '.contact-intro',
    '.biz-card',
    '.social-row'
  ];
  const revealEls = document.querySelectorAll(revealTargets.join(', '));
  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    // Subtle stagger inside same section grid
    if (el.matches('.skill-cat, .project-card, .tl-item, .edu-card')) {
      const siblings = Array.from(el.parentNode.children).filter(c => c.classList.contains('reveal'));
      const idx = siblings.indexOf(el);
      if (idx > 0) el.style.transitionDelay = (idx * 0.08) + 's';
    }
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));


  // ---------------------------------------------
  // 6. Custom cursor (desktop only)
  // ---------------------------------------------
  const supportsHover = window.matchMedia('(hover: hover)').matches;
  const isWide        = window.matchMedia('(min-width: 981px)').matches;

  if (supportsHover && isWide) {
    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');

    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      document.body.classList.add('cursor-active');
    });

    document.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-active');
    });

    function tick() {
      // Dot follows immediately
      dotX = mouseX;
      dotY = mouseY;
      if (dot) dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;

      // Ring follows with a smooth lag
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ring) ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

      requestAnimationFrame(tick);
    }
    tick();

    // Hover targets — expand the ring
    const hoverSelector = 'a, button, .stat, .skill-tags span, .tag, .edu-card, .biz-line, .project-card';
    document.querySelectorAll(hoverSelector).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }


  // ---------------------------------------------
  // 7. Subtle parallax on hero photo (desktop)
  // ---------------------------------------------
  if (supportsHover && isWide && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const heroCard  = document.querySelector('.hero-card');
    const heroPhoto = document.querySelector('.hero-photo');
    const photoImg  = heroPhoto && heroPhoto.querySelector('img');
    const floats    = document.querySelectorAll('.float-icon');

    if (heroCard && photoImg) {
      heroCard.addEventListener('mousemove', (e) => {
        const rect = heroCard.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;

        photoImg.style.transform = `translate3d(${x * -10}px, ${y * -10}px, 0) scale(1.04)`;
        floats.forEach((el, i) => {
          const factor = (i + 1) * 8;
          el.style.transform = `translate3d(${x * factor}px, ${y * factor}px, 0)`;
        });
      });
      heroCard.addEventListener('mouseleave', () => {
        photoImg.style.transform = '';
        floats.forEach(el => { el.style.transform = ''; });
      });
    }
  }


  // ---------------------------------------------
  // 8. Stat counter animation (numbers count up on view)
  // ---------------------------------------------
  const statValues = document.querySelectorAll('.stat-value');

  function animateCount(el) {
    // Extract first number in text
    const text = el.textContent;
    const match = text.match(/\d+/);
    if (!match) return;
    const target = parseInt(match[0], 10);
    if (target < 2) return;

    const duration = 1200;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(target * eased);
      el.firstChild.textContent = current;
      if (t < 1) requestAnimationFrame(step);
      else el.firstChild.textContent = target;
    }
    requestAnimationFrame(step);
  }

  // Run only when stats enter view
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statValues.forEach(el => statObserver.observe(el));

  // ---------------------------------------------
  // 9. Carousel ("More Work")
  //    - Click arrows / dots
  //    - Keyboard left/right (when carousel in view & focused)
  //    - Touch swipe on mobile
  // ---------------------------------------------
  (function setupCarousel() {
    const carousel = document.getElementById('carousel');
    if (!carousel) return;

    const track    = document.getElementById('carouselTrack');
    const slides   = Array.from(track.querySelectorAll('.carousel-slide'));
    const prevBtn  = document.getElementById('carouselPrev');
    const nextBtn  = document.getElementById('carouselNext');
    const dotsBox  = document.getElementById('carouselDots');
    const bigNum   = document.getElementById('carouselBigNum');

    if (slides.length === 0) return;

    let current = 0;

    // Build dots
    const dots = slides.map((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'carousel-dot' + (i === 0 ? ' is-active' : '');
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', `Go to project ${i + 1}`);
      b.addEventListener('click', () => goTo(i));
      dotsBox.appendChild(b);
      return b;
    });

    // Initial state — first slide active
    slides[0].classList.add('is-active');
    if (bigNum) bigNum.textContent = slides[0].dataset.num || '01';

    function goTo(index) {
      if (index === current) return;
      const total = slides.length;
      // Wrap around
      if (index < 0)        index = total - 1;
      else if (index >= total) index = 0;

      const prev = slides[current];
      const next = slides[index];

      prev.classList.remove('is-active');
      prev.classList.add('is-leaving');
      // Clean up "is-leaving" after the transition finishes
      setTimeout(() => prev.classList.remove('is-leaving'), 600);

      next.classList.add('is-active');

      // Update dots
      dots[current].classList.remove('is-active');
      dots[index].classList.add('is-active');

      // Update big number with subtle fade
      if (bigNum) {
        bigNum.style.opacity = '0';
        bigNum.style.transform = 'translateX(-10px)';
        setTimeout(() => {
          bigNum.textContent = next.dataset.num || String(index + 1).padStart(2, '0');
          bigNum.style.opacity = '';
          bigNum.style.transform = '';
        }, 250);
      }

      current = index;
    }

    // Arrow buttons
    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

    // Keyboard navigation (only when carousel is in viewport)
    let inView = false;
    const carouselObs = new IntersectionObserver((entries) => {
      entries.forEach(e => { inView = e.isIntersecting; });
    }, { threshold: 0.4 });
    carouselObs.observe(carousel);

    document.addEventListener('keydown', (e) => {
      if (!inView) return;
      // Don't hijack keys while user is typing
      const tag = (document.activeElement && document.activeElement.tagName) || '';
      if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;

      if (e.key === 'ArrowLeft')  { goTo(current - 1); }
      if (e.key === 'ArrowRight') { goTo(current + 1); }
    });

    // Touch swipe
    let touchStartX = 0;
    let touchEndX   = 0;
    const SWIPE_THRESHOLD = 40;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const dx = touchEndX - touchStartX;
      if (Math.abs(dx) < SWIPE_THRESHOLD) return;
      if (dx < 0) goTo(current + 1);  // swipe left → next
      else        goTo(current - 1);  // swipe right → prev
    }, { passive: true });

  })();

})();
