/**
 * PERBAIKAN FINAL 100%: 
 * 1. Mencegah Freeze pada Loading (Aman dari zona waktu & interval).
 * 2. Mengembalikan bentuk Kucing dan Kelinci menjadi sangat lucu dan bulat.
 * 3. Menghidupkan fitur lompat ketika mereka disentuh di layar.
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

// --- AUDIO ENGINE ---
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

// --- 3D ENGINE (KUCING & KELINCI BULAT, LUCU & BISA MELOMPAT) ---
class ThreeJSEngine {
    constructor() {
        try {
            this.canvas = document.getElementById('three-canvas');
            this.scene = new THREE.Scene();
            
            const isMobile = window.innerWidth < 768;
            this.camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 100);
            this.camera.position.set(0, 0, isMobile ? 24 : 18); // Posisi mundur agar tidak terpotong
            
            this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            
            const ambient = new THREE.AmbientLight(0xffffff, 0.9);
            const dirLight = new THREE.DirectionalLight(0xffe8f0, 0.5);
            dirLight.position.set(5, 10, 5);
            this.scene.add(ambient, dirLight);

            const matCat = new THREE.MeshLambertMaterial({ color: 0xffa07a }); // Peach/Orange
            const matRab = new THREE.MeshLambertMaterial({ color: 0xfafafa }); // Putih
            const matBlack = new THREE.MeshBasicMaterial({ color: 0x111111 });
            const matPink = new THREE.MeshBasicMaterial({ color: 0xff69b4 });

            // 1. MEMBUAT KUCING LUCU (Bulat)
            this.cat = new THREE.Group();
            
            // Badan Bulat
            const catBody = new THREE.Mesh(new THREE.SphereGeometry(1.3, 32, 32), matCat);
            catBody.scale.set(1, 1.2, 1);
            catBody.position.y = 1.3;
            
            // Kepala Bulat
            const catHead = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), matCat);
            catHead.position.set(0, 2.7, 0.3);
            
            // Telinga Runcing
            const earGeo = new THREE.ConeGeometry(0.3, 0.8, 16);
            const catEarL = new THREE.Mesh(earGeo, matCat); catEarL.position.set(-0.5, 3.4, 0.3); catEarL.rotation.z = 0.2;
            const catEarR = new THREE.Mesh(earGeo, matCat); catEarR.position.set(0.5, 3.4, 0.3); catEarR.rotation.z = -0.2;
            
            // Mata dan Hidung
            const catEyeL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), matBlack); catEyeL.position.set(-0.35, 2.8, 1.2);
            const catEyeR = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), matBlack); catEyeR.position.set(0.35, 2.8, 1.2);
            const catNose = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), matPink); catNose.position.set(0, 2.6, 1.3);

            this.cat.add(catBody, catHead, catEarL, catEarR, catEyeL, catEyeR, catNose);

            // 2. MEMBUAT KELINCI LUCU (Bulat)
            this.rabbit = new THREE.Group();
            
            // Badan Bulat
            const rabBody = new THREE.Mesh(new THREE.SphereGeometry(1.4, 32, 32), matRab);
            rabBody.scale.set(1, 1.1, 1);
            rabBody.position.y = 1.3;
            
            // Kepala Bulat
            const rabHead = new THREE.Mesh(new THREE.SphereGeometry(0.9, 32, 32), matRab);
            rabHead.position.set(0, 2.6, 0.3);
            
            // Telinga Panjang
            const rabEarL = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.8, 16), matRab); rabEarL.position.set(-0.4, 3.6, 0.3); rabEarL.rotation.z = 0.1;
            const rabEarR = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.8, 16), matRab); rabEarR.position.set(0.4, 3.6, 0.3); rabEarR.rotation.z = -0.1;
            
            // Mata dan Hidung
            const rabEyeL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), matBlack); rabEyeL.position.set(-0.35, 2.7, 1.1);
            const rabEyeR = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), matBlack); rabEyeR.position.set(0.35, 2.7, 1.1);
            const rabNose = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), matPink); rabNose.position.set(0, 2.5, 1.2);

            this.rabbit.add(rabBody, rabHead, rabEarL, rabEarR, rabEyeL, rabEyeR, rabNose);

            // PENEMPATAN POSISI
            this.baseY = isMobile ? -7 : -5;
            const xOffset = isMobile ? 3.5 : 5;
            this.cat.position.set(-xOffset, this.baseY, 0);
            this.rabbit.position.set(xOffset, this.baseY, 0);
            
            this.scene.add(this.cat, this.rabbit);
            
            // FITUR LOMPAT KETIKA DISENTUH
            this.raycaster = new THREE.Raycaster();
            this.mouse = new THREE.Vector2();
            this.catJump = 0;
            this.rabJump = 0;

            window.addEventListener('click', (e) => {
                if(!this.isActive) return;
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
                        this.catJump = 0.5; audio.playSuccess();
                    } else if(obj === this.rabbit && this.rabJump <= 0) {
                        this.rabJump = 0.5; audio.playSuccess();
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
        } catch(e) { console.error("3D Error", e); }
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        if(!this.isActive) return; 
        
        const t = this.clock.getElapsedTime();
        
        // Fisika Lompat Kucing
        if(this.catJump > 0 || this.cat.position.y > this.baseY) {
            this.cat.position.y += this.catJump;
            this.catJump -= 0.03; // Gravitasi
            if(this.cat.position.y <= this.baseY) { this.cat.position.y = this.baseY; this.catJump = 0; }
        } else {
            this.cat.position.y = this.baseY + Math.sin(t * 2) * 0.2; // Bernapas
        }
        
        // Fisika Lompat Kelinci
        if(this.rabJump > 0 || this.rabbit.position.y > this.baseY) {
            this.rabbit.position.y += this.rabJump;
            this.rabJump -= 0.03; 
            this.rabbit.rotation.y += 0.1; // Muter pas lompat
            if(this.rabbit.position.y <= this.baseY) { this.rabbit.position.y = this.baseY; this.rabJump = 0; this.rabbit.rotation.y = 0;}
        } else {
            this.rabbit.position.y = this.baseY + Math.sin(t * 2.2) * 0.2;
        }

        // Putar kiri kanan otomatis
        if(this.catJump === 0) this.cat.rotation.y = Math.sin(t) * 0.3;
        if(this.rabJump === 0) this.rabbit.rotation.y = -Math.sin(t) * 0.3;
        
        this.renderer.render(this.scene, this.camera);
    }
}
let threeEngine;

// --- UI MANAGER ---
class UIManager {
    constructor() {
        this.screens = document.querySelectorAll('.screen-layer');
        this.dockItems = document.querySelectorAll('.dock-item');
        this.bgMusic = document.getElementById('bg-music');
        
        this.initKeypad();
        this.initDock();
        this.initMusic();
        this.initLetterScroll();
        this.initWish();
        this.initSecret();
    }
    
    switchScreen(targetId) {
        try {
            this.screens.forEach(s => s.classList.remove('active-screen'));
            document.getElementById(`screen-${targetId}`).classList.add('active-screen');
            
            this.dockItems.forEach(i => {
                i.classList.remove('active');
                if(i.dataset.target === targetId) i.classList.add('active');
            });
            
            audio.playSuccess();
            
            if(targetId === 'home') {
                if(!threeEngine) threeEngine = new ThreeJSEngine();
                threeEngine.isActive = true;
                this.startLiveClock();
            } else if(threeEngine) {
                threeEngine.isActive = false; // Matikan 3D untuk amankan Scroll HP
            }
        } catch(e) { console.error("Switch Screen Error", e); }
    }
    
    initDock() {
        this.dockItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const target = e.currentTarget.dataset.target;
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
                
                if(audio.ctx === null) audio.init(); // Wajib untuk HP
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
    
    // PERBAIKAN FATAL PADA SISTEM LOADING MENGGUNAKAN requestAnimationFrame YANG AMAN
    startLoadingSequence() {
        this.switchScreen('loading');
        let prog = 0;
        const fill = document.getElementById('loading-fill-element');
        const pct = document.getElementById('loading-pct');
        
        const step = () => {
            try {
                prog += 2; // Kecepatan progres
                if (fill) fill.style.width = `${Math.min(prog, 100)}%`;
                if (pct) pct.innerText = `${Math.min(prog, 100)}%`;
                
                if (prog < 100) {
                    requestAnimationFrame(step);
                } else {
                    setTimeout(() => {
                        this.switchScreen('home');
                        document.getElementById('main-dock').classList.remove('hidden-dock');
                        if(this.bgMusic) {
                            this.bgMusic.play().then(() => {
                                document.getElementById('music-eq').classList.remove('is-paused');
                                document.getElementById('music-icon-svg').innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
                            }).catch(()=>{}); // Abaikan error play dari browser
                        }
                    }, 500);
                }
            } catch(e) {
                console.error(e);
                this.switchScreen('home'); // Bypass Loading jika ada error sistem HP
                document.getElementById('main-dock').classList.remove('hidden-dock');
            }
        };
        requestAnimationFrame(step);
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
    
    // PERBAIKAN ZONA WAKTU AGAR TIDAK CRASH DI HP TERTENTU
    startLiveClock() {
        const update = () => {
            try {
                const now = new Date();
                document.getElementById('live-date-display').innerText = now.toLocaleDateString('id-ID', {weekday:'long', month:'long', day:'numeric', year:'numeric'});
                
                // Menggunakan sistem Manual Offset Math agar 1000% tidak akan crash di HP
                const pad = (n) => n.toString().padStart(2, '0');
                const getTZTime = (offset) => {
                    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
                    const d = new Date(utc + (3600000 * offset));
                    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
                };
                
                document.getElementById('tz-wib').innerText = getTZTime(7);
                document.getElementById('tz-wita').innerText = getTZTime(8);
                document.getElementById('tz-wit').innerText = getTZTime(9);
                document.getElementById('tz-utc').innerText = getTZTime(0);
            } catch(e) {}
            setTimeout(update, 1000);
        };
        update();
    }
    
    initLetterScroll() {
        document.getElementById('open-letter-btn').addEventListener('click', () => {
            audio.playSuccess();
            document.getElementById('envelope-wrapper').classList.add('envelope-open');
            setTimeout(() => {
                document.getElementById('envelope-wrapper').classList.add('hidden');
                document.getElementById('letter-content').classList.remove('hidden');
                const container = document.getElementById('romantic-quotes-container');
                if(container.children.length === 0) {
                    ROMANTIC_QUOTES.forEach(quote => {
                        const el = document.createElement('div');
                        el.className = 'quote-item'; el.innerText = quote;
                        container.appendChild(el);
                    });
                }
            }, 800);
        });
    }
    
    initWish() {
        document.getElementById('send-wish-btn').addEventListener('click', () => {
            const text = document.getElementById('wish-input');
            if(text.value.trim() === '') return;
            audio.playSuccess();
            text.value = ''; 
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

// Inisialisasi AMAN
document.addEventListener('DOMContentLoaded', () => {
    try { window.App = new UIManager(); } catch(e) { console.error(e); }
});
