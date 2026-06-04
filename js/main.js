/* ========================================================
   Layte LifeScience — Global JS
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');

  if (!navbar) return;

  // Start with navbar hidden
  navbar.classList.add('nav-hidden');

  let lastScrollY = window.scrollY;
  const threshold = 12;

  window.addEventListener(
    'scroll',
    () => {
      const currentScrollY = window.scrollY;

      // Shadow effect
      navbar.classList.toggle('scrolled', currentScrollY > 40);

      const diff = currentScrollY - lastScrollY;

      if (Math.abs(diff) < threshold) {
        // Not enough movement
        return;
      }

      if (diff > 0) {
        // Scrolling down - keep hidden
        navbar.classList.add('nav-hidden');
      } else {
        // Scrolling up - show navbar
        navbar.classList.remove('nav-hidden');
      }

      lastScrollY = currentScrollY;
    },
    { passive: true }
  );

  /* ── Mobile menu ───────────────────────────────────── */
  const hamburger = document.getElementById('mobile-menu-button');
  const mobileNav = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-menu-close');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    mobileClose?.addEventListener('click', closeMobile);
    mobileNav.addEventListener('click', e => { if (e.target === mobileNav) closeMobile(); });
  }
  function closeMobile() {
    mobileNav?.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* Mobile accordion sub-menus */
  document.querySelectorAll('.nav-mobile-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const sub = btn.nextElementSibling;
      if (sub) sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
      btn.querySelector('.chevron')?.classList.toggle('rotated');
    });
  });

  /* Close mobile nav on link click */
  document.querySelectorAll('#mobile-menu a').forEach(a => {
    a.addEventListener('click', closeMobile);
  });

  /* ── Active nav link ───────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[data-page], .nav-mobile-link[data-page]').forEach(link => {
    if (link.dataset.page === currentPage) link.classList.add('active');
  });

  /* ── Hero Slider ────────────────────────────────────── */
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length > 0) {
    let currentIndex = 0;
    let slideTimeout;

    // Initialize video end listeners
    slides.forEach((slide) => {
      if (slide.dataset.type === 'video') {
        const video = slide.querySelector('video');
        if (video) {
          video.addEventListener('ended', () => {
            if (slide.classList.contains('active')) {
              nextSlide();
            }
          });
        }
      }
    });

    function showSlide(index) {
      clearTimeout(slideTimeout);

      const currentSlide = slides[currentIndex];
      if (currentSlide) {
        currentSlide.classList.remove('active');
        if (currentSlide.dataset.type === 'video') {
          const video = currentSlide.querySelector('video');
          if (video) {
            video.pause();
            video.removeAttribute('src');
            video.removeAttribute('autoplay');
            try {
              video.load();
            } catch (e) { }
          }
        }
      }

      currentIndex = index;
      if (currentIndex >= slides.length) currentIndex = 0;
      if (currentIndex < 0) currentIndex = slides.length - 1;

      const nextSlideEl = slides[currentIndex];
      nextSlideEl.classList.add('active');

      if (nextSlideEl.dataset.type === 'video') {
        const video = nextSlideEl.querySelector('video');
        if (video) {
          const isMobile = window.innerWidth < 768;
          const videoSrc = isMobile
            ? 'videos/mobile/trust-mobile.mp4'
            : 'videos/desktop/patient-laugh-trust-desktop1.mp4';
          const posterSrc = isMobile
            ? 'images/Hero section image for mobile.jpg'
            : 'images/Hero section image.jpg';

          video.poster = posterSrc;
          video.src = videoSrc;
          video.autoplay = true;
          video.muted = true;
          video.playsInline = true;

          try {
            video.load();
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.then(() => {
                console.log('Video started playing successfully');
              }).catch(err => {
                console.log('Video play failed:', err);
                slideTimeout = setTimeout(nextSlide, 8000);
              });
            }
          } catch (err) {
            console.log('Video load error:', err);
            slideTimeout = setTimeout(nextSlide, 8000);
          }
        } else {
          slideTimeout = setTimeout(nextSlide, 5000);
        }
      } else {
        const duration = parseInt(nextSlideEl.dataset.duration, 10) || 5000;
        slideTimeout = setTimeout(nextSlide, duration);
      }
    }

    function nextSlide() {
      showSlide(currentIndex + 1);
    }

    showSlide(0);

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const activeSlide = slides[currentIndex];
        if (activeSlide && activeSlide.dataset.type === 'video') {
          const video = activeSlide.querySelector('video');
          if (video) {
            const isMobile = window.innerWidth < 768;
            const expectedSrc = isMobile
              ? 'videos/mobile/trust-mobile.mp4'
              : 'videos/desktop/patient-laugh-trust-desktop1.mp4';

            const currentSrc = video.getAttribute('src');
            if (currentSrc !== expectedSrc) {
              video.poster = isMobile
                ? 'images/Hero section image for mobile.jpg'
                : 'images/Hero section image.jpg';
              video.src = expectedSrc;
              video.muted = true;
              video.playsInline = true;
              try {
                video.load();
                video.play().catch(e => console.log(e));
              } catch (e) { }
            }
          }
        }
      }, 250);
    });
  }

  /* ── Scroll fade-up animations ─────────────────────── */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  /* ── Stats counter ─────────────────────────────────── */
  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const formatter = new Intl.NumberFormat('en-IN');
    const duration = 1800;
    const start = performance.now();
    const step = ts => {
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatter.format(Math.floor(ease * target)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number[data-target]').forEach(el => statsObserver.observe(el));

  /* ── Products page filter tabs ─────────────────────── */
  const tabsWrap = document.querySelector('.ll-filter-tabs');
  const productCards = Array.from(document.querySelectorAll('.ll-product-card[data-category]'));
  if (tabsWrap && productCards.length) {
    const tabs = Array.from(tabsWrap.querySelectorAll('button.ll-tab[data-filter]'));

    function setActiveTab(active) {
      tabs.forEach(t => {
        const isActive = t === active;
        t.classList.toggle('active', isActive);
        t.setAttribute('aria-selected', String(isActive));
      });
    }

    function applyFilter(filter) {
      const normalized = (filter || '').toLowerCase();
      productCards.forEach(card => {
        const cat = (card.dataset.category || '').toLowerCase();
        const show = normalized === 'all' || cat === normalized;
        card.classList.toggle('ll-hidden', !show);
      });
    }

    tabsWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('button.ll-tab[data-filter]');
      if (!btn) return;
      setActiveTab(btn);
      applyFilter(btn.dataset.filter);
    });

    // initial state
    const active = tabs.find(t => t.classList.contains('active')) || tabs[0];
    if (active) {
      setActiveTab(active);
      applyFilter(active.dataset.filter);
    }
  }

  /* ── WhatsApp contact form ─────────────────────────── */
  const form = document.getElementById('contact-form');
  if (form) {
    const WANUM = '916003214247';
    let submitted = false;

    const rules = {
      name: { re: /.{2,}/, msg: 'Please enter your full name.' },
      company: { re: /.{1,}/, msg: 'Please enter your company name.', optional: true },
      mobile: { re: /^[6-9]\d{9}$/, msg: 'Enter a valid 10-digit mobile number.' },
      email: { re: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: 'Enter a valid email address.', optional: true },
      message: { re: /.{10,}/, msg: 'Message must be at least 10 characters.' },
    };

    function validateField(id) {
      const rule = rules[id]; if (!rule) return true;
      const el = document.getElementById(id); if (!el) return true;
      const val = el.value.trim();
      const errEl = document.getElementById(`err-${id}`);
      if (rule.optional && !val) { clearErr(id); return true; }
      if (rule.re.test(val)) { clearErr(id); el.style.borderColor = '#22c55e'; return true; }
      showErr(id, rule.msg); return false;
    }

    function showErr(id, msg) {
      const el = document.getElementById(id); if (!el) return;
      el.style.borderColor = '#ef4444';
      let e = document.getElementById(`err-${id}`);
      if (!e) { e = document.createElement('p'); e.id = `err-${id}`; e.style.cssText = 'color:#ef4444;font-size:12px;margin-top:4px;'; el.parentNode.appendChild(e); }
      e.textContent = '⚠ ' + msg;
    }

    function clearErr(id) {
      const el = document.getElementById(id); if (!el) return;
      el.style.borderColor = '';
      const e = document.getElementById(`err-${id}`);
      if (e) e.remove();
    }

    ['name', 'company', 'mobile', 'email', 'message'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => { if (submitted) validateField(id); });
    });

    form.addEventListener('submit', e => {
      e.preventDefault(); submitted = true;
      const valid = ['name', 'company', 'mobile', 'email', 'message'].map(validateField).every(Boolean);
      if (!valid) { form.querySelector('[style*="border-color: rgb(239"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }

      const get = id => document.getElementById(id)?.value.trim() || '';
      const enquiryType = document.getElementById('enquiry-type')?.value || '';
      const now = new Date();

      const msg = `🏥 *New Enquiry – Layte LifeScience Pvt. Ltd.*
━━━━━━━━━━━━━━━━━━━━━━━
👤 *Name:* ${get('name')}
🏢 *Company:* ${get('company') || 'Not provided'}
📞 *Mobile:* ${get('mobile')}
📧 *Email:* ${get('email') || 'Not provided'}
📋 *Enquiry Type:* ${enquiryType || 'General'}
━━━━━━━━━━━━━━━━━━━━━━━
💬 *Message:*
${get('message')}
━━━━━━━━━━━━━━━━━━━━━━━
🕐 *Received:* ${now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} at ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
📍 *Source:* Website Contact Form`;

      window.open(`https://wa.me/${WANUM}?text=${encodeURIComponent(msg)}`, '_blank');
      showToast('✅ Opening WhatsApp with your enquiry!');
      form.reset(); submitted = false;
      ['name', 'company', 'mobile', 'email', 'message'].forEach(clearErr);
    });
  }

  /* ── Toast ─────────────────────────────────────────── */
  function showToast(msg) {
    const existing = document.getElementById('toast');
    if (existing) existing.remove();
    const t = document.createElement('div');
    t.id = 'toast';
    t.textContent = msg;
    Object.assign(t.style, { position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)', background: getComputedStyle(document.documentElement).getPropertyValue('--navy'), color: '#fff', padding: '14px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: '600', boxShadow: '0 8px 30px rgba(0,0,0,0.25)', zIndex: '9999', opacity: '0', transition: 'opacity 0.3s ease', whiteSpace: 'nowrap' });
    document.body.appendChild(t);
    requestAnimationFrame(() => t.style.opacity = '1');
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 400); }, 3500);
  }

  window.showToast = showToast;

});
