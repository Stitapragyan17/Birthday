// ================= 1. GLOWING CURSOR =================
const dot = document.getElementById('cursor-dot');
const follower = document.getElementById('cursor-follower');

window.addEventListener('mousemove', (e) => {
  if (dot && follower) {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';

    follower.animate({
      left: `${e.clientX}px`,
      top: `${e.clientY}px`
    }, { duration: 350, fill: "forwards" });
  }
});

// ================= 2. FALLING ROSE PETALS =================
const canvas = document.getElementById('petals-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = [];
  const TOTAL_PETALS = 32;

  class Petal {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * -height;
      this.size = Math.random() * 12 + 10;
      this.speedY = Math.random() * 1.5 + 1;
      this.speedX = Math.random() * 1.2 - 0.6;
      this.rotation = Math.random() * 360;
      this.rotSpeed = Math.random() * 2 - 1;
      this.color = Math.random() > 0.4 ? '#ff3366' : '#d90445';
      this.opacity = Math.random() * 0.4 + 0.4;
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5;
      this.rotation += this.rotSpeed;
      if (this.y > height + 20) this.reset();
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size);
      ctx.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, 0);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < TOTAL_PETALS; i++) petals.push(new Petal());

  function animatePetals() {
    ctx.clearRect(0, 0, width, height);
    petals.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animatePetals);
  }
  animatePetals();
}

// ================= 3. PASSWORD SYSTEM =================
function checkPassword() {
  const passInput = document.getElementById('passInput');
  const errorMsg = document.getElementById('lock-error');
  const inputVal = passInput ? passInput.value.trim() : '';

  // Allowed passwords: love123, queen, birthday
  if (inputVal === 'love123' || inputVal.toLowerCase() === 'queen' || inputVal.toLowerCase() === 'birthday') {
    const lock = document.getElementById('lock-screen');
    if (lock) {
      lock.style.opacity = '0';
      setTimeout(() => {
        lock.style.display = 'none';
        startConfettiBurst();
      }, 700);
    }
  } else {
    if (errorMsg) errorMsg.style.display = 'block';
  }
}

const passInputField = document.getElementById('passInput');
if (passInputField) {
  passInputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkPassword();
  });
}

// ================= 4. MUSIC PLAYER =================
const musicBtn = document.getElementById('music-btn');
const audio = document.getElementById('bg-audio');
let isPlaying = false;

if (musicBtn && audio) {
  musicBtn.addEventListener('click', () => {
    if (!isPlaying) {
      audio.play();
      musicBtn.innerText = '⏸️ Pause Music';
      isPlaying = true;
    } else {
      audio.pause();
      musicBtn.innerText = '🎵 Play Music';
      isPlaying = false;
    }
  });
}

// ================= 5. COUNTDOWN TIMER (OCTOBER 2, 12:00 AM) =================
const targetDate = new Date(2026, 9, 2, 0, 0, 0).getTime();

function updateCountdown() {
  const now = Date.now();
  const diff = targetDate - now;

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  if (diff > 0) {
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(d).padStart(2, '0');
    hoursEl.textContent = String(h).padStart(2, '0');
    minutesEl.textContent = String(m).padStart(2, '0');
    secondsEl.textContent = String(s).padStart(2, '0');
  } else {
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minutesEl.textContent = '00';
    secondsEl.textContent = '00';
  }
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ================= 6. ANIMATED PHOTO SLIDER =================
let currentIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const slidesContainer = document.getElementById('slidesContainer');
const dotsContainer = document.getElementById('sliderDots');

if (dotsContainer && totalSlides > 0) {
  dotsContainer.innerHTML = '';
  for (let i = 0; i < totalSlides; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(d);
  }
}

function updateSlider() {
  if (!slidesContainer) return;
  slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
  document.querySelectorAll('.dot').forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentIndex);
  });
}

function nextSlide() {
  if (totalSlides === 0) return;
  currentIndex = (currentIndex + 1) % totalSlides;
  updateSlider();
}
function prevSlide() {
  if (totalSlides === 0) return;
  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  updateSlider();
}
function goToSlide(idx) {
  currentIndex = idx;
  updateSlider();
}

let autoSlideInterval = setInterval(nextSlide, 4500);
const sliderWrap = document.querySelector('.slider-wrapper');
if (sliderWrap) {
  sliderWrap.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
  sliderWrap.addEventListener('mouseleave', () => autoSlideInterval = setInterval(nextSlide, 4500));
}

// ================= 7. 3D GIFT BOX =================
let isBoxOpen = false;
function openGiftBox() {
  const box = document.getElementById('giftBox');
  const surprise = document.getElementById('surpriseCard');
  if (!box || !surprise) return;

  if (!isBoxOpen) {
    box.classList.add('opened');
    startConfettiBurst();
    setTimeout(() => { surprise.style.display = 'block'; }, 400);
    isBoxOpen = true;
  } else {
    box.classList.remove('opened');
    surprise.style.display = 'none';
    isBoxOpen = false;
  }
}

// ================= 8. FULLSCREEN "I LOVE YOU" =================
function triggerLoveOverlay() {
  const overlay = document.getElementById('love-overlay');
  if (overlay) {
    overlay.style.display = 'flex';
    startMassiveConfetti();
  }
}
function closeLoveOverlay() {
  const overlay = document.getElementById('love-overlay');
  if (overlay) overlay.style.display = 'none';
}

// ================= 9. CONFETTI FUNCTIONS =================
function startConfettiBurst() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff3366', '#ff758c', '#ffd166', '#ffffff']
    });
  }
}

function startMassiveConfetti() {
  if (typeof confetti !== 'function') return;
  const duration = 4 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 60,
      origin: { x: 0 },
      colors: ['#ff1a53', '#ff758c', '#ffd166']
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 60,
      origin: { x: 1 },
      colors: ['#ff1a53', '#ff758c', '#ffd166']
    });

    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}