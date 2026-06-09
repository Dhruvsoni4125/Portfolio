import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. PRELOADER HIDE
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        
        // Trigger Hero entry animations with GSAP
        animateHeroEntry();
      }, 1000);
    });
    
    // Fallback if load event doesn't fire soon
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      animateHeroEntry();
    }, 3000);
  }

  // 2. CUSTOM CURSOR
  const dot = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');
  
  let posX = 0, posY = 0;
  let mouseX = 0, mouseY = 0;

  if (dot && outline) {
    // Follow mouse
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Instantly position the center dot
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    });

    // Animate trailing outline (lerp)
    gsap.ticker.add(() => {
      const dt = 1.0 - Math.pow(1.0 - 0.15, gsap.ticker.deltaRatio());
      posX += (mouseX - posX) * dt;
      posY += (mouseY - posY) * dt;
      
      outline.style.left = `${posX}px`;
      outline.style.top = `${posY}px`;
    });

    // Add hover effects for interactive elements
    const hoverables = document.querySelectorAll('a, button, .project-card, .quick-cmd-btn, input, textarea, [data-tilt]');
    
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('hovering');
      });
    });
  }

  // 3. TYPEWRITER EFFECT
  const roleText = document.getElementById('role-text');
  const roles = [
    'Multi-Agent Architectures',
    'Intelligent RAG Workflows',
    'Autonomous AI Solutions',
    'Generative AI Pipelines'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 100;

  function typeEffect() {
    if (!roleText) return;
    
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      // Remove character
      roleText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 40; // delete faster
    } else {
      // Add character
      roleText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 80; // normal speed
    }

    // Word complete checks
    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingDelay = 1500; // pause at end of word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingDelay = 400; // pause before typing next word
    }

    setTimeout(typeEffect, typingDelay);
  }
  
  // Start typewriter
  setTimeout(typeEffect, 1200);

  // 4. MOBILE NAVIGATION
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // 5. 3D CARD TILT EFFECT (Vanilla JS for max performance)
  const tiltCards = document.querySelectorAll('[data-tilt]');
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate inside element
      const y = e.clientY - rect.top;  // y coordinate inside element
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation angles (max 12deg rotation)
      const rotateX = ((centerY - y) / centerY) * 10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      // Apply translation and rotation
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      
      // Subtle glare effect coordinate shift
      const glow = card.querySelector('.card-glow');
      if (glow) {
        glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 242, 254, 0.12) 0%, rgba(0, 242, 254, 0) 60%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      const glow = card.querySelector('.card-glow');
      if (glow) {
        glow.style.background = 'transparent';
      }
    });
  });

  // 6. GSAP HERO ENTRY ANIMATION
  function animateHeroEntry() {
    const tl = gsap.timeline();
    
    tl.from('header', {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
    
    tl.from('.hero-badge', {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(1.7)'
    }, '-=0.3');
    
    tl.from('.hero-title .greeting', {
      x: -30,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.out'
    }, '-=0.2');

    tl.from('.hero-title .name', {
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: 'power4.out'
    }, '-=0.3');

    tl.from('.hero-subtitle', {
      opacity: 0,
      duration: 0.5
    }, '-=0.2');

    tl.from('.hero-description', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.3');

    tl.from('.hero-actions .btn', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.15,
      ease: 'power3.out'
    }, '-=0.4');

    tl.from('.tech-orb', {
      scale: 0.5,
      opacity: 0,
      duration: 1,
      ease: 'elastic.out(1, 0.5)'
    }, '-=0.8');
    
    tl.from('.scroll-down-indicator', {
      opacity: 0,
      y: -10,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.3');
  }

  // 7. GSAP SCROLL TRIGGERS FOR SECTIONS
  const sections = document.querySelectorAll('.scroll-reveal');
  
  sections.forEach(sec => {
    // Fade & slide in sections using fromTo to ensure opacity animates to 1
    gsap.fromTo(sec, 
      { opacity: 0, y: 50 },
      {
        scrollTrigger: {
          trigger: sec,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out'
      }
    );

    // Special staggering animations for items inside sections
    if (sec.id === 'skills') {
      gsap.from('#skills .skills-category-card', {
        scrollTrigger: {
          trigger: '#skills',
          start: 'top 75%'
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }

    if (sec.id === 'experience') {
      gsap.from('#experience .timeline-item', {
        scrollTrigger: {
          trigger: '#experience',
          start: 'top 75%'
        },
        x: -40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.25,
        ease: 'power3.out'
      });
    }

    if (sec.id === 'projects') {
      gsap.from('#projects .project-card', {
        scrollTrigger: {
          trigger: '#projects',
          start: 'top 75%'
        },
        y: 45,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }
  });

  // 8. CONTACT FORM TRANSITION
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  
  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simulate network request
      const submitBtn = contactForm.querySelector('.submit-btn');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Transmitting...';
      
      setTimeout(() => {
        // Fade out form
        gsap.to(contactForm, {
          opacity: 0,
          y: -20,
          duration: 0.4,
          onComplete: () => {
            contactForm.style.display = 'none';
            formSuccess.style.display = 'flex';
            
            // Fade in success message
            gsap.fromTo(formSuccess, 
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
            );
          }
        });
      }, 1500);
    });
  }
});
