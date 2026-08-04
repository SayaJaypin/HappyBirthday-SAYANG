/* ==========================================================================
   UNTUK ZAHRA — script.js
   Semua logika interaktif website ulang tahun.
   ========================================================================== */

'use strict';

/* ---------- Konfigurasi utama ---------- */
const CONFIG = {
  PIN: '090812',
  BIRTHDAY_MONTH: 8,   // Agustus (1-indexed dipakai manual di bawah)
  BIRTHDAY_DAY: 9,
  WHATSAPP_URL: 'https://wa.me/6283815954022?text=AKU%20MAU%20SAYANGGG%20%3A3'
};

/* ==========================================================================
   0. UTIL
   ========================================================================== */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (a, b) => a + Math.random() * (b - a);
const TAU = Math.PI * 2;

function setDvh(){
  document.documentElement.style.setProperty('--dvh', `${window.innerHeight}px`);
}
setDvh();
window.addEventListener('resize', setDvh);

/* ==========================================================================
   1. PIN SCREEN
   ========================================================================== */
(function initPin(){
  const pinScreen   = $('#pin-screen');
  const dotsWrap    = $('#pin-dots');
  const dots        = $$('.pin-dot', dotsWrap);
  const errorEl     = $('#pin-error');
  const keypad      = $('#pin-keypad');
  const deleteBtn    = $('#pin-delete');

  let entered = '';

  function renderDots(){
    dots.forEach((d, i) => d.classList.toggle('filled', i < entered.length));
  }

  function shake(){
    errorEl.classList.add('show');
    dotsWrap.classList.add('shake');
    if (navigator.vibrate) navigator.vibrate([40, 40, 40]);
    setTimeout(() => {
      dotsWrap.classList.remove('shake');
      entered = '';
      renderDots();
    }, 450);
  }

  function success(){
    dotsWrap.classList.add('success');
    if (navigator.vibrate) navigator.vibrate(60);
    setTimeout(() => {
      pinScreen.style.opacity = '0';
      setTimeout(() => {
        pinScreen.classList.add('hidden');
        startLoading();
      }, 650);
    }, 450);
  }

  function submit(){
    if (entered.length !== CONFIG.PIN.length) return;
    if (entered === CONFIG.PIN){
      success();
    } else {
      shake();
    }
  }

  keypad.addEventListener('click', (e) => {
    const key = e.target.closest('.pin-key');
    if (!key || key.classList.contains('pin-key-ghost')) return;

    if (key === deleteBtn){
      entered = entered.slice(0, -1);
      renderDots();
      return;
    }
    const digit = key.dataset.key;
    if (digit === undefined) return;
    if (entered.length >= CONFIG.PIN.length) return;

    entered += digit;
    key.style.transform = 'scale(0.88)';
    setTimeout(() => key.style.transform = '', 120);
    renderDots();
    errorEl.classList.remove('show');

    if (entered.length === CONFIG.PIN.length) setTimeout(submit, 160);
  });

  // Dukungan keyboard fisik (desktop)
  window.addEventListener('keydown', (e) => {
    if (pinScreen.classList.contains('hidden')) return;
    if (/^[0-9]$/.test(e.key) && entered.length < CONFIG.PIN.length){
      entered += e.key;
      renderDots();
      if (entered.length === CONFIG.PIN.length) setTimeout(submit, 160);
    } else if (e.key === 'Backspace'){
      entered = entered.slice(0, -1);
      renderDots();
    }
  });

  // Background halus di layar PIN
  drawAmbientCanvas('#pin-bg-canvas');
})();

/* Canvas ambient sederhana dipakai ulang di PIN & loading screen */
function drawAmbientCanvas(selector){
  const canvas = $(selector);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles;

  function resize(){
    w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * devicePixelRatio;
  }
  function seed(){
    particles = Array.from({ length: 46 }, () => ({
      x: rand(0, w), y: rand(0, h), r: rand(0.6, 2.2) * devicePixelRatio,
      s: rand(0.15, 0.5), a: rand(0.15, 0.6), phase: rand(0, TAU)
    }));
  }
  function loop(t){
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      const y = (p.y - t * 0.02 * p.s) % (h + 20);
      const yy = y < 0 ? y + h + 20 : y;
      const twinkle = 0.5 + 0.5 * Math.sin(t * 0.002 + p.phase);
      ctx.beginPath();
      ctx.arc(p.x, yy, p.r, 0, TAU);
      ctx.fillStyle = `rgba(255,255,255,${p.a * twinkle})`;
      ctx.fill();
    });
    requestAnimationFrame(loop);
  }
  new ResizeObserver(() => { resize(); seed(); }).observe(canvas);
  resize(); seed();
  requestAnimationFrame(loop);
}

/* ==========================================================================
   2. LOADING SCREEN
   ========================================================================== */
function startLoading(){
  const loadingScreen = $('#loading-screen');
  const fill = $('#loading-bar-fill');
  const percent = $('#loading-percent');
  loadingScreen.classList.remove('hidden');
  drawAmbientCanvas('#loading-bg-canvas');
  mountMascot('#mascot-cat-slot', 'cat');
  mountMascot('#mascot-rabbit-slot', 'rabbit');

  let p = 0;
  const timer = setInterval(() => {
    p += rand(4, 12);
    if (p >= 100){
      p = 100;
      clearInterval(timer);
      setTimeout(finishLoading, 500);
    }
    fill.style.width = p + '%';
    percent.textContent = Math.floor(p) + '%';
  }, 180);
}

function finishLoading(){
  const loadingScreen = $('#loading-screen');
  const app = $('#app');
  loadingScreen.style.opacity = '0';
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    app.classList.remove('hidden');
    requestAnimationFrame(() => {
      document.body.classList.add('reveal-ready');
      initAppExperience();
    });
  }, 650);
}

/* Maskot kucing & kelinci versi CSS/SVG ringan untuk loading screen */
function mountMascot(selector, kind){
  const slot = $(selector);
  if (!slot) return;
  const earColor = kind === 'cat' ? '#e8a3c4' : '#f3c77e';
  const bodyColor = kind === 'cat' ? '#c9a7f5' : '#ffd9e6';
  slot.innerHTML = `
    <svg viewBox="0 0 84 90" width="84" height="90" class="mascot-svg mascot-${kind}">
      <ellipse cx="42" cy="80" rx="16" ry="5" fill="rgba(0,0,0,0.25)"/>
      <g class="mascot-bob">
        ${kind === 'cat'
          ? `<path d="M18 30 L26 8 L34 30 Z" fill="${earColor}"/><path d="M50 30 L58 8 L66 30 Z" fill="${earColor}"/>`
          : `<ellipse cx="26" cy="14" rx="7" ry="20" fill="${earColor}" transform="rotate(-10 26 14)"/><ellipse cx="58" cy="14" rx="7" ry="20" fill="${earColor}" transform="rotate(10 58 14)"/>`
        }
        <circle cx="42" cy="46" r="26" fill="${bodyColor}"/>
        <circle class="mascot-blink" cx="33" cy="44" r="3" fill="#2a1339"/>
        <circle class="mascot-blink" cx="51" cy="44" r="3" fill="#2a1339"/>
        <path d="M39 52 Q42 55 45 52" stroke="#2a1339" stroke-width="2" fill="none" stroke-linecap="round"/>
        <circle cx="24" cy="50" r="3.4" fill="rgba(255,90,140,0.45)"/>
        <circle cx="60" cy="50" r="3.4" fill="rgba(255,90,140,0.45)"/>
      </g>
    </svg>`;
}

/* ==========================================================================
   3. GLOBAL PARTICLES (petals, sparkles, hearts, bubbles, dust)
   ========================================================================== */
function initGlobalParticles(){
  const canvas = $('#global-particles');
  const ctx = canvas.getContext('2d');
  let w, h, items;
  const kinds = ['heart', 'sparkle', 'petal', 'bubble', 'dust'];

  function resize(){
    w = canvas.width = window.innerWidth * devicePixelRatio;
    h = canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }

  function makeItem(){
    const kind = kinds[Math.floor(rand(0, kinds.length))];
    return {
      kind,
      x: rand(0, w), y: rand(h, h * 1.4),
      size: rand(6, 16) * devicePixelRatio,
      speed: rand(0.15, 0.45) * devicePixelRatio,
      drift: rand(-0.4, 0.4),
      rot: rand(0, TAU), rotSpeed: rand(-0.01, 0.01),
      hue: rand(0, 1),
      phase: rand(0, TAU),
      alpha: rand(0.35, 0.85)
    };
  }

  function seed(){
    items = Array.from({ length: 34 }, makeItem);
  }

  function drawHeart(p){
    const s = p.size * 0.05;
    ctx.beginPath();
    ctx.moveTo(0, s * 4);
    ctx.bezierCurveTo(-s * 10, -s * 6, -s * 4, -s * 12, 0, -s * 4);
    ctx.bezierCurveTo(s * 4, -s * 12, s * 10, -s * 6, 0, s * 4);
    ctx.fillStyle = `rgba(255,120,160,${p.alpha})`;
    ctx.fill();
  }
  function drawSparkle(p){
    const s = p.size * 0.6;
    ctx.beginPath();
    ctx.moveTo(0, -s); ctx.lineTo(s * 0.28, -s * 0.28); ctx.lineTo(s, 0);
    ctx.lineTo(s * 0.28, s * 0.28); ctx.lineTo(0, s); ctx.lineTo(-s * 0.28, s * 0.28);
    ctx.lineTo(-s, 0); ctx.lineTo(-s * 0.28, -s * 0.28); ctx.closePath();
    ctx.fillStyle = `rgba(243,199,126,${p.alpha})`;
    ctx.fill();
  }
  function drawPetal(p){
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size * 0.55, p.size * 0.3, 0, 0, TAU);
    ctx.fillStyle = `rgba(199,140,220,${p.alpha * 0.8})`;
    ctx.fill();
  }
  function drawBubble(p){
    ctx.beginPath();
    ctx.arc(0, 0, p.size * 0.45, 0, TAU);
    ctx.strokeStyle = `rgba(255,255,255,${p.alpha * 0.5})`;
    ctx.lineWidth = 1 * devicePixelRatio;
    ctx.stroke();
  }
  function drawDust(p){
    ctx.beginPath();
    ctx.arc(0, 0, p.size * 0.14, 0, TAU);
    ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
    ctx.fill();
  }

  const drawers = { heart: drawHeart, sparkle: drawSparkle, petal: drawPetal, bubble: drawBubble, dust: drawDust };

  let t0 = performance.now();
  function loop(t){
    const dt = t - t0; t0 = t;
    ctx.clearRect(0, 0, w, h);
    items.forEach(p => {
      p.y -= p.speed * dt * 0.06;
      p.x += Math.sin(t * 0.0007 + p.phase) * p.drift;
      p.rot += p.rotSpeed * dt * 0.06;
      if (p.y < -30){ Object.assign(p, makeItem(), { y: h + 30 }); }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      drawers[p.kind](p);
      ctx.restore();
    });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); });
  resize(); seed();
  requestAnimationFrame(loop);
}

/* ==========================================================================
   4. REALTIME CLOCK (WIB / WITA / WIT / UTC)
   ========================================================================== */
function initClock(){
  const primary = $('#clock-primary');
  const wib = $('#clock-wib'), wita = $('#clock-wita'), wit = $('#clock-wit'), utc = $('#clock-utc');
  const dateEl = $('#clock-date');
  const btn = $('#clock-chip-btn');
  const panel = $('#clock-panel');

  const days = ['Minggu','Senin','Selasa','Rabu','Kamis',"Jumat",'Sabtu'];
  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

  function pad(n){ return String(n).padStart(2, '0'); }
  function fmt(date, offset){
    const t = new Date(date.getTime() + offset * 3600000);
    return `${pad(t.getUTCHours())}:${pad(t.getUTCMinutes())}:${pad(t.getUTCSeconds())}`;
  }

  function tick(){
    const now = new Date();
    wib.textContent = fmt(now, 7);
    wita.textContent = fmt(now, 8);
    wit.textContent = fmt(now, 9);
    utc.textContent = fmt(now, 0);
    primary.textContent = fmt(now, 7).slice(0, 5);

    const local = new Date(now.getTime() + 7 * 3600000);
    dateEl.textContent = `${days[local.getUTCDay()]}, ${local.getUTCDate()} ${months[local.getUTCMonth()]} ${local.getUTCFullYear()}`;
  }
  tick();
  setInterval(tick, 1000);

  btn.addEventListener('click', () => panel.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#clock-chip')) panel.classList.remove('open');
  });
}

/* ==========================================================================
   5. COUNTDOWN MENUJU ULANG TAHUN
   ========================================================================== */
function initCountdown(){
  const label = $('#countdown-label');
  const dEl = $('#cd-days'), hEl = $('#cd-hours'), mEl = $('#cd-mins'), sEl = $('#cd-secs');

  function nextBirthday(now){
    let year = now.getFullYear();
    let target = new Date(year, CONFIG.BIRTHDAY_MONTH - 1, CONFIG.BIRTHDAY_DAY, 0, 0, 0);
    const end = new Date(year, CONFIG.BIRTHDAY_MONTH - 1, CONFIG.BIRTHDAY_DAY + 1, 0, 0, 0);
    if (now >= target && now < end) return { isToday: true, target, end };
    if (now >= end) target = new Date(year + 1, CONFIG.BIRTHDAY_MONTH - 1, CONFIG.BIRTHDAY_DAY, 0, 0, 0);
    return { isToday: false, target };
  }

  function tick(){
    const now = new Date();
    const info = nextBirthday(now);
    if (info.isToday){
      label.textContent = 'Hari ini hari spesialmu, selamat ulang tahun, Zahra';
      dEl.textContent = hEl.textContent = mEl.textContent = sEl.textContent = '00';
      return;
    }
    label.textContent = 'Menghitung menuju hari spesialmu';
    const diff = info.target - now;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    dEl.textContent = String(days).padStart(2, '0');
    hEl.textContent = String(hours).padStart(2, '0');
    mEl.textContent = String(mins).padStart(2, '0');
    sEl.textContent = String(secs).padStart(2, '0');
  }
  tick();
  setInterval(tick, 1000);
}

/* ==========================================================================
   6. FIREWORKS (Canvas 2D procedural)
   ========================================================================== */
function initFireworks(){
  const canvas = $('#firework-canvas');
  const ctx = canvas.getContext('2d');
  let w, h, sparks = [];
  const palette = ['#ff5a8c', '#f3c77e', '#b98cf0', '#ffb0c9', '#ffffff'];

  function resize(){
    w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * devicePixelRatio;
  }

  function burst(x, y){
    const count = 34;
    const color = palette[Math.floor(rand(0, palette.length))];
    for (let i = 0; i < count; i++){
      const angle = (i / count) * TAU;
      const speed = rand(1.4, 4.2) * devicePixelRatio;
      sparks.push({
        x, y,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        life: 1, decay: rand(0.008, 0.018), color, size: rand(1.4, 2.6) * devicePixelRatio
      });
    }
  }

  function loop(){
    ctx.clearRect(0, 0, w, h);
    sparks.forEach(s => {
      s.x += s.vx; s.y += s.vy; s.vy += 0.02 * devicePixelRatio; s.life -= s.decay;
      ctx.globalAlpha = clamp(s.life, 0, 1);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, TAU);
      ctx.fillStyle = s.color;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    sparks = sparks.filter(s => s.life > 0);
    requestAnimationFrame(loop);
  }

  new ResizeObserver(resize).observe(canvas);
  resize();
  requestAnimationFrame(loop);

  // Rangkaian kembang api otomatis saat hero muncul
  let count = 0;
  const auto = setInterval(() => {
    burst(rand(w * 0.2, w * 0.8), rand(h * 0.18, h * 0.5));
    count++;
    if (count > 6) clearInterval(auto);
  }, 500);

  canvas.parentElement.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    burst((e.clientX - rect.left) * devicePixelRatio, (e.clientY - rect.top) * devicePixelRatio);
  });
}

/* ==========================================================================
   7. THREE.JS — Kucing & Kelinci 3D di Hero
   ========================================================================== */
function initHeroCreatures(){
  const wrap = $('#hero-canvas');
  if (!window.THREE) return;

  const renderer = new THREE.WebGLRenderer({ canvas: wrap, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 1.4, 9);

  const key = new THREE.DirectionalLight(0xffe3f2, 1.1);
  key.position.set(3, 5, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xb98cf0, 0.6);
  rim.position.set(-4, 2, -3);
  scene.add(rim);
  scene.add(new THREE.AmbientLight(0x6a4a8f, 0.7));

  function makeCreature(kind, color, earColor){
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.05 });
    const earMat = new THREE.MeshStandardMaterial({ color: earColor, roughness: 0.5 });

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.62, 24, 24), mat);
    body.scale.set(1, 0.86, 0.92);
    g.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 24), mat);
    head.position.set(0, 0.68, 0.12);
    g.add(head);

    const earGeo = kind === 'cat'
      ? new THREE.ConeGeometry(0.13, 0.32, 12)
      : new THREE.CapsuleGeometry(0.08, 0.5, 4, 8);

    const earL = new THREE.Mesh(earGeo, earMat);
    const earR = new THREE.Mesh(earGeo, earMat);
    if (kind === 'cat'){
      earL.position.set(-0.19, 1.02, 0.1); earL.rotation.z = 0.25;
      earR.position.set(0.19, 1.02, 0.1); earR.rotation.z = -0.25;
    } else {
      earL.position.set(-0.15, 1.15, 0.05); earL.rotation.z = 0.18;
      earR.position.set(0.15, 1.15, 0.05); earR.rotation.z = -0.18;
    }
    g.add(earL, earR);

    const eyeGeo = new THREE.SphereGeometry(0.05, 10, 10);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x2a1339 });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat); eyeL.position.set(-0.15, 0.7, 0.46);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat); eyeR.position.set(0.15, 0.7, 0.46);
    g.add(eyeL, eyeR);

    const cheekMat = new THREE.MeshStandardMaterial({ color: 0xff8fae, transparent: true, opacity: 0.55 });
    const cheekGeo = new THREE.CircleGeometry(0.07, 16);
    const cheekL = new THREE.Mesh(cheekGeo, cheekMat); cheekL.position.set(-0.27, 0.6, 0.44); cheekL.rotation.y = -0.3;
    const cheekR = new THREE.Mesh(cheekGeo, cheekMat); cheekR.position.set(0.27, 0.6, 0.44); cheekR.rotation.y = 0.3;
    g.add(cheekL, cheekR);

    const tailGeo = kind === 'cat'
      ? new THREE.CapsuleGeometry(0.06, 0.5, 4, 8)
      : new THREE.SphereGeometry(0.14, 12, 12);
    const tail = new THREE.Mesh(tailGeo, mat);
    tail.position.set(0, 0.1, -0.55);
    tail.rotation.x = kind === 'cat' ? 0.9 : 0;
    g.add(tail);

    const armGeo = new THREE.CapsuleGeometry(0.08, 0.32, 4, 8);
    const armL = new THREE.Mesh(armGeo, mat); armL.position.set(-0.48, 0.15, 0.25); armL.rotation.z = 0.5;
    const armR = new THREE.Mesh(armGeo, mat); armR.position.set(0.48, 0.15, 0.25); armR.rotation.z = -0.5;
    g.add(armL, armR);

    g.userData = { kind, head, earL, earR, tail, eyeL, eyeR, armR, body,
      blinkTimer: rand(1, 3), lookTimer: rand(2, 5), gestureTimer: rand(3, 7),
      baseY: 0, waving: false };
    return g;
  }

  const cat = makeCreature('cat', 0xc9a7f5, 0xe8a3c4);
  cat.position.set(-1.7, -0.3, 0);
  cat.scale.setScalar(0.92);
  scene.add(cat);

  const rabbit = makeCreature('rabbit', 0xffd9e6, 0xf3c77e);
  rabbit.position.set(1.7, -0.42, -0.4);
  rabbit.scale.setScalar(0.85);
  scene.add(rabbit);

  const creatures = [cat, rabbit];

  const pointer = { x: 0, y: 0, active: false };
  function updatePointer(clientX, clientY){
    const rect = wrap.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    pointer.active = true;
  }
  window.addEventListener('pointermove', (e) => updatePointer(e.clientX, e.clientY));
  window.addEventListener('pointerdown', (e) => {
    const rect = wrap.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) return;
    creatures.forEach(c => { c.userData.jumpImpulse = 1; });
  });

  function resize(){
    const rect = wrap.parentElement.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(wrap.parentElement);
  resize();

  const clock = new THREE.Clock();
  function animate(){
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    creatures.forEach((c, idx) => {
      const u = c.userData;
      const sway = Math.sin(t * 0.6 + idx) * 0.12;
      c.rotation.y = sway + (pointer.active ? pointer.x * 0.25 : 0);

      const idleY = Math.sin(t * 1.6 + idx * 2) * 0.045;
      u.jumpImpulse = u.jumpImpulse || 0;
      if (u.jumpImpulse > 0.01){
        c.position.y = c.userData.baseYAbs + Math.sin(u.jumpImpulse * Math.PI) * 0.5;
        u.jumpImpulse = lerp(u.jumpImpulse, 0, dt * 3.2);
      } else {
        c.position.y = c.userData.baseYAbs + idleY;
      }
      if (u.baseYAbs === undefined) u.baseYAbs = c.position.y;

      u.head.rotation.x = lerp(u.head.rotation.x, (pointer.active ? -pointer.y * 0.2 : 0), dt * 3);
      u.head.rotation.y = lerp(u.head.rotation.y, (pointer.active ? pointer.x * 0.3 : 0), dt * 3);

      u.earL.rotation.z = (u.kind === 'cat' ? 0.25 : 0.18) + Math.sin(t * 2.4 + idx) * 0.06;
      u.earR.rotation.z = -(u.kind === 'cat' ? 0.25 : 0.18) - Math.sin(t * 2.2 + idx) * 0.06;

      u.tail.rotation.z = Math.sin(t * 2 + idx) * (u.kind === 'cat' ? 0.35 : 0.15);

      u.blinkTimer -= dt;
      if (u.blinkTimer <= 0){
        u.eyeL.scale.y = u.eyeR.scale.y = 0.15;
        setTimeout(() => { u.eyeL.scale.y = u.eyeR.scale.y = 1; }, 110);
        u.blinkTimer = rand(2, 5);
      }

      u.gestureTimer -= dt;
      if (u.gestureTimer <= 0 && !u.waving){
        u.waving = true;
        u.waveT = 0;
        u.gestureTimer = rand(5, 9);
      }
      if (u.waving){
        u.waveT += dt;
        u.armR.rotation.z = -0.5 + Math.sin(u.waveT * 10) * 0.5;
        if (u.waveT > 1.2){ u.waving = false; u.armR.rotation.z = -0.5; }
      }
    });

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   8. THREE.JS — Kue Ulang Tahun 3D
   ========================================================================== */
function initCake(){
  const canvas = $('#cake-canvas');
  const tapTarget = $('#cake-tap-target');
  const instruction = $('#cake-instruction');
  if (!window.THREE || !canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 1.6, 6.2);

  scene.add(new THREE.AmbientLight(0x6a4a8f, 0.8));
  const key = new THREE.DirectionalLight(0xffe3c2, 1.2);
  key.position.set(2, 4, 3);
  scene.add(key);

  const cakeGroup = new THREE.Group();

  const tierMat1 = new THREE.MeshStandardMaterial({ color: 0xffd9e6, roughness: 0.5 });
  const tierMat2 = new THREE.MeshStandardMaterial({ color: 0xfff2f7, roughness: 0.5 });
  const tier1 = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.6, 0.7, 32), tierMat1);
  tier1.position.y = -0.7;
  const tier2 = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.2, 0.6, 32), tierMat2);
  tier2.position.y = 0.05;
  const tier3 = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.85, 0.5, 32), tierMat1);
  tier3.position.y = 0.6;
  cakeGroup.add(tier1, tier2, tier3);

  // drip icing
  const dripMat = new THREE.MeshStandardMaterial({ color: 0xb98cf0, roughness: 0.4 });
  for (let i = 0; i < 14; i++){
    const angle = (i / 14) * TAU;
    const drip = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), dripMat);
    drip.position.set(Math.cos(angle) * 1.15, -0.45 + Math.sin(i * 3) * 0.08, Math.sin(angle) * 1.15);
    cakeGroup.add(drip);
  }

  // candle
  const candle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.5, 12),
    new THREE.MeshStandardMaterial({ color: 0xf3c77e })
  );
  candle.position.y = 1.1;
  cakeGroup.add(candle);

  const flameGroup = new THREE.Group();
  const flame = new THREE.Mesh(
    new THREE.ConeGeometry(0.09, 0.24, 12),
    new THREE.MeshStandardMaterial({ color: 0xffb347, emissive: 0xff8c2a, emissiveIntensity: 1.4 })
  );
  flame.position.y = 1.45;
  flameGroup.add(flame);
  const flameLight = new THREE.PointLight(0xffb347, 1.4, 4);
  flameLight.position.y = 1.5;
  flameGroup.add(flameLight);
  cakeGroup.add(flameGroup);

  scene.add(cakeGroup);
  cakeGroup.rotation.y = 0.3;

  function resize(){
    const rect = canvas.parentElement.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas.parentElement);
  resize();

  let blown = false;
  let smokeParticles = [];

  function spawnSmoke(){
    for (let i = 0; i < 18; i++){
      smokeParticles.push({
        x: 0, y: 1.45, z: 0,
        vx: rand(-0.01, 0.01), vy: rand(0.01, 0.025), vz: rand(-0.01, 0.01),
        life: 1, mesh: null
      });
    }
  }

  const smokeMat = new THREE.MeshBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.35 });
  const smokeGeo = new THREE.SphereGeometry(0.07, 8, 8);
  const smokeMeshes = [];

  tapTarget.addEventListener('click', () => {
    if (blown) return;
    blown = true;
    instruction.textContent = 'Selamat, harapanmu sudah melayang bersama asapnya.';
    flameGroup.visible = false;
    spawnSmoke();
    fireConfettiDom();
  });

  function loop(){
    const t = performance.now() * 0.001;
    if (!blown){
      flame.scale.set(1 + Math.sin(t * 12) * 0.06, 1 + Math.sin(t * 9) * 0.08, 1);
      flameLight.intensity = 1.2 + Math.sin(t * 14) * 0.3;
    }
    cakeGroup.rotation.y += 0.0025;

    smokeParticles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy; p.z += p.vz; p.life -= 0.01;
      if (!p.mesh){
        p.mesh = new THREE.Mesh(smokeGeo, smokeMat.clone());
        cakeGroup.add(p.mesh);
        smokeMeshes.push(p.mesh);
      }
      p.mesh.position.set(p.x, p.y, p.z);
      p.mesh.material.opacity = clamp(p.life * 0.35, 0, 0.35);
      p.mesh.scale.setScalar(1 + (1 - p.life) * 2);
    });
    smokeParticles = smokeParticles.filter(p => p.life > 0);

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }
  loop();
}

/* Confetti DOM sederhana dipakai saat lilin ditiup & interaksi lain */
function fireConfettiDom(){
  const colors = ['#ff5a8c', '#f3c77e', '#b98cf0', '#ffb0c9', '#ffffff'];
  const container = document.body;
  for (let i = 0; i < 60; i++){
    const el = document.createElement('div');
    const size = rand(6, 11);
    el.style.cssText = `
      position: fixed; top: -20px; left: ${rand(0, 100)}vw; width:${size}px; height:${size * 0.4}px;
      background:${colors[Math.floor(rand(0, colors.length))]}; z-index: 9999; pointer-events:none;
      border-radius: 2px; opacity: 0.9;`;
    document.body.appendChild(el);
    const duration = rand(2200, 4200);
    const drift = rand(-120, 120);
    el.animate([
      { transform: `translate(0,0) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${drift}px, ${window.innerHeight + 40}px) rotate(${rand(200, 720)}deg)`, opacity: 0.9 }
    ], { duration, easing: 'cubic-bezier(.2,.6,.4,1)' });
    setTimeout(() => el.remove(), duration + 60);
  }
}

/* ==========================================================================
   9. CERITA — 30+ paragraf unik
   ========================================================================== */
const STORY_PARAGRAPHS = [
  "Aku tidak pernah menyangka, rasa sayang bisa tumbuh sebesar ini hanya lewat layar kecil di genggaman.",
  "Setiap notifikasi yang muncul dengan namamu, selalu berhasil membuat harimu jadi lebih baik dari sedetik sebelumnya.",
  "Kau mengajarkanku bahwa jarak bukan tentang berapa kilometer, tapi tentang seberapa sering kita memilih untuk saling hadir.",
  "Panggilan video kita yang kadang cuma diam-diaman, tetap terasa lebih hangat daripada ruangan mana pun.",
  "Aku menyimpan setiap pesan selamat pagi darimu, seperti menyimpan alasan kecil untuk terus bersyukur.",
  "Kau tidak tahu betapa aku selalu menunggu centang biru itu berubah, berharap kau sedang baik-baik saja.",
  "Terima kasih sudah percaya pada hubungan yang tidak bisa disentuh, tapi selalu bisa dirasakan.",
  "Setiap kali suaramu terdengar lelah di telepon, aku ikut belajar bagaimana caranya mendengarkan dengan lebih sabar.",
  "Kita membangun kepercayaan bukan dari genggaman tangan, tapi dari kata-kata yang selalu kau tepati.",
  "Aku bersyukur untuk sinyal yang menyambungkan kita, sesederhana apa pun itu terdengar.",
  "Doaku untukmu selalu sama setiap malam, semoga kau selalu diberi kesehatan dan kebahagiaan yang layak kau terima.",
  "Kau adalah alasan aku belajar sabar menunggu, tanpa pernah merasa itu sebagai beban.",
  "Setiap cerita kecil yang kau kirimkan tentang harimu, selalu terasa seperti oleh-oleh paling berharga.",
  "Aku menghargai setiap usahamu untuk tetap mengabari, meski kau sendiri sedang lelah dengan harimu.",
  "Kita belajar mencintai dengan cara yang berbeda, lewat kata yang jujur dan perhatian yang konsisten.",
  "Aku percaya, komitmen yang dijaga dari jauh justru yang paling teruji ketulusannya.",
  "Kau selalu tahu cara membuatku tersenyum sendiri di depan layar, tanpa kau sadari sekalipun.",
  "Setiap kali kau bilang 'aku pulang dulu ya', aku ikut lega meskipun kau pulang ke tempat yang jauh dariku.",
  "Aku menyayangi caramu bercerita, cara kau tertawa lewat pesan suara, dan cara kau selalu jujur soal perasaanmu.",
  "Masa depan kita mungkin masih berupa rencana, tapi aku menjaganya seperti sesuatu yang sudah nyata.",
  "Aku ingin jadi tempatmu pulang, meski untuk saat ini itu berarti tempat kau membuka chat kita lebih dulu.",
  "Kesabaranmu menghadapi jarak ini membuatku semakin yakin, kau memang orang yang tepat untuk diperjuangkan.",
  "Aku tidak butuh banyak, cukup kabar bahwa kau baik-baik saja sudah membuat hariku terasa cukup.",
  "Kita saling menguatkan lewat kata-kata sederhana, dan itu selalu lebih dari cukup untukku.",
  "Aku bersyukur punya seseorang yang mau mendengarkan keluh kesahku meski hanya lewat pesan singkat.",
  "Setiap kali kau kirim foto langitmu, aku selalu percaya kita sedang melihat langit yang sama.",
  "Aku belajar bahwa kepercayaan itu dibangun dari konsistensi kecil, bukan dari kata-kata besar sesaat.",
  "Semoga suatu hari nanti, semua tunggu-menunggu ini terbayar dengan cerita yang lebih indah lagi.",
  "Kau memberiku harapan bahwa hubungan virtual pun bisa terasa sekokoh yang lain, bahkan lebih.",
  "Aku menyayangimu bukan karena seberapa sering kita bertatap layar, tapi karena seberapa tulus kita saling menjaga.",
  "Terima kasih untuk setiap malam yang kau habiskan menemaniku lewat panggilan suara sampai tertidur.",
  "Aku ingin kau tahu, rasa syukurku padamu tidak pernah berkurang meski jarak kita tidak berubah.",
  "Kau adalah semangat kecil yang selalu kutunggu setiap kali membuka ponsel di pagi hari.",
  "Aku percaya, cinta yang dijaga dengan kesungguhan akan selalu menemukan caranya untuk bertahan.",
  "Semoga tahun ini menjadi tahun di mana kita semakin dekat, meski jarak kita belum berubah.",
  "Aku menyayangimu dalam diam, dalam doa, dan dalam setiap usaha kecil untuk selalu ada untukmu."
];

function renderStory(){
  const wrap = $('#story-scroller');
  const opener = document.createElement('p');
  opener.className = 'story-para accent';
  opener.textContent = '"Kita mungkin terpisah layar, tapi tidak pernah terpisah rasa."';
  wrap.appendChild(opener);

  STORY_PARAGRAPHS.forEach((text, i) => {
    const p = document.createElement('p');
    p.className = 'story-para';
    p.textContent = text;
    wrap.appendChild(p);
    if ((i + 1) % 9 === 0 && i !== STORY_PARAGRAPHS.length - 1){
      const accent = document.createElement('p');
      accent.className = 'story-para accent';
      const accents = [
        '"Terima kasih sudah tetap tinggal, walau hanya lewat kata."',
        '"Jarak boleh memisahkan raga, tidak dengan rasa sayang ini."'
      ];
      accent.textContent = accents[Math.floor(i / 9) - 1] || accents[0];
      wrap.appendChild(accent);
    }
  });

  const closer = document.createElement('p');
  closer.className = 'story-para accent';
  closer.textContent = '"Selamat ulang tahun, Zahra. Terima kasih sudah menjadi rumah, meski dari jauh."';
  wrap.appendChild(closer);

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.style.transition = 'opacity .8s ease, transform .8s ease';
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  $$('.story-para', wrap).forEach(el => io.observe(el));
}

/* ==========================================================================
   10. AMPLOP / KARTU UCAPAN
   ========================================================================== */
function initEnvelope(){
  const envelope = $('#envelope');
  const hint = $('#envelope-hint');
  envelope.addEventListener('click', () => {
    const opening = !envelope.classList.contains('open');
    envelope.classList.toggle('open');
    hint.textContent = opening ? 'Ketuk untuk menutup kembali' : 'Ketuk untuk membuka';
  });
}

/* ==========================================================================
   11. GALERI
   ========================================================================== */
function initGallery(){
  const scroller = $('#gallery-scroller');
  const items = $$('.gallery-item', scroller);
  const dotsWrap = $('#gallery-dots');

  items.forEach((item, i) => {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dotsWrap.appendChild(dot);

    const media = $('.gallery-media', item);
    if (media.dataset.src){
      media.src = media.dataset.src;
    }

    const playBtn = $('.gallery-play', item);
    if (playBtn){
      item.addEventListener('click', () => {
        if (media.paused){
          media.muted = false;
          media.play().catch(() => {});
          item.classList.add('playing');
        } else {
          media.pause();
          item.classList.remove('playing');
        }
      });
      media.addEventListener('ended', () => item.classList.remove('playing'));
    }
  });

  const dots = $$('.dot', dotsWrap);
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const idx = items.indexOf(entry.target);
      if (entry.isIntersecting && entry.intersectionRatio > 0.6){
        dots.forEach(d => d.classList.remove('active'));
        dots[idx]?.classList.add('active');
      }
    });
  }, { root: scroller, threshold: [0.6] });
  items.forEach(el => io.observe(el));
}

/* ==========================================================================
   12. MAKE A WISH
   ========================================================================== */
function initWish(){
  const input = $('#wish-input');
  const btn = $('#wish-button');
  const result = $('#wish-result');
  const canvas = $('#wish-canvas');
  const ctx = canvas.getContext('2d');
  let w, h;

  function resize(){
    w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * devicePixelRatio;
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  function launchStars(){
    const stars = Array.from({ length: 70 }, () => ({
      x: rand(w * 0.3, w * 0.7), y: rand(h * 0.5, h * 0.7),
      vx: rand(-0.6, 0.6) * devicePixelRatio, vy: rand(-2.6, -1.4) * devicePixelRatio,
      life: 1, size: rand(1.5, 3.2) * devicePixelRatio
    }));
    function loop(){
      ctx.clearRect(0, 0, w, h);
      let alive = false;
      stars.forEach(s => {
        s.x += s.vx; s.y += s.vy; s.vy -= 0.005; s.life -= 0.006;
        if (s.life > 0){
          alive = true;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, TAU);
          ctx.fillStyle = `rgba(243,199,126,${s.life})`;
          ctx.fill();
        }
      });
      if (alive) requestAnimationFrame(loop);
      else ctx.clearRect(0, 0, w, h);
    }
    loop();
  }

  btn.addEventListener('click', () => {
    if (!input.value.trim()) { input.focus(); return; }
    launchStars();
    input.value = '';
    input.blur();
    setTimeout(() => result.classList.add('show'), 400);
  });
}

/* ==========================================================================
   13. PENUTUP — LOVE SVG draw + Kotak Rahasia
   ========================================================================== */
function initClosing(){
  const lovePath = $('#love-path');
  const giftWrap = $('#secret-gift-wrap');
  const giftBox = $('#secret-gift-box');
  const finalGift = $('#final-gift');
  const restartBtn = $('#restart-button');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        lovePath.style.transition = 'stroke-dashoffset 2.6s cubic-bezier(.2,.7,.2,1)';
        lovePath.style.strokeDashoffset = '0';
        setTimeout(() => giftWrap.classList.remove('hidden'), 2600);
        io.disconnect();
      }
    });
  }, { threshold: 0.5 });
  io.observe($('#love-svg'));

  giftBox.addEventListener('click', () => {
    giftWrap.classList.add('hidden');
    finalGift.classList.remove('hidden');
    fireConfettiDom();
  });

  restartBtn.addEventListener('click', () => {
    window.location.reload();
  });
}

/* ==========================================================================
   14. BOTTOM NAVIGATION
   ========================================================================== */
function initBottomNav(){
  const nav = $('#bottom-nav');
  const items = $$('.nav-item', nav);
  const indicator = $('#bottom-nav-indicator');
  const sections = items.map(i => $('#' + i.dataset.target));

  function setActive(idx){
    items.forEach((it, i) => it.classList.toggle('active', i === idx));
    indicator.style.transform = `translateX(${idx * 50}px)`;
  }
  setActive(0);

  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      sections[i].scrollIntoView({ behavior: 'smooth' });
    });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const idx = sections.indexOf(entry.target);
        if (idx > -1) setActive(idx);
      }
    });
  }, { threshold: 0.5 });
  sections.forEach(s => s && io.observe(s));
}

/* ==========================================================================
   15. MUSIC PLAYER
   ========================================================================== */
function initMusicPlayer(){
  const audio = $('#bg-audio');
  const toggle = $('#music-toggle');
  const playIcon = $('#play-icon');
  const pauseIcon = $('#pause-icon');
  const panel = $('#music-panel');
  const waveWrap = $('#music-wave');
  const progressTrack = $('#music-progress-track');
  const progressFill = $('#music-progress-fill');
  const progressHandle = $('#music-progress-handle');
  const currentTimeEl = $('#music-current-time');
  const durationEl = $('#music-duration');
  const volumeSlider = $('#music-volume');

  for (let i = 0; i < 24; i++){
    const bar = document.createElement('span');
    waveWrap.appendChild(bar);
  }
  const bars = $$('span', waveWrap);

  let audioCtx, analyser, dataArray, source;
  function setupAnalyser(){
    if (audioCtx) return;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      source = audioCtx.createMediaElementSource(audio);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      dataArray = new Uint8Array(analyser.frequencyBinCount);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
    } catch (e) { /* Web Audio tidak tersedia, fallback ke animasi acak */ }
  }

  function fmtTime(sec){
    if (!isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function animateWave(){
    if (!audio.paused){
      if (analyser){
        analyser.getByteFrequencyData(dataArray);
        bars.forEach((bar, i) => {
          const v = dataArray[i % dataArray.length] / 255;
          bar.style.height = `${10 + v * 90}%`;
        });
      } else {
        bars.forEach(bar => bar.style.height = `${20 + rand(0, 70)}%`);
      }
    }
    requestAnimationFrame(animateWave);
  }
  animateWave();

  toggle.addEventListener('click', () => {
    setupAnalyser();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    if (audio.paused){
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  });

  audio.addEventListener('play', () => {
    toggle.classList.add('playing');
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
  });
  audio.addEventListener('pause', () => {
    toggle.classList.remove('playing');
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
  });

  let panelTimer;
  toggle.addEventListener('pointerenter', () => { clearTimeout(panelTimer); panel.classList.add('open'); });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.music-player')) panel.classList.remove('open');
    else if (e.target.closest('.music-toggle')) panel.classList.toggle('open');
  });

  audio.addEventListener('loadedmetadata', () => { durationEl.textContent = fmtTime(audio.duration); });
  audio.addEventListener('timeupdate', () => {
    const pct = (audio.currentTime / (audio.duration || 1)) * 100;
    progressFill.style.width = pct + '%';
    progressHandle.style.left = pct + '%';
    currentTimeEl.textContent = fmtTime(audio.currentTime);
  });

  function seek(e){
    const rect = progressTrack.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const pct = clamp((clientX - rect.left) / rect.width, 0, 1);
    if (isFinite(audio.duration)) audio.currentTime = pct * audio.duration;
  }
  progressTrack.addEventListener('click', seek);

  volumeSlider.addEventListener('input', () => { audio.volume = parseFloat(volumeSlider.value); });
  audio.volume = parseFloat(volumeSlider.value);

  // Autoplay setelah interaksi pertama pengguna di seluruh halaman
  let started = false;
  function tryAutoplay(){
    if (started) return;
    started = true;
    setupAnalyser();
    audio.play().catch(() => {});
    window.removeEventListener('pointerdown', tryAutoplay);
  }
  window.addEventListener('pointerdown', tryAutoplay, { once: true });
}

/* ==========================================================================
   16. SCROLL REVEAL untuk Hero
   ========================================================================== */
function initHeroReveal(){
  requestAnimationFrame(() => {
    $$('.reveal-line, .reveal-text').forEach((el, i) => {
      setTimeout(() => {
        el.style.transition = 'opacity .9s cubic-bezier(.2,.7,.2,1), transform .9s cubic-bezier(.2,.7,.2,1)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, i * 140);
    });
  });
}

/* ==========================================================================
   INISIALISASI SETELAH LOADING SELESAI
   ========================================================================== */
function initAppExperience(){
  initGlobalParticles();
  initClock();
  initCountdown();
  initFireworks();
  initHeroCreatures();
  initCake();
  renderStory();
  initEnvelope();
  initGallery();
  initWish();
  initClosing();
  initBottomNav();
  initMusicPlayer();
  initHeroReveal();
}
