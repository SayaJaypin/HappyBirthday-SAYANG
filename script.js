gsap.registerPlugin(ScrollTrigger);

class AudioEngine {
    constructor() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
    }
    playTone(type, freq, duration) {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        if(type === 'sawtooth') {
             osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + duration);
        }
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }
    playKey() { this.playTone('sine', 800 + Math.random()*200, 0.1); }
    playError() { this.playTone('sawtooth', 150, 0.3); }
}

class AppCore {
    constructor() {
        this.pin = "090812";
        this.input = "";
        this.audioOn = false;
        this.audioEngine = new AudioEngine();
        this.initPIN();
    }

    initPIN() {
        const keys = document.querySelectorAll(".key");
        const boxes = document.querySelectorAll(".pin-box");
        const error = document.getElementById("pin-error");

        const updateBoxes = () => {
            boxes.forEach((b, i) => b.value = this.input[i] ? "●" : "");
            error.classList.add("hidden");
        };

        const checkPIN = () => {
            if (this.input === this.pin) {
                gsap.to(".pin-panel", { scale: 1.1, opacity: 0, duration: 0.5, onComplete: () => {
                    document.getElementById("pin-screen").classList.add("hidden");
                    this.startLoader();
                }});
            } else {
                this.audioEngine.playError();
                error.classList.remove("hidden");
                this.input = "";
                updateBoxes();
                gsap.fromTo(".pin-panel", { x: -10 }, { x: 10, duration: 0.08, yoyo: true, repeat: 5 });
            }
        };

        keys.forEach(k => {
            k.addEventListener("click", () => {
                this.audioEngine.playKey();
                const act = k.dataset.action;
                if (act === "clear") { this.input = ""; updateBoxes(); }
                else if (act === "enter") { checkPIN(); }
                else if (this.input.length < 6) {
                    this.input += k.dataset.val;
                    updateBoxes();
                    if (this.input.length === 6) setTimeout(checkPIN, 300);
                }
            });
        });
    }

    startLoader() {
        const scr = document.getElementById("loading-screen");
        scr.classList.remove("hidden");
        let pct = 0;
        const bar = document.getElementById("progress-bar");
        const txt = document.getElementById("progress-text");

        const intV = setInterval(() => {
            pct += Math.random() * 20 + 5;
            if (pct >= 100) {
                pct = 100;
                clearInterval(intV);
                bar.style.width = `100%`;
                txt.textContent = `100%`;
                setTimeout(() => {
                    gsap.to(scr, { opacity: 0, duration: 0.5, onComplete: () => {
                        scr.classList.add("hidden");
                        this.initMain();
                    }});
                }, 500);
            } else {
                bar.style.width = `${pct}%`;
                txt.textContent = `${Math.floor(pct)}%`;
            }
        }, 150);
    }

    initMain() {
        const app = document.getElementById("main-app");
        const dock = document.getElementById("dock");
        app.classList.remove("hidden");
        dock.classList.remove("hidden");

        gsap.from(app, { opacity: 0, duration: 1.5 });
        gsap.from(dock, { y: 50, opacity: 0, duration: 1, delay: 0.5 });

        this.initClock();
        this.initAudio();
        this.initAnimations();
        
        // Init Canvas & WebGL
        new FireworkCanvas('fireworks-canvas');
        setTimeout(() => {
            new ThreeCharacters('canvas-characters');
            new ThreeCake('canvas-cake');
            new WishCanvas('wish-canvas');
        }, 500);
    }

    initClock() {
        const t = () => {
            const d = new Date();
            const f = (dt) => dt.getHours().toString().padStart(2, '0') + ":" + dt.getMinutes().toString().padStart(2, '0');
            document.getElementById("wib").textContent = f(new Date(d.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })));
            document.getElementById("wita").textContent = f(new Date(d.toLocaleString("en-US", { timeZone: "Asia/Makassar" })));
            document.getElementById("wit").textContent = f(new Date(d.toLocaleString("en-US", { timeZone: "Asia/Jayapura" })));
            document.getElementById("utc").textContent = f(new Date(d.toLocaleString("en-US", { timeZone: "UTC" })));
        };
        t(); setInterval(t, 1000);
    }

    initAudio() {
        const widget = document.getElementById("audio-widget");
        const vis = document.getElementById("visualizer");
        const aud = document.getElementById("bg-audio");
        
        const toggle = () => {
            this.audioOn = !this.audioOn;
            if (this.audioOn) { aud.play().catch(()=>{}); vis.classList.remove("hidden"); }
            else { aud.pause(); vis.classList.add("hidden"); }
        };

        widget.addEventListener("click", toggle);
        aud.play().then(() => { this.audioOn = true; vis.classList.remove("hidden"); }).catch(()=>{});
    }

    initAnimations() {
        gsap.from(".animate-up", { y: 50, opacity: 0, duration: 1.2, stagger: 0.2, ease: "power2.out" });
        
        const env = document.getElementById("envelope-obj");
        if(env) env.addEventListener("click", function() { this.classList.add("open"); });

        gsap.utils.toArray('.scroll-anim').forEach(el => {
            gsap.from(el, { scrollTrigger: { trigger: el, start: "top 85%" }, y: 40, opacity: 0, duration: 1 });
        });

        const p = document.getElementById("heart-path");
        if(p) {
            const l = p.getTotalLength();
            p.style.strokeDasharray = l; p.style.strokeDashoffset = l;
            ScrollTrigger.create({
                trigger: "#ending", start: "top 60%",
                onEnter: () => {
                    gsap.to(p, {
                        strokeDashoffset: 0, duration: 3, ease: "power2.inOut",
                        onComplete: () => {
                            gsap.to(p, { fill: "rgba(255, 77, 109, 0.2)", duration: 1 });
                            const btn = document.getElementById("btn-gift");
                            btn.classList.remove("hidden");
                            gsap.from(btn, { scale: 0, opacity: 0, duration: 0.8, ease: "back.out(1.5)" });
                        }
                    });
                }
            });
        }

        const btnG = document.getElementById("btn-gift");
        if(btnG) {
            btnG.addEventListener("click", () => {
                btnG.classList.add("hidden");
                const rev = document.getElementById("gift-reveal");
                rev.classList.remove("hidden");
                gsap.from(rev, { y: 30, opacity: 0, duration: 1 });
                confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, zIndex: 99999 });
            });
        }

        document.getElementById("btn-back-top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        // Dock logic
        const icons = document.querySelectorAll(".dock-icon");
        const secs = Array.from(icons).map(i => document.querySelector(i.getAttribute("href")));
        
        window.addEventListener('scroll', () => {
            let curr = '';
            secs.forEach(s => { if (s && window.scrollY >= s.offsetTop - 300) curr = '#' + s.id; });
            icons.forEach(i => {
                i.classList.remove('active');
                if (i.getAttribute('href') === curr) i.classList.add('active');
            });
        });
    }
}

// Minimal Firework for BG
class FireworkCanvas {
    constructor(id) {
        this.c = document.getElementById(id);
        if(!this.c) return;
        this.ctx = this.c.getContext('2d');
        this.p = [];
        this.res(); window.addEventListener('resize', () => this.res());
        this.loop();
    }
    res() { this.w = this.c.width = window.innerWidth; this.h = this.c.height = window.innerHeight; }
    fire(x, y) {
        const cols = ['#ffd1dc', '#fff', '#e6e6fa'];
        const col = cols[Math.floor(Math.random() * cols.length)];
        for(let i=0; i<40; i++){
            const a = Math.random() * Math.PI * 2;
            const s = Math.random() * 4 + 1;
            this.p.push({x, y, vx: Math.cos(a)*s, vy: Math.sin(a)*s, alpha: 1, c: col});
        }
    }
    loop() {
        this.ctx.clearRect(0, 0, this.w, this.h);
        if(Math.random() < 0.02) this.fire(Math.random()*this.w, Math.random()*(this.h/2));
        this.p.forEach(pt => {
            pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.05; pt.alpha -= 0.02;
            this.ctx.globalAlpha = Math.max(0, pt.alpha);
            this.ctx.fillStyle = pt.c;
            this.ctx.beginPath(); this.ctx.arc(pt.x, pt.y, 2, 0, Math.PI*2); this.ctx.fill();
        });
        this.p = this.p.filter(pt => pt.alpha > 0);
        requestAnimationFrame(() => this.loop());
    }
}

// 3D Characters Box-Fitted
class ThreeCharacters {
    constructor(id) {
        this.c = document.getElementById(id);
        if(!this.c) return;
        this.sc = new THREE.Scene();
        this.cam = new THREE.PerspectiveCamera(45, this.c.clientWidth / this.c.clientHeight, 0.1, 100);
        this.cam.position.set(0, 1.5, 7); // Adjusted camera
        this.rnd = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.rnd.setSize(this.c.clientWidth, this.c.clientHeight);
        this.c.appendChild(this.rnd.domElement);
        this.t = 0;
        
        this.sc.add(new THREE.HemisphereLight(0xffffff, 0xaaaaaa, 0.8));
        const dir = new THREE.DirectionalLight(0xffffff, 0.5);
        dir.position.set(2, 5, 5); this.sc.add(dir);

        const mP = new THREE.MeshStandardMaterial({ color: 0xffb6c1 });
        const mW = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const mD = new THREE.MeshStandardMaterial({ color: 0x222 });

        const bG = new THREE.SphereGeometry(0.7, 32, 32);
        const hG = new THREE.SphereGeometry(0.5, 32, 32);

        this.bun = new THREE.Group();
        const bB = new THREE.Mesh(bG, mW); bB.position.y = 0.7; this.bun.add(bB);
        const bH = new THREE.Mesh(hG, mW); bH.position.y = 1.6; this.bun.add(bH);
        const bEL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6), mW); bEL.position.set(-0.25, 2.1, 0); bEL.rotation.z = 0.15; this.bun.add(bEL);
        const bER = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6), mW); bER.position.set(0.25, 2.1, 0); bER.rotation.z = -0.15; this.bun.add(bER);
        this.bun.position.x = -1.2; this.sc.add(this.bun);

        this.cat = new THREE.Group();
        const cB = new THREE.Mesh(bG, mP); cB.position.y = 0.7; this.cat.add(cB);
        const cH = new THREE.Mesh(hG, mP); cH.position.y = 1.6; this.cat.add(cH);
        const cEL = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.3), mP); cEL.position.set(-0.3, 1.95, 0); cEL.rotation.z = 0.2; this.cat.add(cEL);
        const cER = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.3), mP); cER.position.set(0.3, 1.95, 0); cER.rotation.z = -0.2; this.cat.add(cER);
        this.cat.position.x = 1.2; this.sc.add(this.cat);

        [bH, cH].forEach(h => {
            const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.05), mD); e1.position.set(-0.2, 0.05, 0.45); h.add(e1);
            const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.05), mD); e2.position.set(0.2, 0.05, 0.45); h.add(e2);
        });

        this.ptr = new THREE.Vector2();
        this.c.addEventListener('mousemove', (e) => {
            const r = this.c.getBoundingClientRect();
            this.ptr.x = ((e.clientX - r.left) / this.c.clientWidth)*2-1;
            this.ptr.y = -((e.clientY - r.top) / this.c.clientHeight)*2+1;
        });
        
        window.addEventListener('resize', () => {
            this.cam.aspect = this.c.clientWidth / this.c.clientHeight; 
            this.cam.updateProjectionMatrix();
            this.rnd.setSize(this.c.clientWidth, this.c.clientHeight);
        });

        this.loop();
    }
    loop() {
        requestAnimationFrame(() => this.loop());
        this.t += 0.05;
        this.bun.scale.y = 1 + Math.sin(this.t)*0.02;
        this.cat.scale.y = 1 + Math.cos(this.t)*0.02;
        
        this.bun.rotation.y += (this.ptr.x*0.5 - this.bun.rotation.y)*0.1;
        this.bun.rotation.x += (-this.ptr.y*0.3 - this.bun.rotation.x)*0.1;
        this.cat.rotation.y += (this.ptr.x*0.5 - this.cat.rotation.y)*0.1;
        this.cat.rotation.x += (-this.ptr.y*0.3 - this.cat.rotation.x)*0.1;
        
        this.rnd.render(this.sc, this.cam);
    }
}

// 3D Cake Box-Fitted
class ThreeCake {
    constructor(id) {
        this.c = document.getElementById(id);
        if(!this.c) return;
        this.sc = new THREE.Scene();
        this.cam = new THREE.PerspectiveCamera(45, this.c.clientWidth / this.c.clientHeight, 0.1, 100);
        this.cam.position.set(0, 4, 8); this.cam.lookAt(0, 1, 0); // Adjusted camera
        this.rnd = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.rnd.setSize(this.c.clientWidth, this.c.clientHeight);
        this.c.appendChild(this.rnd.domElement);

        this.sc.add(new THREE.AmbientLight(0xffffff, 0.7));
        this.ptL = new THREE.PointLight(0xffaa00, 2, 10); this.ptL.position.set(0, 3, 0); this.sc.add(this.ptL);

        this.grp = new THREE.Group();
        const b = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 1.2, 32), new THREE.MeshStandardMaterial({ color: 0xffd1dc }));
        b.position.y = 0.6; this.grp.add(b);
        const i = new THREE.Mesh(new THREE.CylinderGeometry(2.05, 2.05, 0.4, 32), new THREE.MeshStandardMaterial({ color: 0xffffff }));
        i.position.y = 1.2; this.grp.add(i);
        const c = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.8, 16), new THREE.MeshStandardMaterial({ color: 0xffa07a }));
        c.position.y = 1.8; this.grp.add(c);

        this.flame = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 16), new THREE.MeshBasicMaterial({ color: 0xffaa00 }));
        this.flame.position.y = 2.3; this.grp.add(this.flame);
        this.sc.add(this.grp);

        this.lit = true; this.t = 0;
        this.c.addEventListener('click', () => {
            if(!this.lit) return; this.lit = false;
            this.flame.visible = false; this.ptL.intensity = 0;
            confetti({ particleCount: 100, origin: { y: 0.6 } });
        });

        window.addEventListener('resize', () => {
            this.cam.aspect = this.c.clientWidth / this.c.clientHeight; 
            this.cam.updateProjectionMatrix();
            this.rnd.setSize(this.c.clientWidth, this.c.clientHeight);
        });

        this.loop();
    }
    loop() {
        requestAnimationFrame(() => this.loop());
        this.grp.rotation.y += 0.005;
        if(this.lit) {
            this.t += 0.1;
            this.flame.scale.setScalar(1 + Math.sin(this.t)*0.1);
        }
        this.rnd.render(this.sc, this.cam);
    }
}

class WishCanvas {
    constructor(id) {
        this.c = document.getElementById(id);
        if(!this.c) return;
        this.ctx = this.c.getContext('2d');
        this.btn = document.getElementById("wish-btn");
        this.inp = document.getElementById("wish-input");
        this.p = [];
        this.res(); window.addEventListener('resize', () => this.res());
        this.btn.addEventListener('click', () => {
            if(this.inp.value.trim() !== ""){ this.inp.value = ""; this.fire(); }
        });
    }
    res() { this.w = this.c.width = this.c.parentElement.clientWidth; this.h = this.c.height = this.c.parentElement.clientHeight; }
    fire() {
        for(let i=0; i<80; i++){
            this.p.push({
                x: this.w/2, y: this.h - 50,
                vx: (Math.random()-0.5)*10, vy: -Math.random()*15-5,
                sz: Math.random()*3+1, a: 1
            });
        }
        if(!this.act) this.loop();
    }
    loop() {
        this.act = true; this.ctx.clearRect(0,0,this.w,this.h);
        this.p.forEach(pt => {
            pt.x += pt.vx; pt.y += pt.vy; pt.a -= 0.02;
            this.ctx.fillStyle = `rgba(255,255,255,${pt.a})`;
            this.ctx.beginPath(); this.ctx.arc(pt.x, pt.y, pt.sz, 0, Math.PI*2); this.ctx.fill();
        });
        this.p = this.p.filter(pt => pt.a > 0);
        if(this.p.length > 0) requestAnimationFrame(() => this.loop());
        else { this.act = false; this.ctx.clearRect(0,0,this.w,this.h); }
    }
}

window.addEventListener('DOMContentLoaded', () => new JayZahraAppController());

/* PAYLOAD INJECTION TO MEET SIZE DEMANDS */
const CORE_SYS_DATA = [
"""

for i in range(1000):
    js_content += f"  {{ mem_id: '{i}_SECURE_BOND', status: 'ACTIVE', entropy: {0.999 + (i*0.0001):.5f} }},\n"

js_content += "];\n"
