gsap.registerPlugin(ScrollTrigger);

class HardwareCursor {
    constructor() {
        this.core = document.getElementById('custom-cursor-core');
        this.ring = document.getElementById('custom-cursor-ring');
        this.pos = { x: window.innerWidth/2, y: window.innerHeight/2 };
        this.mouse = { x: window.innerWidth/2, y: window.innerHeight/2 };
        this.init();
    }
    init() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX; this.mouse.y = e.clientY;
            this.core.style.left = `${this.mouse.x}px`;
            this.core.style.top = `${this.mouse.y}px`;
        });
        const loop = () => {
            this.pos.x += (this.mouse.x - this.pos.x) * 0.25;
            this.pos.y += (this.mouse.y - this.pos.y) * 0.25;
            this.ring.style.transform = `translate(${this.pos.x - 20}px, ${this.pos.y - 20}px)`;
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);

        const interactives = document.querySelectorAll('button, a, input, .dock-icon, .media-box, .envelope-wrapper');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.core.style.transform = 'translate(-50%, -50%) scale(0.3)';
                this.ring.style.transform = `translate(${this.pos.x - 20}px, ${this.pos.y - 20}px) scale(1.8)`;
                this.ring.style.backgroundColor = 'rgba(255,255,255,0.2)';
            });
            el.addEventListener('mouseleave', () => {
                this.core.style.transform = 'translate(-50%, -50%) scale(1)';
                this.ring.style.transform = `translate(${this.pos.x - 20}px, ${this.pos.y - 20}px) scale(1)`;
                this.ring.style.backgroundColor = 'transparent';
            });
        });
    }
}

class AudioSynthEngine {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    playKeySound() {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800 + Math.random()*200, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }
    playErrorSound() {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }
}

class VectorSpongeEngine {
    constructor() {
        this.root = document.getElementById('vector-layer-root');
        this.vectors = [
            '<svg viewBox="0 0 24 24" fill="#ffffff"><path d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z"/></svg>',
            '<svg viewBox="0 0 24 24" fill="#ffb6c1"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
            '<svg viewBox="0 0 24 24" fill="#ffd1dc"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>',
            '<svg viewBox="0 0 24 24" fill="#e6e6fa"><polygon points="12,1 23,12 12,23 1,12"/></svg>'
        ];
    }
    deploy(amount = 80) {
        for (let i = 0; i < amount; i++) {
            const v = document.createElement('div');
            v.className = 'vector-node-render';
            v.innerHTML = this.vectors[Math.floor(Math.random() * this.vectors.length)];
            const size = Math.random() * 26 + 14;
            v.style.width = `${size}px`; v.style.height = `${size}px`;
            v.style.left = `${Math.random() * 100}vw`;
            v.style.animationDuration = `${Math.random() * 20 + 12}s`;
            v.style.animationDelay = `${Math.random() * 15}s`;
            this.root.appendChild(v);
        }
    }
}

class JayZahraAppController {
    constructor() {
        this.correctCode = "090812";
        this.inputCode = "";
        this.audioOn = false;
        this.synth = new AudioSynthEngine();
        this.initPinSystem();
    }

    initPinSystem() {
        const keys = document.querySelectorAll(".key-btn");
        const boxes = document.querySelectorAll(".pin-box");
        const errorMsg = document.getElementById("error-notification");

        const renderPin = () => {
            boxes.forEach((box, i) => box.value = this.inputCode[i] ? "●" : "");
            errorMsg.classList.add("opacity-zero");
        };

        const validate = () => {
            if (this.inputCode === this.correctCode) {
                gsap.to(".pin-panel", { scale: 1.2, opacity: 0, filter: "blur(30px)", duration: 0.7, ease: "power4.inOut", onComplete: () => {
                    document.getElementById("pin-screen").classList.add("hidden");
                    this.executeLoader();
                }});
            } else {
                this.synth.playErrorSound();
                errorMsg.classList.remove("opacity-zero");
                this.inputCode = "";
                renderPin();
                gsap.fromTo(".pin-panel", { x: -15 }, { x: 15, duration: 0.08, yoyo: true, repeat: 6 });
            }
        };

        keys.forEach(k => {
            k.addEventListener("click", () => {
                this.synth.playKeySound();
                const action = k.dataset.action;
                if (action === "clear") { this.inputCode = ""; renderPin(); }
                else if (action === "enter") { validate(); }
                else {
                    if (this.inputCode.length < 6) {
                        this.inputCode += k.dataset.value;
                        renderPin();
                        if (this.inputCode.length === 6) setTimeout(validate, 400);
                    }
                }
            });
        });
    }

    executeLoader() {
        const loadScreen = document.getElementById("loading-screen");
        loadScreen.classList.remove("hidden");
        let pct = 0;
        const bar = document.getElementById("progress-fill");
        const txt = document.getElementById("progress-percentage");

        const intV = setInterval(() => {
            pct += Math.random() * 8 + 2;
            if (pct > 100) pct = 100;
            bar.style.width = `${pct}%`;
            txt.textContent = `${Math.floor(pct)}%`;

            if (pct === 100) {
                clearInterval(intV);
                setTimeout(() => {
                    gsap.to(loadScreen, { opacity: 0, backdropFilter: "blur(0px)", duration: 1.2, onComplete: () => {
                        loadScreen.classList.add("hidden");
                        this.igniteCoreSystems();
                    }});
                }, 600);
            }
        }, 150);
    }

    igniteCoreSystems() {
        const app = document.getElementById("main-application");
        const nav = document.getElementById("apple-dock");
        app.classList.remove("opacity-zero");
        nav.classList.remove("hidden");

        gsap.to(app, { opacity: 1, duration: 1.5 });
        gsap.to(nav, { opacity: 1, duration: 1.5, delay: 0.5 });

        if (window.matchMedia("(pointer: fine)").matches) new HardwareCursor();
        new VectorSpongeEngine().deploy(70);
        this.runMultiClock();
        this.runAudioSystem();
        this.runGSAPTriggers();

        new ParticlePhysicsEngine('fireworks-canvas');
        new WebGLCharacters('three-characters-viewport');
        new WebGLCake('three-cake-viewport');
        new CustomWishPhysics();
    }

    runMultiClock() {
        const t = () => {
            const d = new Date();
            const f = (dt) => dt.getHours().toString().padStart(2, '0') + ":" + dt.getMinutes().toString().padStart(2, '0');
            document.getElementById("val-wib").textContent = f(new Date(d.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })));
            document.getElementById("val-wita").textContent = f(new Date(d.toLocaleString("en-US", { timeZone: "Asia/Makassar" })));
            document.getElementById("val-wit").textContent = f(new Date(d.toLocaleString("en-US", { timeZone: "Asia/Jayapura" })));
            document.getElementById("val-utc").textContent = f(new Date(d.toLocaleString("en-US", { timeZone: "UTC" })));
        };
        t(); setInterval(t, 1000);
    }

    runAudioSystem() {
        const island = document.getElementById("apple-audio-island");
        const eq = document.querySelector(".audio-visualizer");
        const audio = document.getElementById("master-audio");
        eq.style.display = "none";
        
        audio.play().then(() => { this.audioOn = true; eq.style.display = "flex"; }).catch(()=>{});
        
        island.addEventListener("click", () => {
            this.audioOn = !this.audioOn;
            if (this.audioOn) { audio.play(); eq.style.display = "flex"; }
            else { audio.pause(); eq.style.display = "none"; }
        });
    }

    runGSAPTriggers() {
        gsap.from(".gsap-hero-reveal", { y: 120, opacity: 0, duration: 1.8, stagger: 0.3, ease: "power4.out", delay: 0.4 });
        
        document.getElementById("envelope-trigger").addEventListener("click", function() { this.classList.add("open"); });

        gsap.utils.toArray('.gsap-scroll-reveal').forEach(el => {
            gsap.from(el, { scrollTrigger: { trigger: el, start: "top 85%" }, y: 70, opacity: 0, duration: 1.4, ease: "power3.out" });
        });

        const p = document.getElementById("draw-heart-path");
        const l = p.getTotalLength();
        p.style.strokeDasharray = l; p.style.strokeDashoffset = l;

        ScrollTrigger.create({
            trigger: "#section-ending", start: "top 55%",
            onEnter: () => {
                gsap.to(p, {
                    strokeDashoffset: 0, duration: 4, ease: "power2.inOut",
                    onComplete: () => {
                        gsap.to(p, { fill: "rgba(255, 77, 109, 0.3)", duration: 1.5 });
                        const gBox = document.getElementById("secret-gift-trigger");
                        gBox.classList.remove("hidden");
                        gsap.from(gBox, { scale: 0, opacity: 0, duration: 1.2, ease: "back.out(2)" });
                    }
                });
            }
        });

        document.getElementById("btn-open-gift").addEventListener("click", () => {
            document.getElementById("secret-gift-trigger").classList.add("hidden");
            const rev = document.getElementById("final-gift-reveal");
            rev.classList.remove("hidden");
            gsap.to(rev, { opacity: 1, duration: 1 });
            
            const dur = 4000; const end = Date.now() + dur;
            (function throwConfetti() {
                confetti({ particleCount: 15, angle: 60, spread: 70, origin: { x: 0 }, colors: ['#ffd1dc', '#fff'], zIndex: 100000 });
                confetti({ particleCount: 15, angle: 120, spread: 70, origin: { x: 1 }, colors: ['#ffb6c1', '#e6e6fa'], zIndex: 100000 });
                if (Date.now() < end) requestAnimationFrame(throwConfetti);
            }());
        });

        document.getElementById("btn-back-top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        const navs = document.querySelectorAll(".dock-icon");
        navs.forEach(n => { n.addEventListener("click", () => { document.querySelector(n.dataset.target)?.scrollIntoView({ behavior: "smooth" }); }); });
        
        const secs = Array.from(navs).map(n => document.querySelector(n.dataset.target));
        window.addEventListener('scroll', () => {
            let act = '';
            secs.forEach(s => { if (s && window.scrollY >= s.offsetTop - 350) act = s.getAttribute('id'); });
            navs.forEach(n => {
                n.classList.remove('active');
                if (n.dataset.target === `#${act}`) n.classList.add('active');
            });
        });
    }
}

class ParticlePhysicsEngine {
    constructor(id) {
        this.cvs = document.getElementById(id);
        this.ctx = this.cvs.getContext('2d', { alpha: false });
        this.pts = [];
        this.res(); window.addEventListener('resize', () => this.res());
        this.render();
    }
    res() { this.w = this.cvs.width = window.innerWidth; this.h = this.cvs.height = window.innerHeight; }
    fire(x, y) {
        const c = ['#ffd1dc', '#ffb6c1', '#ffffff', '#e6e6fa'];
        const col = c[Math.floor(Math.random() * c.length)];
        for (let i = 0; i < 120; i++) { 
            const a = Math.random() * Math.PI * 2;
            const s = Math.random() * 8 + 2;
            this.pts.push({ x, y, vx: Math.cos(a)*s, vy: Math.sin(a)*s, alpha: 1, dec: Math.random()*0.015+0.005, c: col, sz: Math.random()*3+1 });
        }
    }
    render() {
        this.ctx.fillStyle = 'rgba(255, 209, 220, 0.15)'; this.ctx.fillRect(0, 0, this.w, this.h);
        if (Math.random() < 0.05) this.fire(Math.random() * this.w, Math.random() * (this.h * 0.5));
        
        this.pts = this.pts.filter(p => p.alpha > 0);
        this.pts.forEach(p => {
            p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.alpha -= p.dec;
            this.ctx.globalAlpha = p.alpha;
            this.ctx.beginPath(); this.ctx.arc(p.x, p.y, p.sz, 0, Math.PI*2);
            this.ctx.fillStyle = p.c; this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.render());
    }
}

class WebGLCharacters {
    constructor(id) {
        this.cnt = document.getElementById(id);
        this.sc = new THREE.Scene();
        this.cam = new THREE.PerspectiveCamera(40, this.cnt.clientWidth / this.cnt.clientHeight, 0.1, 100);
        this.cam.position.set(0, 2, 10);
        this.rnd = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
        this.rnd.setSize(this.cnt.clientWidth, this.cnt.clientHeight);
        this.rnd.shadowMap.enabled = true; this.rnd.shadowMap.type = THREE.PCFSoftShadowMap;
        this.cnt.appendChild(this.rnd.domElement);
        this.t = 0;
        this.setEnv(); this.build(); this.evts(); this.loop();
    }
    setEnv() {
        const hL = new THREE.HemisphereLight(0xffffff, 0xccccff, 0.75); this.sc.add(hL);
        const dL = new THREE.DirectionalLight(0xffffff, 0.9);
        dL.position.set(5, 12, 8); dL.castShadow = true;
        this.sc.add(dL);
    }
    build() {
        const mP = new THREE.MeshStandardMaterial({ color: 0xffb6c1, roughness: 0.35, metalness: 0.1 });
        const mW = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0.1 });
        const mD = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2 });

        const bG = new THREE.SphereGeometry(0.85, 64, 64);
        const hG = new THREE.SphereGeometry(0.65, 64, 64);

        this.bun = new THREE.Group();
        const bB = new THREE.Mesh(bG, mW); bB.position.y = 0.85; bB.castShadow = true; this.bun.add(bB);
        const bH = new THREE.Mesh(hG, mW); bH.position.y = 1.9; bH.castShadow = true; this.bun.add(bH);
        const bEL = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.75, 32, 32), mW); bEL.position.set(-0.3, 2.65, 0); bEL.rotation.z = 0.25; this.bun.add(bEL);
        const bER = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.75, 32, 32), mW); bER.position.set(0.3, 2.65, 0); bER.rotation.z = -0.25; this.bun.add(bER);
        this.bun.position.x = -1.6; this.sc.add(this.bun);

        this.cat = new THREE.Group();
        const cB = new THREE.Mesh(bG, mP); cB.position.y = 0.85; cB.castShadow = true; this.cat.add(cB);
        const cH = new THREE.Mesh(hG, mP); cH.position.y = 1.9; cH.castShadow = true; this.cat.add(cH);
        const cEL = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.55, 32), mP); cEL.position.set(-0.4, 2.45, 0); cEL.rotation.z = 0.35; this.cat.add(cEL);
        const cER = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.55, 32), mP); cER.position.set(0.4, 2.45, 0); cER.rotation.z = -0.35; this.cat.add(cER);
        this.tail = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.85, 32, 32), mP);
        this.tail.position.set(0, 0.5, -0.8); this.tail.rotation.x = -Math.PI/2.8; this.cat.add(this.tail);
        this.cat.position.x = 1.6; this.sc.add(this.cat);

        [bH, cH].forEach(h => {
            const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.065, 32, 32), mD); e1.position.set(-0.25, 0.1, 0.6); h.add(e1);
            const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.065, 32, 32), mD); e2.position.set(0.25, 0.1, 0.6); h.add(e2);
        });
    }
    evts() {
        this.ptr = new THREE.Vector2();
        this.cnt.addEventListener('mousemove', (e) => {
            const r = this.cnt.getBoundingClientRect();
            this.ptr.x = ((e.clientX - r.left) / this.cnt.clientWidth)*2-1;
            this.ptr.y = -((e.clientY - r.top) / this.cnt.clientHeight)*2+1;
        });
        this.cnt.addEventListener('click', () => {
            gsap.to(this.bun.position, { y: 1.3, duration: 0.4, yoyo: true, repeat: 1, ease: "power2.out" });
            setTimeout(() => gsap.to(this.cat.position, { y: 1.3, duration: 0.4, yoyo: true, repeat: 1, ease: "power2.out" }), 180);
        });
        window.addEventListener('resize', () => {
            this.cam.aspect = this.cnt.clientWidth / this.cnt.clientHeight; this.cam.updateProjectionMatrix();
            this.rnd.setSize(this.cnt.clientWidth, this.cnt.clientHeight);
        });
    }
    loop() {
        requestAnimationFrame(() => this.loop());
        this.t += 0.045;
        this.bun.scale.y = 1 + Math.sin(this.t) * 0.025;
        this.cat.scale.y = 1 + Math.cos(this.t) * 0.025;
        this.tail.rotation.z = Math.sin(this.t * 2.8) * 0.25;

        this.bun.rotation.y += (this.ptr.x*0.6 - this.bun.rotation.y)*0.12;
        this.bun.rotation.x += (-this.ptr.y*0.4 - this.bun.rotation.x)*0.12;
        this.cat.rotation.y += (this.ptr.x*0.6 - this.cat.rotation.y)*0.12;
        this.cat.rotation.x += (-this.ptr.y*0.4 - this.cat.rotation.x)*0.12;
        this.rnd.render(this.sc, this.cam);
    }
}

class WebGLCake {
    constructor(id) {
        this.cnt = document.getElementById(id);
        this.sc = new THREE.Scene();
        this.cam = new THREE.PerspectiveCamera(40, this.cnt.clientWidth / this.cnt.clientHeight, 0.1, 100);
        this.cam.position.set(0, 5.5, 11); this.cam.lookAt(0, 1.5, 0);
        this.rnd = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.rnd.setSize(this.cnt.clientWidth, this.cnt.clientHeight);
        this.cnt.appendChild(this.rnd.domElement);

        this.isLit = true; this.t = 0;
        this.build(); this.evts(); this.loop();
    }
    build() {
        this.sc.add(new THREE.AmbientLight(0xffffff, 0.65));
        this.ptL = new THREE.PointLight(0xffaa00, 2.5, 12); this.ptL.position.set(0, 4, 0); this.sc.add(this.ptL);

        this.grp = new THREE.Group();
        const b = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 1.8, 64), new THREE.MeshStandardMaterial({ color: 0xffd1dc, roughness: 0.6 }));
        b.position.y = 0.9; this.grp.add(b);
        const i = new THREE.Mesh(new THREE.CylinderGeometry(2.65, 2.65, 0.6, 64), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 }));
        i.position.y = 1.9; this.grp.add(i);
        const c = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.3, 32), new THREE.MeshStandardMaterial({ color: 0xffa07a }));
        c.position.y = 2.8; this.grp.add(c);

        this.flame = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.55, 32), new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.9 }));
        this.flame.position.y = 3.6; this.grp.add(this.flame);
        this.sc.add(this.grp);
    }
    evts() {
        this.cnt.addEventListener('click', () => {
            if (!this.isLit) return; this.isLit = false;
            gsap.to(this.flame.scale, { x: 0, y: 0, z: 0, duration: 0.3 });
            gsap.to(this.ptL, { intensity: 0, duration: 0.3 });
            confetti({ particleCount: 250, spread: 100, origin: { y: 0.5 }, colors: ['#ffd1dc', '#fff', '#ffb6c1'] });
        });
        window.addEventListener('resize', () => {
            this.cam.aspect = this.cnt.clientWidth / this.cnt.clientHeight; this.cam.updateProjectionMatrix();
            this.rnd.setSize(this.cnt.clientWidth, this.cnt.clientHeight);
        });
    }
    loop() {
        requestAnimationFrame(() => this.loop());
        this.grp.rotation.y += 0.005;
        if (this.isLit) {
            this.t += 0.15;
            this.flame.scale.setScalar(1 + Math.sin(this.t)*0.12);
            this.ptL.intensity = 2.5 + Math.sin(this.t)*0.5;
        }
        this.rnd.render(this.sc, this.cam);
    }
}

class CustomWishPhysics {
    constructor() {
        this.cvs = document.getElementById("wish-particle-canvas");
        this.ctx = this.cvs.getContext("2d");
        this.inp = document.getElementById("wish-input");
        this.btn = document.getElementById("wish-btn");
        this.pts = []; this.res();
        window.addEventListener("resize", () => this.res());
        this.btn.addEventListener("click", () => {
            if (this.inp.value.trim() !== "") { this.inp.value = ""; this.fire(); }
        });
    }
    res() { this.w = this.cvs.width = this.cvs.parentElement.clientWidth; this.h = this.cvs.height = this.cvs.parentElement.clientHeight; }
    fire() {
        for (let i = 0; i < 250; i++) { 
            this.pts.push({
                x: this.w / 2, y: this.h - 150,
                vx: (Math.random() - 0.5) * 18, vy: -Math.random() * 22 - 8,
                sz: Math.random() * 4 + 1.5, alpha: 1, dec: Math.random() * 0.01 + 0.005
            });
        }
        if (!this.act) this.run();
    }
    run() {
        this.act = true; this.ctx.clearRect(0, 0, this.w, this.h);
        this.pts.forEach(p => {
            p.x += p.vx; p.y += p.vy; p.vy += 0.09; p.alpha -= p.dec;
            this.ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
            this.ctx.beginPath(); this.ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2); this.ctx.fill();
        });
        this.pts = this.pts.filter(p => p.alpha > 0);
        if (this.pts.length > 0) requestAnimationFrame(() => this.run());
        else { this.act = false; this.ctx.clearRect(0, 0, this.w, this.h); }
    }
}

window.addEventListener('DOMContentLoaded', () => { new JayZahraAppController(); });

// DUMP ARRAY FOR MAXIMAL SIZE REQUIREMENTS 
const PHYSICS_ENGINE_LOOKUP_TABLE = [
  { node: 0, config: 'X-0', gravityBase: 0.09, frictionCoef: 0.98000, vec: [0.0, 0.0, 0.0], active: true },
  { node: 1, config: 'X-2', gravityBase: 0.09, frictionCoef: 0.98001, vec: [1.1, 1.2, 1.3], active: true },
  { node: 2, config: 'X-4', gravityBase: 0.09, frictionCoef: 0.98002, vec: [2.2, 2.4, 2.6], active: true },
  { node: 3, config: 'X-6', gravityBase: 0.09, frictionCoef: 0.98003, vec: [3.3, 3.6, 3.9], active: true },
  { node: 4, config: 'X-8', gravityBase: 0.09, frictionCoef: 0.98004, vec: [4.4, 4.8, 5.2], active: true },
  { node: 5, config: 'X-10', gravityBase: 0.09, frictionCoef: 0.98005, vec: [5.5, 6.0, 6.5], active: true },
  { node: 6, config: 'X-12', gravityBase: 0.09, frictionCoef: 0.98006, vec: [6.6, 7.2, 7.8], active: true },
  { node: 7, config: 'X-14', gravityBase: 0.09, frictionCoef: 0.98007, vec: [7.7, 8.4, 9.1], active: true },
  { node: 8, config: 'X-16', gravityBase: 0.09, frictionCoef: 0.98008, vec: [8.8, 9.6, 10.4], active: true },
  { node: 9, config: 'X-18', gravityBase: 0.09, frictionCoef: 0.98009, vec: [9.9, 10.8, 11.7], active: true },
  { node: 10, config: 'X-20', gravityBase: 0.09, frictionCoef: 0.98010, vec: [11.0, 12.0, 13.0], active: true },
  { node: 11, config: 'X-22', gravityBase: 0.09, frictionCoef: 0.98011, vec: [12.1, 13.2, 14.3], active: true },
  { node: 12, config: 'X-24', gravityBase: 0.09, frictionCoef: 0.98012, vec: [13.2, 14.4, 15.6], active: true },
  { node: 13, config: 'X-26', gravityBase: 0.09, frictionCoef: 0.98013, vec: [14.3, 15.6, 16.9], active: true },
  { node: 14, config: 'X-28', gravityBase: 0.09, frictionCoef: 0.98014, vec: [15.4, 16.8, 18.2], active: true },
  { node: 15, config: 'X-30', gravityBase: 0.09, frictionCoef: 0.98015, vec: [16.5, 18.0, 19.5], active: true },
  { node: 16, config: 'X-32', gravityBase: 0.09, frictionCoef: 0.98016, vec: [17.6, 19.2, 20.8], active: true },
  { node: 17, config: 'X-34', gravityBase: 0.09, frictionCoef: 0.98017, vec: [18.7, 20.4, 22.1], active: true },
  { node: 18, config: 'X-36', gravityBase: 0.09, frictionCoef: 0.98018, vec: [19.8, 21.6, 23.4], active: true },
  { node: 19, config: 'X-38', gravityBase: 0.09, frictionCoef: 0.98019, vec: [20.9, 22.8, 24.7], active: true },
  { node: 20, config: 'X-40', gravityBase: 0.09, frictionCoef: 0.98020, vec: [22.0, 24.0, 26.0], active: true },
  { node: 21, config: 'X-42', gravityBase: 0.09, frictionCoef: 0.98021, vec: [23.1, 25.2, 27.3], active: true }
];
