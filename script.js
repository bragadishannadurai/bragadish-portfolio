/* ==========================================================================
   BRAGADISH — PORTFOLIO SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Footer Year ---------------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------------- Theme Toggle ---------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  root.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    showToast(`${next === 'dark' ? 'Dark' : 'Light'} mode enabled`, 'fa-solid fa-circle-half-stroke');
  });

  /* ---------------- Custom Cursor ---------------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
  });

  function animateGlow(){
    glowX += (mouseX - glowX) * 0.15;
    glowY += (mouseY - glowY) * 0.15;
    cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%,-50%)`;
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  document.querySelectorAll('a, button, .skill-card, .project-card, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => cursorGlow.classList.add('active'));
    el.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
  });

  /* ---------------- Scroll Progress + Navbar Shrink ---------------- */
  const scrollProgress = document.getElementById('scrollProgress');
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = `${(scrollTop / docHeight) * 100}%`;

    navbar.classList.toggle('scrolled', scrollTop > 40);
    backToTop.classList.toggle('show', scrollTop > 500);
  }, { passive:true });

  backToTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  /* ---------------- Mobile Menu ---------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });

  /* ---------------- Scroll Spy (Active Nav Link) ---------------- */
  const sections = document.querySelectorAll('main section[id], .resume-section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(sec => spyObserver.observe(sec));

  /* ---------------- Scroll Indicator Click ---------------- */
  document.getElementById('scrollIndicator').addEventListener('click', () => {
    document.getElementById('about').scrollIntoView({ behavior:'smooth' });
  });

  /* ---------------- Typing Animation ---------------- */
  const roles = ['Full Stack Developer', 'Python Developer', 'FastAPI Developer', 'AI Enthusiast', 'Problem Solver', 'Tech Explorer'];
  const typedText = document.getElementById('typedText');
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop(){
    const currentRole = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      typedText.textContent = currentRole.slice(0, charIndex);
      if (charIndex === currentRole.length) {
        deleting = true;
        setTimeout(typeLoop, 1400);
        return;
      }
    } else {
      charIndex--;
      typedText.textContent = currentRole.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 40 : 80);
  }
  typeLoop();

  /* ---------------- Reveal on Scroll ---------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

  /* ---------------- Skill Bars, Rings, Counters ---------------- */
  function animateSkillBars(container){
    container.querySelectorAll('.skill-fill').forEach(bar => {
      bar.style.width = bar.dataset.level + '%';
    });
  }
  function animateRings(container){
    container.querySelectorAll('.ring-fill').forEach(ring => {
      const value = parseFloat(ring.dataset.value);
      const circumference = 2 * Math.PI * 52;
      const offset = circumference - (value / 100) * circumference;
      ring.style.strokeDashoffset = offset;
    });
  }
  function animateCounters(container){
    container.querySelectorAll('[data-counter]').forEach(el => {
      const target = parseInt(el.dataset.counter, 10);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const tick = () => {
        current += step;
        if (current >= target) { el.textContent = target; return; }
        el.textContent = current;
        requestAnimationFrame(tick);
      };
      tick();
    });
  }

  const skillsSection = document.getElementById('skills');
  const aboutSection = document.getElementById('about');

  const oneShotObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (entry.target === skillsSection) animateSkillBars(entry.target), animateRings(entry.target);
      if (entry.target === aboutSection) animateCounters(entry.target);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  oneShotObserver.observe(skillsSection);
  oneShotObserver.observe(aboutSection);

  /* ---------------- Magnetic Buttons ---------------- */
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  /* ---------------- Ripple Effect ---------------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e){
      const ripple = this.querySelector('.btn-ripple');
      if (!ripple) return;
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      ripple.classList.remove('animate');
      void ripple.offsetWidth;
      ripple.classList.add('animate');
    });
  });

  /* ---------------- Toast Notifications ---------------- */
  window.showToast = function(message, icon = 'fa-solid fa-bell'){
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3600);
  };

  /* ---------------- Stars Background ---------------- */
  const starsContainer = document.getElementById('stars');
  const starCount = window.innerWidth < 768 ? 40 : 90;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('span');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = (Math.random() * 4) + 's';
    star.style.animationDuration = (3 + Math.random() * 3) + 's';
    starsContainer.appendChild(star);
  }

  /* ---------------- Neural Network Canvas (Signature Element) ---------------- */
  const canvas = document.getElementById('networkCanvas');
  const ctx = canvas.getContext('2d');
  let nodes = [];
  let animationId;

  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initNodes(){
    const count = window.innerWidth < 768 ? 35 : 70;
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6
    }));
  }

  function getAccentColor(){
    return getComputedStyle(document.documentElement).getPropertyValue('--violet').trim() || '#8b5cf6';
  }

  function drawNetwork(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const lineColor = isLight ? '20,24,50' : '255,255,255';
    const dotColor = isLight ? '80,60,220' : '180,170,255';

    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
      if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.strokeStyle = `rgba(${lineColor}, ${0.12 * (1 - dist / 140)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${dotColor}, 0.6)`;
      ctx.fill();
    });

    animationId = requestAnimationFrame(drawNetwork);
  }

  resizeCanvas();
  initNodes();
  drawNetwork();

  window.addEventListener('resize', () => {
    resizeCanvas();
    initNodes();
  });

});
