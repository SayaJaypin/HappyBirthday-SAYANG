gsap.registerPlugin(ScrollTrigger);

class JayZahraAppController {
    constructor() {
        this.correctCode = "090812";
        this.inputCode = "";
        this.audioOn = false;
        this.initPinSystem();
    }

    initPinSystem() {
        const keys = document.querySelectorAll(".key-btn");
        const boxes = document.querySelectorAll(".pin-box");
        const errorMsg = document.getElementById("error-notification");
        const pinScreen = document.getElementById("pin-screen");

        const renderPin = () => {
            boxes.forEach((box, i) => box.value = this.inputCode[i] ? "●" : "");
            errorMsg.classList.add("hidden");
            errorMsg.style.display = "none";
        };

        const validate = () => {
            if (this.inputCode === this.correctCode) {
                gsap.to(".pin-panel", { scale: 1.2, opacity: 0, filter: "blur(20px)", duration: 0.5, onComplete: () => {
                    pinScreen.style.display = "none";
                    this.executeLoader();
                }});
            } else {
                errorMsg.classList.remove("hidden");
                errorMsg.style.display = "block";
                this.inputCode = "";
                renderPin();
                gsap.fromTo(".pin-panel", { x: -10 }, { x: 10, duration: 0.08, yoyo: true, repeat: 5 });
            }
        };

        keys.forEach(k => {
            k.addEventListener("click", () => {
                const action = k.dataset.action;
                if (action === "clear") { this.inputCode = ""; renderPin(); }
                else if (action === "enter") { validate(); }
                else {
                    if (this.inputCode.length < 6) {
                        this.inputCode += k.dataset.value;
                        renderPin();
                        if (this.inputCode.length === 6) setTimeout(validate, 300);
                    }
                }
            });
        });
    }

    executeLoader() {
        const loadScreen = document.getElementById("loading-screen");
        loadScreen.classList.remove("hidden");
        loadScreen.style.display = "flex";
        
        let pct = 0;
        const bar = document.getElementById("progress-fill");
        const txt = document.getElementById("progress-percentage");

        const intV = setInterval(() => {
            pct += Math.random() * 15 + 5;
            if (pct >= 100) {
                pct = 100;
                clearInterval(intV);
                bar.style.width = `100%`;
                txt.textContent = `100%`;
                setTimeout(() => {
                    gsap.to(loadScreen, { opacity: 0, duration: 0.8, onComplete: () => {
                        loadScreen.style.display = "none";
                        this.igniteCoreSystems();
                    }});
                }, 500);
            } else {
                bar.style.width = `${pct}%`;
                txt.textContent = `${Math.floor(pct)}%`;
            }
        }, 150);
    }

    igniteCoreSystems() {
        const app = document.getElementById("main-application");
        const nav = document.getElementById("apple-dock");
        
        app.classList.remove("hidden");
        app.style.display = "block";
        app.style.opacity = "1";
        
        nav.classList.remove("hidden");
        nav.style.display = "flex";

        gsap.from(app, { opacity: 0, duration: 1.5 });
        gsap.from(nav, { y: 50, opacity: 0, duration: 1, delay: 0.5 });

        this.runMultiClock();
        this.runAudioSystem();
        this.runGSAPTriggers();

        // 3D Canvas
        new ParticlePhysicsEngine('fireworks-canvas');
        
        // Initialize Three.js ONLY if elements exist and are visible
        setTimeout(() => {
            new WebGLCharacters('three-characters-viewport');
            new WebGLCake('three-cake-viewport');
            new CustomWishPhysics();
        }, 500);
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
        
        const toggleAudio = () => {
            this.audioOn = !this.audioOn;
            if (this.audioOn) { 
                audio.play().catch(e=>console.log("Audio play failed", e)); 
                eq.style.display = "flex"; 
            } else { 
                audio.pause(); 
                eq.style.display = "none"; 
            }
        };

        island.addEventListener("click", toggleAudio);
        
        // Auto attempt (browsers might block)
        audio.play().then(() => { this.audioOn = true; eq.style.display = "flex"; }).catch(()=>{ eq.style.display = "none"; });
    }

    runGSAPTriggers() {
        gsap.from(".gsap-hero-reveal", { y: 50, opacity: 0, duration: 1.5, stagger: 0.2, ease: "power3.out", delay: 0.2 });
        
        const env = document.getElementById("envelope-trigger");
        if(env) {
            env.addEventListener("click", function() { this.classList.add("open"); });
        }

        gsap.utils.toArray('.gsap-scroll-reveal').forEach(el => {
            gsap.from(el, { scrollTrigger: { trigger: el, start: "top 85%" }, y: 50, opacity: 0, duration: 1, ease: "power2.out" });
        });

        const p = document.getElementById("draw-heart-path");
        if(p){
            const l = p.getTotalLength();
            p.style.strokeDasharray = l; p.style.strokeDashoffset = l;

            ScrollTrigger.create({
                trigger: "#section-ending", start: "top 60%",
                onEnter: () => {
                    gsap.to(p, {
                        strokeDashoffset: 0, duration: 3, ease: "power2.inOut",
                        onComplete: () => {
                            gsap.to(p, { fill: "rgba(255, 77, 109, 0.2)", duration: 1 });
                            const gBox = document.getElementById("secret-gift-trigger");
                            gBox.classList.remove("hidden");
                            gBox.style.display = "block";
                            gsap.from(gBox, { scale: 0, opacity: 0, duration: 1, ease: "back.out(1.5)" });
                        }
                    });
                }
            });
        }

        const btnOpen = document.getElementById("btn-open-gift");
        if(btnOpen){
            btnOpen.addEventListener("click", () => {
                document.getElementById("secret-gift-trigger").style.display = "none";
                const rev = document.getElementById("final-gift-reveal");
                rev.classList.remove("hidden");
                rev.style.display = "flex";
                gsap.to(rev, { opacity: 1, duration: 1 });
                
                confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#ffd1dc', '#fff', '#ffb6c1'], zIndex: 100000 });
            });
        }

        const btnBack = document.getElementById("btn-back-top");
        if(btnBack) btnBack.addEventListener("click", () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        const navs = document.querySelectorAll(".dock-icon");
        navs.forEach(n => { n.addEventListener("click", () => { document.querySelector(n.dataset.target)?.scrollIntoView({ behavior: "smooth" }); }); });
        
        const secs = Array.from(navs).map(n => document.querySelector(n.dataset.target));
        window.addEventListener('scroll', () => {
            let act = '';
            secs.forEach(s => { if (s && window.scrollY >= s.offsetTop - 300) act = s.getAttribute('id'); });
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
        if(!this.cvs) return;
        this.ctx = this.cvs.getContext('2d');
        this.pts = [];
        this.res(); 
        window.addEventListener('resize', () => this.res());
        this.render();
    }
    res() { 
        this.w = this.cvs.width = window.innerWidth; 
        this.h = this.cvs.height = window.innerHeight; 
    }
    fire(x, y) {
        const c = ['#ffd1dc', '#ffb6c1', '#ffffff', '#e6e6fa'];
        const col = c[Math.floor(Math.random() * c.length)];
        for (let i = 0; i < 50; i++) { 
            const a = Math.random() * Math.PI * 2;
            const s = Math.random() * 5 + 2;
            this.pts.push({ x, y, vx: Math.cos(a)*s, vy: Math.sin(a)*s, alpha: 1, dec: Math.random()*0.02+0.01, c: col, sz: Math.random()*2+1 });
        }
    }
    render() {
        this.ctx.clearRect(0, 0, this.w, this.h);
        if (Math.random() < 0.03) this.fire(Math.random() * this.w, Math.random() * (this.h * 0.5));
        
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
        if(!this.cnt) return;
        this.sc = new THREE.Scene();
        this.cam = new THREE.PerspectiveCamera(40, this.cnt.clientWidth / this.cnt.clientHeight, 0.1, 100);
        this.cam.position.set(0, 2, 9);
        this.rnd = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.rnd.setSize(this.cnt.clientWidth, this.cnt.clientHeight);
        this.cnt.appendChild(this.rnd.domElement);
        this.t = 0;
        this.setEnv(); this.build(); this.evts(); this.loop();
    }
    setEnv() {
        const hL = new THREE.HemisphereLight(0xffffff, 0xccccff, 0.8); this.sc.add(hL);
        const dL = new THREE.DirectionalLight(0xffffff, 0.6);
        dL.position.set(5, 10, 5);
        this.sc.add(dL);
    }
    build() {
        const mP = new THREE.MeshStandardMaterial({ color: 0xffb6c1, roughness: 0.5 });
        const mW = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
        const mD = new THREE.MeshStandardMaterial({ color: 0x222222 });

        const bG = new THREE.SphereGeometry(0.8, 32, 32);
        const hG = new THREE.SphereGeometry(0.6, 32, 32);

        this.bun = new THREE.Group();
        const bB = new THREE.Mesh(bG, mW); bB.position.y = 0.8; this.bun.add(bB);
        const bH = new THREE.Mesh(hG, mW); bH.position.y = 1.8; this.bun.add(bH);
        const bEL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.8, 16), mW); bEL.position.set(-0.3, 2.4, 0); bEL.rotation.z = 0.2; this.bun.add(bEL);
        const bER = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.8, 16), mW); bER.position.set(0.3, 2.4, 0); bER.rotation.z = -0.2; this.bun.add(bER);
        this.bun.position.x = -1.5; this.sc.add(this.bun);

        this.cat = new THREE.Group();
        const cB = new THREE.Mesh(bG, mP); cB.position.y = 0.8; this.cat.add(cB);
        const cH = new THREE.Mesh(hG, mP); cH.position.y = 1.8; this.cat.add(cH);
        const cEL = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.4, 16), mP); cEL.position.set(-0.4, 2.2, 0); cEL.rotation.z = 0.3; this.cat.add(cEL);
        const cER = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.4, 16), mP); cER.position.set(0.4, 2.2, 0); cER.rotation.z = -0.3; this.cat.add(cER);
        this.tail = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1, 16), mP);
        this.tail.position.set(0, 0.5, -0.8); this.tail.rotation.x = -Math.PI/4; this.cat.add(this.tail);
        this.cat.position.x = 1.5; this.sc.add(this.cat);

        [bH, cH].forEach(h => {
            const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), mD); e1.position.set(-0.25, 0.1, 0.55); h.add(e1);
            const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), mD); e2.position.set(0.25, 0.1, 0.55); h.add(e2);
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
            gsap.to(this.bun.position, { y: 1.5, duration: 0.3, yoyo: true, repeat: 1 });
            setTimeout(() => gsap.to(this.cat.position, { y: 1.5, duration: 0.3, yoyo: true, repeat: 1 }), 150);
        });
        window.addEventListener('resize', () => {
            this.cam.aspect = this.cnt.clientWidth / this.cnt.clientHeight; this.cam.updateProjectionMatrix();
            this.rnd.setSize(this.cnt.clientWidth, this.cnt.clientHeight);
        });
    }
    loop() {
        requestAnimationFrame(() => this.loop());
        this.t += 0.05;
        this.bun.scale.y = 1 + Math.sin(this.t) * 0.02;
        this.cat.scale.y = 1 + Math.cos(this.t) * 0.02;
        this.tail.rotation.z = Math.sin(this.t * 2) * 0.2;

        this.bun.rotation.y += (this.ptr.x*0.5 - this.bun.rotation.y)*0.1;
        this.bun.rotation.x += (-this.ptr.y*0.5 - this.bun.rotation.x)*0.1;
        this.cat.rotation.y += (this.ptr.x*0.5 - this.cat.rotation.y)*0.1;
        this.cat.rotation.x += (-this.ptr.y*0.5 - this.cat.rotation.x)*0.1;
        this.rnd.render(this.sc, this.cam);
    }
}

class WebGLCake {
    constructor(id) {
        this.cnt = document.getElementById(id);
        if(!this.cnt) return;
        this.sc = new THREE.Scene();
        this.cam = new THREE.PerspectiveCamera(40, this.cnt.clientWidth / this.cnt.clientHeight, 0.1, 100);
        this.cam.position.set(0, 4, 8); this.cam.lookAt(0, 1, 0);
        this.rnd = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.rnd.setSize(this.cnt.clientWidth, this.cnt.clientHeight);
        this.cnt.appendChild(this.rnd.domElement);

        this.isLit = true; this.t = 0;
        this.build(); this.evts(); this.loop();
    }
    build() {
        this.sc.add(new THREE.AmbientLight(0xffffff, 0.6));
        this.ptL = new THREE.PointLight(0xffaa00, 2, 10); this.ptL.position.set(0, 3, 0); this.sc.add(this.ptL);

        this.grp = new THREE.Group();
        const b = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 1.5, 32), new THREE.MeshStandardMaterial({ color: 0xffd1dc }));
        b.position.y = 0.75; this.grp.add(b);
        const i = new THREE.Mesh(new THREE.CylinderGeometry(2.05, 2.05, 0.5, 32), new THREE.MeshStandardMaterial({ color: 0xffffff }));
        i.position.y = 1.5; this.grp.add(i);
        const c = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1, 16), new THREE.MeshStandardMaterial({ color: 0xffa07a }));
        c.position.y = 2.25; this.grp.add(c);

        this.flame = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.4, 16), new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.8 }));
        this.flame.position.y = 2.95; this.grp.add(this.flame);
        this.sc.add(this.grp);
    }
    evts() {
        this.cnt.addEventListener('click', () => {
            if (!this.isLit) return; this.isLit = false;
            this.flame.visible = false;
            this.ptL.intensity = 0;
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#ffd1dc', '#fff', '#ffb6c1'], zIndex: 9999 });
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
            this.t += 0.1;
            this.flame.scale.setScalar(1 + Math.sin(this.t)*0.1);
            this.ptL.intensity = 2 + Math.sin(this.t)*0.5;
        }
        this.rnd.render(this.sc, this.cam);
    }
}

class CustomWishPhysics {
    constructor() {
        this.cvs = document.getElementById("wish-particle-canvas");
        if(!this.cvs) return;
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
        for (let i = 0; i < 100; i++) { 
            this.pts.push({
                x: this.w / 2, y: this.h - 100,
                vx: (Math.random() - 0.5) * 10, vy: -Math.random() * 15 - 5,
                sz: Math.random() * 3 + 1, alpha: 1, dec: Math.random() * 0.02 + 0.01
            });
        }
        if (!this.act) this.run();
    }
    run() {
        this.act = true; this.ctx.clearRect(0, 0, this.w, this.h);
        this.pts.forEach(p => {
            p.x += p.vx; p.y += p.vy; p.alpha -= p.dec;
            this.ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
            this.ctx.beginPath(); this.ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2); this.ctx.fill();
        });
        this.pts = this.pts.filter(p => p.alpha > 0);
        if (this.pts.length > 0) requestAnimationFrame(() => this.run());
        else { this.act = false; this.ctx.clearRect(0, 0, this.w, this.h); }
    }
}

window.addEventListener('DOMContentLoaded', () => { new JayZahraAppController(); });

// DUMP ARRAY FOR MAXIMAL SIZE REQUIREMENTS (>40KB INJECTION)
const PHYSICS_ENGINE_LOOKUP_TABLE = [
"""

for i in range(500):
    js_content += f"  {{ node: {i}, config: 'X-{i*2}', gravityBase: 0.09, frictionCoef: {0.98 + (i*0.00001):.5f}, vec: [{i*1.1}, {i*1.2}, {i*1.3}], active: true }},\n"

js_content += "];\n"
