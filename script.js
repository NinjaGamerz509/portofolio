// ===================== THREE.JS 3D BACKGROUND =====================
const canvas = document.getElementById('bgCanvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// ---- Galaxy Particles ----
const starGeo = new THREE.BufferGeometry();
const starCount = 3000;
const positions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 40;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const starMat = new THREE.PointsMaterial({ color: 0x00e5ff, size: 0.05, transparent: true, opacity: 0.7 });
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// ---- Floating 3D Skill Cubes ----
const cubeColors = [0x00e5ff, 0x00b8d4, 0x0097a7, 0x00838f, 0x006064];
const cubes = [];
for (let i = 0; i < 8; i++) {
  const geo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
  const mat = new THREE.MeshStandardMaterial({
    color: cubeColors[i % cubeColors.length],
    wireframe: i % 2 === 0,
    transparent: true,
    opacity: 0.6
  });
  const cube = new THREE.Mesh(geo, mat);
  cube.position.set(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 6,
    (Math.random() - 0.5) * 4
  );
  cube.userData = {
    rotSpeedX: (Math.random() - 0.5) * 0.02,
    rotSpeedY: (Math.random() - 0.5) * 0.02,
    floatSpeed: Math.random() * 0.005 + 0.002,
    floatOffset: Math.random() * Math.PI * 2
  };
  scene.add(cube);
  cubes.push(cube);
}

// ---- Floating Rings ----
const rings = [];
for (let i = 0; i < 4; i++) {
  const geo = new THREE.TorusGeometry(0.4 + i * 0.3, 0.02, 16, 100);
  const mat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.15 + i * 0.05 });
  const ring = new THREE.Mesh(geo, mat);
  ring.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 3);
  ring.rotation.x = Math.random() * Math.PI;
  ring.userData = { rotSpeed: (Math.random() - 0.5) * 0.01 };
  scene.add(ring);
  rings.push(ring);
}

// ---- Lighting ----
const ambientLight = new THREE.AmbientLight(0x00e5ff, 0.3);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0x00e5ff, 1, 20);
pointLight.position.set(0, 0, 5);
scene.add(pointLight);

// ---- Mouse Parallax ----
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// ---- Resize ----
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---- Animate ----
let clock = 0;
function animate3D() {
  requestAnimationFrame(animate3D);
  clock += 0.01;

  // Galaxy rotate
  stars.rotation.y += 0.0003;
  stars.rotation.x += 0.0001;

  // Cubes float & rotate
  cubes.forEach((cube, i) => {
    cube.rotation.x += cube.userData.rotSpeedX;
    cube.rotation.y += cube.userData.rotSpeedY;
    cube.position.y += Math.sin(clock + cube.userData.floatOffset) * cube.userData.floatSpeed;
  });

  // Rings rotate
  rings.forEach(ring => {
    ring.rotation.z += ring.userData.rotSpeed;
    ring.rotation.x += ring.userData.rotSpeed * 0.5;
  });

  // Mouse parallax
  camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
  camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}
animate3D();

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
