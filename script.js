/**
 * ==========================================================
 * PERBAIKAN FATAL CRASH: THREE.JS GEOMETRY FIX & ERROR HANDLING
 * ==========================================================
 */

const ROMANTIC_QUOTES = [
    "Terima kasih telah hadir dalam hidupku, Zahra.", "Setiap pesan darimu adalah notifikasi favoritku.", 
    "Meski layar memisahkan raga, hati kita terikat erat.", "Selamat ulang tahun untuk seseorang yang membuat duniaku lebih berwarna.",
    "Jarak mengajarkan kita arti rindu yang sesungguhnya.", "Semoga kebahagiaan selalu mengiringi setiap langkahmu di manapun kau berada.", 
    "Aku bangga memiliki seseorang sepertimu yang luar biasa.", "Melihat namamu mengetik pesan selalu membuatku tersenyum sendiri.",
    "Kehadiranmu selalu menjadi alasan senyumku setiap hari.", "Walau raga tak di tempat yang sama, hati kita selalu terhubung.", 
    "Terima kasih sudah menemani hari-hariku dengan tawa indahmu.", "Di hari spesialmu, aku mengirimkan doa terbaik melintasi sinyal dan waktu.",
    "Semoga impianmu satu per satu menjadi nyata, Zahra sayang.", "Aku akan selalu mendukungmu dari mana pun.", 
    "Suara tawamu di telepon genggam adalah melodi penenang jiwaku.", "Pesan-pesanmu adalah penyemangat di tengah penatnya hariku."
];
while(ROMANTIC_QUOTES.length < 100) { ROMANTIC_QUOTES.push(ROMANTIC_QUOTES[Math.floor(Math.random()*16)]); }

class AudioEngine {
    constructor() { this.ctx = null; }
    init() {
        if (this.ctx) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
                this.masterGain = this.ctx.createGain();
                this.masterGain.connect(this.ctx.destination);
                this.masterGain.gain.value = 0.3;
            }
        } catch(e) {}
    }
    playTone(freq, type, dur) {
        this.init(); 
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type; osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + dur);
            osc.connect(gain); gain.connect(this.masterGain);
            osc.start(); osc.stop(this.ctx.currentTime + dur);
        } catch(e) {}
    }
    playKeystroke() { this.playTone(800, 'sine', 0.1); }
    playDelete() { this.playTone(600, 'triangle', 0.1); }
    playError() { this.playTone(150, 'sawtooth', 0.3); }
    playSuccess() { this.playTone(600, 'sine', 0.1); setTimeout(()=>this.playTone(800, 'sine', 0.2), 100); }
}
const audio = new AudioEngine();

class ParticleEngine {
    constructor() {
        this.canvas = document.getElementById('bg-canvas-particles');
        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.particles = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());
        requestAnimationFrame(this.animate.bind(this));
    }
    resize() { this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; }
    createExplosion(x, y, colorArr) {
        for(let i=0; i<80; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 1;
            this.particles.push({
                x: x, y: y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
                radius: Math.random() * 3 + 1, color: colorArr[Math.floor(Math.random() * colorArr.length)],
                alpha: 1, decay: Math.random() * 0.02 + 0.01
            });
        }
    }
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for(let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.vy += 0.05; p.x += p.vx; p.y += p.vy; p.alpha -= p.decay;
            this.ctx.globalAlpha = Math.max(0, p.alpha);
            this.ctx.beginPath(); this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color; this.ctx.fill();
            if(p.alpha <= 0) this.particles.splice(i, 1);
        }
        requestAnimationFrame(this.animate.bind(this));
    }
}
const particleSys = new ParticleEngine();

// --- 100% SAFE THREE JS ENGINE ---
class ThreeJSEngine {
    constructor() {
        this.canvas = document.getElementById('three-canvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 100);
        this.camera.position.set(0, 2, 22);
        
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: false });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(1);
        
        const ambient = new THREE.AmbientLight(0xffffff, 0.8);
        const dirLight = new THREE.DirectionalLight(0xffe8f0, 0.6);
        dirLight.position.set(5, 10, 5);
        this.scene.add(ambient, dirLight);

        const matCat = new THREE.MeshLambertMaterial({ color: 0xffb07c });
        const matRab = new THREE.MeshLambertMaterial({ color: 0xfafafa });
        
        // PENGGUNAAN CYLINDER AGAR TIDAK CRASH DI HP
        this.cat = new THREE.Group();
        const catBody = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 2, 16), matCat);
        catBody.rotation.z = Math.PI / 2;
        catBody.position.y = 1.2;
        this.cat.add(catBody);
        
        this.rabbit = new THREE.Group();
        const rabBody = new THREE.Mesh(new THREE.SphereGeometry(1.4, 16, 16), matRab);
        rabBody.position.y = 1.4;
        
        // Telinga kelinci ganti ke Cylinder agar kompatibel
        const rabEar = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.8, 16), matRab);
        rabEar.position.set(0, 2.5, 0);
        this.rabbit.add(rabBody, rabEar);

        this.cat.position.set(-4, -5, 0);
        this.rabbit.position.set(4, -5, 0);
        this.scene.add(this.cat, this.rabbit);
        
        this.clock = new THREE.Clock();
        this.isActive = true; 
        
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        requestAnimationFrame(this.animate.bind(this));
    }
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        if(!this.isActive) return; 
        
        const t = this.clock.getElapsedTime();
        this.cat.position.y = -5 + Math.sin(t * 2) * 0.1;
        this.rabbit.position.y = -5 + Math.sin(t * 2.2) * 0.1;
        this.renderer.render(this.scene, this.camera);
    }
}
let threeEngine;

class UIManager {
    constructor() {
        this.screens = document.querySelectorAll('.screen-layer');
        this.dockItems = document.querySelectorAll('.dock-item');
        this.bgMusic = document.getElementById('bg-music');
        
        this.initKeypad();
        this.initDock();
        this.initMusic();
        this.initWish();
        this.initSecret();
        this.injectCSSDecorations();
    }
    
    switchScreen(targetId) {
        this.screens.forEach(s => s.classList.remove('active-screen'));
        document.getElementById(targetId).classList.add('active-screen');
        
        this.dockItems.forEach(i => {
            i.classList.remove('active');
            if(i.dataset.target === targetId) i.classList.add('active');
        });
        
        audio.playSuccess();
        
        if(targetId === 'screen-home') {
            // TRY-CATCH PENGAMAN: Jika 3D Gagal dimuat (HP tidak support), sisanya TETAP JALAN
            try {
                if(!threeEngine) threeEngine = new ThreeJSEngine();
                threeEngine.isActive = true;
            } catch(e) {
                console.warn("3D dilarang oleh browser, tapi aman diabaikan.", e);
            }
            this.startLiveClock(); // Jam akan dipaksa menyala!
        } else if(threeEngine) {
            threeEngine.isActive = false; 
        }
        
        if(targetId === 'screen-messages') this.initLetterScroll();
    }
    
    initDock() {
        this.dockItems.forEach(item => {
            item.addEventListener('click', (e) => {
                this.switchScreen(e.currentTarget.dataset.target);
            });
        });
    }
    
    initKeypad() {
        const container = document.getElementById('numpad-container');
        const keys = [
            {n:'1', l:''}, {n:'2', l:'ABC'}, {n:'3', l:'DEF'},
            {n:'4', l:'GHI'}, {n:'5', l:'JKL'}, {n:'6', l:'MNO'},
            {n:'7', l:'PQRS'}, {n:'8', l:'TUV'}, {n:'9', l:'WXYZ'},
            {n:'clear', l:'⌫', action:true}, {n:'0', l:'+'}, {n:'empty', l:'', empty:true}
        ];
        
        keys.forEach(k => {
            const btn = document.createElement('button');
            btn.className = 'keypad-btn';
            if(k.empty) btn.classList.add('empty');
            if(k.action) btn.classList.add('action-key');
            
            if(k.action) btn.innerText = k.l;
            else if(!k.empty) btn.innerHTML = `${k.n}<span class="letters">${k.l}</span>`;
            
            btn.addEventListener('click', () => {
                if(k.empty) return;
                btn.style.transform = 'scale(0.85)';
                setTimeout(()=> btn.style.transform = 'none', 100);
                this.handlePin(k.action ? 'clear' : k.n);
            });
            container.appendChild(btn);
        });
        
        this.pinCode = "";
        this.correctPin = "090812";
        this.indicators = document.querySelectorAll('.pin-dot');
    }
    
    handlePin(val) {
        if(val === 'clear') {
            this.pinCode = this.pinCode.slice(0, -1);
            audio.playDelete();
        } else if(this.pinCode.length < 6) {
            this.pinCode += val;
            audio.playKeystroke();
        }
        
        this.indicators.forEach((dot, idx) => {
            if(idx < this.pinCode.length) dot.classList.add('filled');
            else dot.classList.remove('filled');
        });
        
        if(this.pinCode.length === 6) {
            if(this.pinCode === this.correctPin) {
                audio.playSuccess();
                setTimeout(() => this.startLoadingSequence(), 400);
            } else {
                audio.playError();
                document.getElementById('pin-indicators').classList.add('shake-error');
                this.indicators.forEach(d => d.classList.add('error'));
                setTimeout(() => {
                    this.pinCode = "";
                    this.indicators.forEach(d => { d.classList.remove('filled'); d.classList.remove('error'); });
                    document.getElementById('pin-indicators').classList.remove('shake-error');
                }, 500);
            }
        }
    }
    
    startLoadingSequence() {
        this.switchScreen('screen-loading');
        const fill = document.getElementById('loading-fill-element');
        const pct = document.getElementById('loading-pct');
        
        let prog = 0;
        const interval = setInterval(() => {
            prog += 15;
            if(prog >= 100) {
                prog = 100; clearInterval(interval);
                setTimeout(() => {
                    this.switchScreen('screen-home');
                    particleSys.createExplosion(window.innerWidth/2, window.innerHeight/2, ['#ff69b4', '#dda0dd']);
                    document.getElementById('main-dock').classList.remove('hidden-dock');
                    if(this.bgMusic) this.bgMusic.play().catch(e=>{});
                }, 500);
            }
            fill.style.width = `${prog}%`;
            pct.innerText = `${Math.floor(prog)}%`;
        }, 150);
    }
    
    initMusic() {
        const btn = document.getElementById('toggle-music-btn');
        if(!btn || !this.bgMusic) return;
        btn.addEventListener('click', () => {
            if(this.bgMusic.paused) { 
                this.bgMusic.play(); 
                document.getElementById('music-island').classList.remove('is-paused');
            } else { 
                this.bgMusic.pause(); 
                document.getElementById('music-island').classList.add('is-paused');
            }
        });
        
        this.bgMusic.addEventListener('timeupdate', () => {
            const p = (this.bgMusic.currentTime / this.bgMusic.duration) * 100;
            document.getElementById('music-progress').style.width = `${p}%`;
        });
    }
    
    startLiveClock() {
        const update = () => {
            const now = new Date();
            // FORMAT TANGGAL YANG AMAN UNTUK SEMUA HP (Jam pasti jalan)
            document.getElementById('live-date-display').innerText = now.toLocaleDateString('id-ID', {weekday:'long', month:'long', day:'numeric', year:'numeric'});
            document.getElementById('tz-wib').innerText = now.toLocaleTimeString('id-ID', {timeZone: 'Asia/Jakarta', hour:'2-digit', minute:'2-digit'});
            document.getElementById('tz-wita').innerText = now.toLocaleTimeString('id-ID', {timeZone: 'Asia/Makassar', hour:'2-digit', minute:'2-digit'});
            document.getElementById('tz-wit').innerText = now.toLocaleTimeString('id-ID', {timeZone: 'Asia/Jayapura', hour:'2-digit', minute:'2-digit'});
            document.getElementById('tz-utc').innerText = now.toLocaleTimeString('id-ID', {timeZone: 'UTC', hour:'2-digit', minute:'2-digit'});
            setTimeout(update, 1000);
        };
        update();
    }
    
    initLetterScroll() {
        if(this.letterInited) return; this.letterInited = true;
        document.getElementById('open-letter-btn').addEventListener('click', () => {
            audio.playSuccess();
            document.getElementById('envelope-wrapper').classList.add('envelope-open');
            setTimeout(() => {
                document.getElementById('envelope-wrapper').style.display = 'none';
                document.getElementById('letter-content').classList.remove('hidden');
                const container = document.getElementById('romantic-quotes-container');
                ROMANTIC_QUOTES.forEach(quote => {
                    const el = document.createElement('div');
                    el.className = 'quote-item'; el.innerText = quote;
                    container.appendChild(el);
                });
            }, 800);
        });
    }
    
    initWish() {
        document.getElementById('send-wish-btn').addEventListener('click', () => {
            const text = document.getElementById('wish-input');
            if(text.value.trim() === '') return;
            audio.playSuccess();
            text.value = ''; 
            particleSys.createExplosion(window.innerWidth/2, window.innerHeight/2, ['#FFD700', '#FF69B4', '#FFFFFF']);
        });
    }
    
    initSecret() {
        const boxBtn = document.getElementById('magic-box-btn');
        boxBtn.addEventListener('click', () => {
            audio.playSuccess();
            particleSys.createExplosion(window.innerWidth/2, window.innerHeight/2, ['#A855F7', '#FF69B4']);
            boxBtn.classList.add('box-opened');
            setTimeout(() => {
                document.getElementById('secret-box-wrapper').classList.add('hidden');
                document.getElementById('ultimate-gift-container').classList.remove('hidden');
            }, 800);
        });
        document.getElementById('reset-journey-btn').addEventListener('click', () => { this.switchScreen('screen-home'); });
    }

    injectCSSDecorations() {
        const layer = document.getElementById('css-decor-layer');
        const shapes = ['✦', '★', '♦', '●', '✧', '⋆'];
        for(let i=0; i<40; i++) {
            const span = document.createElement('span');
            span.className = 'css-particle-item';
            span.innerText = shapes[Math.floor(Math.random()*shapes.length)];
            span.style.left = `${Math.random()*100}vw`;
            span.style.fontSize = `${Math.random()*15 + 10}px`;
            span.style.setProperty('--duration', `${Math.random()*20 + 15}s`);
            span.style.animationDelay = `${Math.random()*20}s`;
            layer.appendChild(span);
        }
    }
}

// Mencegah Crash, tunggu HTML termuat sepenuhnya
document.addEventListener('DOMContentLoaded', () => {
    try { window.App = new UIManager(); } 
    catch(e) { console.error(e); }
});
