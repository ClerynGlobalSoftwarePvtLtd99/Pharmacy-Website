document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const btn = document.getElementById('mobile-menu-button');
  const menu = document.getElementById('mobile-menu');

  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if(targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if(targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
        
        // Hide mobile menu on link click
        if(menu && !menu.classList.contains('hidden')) {
          menu.classList.add('hidden');
        }
      }
    });
  });

  // Intersection Observer for Scroll Animations
  const faders = document.querySelectorAll('.fadeInUp-on-scroll');
  
  const appearOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      } else {
        entry.target.classList.add('fadeInUp');
        observer.unobserve(entry.target);
      }
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });

  // ── WhatsApp Contact Form Handler with Validation ────────────────────────
  const contactForm = document.getElementById('contact-form');
  const WHATSAPP_NUMBER = '919875674988'; // +91 60032 14247

  // Validation rules
  const rules = {
    name: {
      validate: v => v.trim().length >= 2,
      message: 'Please enter your full name (at least 2 characters).'
    },
    mobile: {
      validate: v => /^[6-9]\d{9}$/.test(v.trim().replace(/[\s\-\+]/g, '')),
      message: 'Please enter a valid 10-digit Indian mobile number.'
    },
    email: {
      optional: true,
      validate: v => v.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      message: 'Please enter a valid email address.'
    },
    message: {
      validate: v => v.trim().length >= 10,
      message: 'Please enter a message (at least 10 characters).'
    }
  };

  // Show error under a field
  function showError(id, msg) {
    const input = document.getElementById(id);
    if (!input) return;
    input.classList.remove('border-gray-300', 'border-green-400');
    input.classList.add('border-red-500');

    let errEl = document.getElementById(`err-${id}`);
    if (!errEl) {
      errEl = document.createElement('p');
      errEl.id = `err-${id}`;
      errEl.className = 'text-red-500 text-xs mt-1 flex items-center gap-1';
      input.parentNode.appendChild(errEl);
    }
    errEl.innerHTML = `<span>⚠️</span> ${msg}`;
    errEl.style.display = 'flex';
  }

  // Clear error on a field
  function clearError(id) {
    const input = document.getElementById(id);
    if (!input) return;
    input.classList.remove('border-red-500');
    input.classList.add('border-green-400');

    const errEl = document.getElementById(`err-${id}`);
    if (errEl) errEl.style.display = 'none';
  }

  // Reset all field states completely
  function resetFieldState(id) {
    const input = document.getElementById(id);
    if (!input) return;
    input.classList.remove('border-red-500', 'border-green-400');
    input.classList.add('border-gray-300');
    const errEl = document.getElementById(`err-${id}`);
    if (errEl) errEl.style.display = 'none';
  }

  // Run validation for a single field; return true if valid
  function validateField(id) {
    const rule = rules[id];
    const input = document.getElementById(id);
    if (!input || !rule) return true;

    const val = input.value;

    // Optional fields: only validate format if non-empty
    if (rule.optional && val.trim() === '') {
      clearError(id);
      resetFieldState(id); // no green border for optional empty
      return true;
    }

    if (rule.validate(val)) {
      clearError(id);
      return true;
    } else {
      showError(id, rule.message);
      return false;
    }
  }

  // Run full form validation; returns true if all pass
  function validateAll() {
    const fields = ['name', 'mobile', 'email', 'message'];
    let allValid = true;
    fields.forEach(id => {
      if (!validateField(id)) allValid = false;
    });
    return allValid;
  }

  if (contactForm) {
    // Live validation — only activates after first submit attempt
    let submitted = false;

    ['name', 'mobile', 'email', 'message'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', () => {
        if (submitted) validateField(id);
      });
      el.addEventListener('blur', () => {
        if (submitted) validateField(id);
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      submitted = true;

      if (!validateAll()) {
        // Scroll to first error
        const firstErr = contactForm.querySelector('.border-red-500');
        if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // All valid — build WhatsApp message
      const name    = document.getElementById('name').value.trim();
      const mobile  = document.getElementById('mobile').value.trim();
      const email   = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const now     = new Date();
      const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

      const waMessage =
`🏥 *New Enquiry – Layte LifeScience Pvt. Ltd.*
━━━━━━━━━━━━━━━━━━━━━━━
👤 *Name :*  ${name}
📞 *Mobile :*  ${mobile}
📧 *Email :*  ${email || 'Not provided'}
━━━━━━━━━━━━━━━━━━━━━━━
💬 *Message :*
${message}
━━━━━━━━━━━━━━━━━━━━━━━
🕐 *Received :* ${dateStr} at ${timeStr}
📍 *Source :* Website Contact Form
━━━━━━━━━━━━━━━━━━━━━━━`;

      const waURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;
      window.open(waURL, '_blank');

      showToast('✅ Opening WhatsApp with your enquiry!');

      // Reset form & field states
      contactForm.reset();
      submitted = false;
      ['name', 'mobile', 'email', 'message'].forEach(resetFieldState);
    });
  }

  // Toast notification helper
  function showToast(msg) {
    // Remove existing toast if any
    const existing = document.getElementById('wa-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'wa-toast';
    toast.textContent = msg;
    toast.style.cssText = `
      position: fixed;
      bottom: 28px;
      left: 50%;
      transform: translateX(-50%);
      background: #11b3c3;
      color: #fff;
      padding: 14px 28px;
      border-radius: 50px;
      font-size: 15px;
      font-weight: 600;
      box-shadow: 0 8px 30px rgba(17,179,195,0.35);
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease;
      white-space: nowrap;
    `;
    document.body.appendChild(toast);

    // Fade in
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
    });

    // Fade out after 3.5s
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

});

