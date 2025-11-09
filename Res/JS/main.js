// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  
  // ========================================
  // HEADER SCROLL EFFECT
  // ========================================
  const header = document.querySelector('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });

  // ========================================
  // MOBILE MENU TOGGLE
  // ========================================
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('header nav ul');

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileMenuToggle.querySelector('i');
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('header nav ul a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileMenuToggle.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
      });
    });
  }

  // ========================================
  // SMOOTH SCROLLING FOR ANCHOR LINKS
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========================================
  // ANIMATED COUNTER FOR STATS
  // ========================================
  const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current) + '+';
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target + '+';
      }
    };

    updateCounter();
  };

  // Intersection Observer for stats animation
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumber = entry.target;
        const target = parseInt(statNumber.dataset.target);
        animateCounter(statNumber, target);
        statsObserver.unobserve(statNumber);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(stat => {
    statsObserver.observe(stat);
  });

  // ========================================
  // SCROLL REVEAL ANIMATIONS
  // ========================================
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  // Add initial styles and observe elements
  const revealElements = document.querySelectorAll('.screen-section, .feature-card, .info-card');
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    revealObserver.observe(el);
  });

  // ========================================
  // SCREENSHOT LIGHTBOX EFFECT
  // ========================================
  const screenshots = document.querySelectorAll('.screenshot-wrapper');
  
  screenshots.forEach(wrapper => {
    wrapper.addEventListener('click', () => {
      const img = wrapper.querySelector('.screenshot');
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = `
        <div class="lightbox-content">
          <span class="lightbox-close">&times;</span>
          <img src="${img.src}" alt="${img.alt}">
        </div>
      `;
      
      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';
      
      // Animate in
      setTimeout(() => lightbox.classList.add('active'), 10);
      
      // Close lightbox
      const closeLightbox = () => {
        lightbox.classList.remove('active');
        setTimeout(() => {
          document.body.removeChild(lightbox);
          document.body.style.overflow = '';
        }, 300);
      };
      
      lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
      });
    });
  });

  // Add lightbox styles dynamically
  const lightboxStyles = document.createElement('style');
  lightboxStyles.textContent = `
    .lightbox {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      backdrop-filter: blur(20px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .lightbox.active {
      opacity: 1;
    }
    
    .lightbox-content {
      position: relative;
      max-width: 90%;
      max-height: 90%;
      animation: zoomIn 0.3s ease;
    }
    
    .lightbox-content img {
      width: 100%;
      height: auto;
      max-height: 90vh;
      object-fit: contain;
      border-radius: 1rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }
    
    .lightbox-close {
      position: absolute;
      top: -50px;
      right: 0;
      font-size: 3rem;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--glass-card);
      border-radius: 50%;
      border: 1px solid var(--glass-border);
    }
    
    .lightbox-close:hover {
      transform: rotate(90deg);
      color: var(--color-secondary);
      box-shadow: 0 0 20px var(--color-secondary);
    }
    
    @keyframes zoomIn {
      from {
        transform: scale(0.8);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(lightboxStyles);

  // ========================================
  // CONTACT FORM HANDLING
  // ========================================
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;
      
      // Create notification
      const notification = document.createElement('div');
      notification.className = 'notification success';
      notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Message sent successfully! We'll get back to you soon.</span>
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => notification.classList.add('show'), 100);
      
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
      }, 3000);
      
      // Reset form
      contactForm.reset();
      
      // In a real application, you would send this data to a server
      console.log('Form submitted:', { name, email, subject, message });
    });
  }

  // Add notification styles
  const notificationStyles = document.createElement('style');
  notificationStyles.textContent = `
    .notification {
      position: fixed;
      top: 100px;
      right: -400px;
      background: var(--gradient-primary);
      color: white;
      padding: 1.5rem 2rem;
      border-radius: 1rem;
      box-shadow: var(--shadow-xl);
      display: flex;
      align-items: center;
      gap: 1rem;
      z-index: 10001;
      transition: right 0.3s ease;
      max-width: 350px;
    }
    
    .notification.show {
      right: 2rem;
    }
    
    .notification i {
      font-size: 1.5rem;
    }
    
    .notification span {
      font-weight: 500;
    }
    
    @media (max-width: 480px) {
      .notification {
        right: -100%;
        left: 1rem;
        max-width: calc(100% - 2rem);
      }
      
      .notification.show {
        right: auto;
      }
    }
  `;
  document.head.appendChild(notificationStyles);

  // ========================================
  // PARALLAX EFFECT FOR GRADIENT ORBS
  // ========================================
  window.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.gradient-orb');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    orbs.forEach((orb, index) => {
      const speed = (index + 1) * 20;
      const x = (mouseX - 0.5) * speed;
      const y = (mouseY - 0.5) * speed;
      orb.style.transform = `translate(${x}px, ${y}px)`;
    });
  });

  // ========================================
  // LAZY LOADING IMAGES
  // ========================================
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    imageObserver.observe(img);
  });

  // ========================================
  // ACTIVE NAVIGATION HIGHLIGHT
  // ========================================
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('header nav ul a');

  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.querySelector('li').classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.querySelector('li').classList.add('active');
      }
    });
  });

  // Add active state styles
  const activeNavStyles = document.createElement('style');
  activeNavStyles.textContent = `
    header nav ul a li.active {
      color: var(--color-secondary);
      background: var(--glass-card);
    }
    
    header nav ul a li.active::before {
      width: 80%;
    }
  `;
  document.head.appendChild(activeNavStyles);

  // ========================================
  // CURSOR EFFECT
  // ========================================
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  const cursorFollower = document.createElement('div');
  cursorFollower.className = 'cursor-follower';
  document.body.appendChild(cursorFollower);

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  // Smooth follower animation
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Cursor interactions
  const interactiveElements = document.querySelectorAll('a, button, .screenshot-wrapper, input, textarea');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      cursorFollower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      cursorFollower.classList.remove('hover');
    });
  });

  // Add cursor styles
  const cursorStyles = document.createElement('style');
  cursorStyles.textContent = `
    .custom-cursor,
    .cursor-follower {
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      mix-blend-mode: difference;
    }
    
    .custom-cursor {
      width: 10px;
      height: 10px;
      background: var(--color-secondary);
      border-radius: 50%;
      margin: -5px 0 0 -5px;
      transition: transform 0.2s ease, width 0.3s ease, height 0.3s ease;
    }
    
    .cursor-follower {
      width: 40px;
      height: 40px;
      border: 2px solid var(--color-primary);
      border-radius: 50%;
      margin: -20px 0 0 -20px;
      transition: transform 0.15s ease, width 0.3s ease, height 0.3s ease;
    }
    
    .custom-cursor.hover {
      width: 20px;
      height: 20px;
      margin: -10px 0 0 -10px;
    }
    
    .cursor-follower.hover {
      width: 60px;
      height: 60px;
      margin: -30px 0 0 -30px;
    }
    
    @media (max-width: 768px) {
      .custom-cursor,
      .cursor-follower {
        display: none;
      }
    }
  `;
  document.head.appendChild(cursorStyles);

  console.log('✨ AllenConnect enhanced with modern interactions!');
});