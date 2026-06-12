document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. FIXED NAVBAR SCROLL DETECTION
  // ==========================================
  const navbar = document.getElementById('navbar');
  
  function checkScroll() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Run on initial load

  // ==========================================
  // 2. MOBILE DRAWER INTERACTION
  // ==========================================
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openDrawer() {
    if (!menuToggle || !mobileDrawer || !drawerBackdrop) return;
    menuToggle.classList.add('open');
    mobileDrawer.classList.add('open');
    drawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden'; // Disable scroll under drawer
  }

  function closeDrawer() {
    if (!menuToggle || !mobileDrawer || !drawerBackdrop) return;
    menuToggle.classList.remove('open');
    mobileDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeDrawer);
  }

  // Close drawer if screen resizes to desktop width
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // ==========================================
  // 3. SMOOTH SCROLLING FOR INTERACTIVE LINKS
  // ==========================================
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Close mobile drawer if clicking from it
        closeDrawer();
        
        // Calculate offset (account for fixed navbar height)
        const navbarHeight = navbar.offsetHeight || 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================
  // 4. ACTIVE MENU HIGHLIGHT ON SCROLL
  // ==========================================
  const sections = document.querySelectorAll('section[id], header[id]');
  const desktopLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const highlightOptions = {
    root: null,
    rootMargin: '-120px 0px -50% 0px', // Triggers when section occupies upper-half
    threshold: 0
  };

  const highlightObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        
        // Highlight Desktop
        desktopLinks.forEach(link => {
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active-link');
          } else {
            link.classList.remove('active-link');
          }
        });

        // Highlight Mobile Drawer Links
        mobileLinks.forEach(link => {
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active-link');
          } else {
            link.classList.remove('active-link');
          }
        });
      }
    });
  }, highlightOptions);

  sections.forEach(section => {
    highlightObserver.observe(section);
  });

  // ==========================================
  // 5. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // ==========================================
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const revealOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px', // Trigger slightly before entering view
    threshold: 0.08
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target); // Animate only once
      }
    });
  }, revealOptions);

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // ==========================================
  // 6. VISUAL THEME SWITCHER (OCEAN & SKY / TROPICAL PARADISE)
  // ==========================================
  const themeToggler = document.getElementById('themeToggler');
  
  // Load initial theme state (fallback to ocean-sky theme default)
  let savedTheme = localStorage.getItem('theme') || 'ocean-sky';
  if (savedTheme === 'dark') savedTheme = 'ocean-sky';
  if (savedTheme === 'light') savedTheme = 'tropical-paradise';
  
  document.documentElement.setAttribute('data-theme', savedTheme);
 
  if (themeToggler) {
    themeToggler.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const nextTheme = currentTheme === 'ocean-sky' ? 'tropical-paradise' : 'ocean-sky';
      
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('theme', nextTheme);
    });
  }

  // ==========================================
  // 7. BOOKING DETAILS AUTO-POPULATE LINKING
  // ==========================================
  const detailsButtons = document.querySelectorAll('.btn-view-details');
  const subjectInput = document.getElementById('subject');

  detailsButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const packageName = btn.getAttribute('data-package');
      if (subjectInput && packageName) {
        subjectInput.value = `Inquiry: ${packageName}`;
        
        // Visual cue: focus input
        setTimeout(() => {
          subjectInput.focus();
        }, 800);
      }
    });
  });

  // ==========================================
  // 8. CONTACT FORM SIMULATOR
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Clear old status alerts
      formStatus.style.display = 'none';
      formStatus.className = 'form-status';

      // Grab inputs
      const nameVal = document.getElementById('name').value.trim();
      const emailVal = document.getElementById('email').value.trim();
      const subjectVal = document.getElementById('subject').value.trim();
      const messageVal = document.getElementById('message').value.trim();

      // Basic validation
      if (!nameVal || !emailVal || !subjectVal || !messageVal) {
        showStatusMessage('Please fill in all fields before sending.', 'error');
        return;
      }

      // Enter loading state
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Securing Dates...';

      // Simulate API network request delay (1.5 seconds)
      setTimeout(() => {
        // Restore CTA
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;

        // Reset form inputs
        contactForm.reset();

        // Show elegant success state
        showStatusMessage('Adventure requested! Our travel specialists will email you within 24 hours.', 'success');
      }, 1500);
    });
  }

  function showStatusMessage(msg, type) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.classList.add(type);
    
    // Smooth scroll into focus area
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

});
