// ===================== ANIMATED BG CANVAS =====================
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const PARTICLE_COUNT = 60;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,229,255,${this.alpha})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
}

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,229,255,${0.08 * (1 - dist / 130)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateBg() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLines();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateBg);
}

resizeCanvas();
initParticles();
animateBg();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

// ===================== NAVBAR SCROLL =====================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ===================== HAMBURGER MENU =====================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===================== THEME TOGGLE =====================
const body = document.getElementById('body');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
let isDark = true;

function applyTheme(dark) {
  isDark = dark;
  body.classList.toggle('dark-mode', dark);
  body.classList.toggle('light-mode', !dark);
  themeIcon.textContent = dark ? 'dark_mode' : 'light_mode';
  localStorage.setItem('ninjagamerz-theme', dark ? 'dark' : 'light');
}
themeToggle.addEventListener('click', () => applyTheme(!isDark));
if (localStorage.getItem('ninjagamerz-theme') === 'light') applyTheme(false);

// ===================== TYPEWRITER =====================
const typewriterEl = document.getElementById('typewriter');
const phrases = ['Full Stack Developer','Gamer 🎮','Content Creator','Minecraft Server Builder','Problem Solver','Code Ninja 🥷'];
let phraseIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  const current = phrases[phraseIndex];
  typewriterEl.textContent = deleting ? current.slice(0, charIndex - 1) : current.slice(0, charIndex + 1);
  deleting ? charIndex-- : charIndex++;
  if (!deleting && charIndex === current.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
  if (deleting && charIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; }
  setTimeout(typeLoop, deleting ? 60 : 90);
}
typeLoop();

// ===================== VISITOR COUNTER =====================
const visitorCountEl = document.getElementById('visitorCount');
let count = parseInt(localStorage.getItem('ninjagamerz-visitors') || '1247');
if (!localStorage.getItem('ninjagamerz-visited')) {
  count++;
  localStorage.setItem('ninjagamerz-visitors', count);
  localStorage.setItem('ninjagamerz-visited', '1');
}
let current = 0;
const step = Math.ceil(count / 60);
const timer = setInterval(() => {
  current = Math.min(current + step, count);
  visitorCountEl.textContent = current.toLocaleString();
  if (current >= count) clearInterval(timer);
}, 30);

// ===================== KONAMI CODE EASTER EGG =====================
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiProgress = 0;
const easterEgg = document.getElementById('easterEgg');
document.addEventListener('keydown', (e) => {
  konamiProgress = e.key === KONAMI[konamiProgress] ? konamiProgress + 1 : 0;
  if (konamiProgress === KONAMI.length) { easterEgg.classList.add('active'); konamiProgress = 0; }
});
document.getElementById('closeEE').addEventListener('click', () => easterEgg.classList.remove('active'));
easterEgg.addEventListener('click', (e) => { if (e.target === easterEgg) easterEgg.classList.remove('active'); });

// ===================== SCROLL REVEAL =====================
const revealEls = document.querySelectorAll('.skill-card, .project-card, .contact-card, .section-title, .yt-card');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = (entry.target.dataset.index || 0) * 60;
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease, border-color 0.3s ease, box-shadow 0.3s ease';
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.dataset.index = i % 12;
  revealObserver.observe(el);
});
