/**
 * PERBAIKAN 100% FINAL: BENTUK KUCING & KELINCI LUCU + RAYCASTER TOUCH + SCROLL LANCAR
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
while(ROMANTIC_QUOTES.length < 50) { ROMANTIC_QUOTES.push(ROMANTIC_QUOTES[Math.floor(Math.random()*16)]); }

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
        if (!this.ctx || this.ctx.state === 'suspended') return;
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

// --- 3D ENGINE (KUCING & KELINCI YANG BENAR-BENAR LUCU + FITUR SENTUH) ---
class ThreeJSEngine {
    constructor() {
        this.canvas = document.getElementById('three-canvas');
        this.scene = new THREE.Scene();
        
        const isMobile = window.innerWidth < 768;
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 100);
        this.camera.position.set(0, 0, isMobile ? 26 : 20); // Zoom out agar terlihat jelas
        
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        const ambient = new THREE.AmbientLight(0xffffff, 0.9);
        const dirLight = new THREE.DirectionalLight(0xffe8f0, 0.5);
        dirLight.position.set(5, 10, 5);
        this.scene.add(ambient, dirLight);

        const matCat = new THREE.MeshLambertMaterial({ color: 0xffb07c }); // Orange
        const matRab = new THREE.MeshLambertMaterial({ color: 0xfafafa }); // Putih
        const matBlack = new THREE.MeshBasicMaterial({ color: 0x222222 });
        const matPink = new THREE.MeshBasicMaterial({ color: 0xff69b4 });

        // --- MERAKIT KUCING LUCU (TIDAK AKAN CRASH) ---
        this.cat = new THREE.Group();
        const catBody = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), matCat);
        catBody.scale.y = 1.1; // Sedikit lonjong
        
        const catHead = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), matCat);
        catHead.position.set(0, 2, 0.5);
        
        const earGeo = new THREE.ConeGeometry(0.4, 1, 16);
        const catEar1 = new THREE.Mesh(earGeo, matCat); catEar1.position.set(-0.6, 2.8, 0.5); catEar1.rotation.z = 0.2;
        const catEar2 = new THREE.Mesh(earGeo, matCat); catEar2.position.set(0.6, 2.8, 0.5); catEar2.rotation.z = -0.2;
        
        const catEye1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), matBlack); catEye1.position.set(-0.4, 2, 1.6);
        const catEye2 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), matBlack); catEye2.position.set(0.4, 2, 1.6);
        const catNose = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), matPink); catNose.position.set(0, 1.8, 1.7);
        
        this.cat.add(catBody, catHead, catEar1, catEar2, catEye1, catEye2, catNose);
        
        // --- MERAKIT KELINCI LUCU ---
        this.rabbit = new THREE.Group();
        const rabBody = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), matRab);
        rabBody.scale.y = 1.1;
        
        const rabHead = new THREE.Mesh(new THREE.SphereGeometry(1.1, 32, 32), matRab);
        rabHead.position.set(0, 2.2, 0.5);
        
        const rEarGeo = new THREE.CylinderGeometry(0.2, 0.3, 2.5, 16); // Telinga panjang
        const rabEar1 = new THREE.Mesh(rEarGeo, matRab); rabEar1.position.set(-0.5, 3.8, 0.3); rabEar1.rotation.z = 0.1;
        const rabEar2 = new THREE.Mesh(rEarGeo, matRab); rabEar2.position.set(0.5, 3.8, 0.3); rabEar2.rotation.z = -0.1;
        
        const rabEye1 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), matBlack); rabEye1.position.set(-0.4, 2.3, 1.5);
        const rabEye2 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), matBlack); rabEye2.position.set(0.4, 2.3, 1.5);
        const rabNose = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), matPink); rabNose.position.set(0, 2.1, 1.6);
        
        this.rabbit.add(rabBody, rabHead, rabEar1, rabEar2, rabEye1, rabEye2, rabNose);

        // --- PENEMPATAN POSISI AGAR TERLIHAT ---
        this.baseY = isMobile ? -8 : -6; // Simpan posisi asli Y
        const xOffset = isMobile ? 3.5 : 5;
        this.cat.position.set(-xOffset, this.baseY, 0);
        this.rabbit.position.set(xOffset, this.baseY, 0);
        
        this.scene.add(this.cat, this.rabbit);
        
        // --- FITUR SENTUHAN (RAYCASTER) ---
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Catat variabel lompatan
        this.catJump = 0;
        this.rabJump = 0;

        window.addEventListener('pointerdown', (e) => {
            if(!this.isActive) return;
            // Hitung posisi klik ke 3D
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects([this.cat, this.rabbit], true);
            
            if(intersects.length > 0) {
                let obj = intersects[0].object;
                while(obj.parent && obj.parent.type === "Group") {
                    if(obj.parent === this.cat || obj.parent === this.rabbit) { obj = obj.parent; break; }
                    obj = obj.parent;
                }
                
                if(obj === this.cat && this.catJump <= 0) {
                    this.catJump = 0.5; // Kekuatan lompat
                    audio.playSuccess();
                } else if(obj === this.rabbit && this.rabJump <= 0) {
                    this.rabJump = 0.5; // Kekuatan lompat
                    audio.playSuccess();
                }
            }
        });

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
        
        // Animasi Lompatan Kucing
        if(this.catJump > 0 || this.cat.position.y > this.baseY) {
            this.cat.position.y += this.catJump;
            this.catJump -= 0.03; // Gravitasi
            if(this.cat.position.y <= this.baseY) { this.cat.position.y = this.baseY; this.catJump = 0; }
        } else {
            this.cat.position.y = this.baseY + Math.sin(t * 2) * 0.2; // Nafas biasa
        }
        
        // Animasi Lompatan Kelinci
        if(this.rabJump > 0 || this.rabbit.position.y > this.baseY) {
            this.rabbit.position.y += this.rabJump;
            this.rabJump -= 0.03; // Gravitasi
            this.rabbit.rotation.y += 0.1; // Muter pas lompat
            if(this.rabbit.position.y <= this.baseY) { this.rabbit.position.y = this.baseY; this.rabJump = 0; this.rabbit.rotation.y = 0;}
        } else {
            this.rabbit.position.y = this.baseY + Math.sin(t * 2.2) * 0.2;
        }

        // Putar kanan kiri sedikit
        if(this.catJump === 0) this.cat.rotation.y = Math.sin(t) * 0.3;
        
        this.renderer.render(this.scene, this.camera);
    }
}

// --- UI MANAGER ---
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
    }
    
    switchScreen(targetId) {
        this.screens.forEach(s => s.classList.remove('active-screen'));
        document.getElementById(`screen-${targetId}`).classList.add('active-screen');
        
        this.dockItems.forEach(i => {
            i.classList.remove('active');
            if(i.dataset.target === `screen-${targetId}`) i.classList.add('active');
        });
        
        audio.playSuccess();
        
        if(targetId === 'home') {
            try {
                if(!threeEngine) threeEngine = new ThreeJSEngine();
                threeEngine.isActive = true;
            } catch(e) { console.log(e); }
            this.startLiveClock();
        } else if(threeEngine) {
            threeEngine.isActive = false; 
        }
        
        if(targetId === 'messages') this.initLetterScroll();
    }
    
    initDock() {
        this.dockItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const target = e.currentTarget.dataset.target.replace('screen-', '');
                this.switchScreen(target);
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
                
                // Minta izin audio saat tombol pertama kali diklik
                if(audio.ctx === null) audio.init();
                
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
        this.switchScreen('loading');
        const fill = document.getElementById('loading-fill-element');
        const pct = document.getElementById('loading-pct');
        
        let prog = 0;
        const interval = setInterval(() => {
            prog += 20;
            if(prog >= 100) {
                prog = 100; clearInterval(interval);
                setTimeout(() => {
                    this.switchScreen('home');
                    document.getElementById('main-dock').classList.remove('hidden-dock');
                    if(this.bgMusic) {
                        this.bgMusic.play().then(() => {
                            document.getElementById('music-eq').classList.remove('is-paused');
                            document.getElementById('music-icon-svg').innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
                        }).catch(e=>{});
                    }
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
                document.getElementById('music-eq').classList.remove('is-paused');
                document.getElementById('music-icon-svg').innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
            } else { 
                this.bgMusic.pause(); 
                document.getElementById('music-eq').classList.add('is-paused');
                document.getElementById('music-icon-svg').innerHTML = '<path d="M8 5v14l11-7z"/>';
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
            // Animasi kecil di tombol
            document.querySelector('#send-wish-btn .btn-text').innerText = "Terkirim ✦";
            setTimeout(() => document.querySelector('#send-wish-btn .btn-text').innerText = "Kirim ke Semesta", 2000);
        });
    }
    
    initSecret() {
        const boxBtn = document.getElementById('magic-box-btn');
        boxBtn.addEventListener('click', () => {
            audio.playSuccess();
            boxBtn.classList.add('box-opened');
            setTimeout(() => {
                document.getElementById('secret-box-wrapper').classList.add('hidden');
                document.getElementById('ultimate-gift-container').classList.remove('hidden');
            }, 800);
        });
        document.getElementById('reset-journey-btn').addEventListener('click', () => { this.switchScreen('home'); });
    }
}

// Eksekusi Paling Aman
window.onload = () => {
    try { window.App = new UIManager(); } catch(e) { console.error(e); }
};
