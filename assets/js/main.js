// ─── HERO PARTICLES ───
    const canvas = document.getElementById('heroCanvas');
    const ctx = canvas.getContext('2d');

    let mouse = { x: 0, y: 0 };
    let dots = [];
    let resizeTimer;

    function resizeCanvas() {
      const hero = canvas.parentElement;
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
      mouse.x = canvas.width / 2;
      mouse.y = canvas.height / 2;
      dots.forEach(d => {
        d.x = Math.random() * canvas.width;
        d.y = Math.random() * canvas.height;
        d.vx = (Math.random() - 0.5) * 0.5;
        d.vy = (Math.random() - 0.5) * 0.5;
      });
    }

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resizeCanvas, 150);
    });

    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    const PARTICLE_COUNT = 120;
    const CONNECTION_DIST = 130;

    class Dot {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.r = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.6 + 0.2;
      }
      update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 0) {
          this.vx += (dx / dist) * 0.012;
          this.vy += (dy / dist) * 0.012;
        }
        this.vx *= 0.99;
        this.vy *= 0.99;
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -20) this.x = canvas.width + 20;
        else if (this.x > canvas.width + 20) this.x = -20;
        if (this.y < -20) this.y = canvas.height + 20;
        else if (this.y > canvas.height + 20) this.y = -20;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56,189,255,${this.alpha})`;
        ctx.fill();
      }
    }

    // Size canvas first, then create dots
    resizeCanvas();
    dots = Array.from({ length: PARTICLE_COUNT }, () => new Dot());

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const opacity = (1 - dist / CONNECTION_DIST) * 0.25;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(56,189,255,${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      dots.forEach(d => { d.update(); d.draw(); });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ─── CURSOR GLOW ───
    const glow = document.getElementById('cursorGlow');
    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });

    // ─── NAV SCROLL ───
    const nav = document.getElementById('mainNav');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ─── STAGGERED MENU ───
    const menuToggle = document.getElementById('menuToggle');
    const staggeredMenu = document.getElementById('staggeredMenu');
    const menuLinks = document.querySelectorAll('.sm-panel-item');

    function toggleMenu() {
      const isOpen = staggeredMenu.classList.contains('open');
      if (isOpen) {
        staggeredMenu.classList.remove('open');
        menuToggle.classList.remove('open');
      } else {
        staggeredMenu.classList.add('open');
        menuToggle.classList.add('open');
      }
    }

    menuToggle.addEventListener('click', toggleMenu);

    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (staggeredMenu.classList.contains('open')) {
          toggleMenu();
        }
      });
    });

    // ─── REVEAL ON SCROLL ───
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(el => observer.observe(el));

    // ─── THEME TOGGLE ───
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateIcon(newTheme);
    });

    function updateIcon(theme) {
      if (theme === 'dark') {
        icon.className = 'fas fa-sun';
      } else {
        icon.className = 'fas fa-moon';
      }
    }