/**
 * ==============================================================================
 * ENTERPRISE VIRTUAL BIRTHDAY ENGINE (v4.0.0 Premium Apple-Grade)
 * Architecture: ES6 Class Modules (UIManager, AudioEngine, ParticleSystem, ThreeJSEngine)
 * ==============================================================================
 */

// --- 1. DATA DATABASE (100+ KALIMAT HUBUNGAN VIRTUAL) ---
const ROMANTIC_QUOTES = [
    "Terima kasih telah hadir dalam hidupku, Zahra.", "Setiap pesan darimu adalah notifikasi favoritku.", "Meski layar memisahkan raga, hati kita terikat erat.", "Selamat ulang tahun untuk seseorang yang membuat duniaku lebih berwarna.",
    "Jarak mengajarkan kita arti rindu yang sesungguhnya.", "Semoga kebahagiaan selalu mengiringi setiap langkahmu di manapun kau berada.", "Aku bangga memiliki seseorang sepertimu yang luar biasa.", "Melihat namamu mengetik pesan selalu membuatku tersenyum sendiri.",
    "Kehadiranmu selalu menjadi alasan senyumku setiap hari.", "Walau raga tak di tempat yang sama, hati kita selalu terhubung.", "Terima kasih sudah menemani hari-hariku dengan tawa indahmu.", "Di hari spesialmu, aku mengirimkan doa terbaik melintasi sinyal dan waktu.",
    "Semoga impianmu satu per satu menjadi nyata, Zahra sayang.", "Aku akan selalu mendukungmu dari mana pun.", "Suara tawamu di telepon genggam adalah melodi penenang jiwaku.", "Pesan-pesanmu adalah penyemangat di tengah penatnya hariku.",
    "Kau membuktikan bahwa ketulusan bisa menembus batas virtual.", "Jangan pernah ragukan seberapa berartinya dirimu bagiku.", "Harapanku di hari ulang tahunmu adalah melihatmu selalu bahagia.", "Engkau adalah bintang terang di langit virtualku yang selalu menuntunku.",
    "Walaupun kita terhubung melalui jaringan, kasih sayang ini begitu nyata.", "Tetaplah menjadi Zahra yang ceria, lembut, dan penuh kasih sayang.", "Aku bersyukur algoritma semesta mempertemukan kita di dunia maya yang luas ini.", "Setiap notifikasi darimu selalu berhasil membuat jantungku berdebar hangat.",
    "Selamat bertambah usia, semoga kedewasaan membawa kedamaian di hatimu.", "Jangan lelah mengejar apa yang kau cita-citakan, aku di sini mendukungmu.", "Ketahuilah bahwa di sini ada seseorang yang selalu mendoakanmu tanpa henti.", "Hari ini adalah perayaan untuk jiwa yang luar biasa indahnya, yaitu jiwamu.",
    "Cinta sejati tidak dibatasi layar, ia merasuk ke dalam hati.", "Terima kasih telah menjadi pendengar dan peneman yang luar biasa bagiku.", "Semoga tahun ini membawa banyak kejutan manis untukmu.", "Ingatlah selalu bahwa kamu berharga, hari ini, esok, dan selamanya.",
    "Waktu yang kuhabiskan bersamamu secara virtual lebih berharga dari apapun.", "Mendengar ceritamu setiap hari adalah rutinitas yang tak pernah membosankan.", "Kau membuat dunia maya ini terasa lebih nyata dan penuh makna.", "Setiap kata yang kau ketik memiliki kekuatan untuk menenangkanku.",
    "Aku mengirimkan pelukan hangat melalui untaian doa di hari ulang tahunmu.", "Kau adalah bukti nyata bahwa jarak bukan penghalang ketulusan.", "Semoga setiap harimu seindah senyum yang kau bagikan kepadaku.", "Mengenalmu adalah salah satu keberuntungan terbesarku.",
    "Di usiamu yang baru, semoga kebijaksanaan dan kelembutan selalu menyertaimu.", "Aku tak sabar mendengar cerita-cerita hebatmu di tahun yang baru ini.", "Terima kasih telah mengajarkanku arti peduli tanpa pamrih.", "Kamu adalah tempat berpulangku di dunia yang bising ini.",
    "Selamat Ulang Tahun, cintaku. Bahagiamu adalah prioritas bahagiaku.", "Semoga langit selalu cerah di tempatmu, secerah harapanku untukmu.", "Membaca pesan lamamu terkadang cukup untuk mengubah hariku yang buruk.", "Kau memiliki pesona yang membuatku kagum meski hanya lewat kata.",
    "Doaku hari ini: semoga Allah senantiasa menjagamu di sana.", "Setiap malam aku berdoa agar esok bisa membaca pesan selamat pagimu lagi.",
];
// Auto-fill sisa kalimat untuk mencapai 100+ tanpa memenuhi file statis
const baseTemplates = ["Aku sangat bersyukur mengenalmu.", "Kamu hebat, teruslah melangkah.", "Doa terbaikku terbang mencarimu hari ini.", "Tetaplah bercahaya, Zahra.", "Setiap detik bersamamu berharga.", "Aku mengagumi semangat dan ketangguhanmu.", "Duniaku lebih indah sejak ada namamu di layarku.", "Kamu selalu tahu cara membuatku merasa lebih baik.", "Terima kasih telah menjadi versi terbaik dari dirimu.", "Selamat merayakan hari kelahiran jiwa yang indah."];
while(ROMANTIC_QUOTES.length < 100) { ROMANTIC_QUOTES.push(baseTemplates[Math.floor(Math.random()*baseTemplates.length)] + " " + ROMANTIC_QUOTES[Math.floor(Math.random()*20)]); }

// --- 2. ADVANCED AUDIO ENGINE (ADSR SYNTHESIZER) ---
class AudioEngine {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
        this.masterGain.gain.value = 0.5; // Master volume
    }
    resume() { if(this.ctx.state === 'suspended') this.ctx.resume(); }
    
    // ADSR (Attack, Decay, Sustain, Release) Envelope untuk suara Premium Apple
    playTone(freq, type, attack, decay, sustain, release, vol=1) {
        this.resume();
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        
        osc.type = type; osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        filter.type = 'lowpass'; filter.frequency.value = 2000;
        
        // ADSR Envelope
        const now = this.ctx.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(vol, now + attack);
        gainNode.gain.exponentialRampToValueAtTime(sustain * vol, now + attack + decay);
        gainNode.gain.setValueAtTime(sustain * vol, now + attack + decay + 0.1); // hold
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + attack + decay + 0.1 + release);
        
        osc.connect(filter); filter.connect(gainNode); gainNode.connect(this.masterGain);
        
        osc.start(now); osc.stop(now + attack + decay + 0.1 + release);
    }
    playKeystroke() { this.playTone(800, 'sine', 0.01, 0.05, 0.2, 0.1, 0.15); } // Soft tick
    playDelete() { this.playTone(600, 'triangle', 0.02, 0.1, 0.1, 0.15, 0.1); }
    playError() {
        this.playTone(150, 'sawtooth', 0.05, 0.1, 0.2, 0.2, 0.3);
        setTimeout(() => this.playTone(130, 'sawtooth', 0.05, 0.1, 0.2, 0.3, 0.3), 150);
    }
    playSuccess() {
        this.playTone(523.25, 'sine', 0.05, 0.1, 0.5, 0.5, 0.2); // C5
        setTimeout(() => this.playTone(659.25, 'sine', 0.05, 0.1, 0.5, 0.5, 0.2), 150); // E5
        setTimeout(() => this.playTone(783.99, 'sine', 0.05, 0.1, 0.5, 1.0, 0.3), 300); // G5
        setTimeout(() => this.playTone(1046.50, 'sine', 0.05, 0.2, 0.5, 1.5, 0.4), 450); // C6 Sparkle
    }
    playNavClick() { this.playTone(1200, 'sine', 0.01, 0.05, 0, 0.1, 0.05); }
    playWishSent() {
        for(let i=0; i<5; i++) { setTimeout(() => this.playTone(800 + (i*200), 'sine', 0.1, 0.2, 0.2, 0.5, 0.1), i*100); }
    }
}
const audio = new AudioEngine();

// --- 3. CANVAS PARTICLE SYSTEM (HEARTS, STARS, FIREWORKS) ---
class ParticleEngine {
    constructor() {
        this.canvas = document.getElementById('bg-canvas-particles');
        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.particles = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    createExplosion(x, y, colorArr) {
        for(let i=0; i<150; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 2;
            this.particles.push({
                x: x, y: y,
                vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
                radius: Math.random() * 3 + 1,
                color: colorArr[Math.floor(Math.random() * colorArr.length)],
                alpha: 1, decay: Math.random() * 0.015 + 0.005,
                type: 'firework', gravity: 0.05
            });
        }
    }
    createFloatingHearts() {
        if(Math.random() > 0.95) { // 5% chance per frame
            this.particles.push({
                x: Math.random() * this.canvas.width, y: this.canvas.height + 20,
                vx: (Math.random() - 0.5) * 1, vy: -(Math.random() * 2 + 1),
                radius: Math.random() * 10 + 5,
                color: `hsla(${Math.random()*40 + 330}, 100%, 70%, 0.6)`,
                alpha: 0, decay: -0.01, type: 'heart', life: 0
            });
        }
    }
    drawHeart(ctx, x, y, size, color, alpha) {
        ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color;
        ctx.beginPath();
        const topCurveHeight = size * 0.3;
        ctx.moveTo(x, y + topCurveHeight);
        ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
        ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 2, x, y + size);
        ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
        ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
        ctx.closePath(); ctx.fill(); ctx.restore();
    }
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.createFloatingHearts();
        
        for(let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            if(p.type === 'firework') {
                p.vy += p.gravity; p.x += p.vx; p.y += p.vy; p.alpha -= p.decay;
                this.ctx.save(); this.ctx.globalAlpha = p.alpha; this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = p.color; this.ctx.fill(); this.ctx.restore();
                if(p.alpha <= 0) this.particles.splice(i, 1);
            } else if(p.type === 'heart') {
                p.life += 0.01; p.x += Math.sin(p.life * 5) * 0.5; // sway
                p.y += p.vy;
                if(p.alpha < 0.6 && p.life < 1) p.alpha += 0.02; // fade in
                if(p.y < this.canvas.height / 2) p.alpha -= 0.01; // fade out near top
                this.drawHeart(this.ctx, p.x, p.y, p.radius, p.color, p.alpha);
                if(p.alpha <= 0 || p.y < -50) this.particles.splice(i, 1);
            }
        }
        requestAnimationFrame(this.animate);
    }
}
const particleSys = new ParticleEngine();

// --- 4. THREE.JS PROCEDURAL ENGINE (EXTREME COMPLEXITY) ---
class ThreeJSEngine {
    constructor() {
        this.canvas = document.getElementById('three-canvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 2, 25); // Mundur sedikit agar terlihat semua
        
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.setupLighting();
        this.materials = this.createMaterials();
        
        // Groups
        this.cat = new THREE.Group();
        this.rabbit = new THREE.Group();
        this.cake = new THREE.Group();
        
        this.buildProceduralCat();
        this.buildProceduralRabbit();
        this.buildProceduralCake();
        
        // Positioning
        this.cat.position.set(-5, -5, 0);
        this.rabbit.position.set(5, -5, 0);
        this.cake.position.set(0, -5, 0);
        
        this.scene.add(this.cat, this.rabbit, this.cake);
        
        // Interaction vars
        this.mouseX = 0; this.mouseY = 0;
        this.clock = new THREE.Clock();
        
        window.addEventListener('resize', () => this.onWindowResize(), false);
        document.addEventListener('mousemove', (e) => this.onPointerMove(e.clientX, e.clientY));
        document.addEventListener('touchmove', (e) => this.onPointerMove(e.touches[0].clientX, e.touches[0].clientY), {passive:true});
        
        this.animate = this.animate.bind(this);
        this.isActive = true; // Control flag for rendering
        this.animate();
    }
    setupLighting() {
        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        const dirLight = new THREE.DirectionalLight(0xffe8f0, 0.8);
        dirLight.position.set(10, 15, 10);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        this.scene.add(ambient, dirLight);
    }
    createMaterials() {
        return {
            catMat: new THREE.MeshStandardMaterial({ color: 0xffb07c, roughness: 0.8, metalness: 0.1 }), // Orange persia
            rabbitMat: new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.9 }),
            blackMat: new THREE.MeshBasicMaterial({ color: 0x111111 }),
            pinkMat: new THREE.MeshStandardMaterial({ color: 0xff69b4, roughness: 0.5 }),
            cakeBase: new THREE.MeshStandardMaterial({ color: 0xffe4e1, roughness: 0.7 }),
            icing: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.1 }),
            candle: new THREE.MeshStandardMaterial({ color: 0xffdddd }),
            plate: new THREE.MeshStandardMaterial({ color: 0xd8b4fe, metalness: 0.3, roughness: 0.2 })
        };
    }
    // BUILD CAT DENGAN DETAIL TINGGI
    buildProceduralCat() {
        // Body
        const bodyGeo = new THREE.CapsuleGeometry(1.2, 1.5, 4, 16);
        const body = new THREE.Mesh(bodyGeo, this.materials.catMat);
        body.rotation.z = Math.PI/2; body.position.y = 1.2; body.castShadow = true;
        this.cat.add(body);
        
        // Head Group (bisa digerakkan)
        this.catHeadGroup = new THREE.Group();
        this.catHeadGroup.position.set(-1.5, 2, 0);
        const headGeo = new THREE.SphereGeometry(1.1, 32, 32);
        const head = new THREE.Mesh(headGeo, this.materials.catMat); head.castShadow = true;
        this.catHeadGroup.add(head);
        
        // Ears
        const earGeo = new THREE.ConeGeometry(0.4, 0.8, 16);
        earGeo.translate(0, 0.4, 0); // Pivot di bawah
        const earL = new THREE.Mesh(earGeo, this.materials.catMat); earL.position.set(-0.6, 0.8, -0.2); earL.rotation.z = 0.3; earL.rotation.x = -0.2;
        const earR = new THREE.Mesh(earGeo, this.materials.catMat); earR.position.set(0.6, 0.8, -0.2); earR.rotation.z = -0.3; earR.rotation.x = -0.2;
        this.catHeadGroup.add(earL, earR);
        
        // Eyes & Nose
        const eyeGeo = new THREE.SphereGeometry(0.18, 16, 16);
        const eyeL = new THREE.Mesh(eyeGeo, this.materials.blackMat); eyeL.position.set(-0.4, 0.2, 0.95);
        const eyeR = new THREE.Mesh(eyeGeo, this.materials.blackMat); eyeR.position.set(0.4, 0.2, 0.95);
        const nose = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16,16), this.materials.pinkMat); nose.position.set(0, -0.1, 1.05);
        this.catHeadGroup.add(eyeL, eyeR, nose);
        this.cat.add(this.catHeadGroup);
        
        // Legs (4)
        const legGeo = new THREE.CylinderGeometry(0.3, 0.2, 1.2, 16);
        legGeo.translate(0, -0.6, 0);
        const legFrontL = new THREE.Mesh(legGeo, this.materials.catMat); legFrontL.position.set(-1, 1.2, 0.6);
        const legFrontR = new THREE.Mesh(legGeo, this.materials.catMat); legFrontR.position.set(-1, 1.2, -0.6);
        const legBackL = new THREE.Mesh(legGeo, this.materials.catMat); legBackL.position.set(1, 1.2, 0.6);
        const legBackR = new THREE.Mesh(legGeo, this.materials.catMat); legBackR.position.set(1, 1.2, -0.6);
        this.cat.add(legFrontL, legFrontR, legBackL, legBackR);
        
        // Tail (Procedural segmented for smooth wag)
        this.catTail = new THREE.Group();
        this.catTail.position.set(1.8, 1.5, 0);
        let prevSegment = this.catTail;
        this.tailSegments = [];
        for(let i=0; i<6; i++) {
            const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.2 - (i*0.02), 0.2 - ((i+1)*0.02), 0.5, 16), this.materials.catMat);
            seg.position.y = 0.25; // geser ke atas
            const pivot = new THREE.Group();
            if(i===0) { pivot.rotation.z = Math.PI/4; }
            pivot.position.y = (i===0) ? 0 : 0.45;
            pivot.add(seg);
            prevSegment.add(pivot);
            prevSegment = pivot;
            this.tailSegments.push(pivot);
        }
        this.cat.add(this.catTail);
    }
    // BUILD RABBIT DENGAN DETAIL TINGGI
    buildProceduralRabbit() {
        // Body (Lebih bulat)
        const bodyGeo = new THREE.SphereGeometry(1.4, 32, 32);
        const body = new THREE.Mesh(bodyGeo, this.materials.rabbitMat); body.position.y = 1.4; body.castShadow = true;
        this.rabbit.add(body);
        
        // Head
        this.rabHeadGroup = new THREE.Group();
        this.rabHeadGroup.position.set(0, 2.8, 0.8);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.9, 32, 32), this.materials.rabbitMat); head.castShadow = true;
        this.rabHeadGroup.add(head);
        
        // Long Floppy Ears
        const earGeo = new THREE.CapsuleGeometry(0.25, 1.8, 4, 16);
        earGeo.translate(0, 0.9, 0);
        this.rabEarL = new THREE.Mesh(earGeo, this.materials.rabbitMat); this.rabEarL.position.set(-0.4, 0.6, -0.2); this.rabEarL.rotation.z = 0.2;
        this.rabEarR = new THREE.Mesh(earGeo, this.materials.rabbitMat); this.rabEarR.position.set(0.4, 0.6, -0.2); this.rabEarR.rotation.z = -0.2;
        this.rabHeadGroup.add(this.rabEarL, this.rabEarR);
        
        // Eyes, Nose, Cheeks
        const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), this.materials.blackMat); eyeL.position.set(-0.35, 0.1, 0.8);
        const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), this.materials.blackMat); eyeR.position.set(0.35, 0.1, 0.8);
        const nose = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16,16), this.materials.pinkMat); nose.position.set(0, -0.1, 0.85);
        this.rabHeadGroup.add(eyeL, eyeR, nose);
        this.rabbit.add(this.rabHeadGroup);
        
        // Fluffy Tail
        const tail = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), this.materials.rabbitMat);
        tail.position.set(0, 0.8, -1.3);
        this.rabbit.add(tail);
        
        // Legs
        const legGeo = new THREE.CapsuleGeometry(0.3, 0.8, 4, 16);
        legGeo.translate(0, -0.4, 0);
        const lFL = new THREE.Mesh(legGeo, this.materials.rabbitMat); lFL.position.set(-0.6, 0.8, 1);
        const lFR = new THREE.Mesh(legGeo, this.materials.rabbitMat); lFR.position.set(0.6, 0.8, 1);
        const lBL = new THREE.Mesh(legGeo, this.materials.rabbitMat); lBL.position.set(-0.8, 0.8, -0.5);
        const lBR = new THREE.Mesh(legGeo, this.materials.rabbitMat); lBR.position.set(0.8, 0.8, -0.5);
        this.rabbit.add(lFL, lFR, lBL, lBR);
    }
    // BUILD 3-TIER CAKE
    buildProceduralCake() {
        // Plate
        const plate = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 3.5, 0.4, 32), this.materials.plate);
        plate.position.y = 0.2; plate.castShadow = true; plate.receiveShadow = true;
        this.cake.add(plate);
        
        // Tier 1 (Base)
        const t1 = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 2, 32), this.materials.cakeBase);
        t1.position.y = 1.4; t1.castShadow = true;
        const i1 = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 0.5, 32), this.materials.icing);
        i1.position.y = 2.4;
        this.cake.add(t1, i1);
        
        // Tier 2
        const t2 = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 1.8, 32), this.materials.pinkMat);
        t2.position.y = 3.5; t2.castShadow = true;
        const i2 = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 0.4, 32), this.materials.icing);
        i2.position.y = 4.4;
        this.cake.add(t2, i2);
        
        // Candles (3)
        this.flames = [];
        this.candleLights = [];
        const candleGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.2, 16);
        const flameGeo = new THREE.ConeGeometry(0.15, 0.5, 16);
        const flameMat = new THREE.MeshBasicMaterial({ color: 0xffd700 }); // Gold glow
        
        const positions = [[0,0], [-1.2, 0.5], [1.2, -0.5]];
        positions.forEach(pos => {
            const candle = new THREE.Mesh(candleGeo, this.materials.candle);
            candle.position.set(pos[0], 5.0, pos[1]);
            
            const flame = new THREE.Mesh(flameGeo, flameMat);
            flame.position.set(pos[0], 5.8, pos[1]);
            this.flames.push(flame);
            
            const light = new THREE.PointLight(0xffaa00, 0.5, 5);
            light.position.set(pos[0], 6.0, pos[1]);
            this.candleLights.push(light);
            
            this.cake.add(candle, flame, light);
        });
        
        // Procedural Sprinkles on Tier 1 using InstancedMesh (Performa Tinggi)
        const sprinkleGeo = new THREE.CapsuleGeometry(0.05, 0.15, 4, 8);
        const sprinkleMat = new THREE.MeshStandardMaterial({color: 0xffffff});
        this.sprinkles = new THREE.InstancedMesh(sprinkleGeo, sprinkleMat, 200);
        const dummy = new THREE.Object3D();
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
        
        for(let i=0; i<200; i++) {
            const theta = Math.random() * Math.PI * 2;
            const radius = Math.random() * 3.2;
            dummy.position.set(Math.cos(theta)*radius, 2.7, Math.sin(theta)*radius); // Di atas Icing Tier 1
            dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
            dummy.updateMatrix();
            this.sprinkles.setMatrixAt(i, dummy.matrix);
            const c = new THREE.Color(colors[Math.floor(Math.random()*colors.length)]);
            this.sprinkles.setColorAt(i, c);
        }
        this.cake.add(this.sprinkles);
    }
    
    onPointerMove(clientX, clientY) {
        this.mouseX = (clientX / window.innerWidth) * 2 - 1;
        this.mouseY = -(clientY / window.innerHeight) * 2 + 1;
    }
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(this.animate);
        if(!this.isActive) return; // Pause rendering if not on home screen
        
        const t = this.clock.getElapsedTime();
        
        // Animasi bernapas (breathing)
        this.cat.position.y = -5 + Math.sin(t * 2) * 0.1;
        this.rabbit.position.y = -5 + Math.sin(t * 2.2) * 0.1;
        this.cake.position.y = -5 + Math.sin(t * 1.5) * 0.05;
        
        // Kepala mengikuti kursor (Lerp Math)
        const targetRotX = this.mouseY * 0.5;
        const targetRotY = -this.mouseX * 0.5;
        
        this.catHeadGroup.rotation.x += (targetRotX - this.catHeadGroup.rotation.x) * 0.1;
        this.catHeadGroup.rotation.y += (targetRotY - this.catHeadGroup.rotation.y) * 0.1;
        this.rabHeadGroup.rotation.x += (targetRotX - this.rabHeadGroup.rotation.x) * 0.1;
        this.rabHeadGroup.rotation.y += (targetRotY - this.rabHeadGroup.rotation.y) * 0.1;
        
        // Ekor Kucing bergoyang halus (Sine wave per segment)
        this.tailSegments.forEach((seg, i) => {
            seg.rotation.x = Math.sin(t * 3 - i * 0.5) * 0.2;
            seg.rotation.z = Math.sin(t * 2 - i * 0.3) * 0.1;
        });
        
        // Telinga Kelinci mengepak
        this.rabEarL.rotation.z = 0.2 + Math.sin(t * 4) * 0.1;
        this.rabEarR.rotation.z = -0.2 - Math.sin(t * 4) * 0.1;
        
        // Kue berputar perlahan
        this.cake.rotation.y += 0.005;
        
        // Api lilin berkedip (Flicker)
        this.flames.forEach((flame, i) => {
            flame.scale.y = 1 + Math.sin(t * 20 + i) * 0.2;
            flame.scale.x = 1 + Math.sin(t * 15 + i) * 0.1;
            flame.scale.z = 1 + Math.sin(t * 15 + i) * 0.1;
        });
        this.candleLights.forEach((light, i) => {
            light.intensity = 0.5 + Math.sin(t * 30 + i) * 0.2;
        });
        
        this.renderer.render(this.scene, this.camera);
    }
}
let threeEngine;

// --- 5. UI CONTROLLER & LOGIC STATE MACHINE ---
class UIManager {
    constructor() {
        this.screens = document.querySelectorAll('.screen-layer');
        this.dockItems = document.querySelectorAll('.dock-item');
        this.musicBtn = document.getElementById('toggle-music-btn');
        this.bgMusic = document.getElementById('bg-music');
        this.initKeypad();
        this.initDock();
        this.initMusic();
        this.initWish();
        this.initSecret();
        
        // Decor Layer (CSS CSS-Decor-Layer procedurally injected)
        this.injectCSSDecorations();
    }
    
    switchScreen(targetId) {
        this.screens.forEach(s => {
            s.classList.remove('active-screen');
        });
        document.getElementById(targetId).classList.add('active-screen');
        
        this.dockItems.forEach(i => {
            i.classList.remove('active');
            if(i.dataset.target === targetId) i.classList.add('active');
        });
        
        audio.playNavClick();
        
        // Manage ThreeJS Rendering State
        if(threeEngine) {
            threeEngine.isActive = (targetId === 'screen-home');
        }

        // Trigger specific logic
        if(targetId === 'screen-home') {
            if(!threeEngine) threeEngine = new ThreeJSEngine();
            this.startLiveClock();
        }
        if(targetId === 'screen-messages') this.initLetterScroll();
    }
    
    initDock() {
        this.dockItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const target = e.currentTarget.dataset.target;
                this.switchScreen(target);
            });
        });
    }
    
    // Kompleks Keypad Generation & Logic
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
            
            if(k.action) {
                btn.innerText = k.l;
            } else if(!k.empty) {
                btn.innerHTML = `${k.n}<span class="letters">${k.l}</span>`;
            }
            
            // Use pointerdown for immediate response on mobile
            btn.addEventListener('pointerdown', (e) => {
                e.preventDefault(); // Prevent double firing
                if(k.empty) return;
                
                // Visual feedback
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
        
        this.updatePinDots();
        
        if(this.pinCode.length === 6) {
            if(this.pinCode === this.correctPin) {
                audio.playSuccess();
                setTimeout(() => this.startLoadingSequence(), 500);
            } else {
                audio.playError();
                document.getElementById('pin-indicators').classList.add('shake-error');
                this.indicators.forEach(d => d.classList.add('error'));
                if(navigator.vibrate) navigator.vibrate([100, 50, 100]);
                setTimeout(() => {
                    this.pinCode = "";
                    this.updatePinDots();
                    document.getElementById('pin-indicators').classList.remove('shake-error');
                    this.indicators.forEach(d => d.classList.remove('error'));
                }, 500);
            }
        }
    }
    
    updatePinDots() {
        this.indicators.forEach((dot, idx) => {
            if(idx < this.pinCode.length) dot.classList.add('filled');
            else dot.classList.remove('filled');
        });
    }
    
    startLoadingSequence() {
        this.switchScreen('screen-loading');
        const fill = document.getElementById('loading-fill-element');
        const pct = document.getElementById('loading-pct');
        const status = document.getElementById('loading-status');
        const statuses = ["Memuat Kenangan...", "Membangun Ruang 3D...", "Menyusun Harapan...", "Hampir Siap..."];
        
        let prog = 0;
        const interval = setInterval(() => {
            prog += Math.random() * 10;
            if(prog >= 100) {
                prog = 100; clearInterval(interval);
                setTimeout(() => {
                    this.switchScreen('screen-home');
                    particleSys.createExplosion(window.innerWidth/2, window.innerHeight/2, ['#ff69b4', '#dda0dd', '#ffffff', '#ffd700']);
                    document.getElementById('main-dock').classList.remove('hidden-dock');
                    // Play music on auth success
                    this.bgMusic.play().catch(e=>console.log("Autoplay block", e));
                    this.updateMusicUI(true);
                }, 1000);
            }
            fill.style.width = `${prog}%`;
            pct.innerText = `${Math.floor(prog)}%`;
            if(prog > 25) status.innerText = statuses[1];
            if(prog > 60) status.innerText = statuses[2];
            if(prog > 85) status.innerText = statuses[3];
        }, 300);
    }
    
    initMusic() {
        const island = document.getElementById('music-island');
        this.musicBtn.addEventListener('click', () => {
            if(this.bgMusic.paused) { this.bgMusic.play(); this.updateMusicUI(true); }
            else { this.bgMusic.pause(); this.updateMusicUI(false); }
        });
        
        this.bgMusic.addEventListener('timeupdate', () => {
            const p = (this.bgMusic.currentTime / this.bgMusic.duration) * 100;
            document.getElementById('music-progress').style.width = `${p}%`;
        });
    }
    updateMusicUI(isPlaying) {
        this.musicBtn.innerHTML = isPlaying ? '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>' : '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
        if(isPlaying) document.getElementById('music-island').classList.remove('is-paused');
        else document.getElementById('music-island').classList.add('is-paused');
    }
    
    startLiveClock() {
        const update = () => {
            const now = new Date();
            document.getElementById('live-date-display').innerText = now.toLocaleDateString('id-ID', {weekday:'long', year:'numeric', month:'long', day:'numeric'});
            const form = (tz) => now.toLocaleTimeString('id-ID', {timeZone: tz, hour:'2-digit', minute:'2-digit', second:'2-digit'});
            document.getElementById('tz-wib').innerText = form('Asia/Jakarta');
            document.getElementById('tz-wita').innerText = form('Asia/Makassar');
            document.getElementById('tz-wit').innerText = form('Asia/Jayapura');
            document.getElementById('tz-utc').innerText = form('UTC');
            document.getElementById('tz-gmt').innerText = form('GMT');
            requestAnimationFrame(update);
        };
        update();
    }
    
    initLetterScroll() {
        if(this.letterInited) return; this.letterInited = true;
        const btn = document.getElementById('open-letter-btn');
        btn.addEventListener('click', () => {
            audio.playSuccess();
            document.getElementById('envelope-wrapper').classList.add('envelope-open');
            setTimeout(() => {
                document.getElementById('envelope-wrapper').classList.add('hidden');
                const content = document.getElementById('letter-content');
                content.classList.remove('hidden');
                
                // Inject 100 Quotes dynamically
                const container = document.getElementById('romantic-quotes-container');
                ROMANTIC_QUOTES.forEach((quote, idx) => {
                    const el = document.createElement('div');
                    el.className = 'quote-item';
                    el.innerText = quote;
                    // Intersection Observer for fade-in scroll
                    const observer = new IntersectionObserver((entries) => {
                        if(entries[0].isIntersecting) {
                            setTimeout(()=>el.classList.add('visible'), 100);
                            observer.unobserve(el);
                        }
                    }, {threshold: 0.1});
                    container.appendChild(el);
                    observer.observe(el);
                });
            }, 1000);
        });
    }
    
    initWish() {
        const text = document.getElementById('wish-input');
        const count = document.getElementById('char-count');
        const btn = document.getElementById('send-wish-btn');
        text.addEventListener('input', () => { count.innerText = `${text.value.length} / 500`; });
        
        btn.addEventListener('click', () => {
            if(text.value.trim() === '') return;
            audio.playWishSent();
            text.value = ''; count.innerText = '0 / 500';
            
            // Giant fireworks response
            for(let i=0; i<5; i++) {
                setTimeout(()=>{
                    particleSys.createExplosion(
                        Math.random()*window.innerWidth, 
                        Math.random()*(window.innerHeight/2), 
                        ['#FFD700', '#FF69B4', '#FFFFFF']
                    );
                }, i*300);
            }
            btn.querySelector('.btn-text').innerText = "Terkirim ke Langit ✦";
            setTimeout(()=> btn.querySelector('.btn-text').innerText = "Kirim ke Semesta", 4000);
        });
    }
    
    initSecret() {
        // Logic will be triggered when switching to screen-secret natively
        // Handled via Intersection or button click if needed.
        const loveContainer = document.getElementById('love-drawing-container');
        const lovePath = document.getElementById('giant-love-path');
        const boxWrapper = document.getElementById('secret-box-wrapper');
        const giftContainer = document.getElementById('ultimate-gift-container');
        const boxBtn = document.getElementById('magic-box-btn');
        const resetBtn = document.getElementById('reset-journey-btn');
        
        let secretTriggered = false;
        
        // KITA OVERRIDE switchScreen khusus untuk ngetrigger animasi rahasia
        const origSwitch = this.switchScreen.bind(this);
        this.switchScreen = (target) => {
            origSwitch(target);
            if(target === 'screen-secret' && !secretTriggered) {
                secretTriggered = true;
                lovePath.classList.add('draw-love-anim');
                
                // Setelah SVG selesai di-draw (4 detik + 1s isi)
                setTimeout(() => {
                    loveContainer.style.opacity = 0;
                    setTimeout(()=>{
                        loveContainer.classList.add('hidden');
                        boxWrapper.classList.remove('hidden');
                        audio.playSuccess();
                    }, 500);
                }, 5000);
            }
        };
        
        boxBtn.addEventListener('click', () => {
            audio.playSuccess();
            particleSys.createExplosion(window.innerWidth/2, window.innerHeight/2, ['#A855F7', '#FF69B4']);
            boxBtn.classList.add('box-opened');
            
            setTimeout(() => {
                boxWrapper.classList.add('hidden');
                giftContainer.classList.remove('hidden');
            }, 1000);
        });
        
        resetBtn.addEventListener('click', () => { this.switchScreen('screen-home'); });
    }
    
    injectCSSDecorations() {
        const layer = document.getElementById('css-decor-layer');
        const shapes = ['✦', '★', '♦', '●', '✧', '⋆'];
        for(let i=0; i<60; i++) { // Massive amount of passive decor
            const span = document.createElement('span');
            span.className = 'css-particle-item';
            span.innerText = shapes[Math.floor(Math.random()*shapes.length)];
            span.style.left = `${Math.random()*100}vw`;
            span.style.fontSize = `${Math.random()*15 + 10}px`;
            span.style.setProperty('--duration', `${Math.random()*20 + 15}s`);
            span.style.setProperty('--pulse', `${Math.random()*2 + 1}s`);
            span.style.setProperty('--max-opacity', `${Math.random()*0.5 + 0.2}`);
            span.style.animationDelay = `${Math.random()*20}s`;
            layer.appendChild(span);
        }
    }
}

// Start The Engine on Load
// Ensure DOM is fully loaded before initializing to prevent button issues
document.addEventListener('DOMContentLoaded', () => {
    window.App = new UIManager();
});
"""

import os
os.makedirs("Ulang-Tahun-Zahra", exist_ok=True)
with open("Ulang-Tahun-Zahra/index.html", "w") as f:
    f.write(generate_premium_html())
with open("Ulang-Tahun-Zahra/style.css", "w") as f:
    f.write(generate_premium_css())
with open("Ulang-Tahun-Zahra/script.js", "w") as f:
    f.write(generate_premium_js())
print("Files Generated in Ulang-Tahun-Zahra directory")