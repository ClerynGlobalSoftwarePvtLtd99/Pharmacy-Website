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
});
