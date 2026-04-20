(function () {
    'use strict';

    // ── Canvas Setup ─────────────────────────────────────────────────────────
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W, H;
    function resize() {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // ── Simple 2D Noise (Perlin-like) ────────────────────────────────────────
    const permutation = [];
    for (let i = 0; i < 256; i++) permutation[i] = i;
    for (let i = 255; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
    }
    const perm = [...permutation, ...permutation];

    function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    function lerp(a, b, t) { return a + t * (b - a); }
    function grad(hash, x, y) {
        const h = hash & 3;
        const u = h < 2 ? x : y;
        const v = h < 2 ? y : x;
        return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
    }

    function noise2D(x, y) {
        const xi = Math.floor(x) & 255;
        const yi = Math.floor(y) & 255;
        const xf = x - Math.floor(x);
        const yf = y - Math.floor(y);
        const u = fade(xf);
        const v = fade(yf);
        const aa = perm[perm[xi] + yi];
        const ab = perm[perm[xi] + yi + 1];
        const ba = perm[perm[xi + 1] + yi];
        const bb = perm[perm[xi + 1] + yi + 1];
        return lerp(
            lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
            lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
            v
        );
    }

    // ── Mouse Tracking ───────────────────────────────────────────────────────
    let mouseX = -1000, mouseY = -1000;
    let targetMouseX = -1000, targetMouseY = -1000;
    let mouseActive = false;

    window.addEventListener('mousemove', (e) => {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
        mouseActive = true;
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        mouseActive = false;
    });

    // ── Aurora Gradient Blobs ────────────────────────────────────────────────
    class AuroraBlob {
        constructor(hue1, hue2, size, speed, xBase, yBase) {
            this.hue1 = hue1;
            this.hue2 = hue2;
            this.size = size;
            this.speed = speed;
            this.xBase = xBase;
            this.yBase = yBase;
            this.noiseOffsetX = Math.random() * 1000;
            this.noiseOffsetY = Math.random() * 1000;
            this.phase = Math.random() * Math.PI * 2;
        }

        draw(t) {
            const nx = noise2D(this.noiseOffsetX + t * this.speed, 0.5);
            const ny = noise2D(0.5, this.noiseOffsetY + t * this.speed);
            
            const x = this.xBase * W + nx * W * 0.3;
            const y = this.yBase * H + ny * H * 0.3;
            
            const breathe = 1 + Math.sin(t * 0.5 + this.phase) * 0.15;
            const radius = this.size * Math.min(W, H) * 0.5 * breathe;

            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            
            const hueShift = Math.sin(t * 0.3 + this.phase) * 20;
            const alpha1 = 0.06 + Math.sin(t * 0.4 + this.phase) * 0.025;
            const alpha2 = 0.03 + Math.sin(t * 0.3 + this.phase + 1) * 0.015;
            
            gradient.addColorStop(0, `hsla(${this.hue1 + hueShift}, 85%, 55%, ${alpha1})`);
            gradient.addColorStop(0.4, `hsla(${this.hue2 + hueShift}, 80%, 45%, ${alpha2})`);
            gradient.addColorStop(1, 'hsla(0, 0%, 0%, 0)');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, W, H);
        }
    }

    const auroraBlobs = [
        // Main purple aurora — top right
        new AuroraBlob(270, 290, 0.9, 0.12, 0.75, 0.15),
        // Cyan/teal accent — bottom left
        new AuroraBlob(185, 200, 0.7, 0.1, 0.2, 0.8),
        // Pink/magenta pulse — center
        new AuroraBlob(320, 340, 0.65, 0.08, 0.5, 0.45),
        // Deep blue — top left
        new AuroraBlob(230, 250, 0.8, 0.15, 0.15, 0.2),
        // Orange/warm accent — bottom right
        new AuroraBlob(25, 45, 0.5, 0.09, 0.85, 0.75),
        // Electric violet — center-right
        new AuroraBlob(280, 310, 0.55, 0.11, 0.65, 0.55),
    ];

    // ── Particle System ──────────────────────────────────────────────────────
    const PARTICLE_COUNT = window.innerWidth <= 768 ? 45 : 90;
    const particles = [];

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.z = Math.random() * 0.5 + 0.5; // depth (0.5–1)
            this.vx = (Math.random() - 0.5) * 0.15;
            this.vy = (Math.random() - 0.5) * 0.15;
            this.baseAlpha = Math.random() * 0.35 + 0.1;
            this.size = Math.random() * 1.5 + 0.5;
            this.pulseSpeed = Math.random() * 2 + 0.5;
            this.pulsePhase = Math.random() * Math.PI * 2;
            // Color: pick from palette
            const hues = [270, 290, 200, 320, 240, 30];
            this.hue = hues[Math.floor(Math.random() * hues.length)];
        }

        update(t) {
            this.x += this.vx;
            this.y += this.vy;

            // Subtle noise-based drift
            const nx = noise2D(this.x * 0.003 + t * 0.1, this.y * 0.003);
            const ny = noise2D(this.y * 0.003, this.x * 0.003 + t * 0.1);
            this.x += nx * 0.3;
            this.y += ny * 0.3;

            // Mouse repulsion / attraction
            if (mouseActive) {
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 180) {
                    const force = (180 - dist) / 180 * 0.4;
                    this.x += dx / dist * force;
                    this.y += dy / dist * force;
                }
            }

            // Wrap around
            if (this.x < -20) this.x = W + 20;
            if (this.x > W + 20) this.x = -20;
            if (this.y < -20) this.y = H + 20;
            if (this.y > H + 20) this.y = -20;
        }

        draw(t) {
            const pulse = Math.sin(t * this.pulseSpeed + this.pulsePhase) * 0.5 + 0.5;
            const alpha = this.baseAlpha * (0.6 + pulse * 0.4);
            const size = this.size * this.z * (0.85 + pulse * 0.15);

            // Glow
            ctx.beginPath();
            ctx.arc(this.x, this.y, size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${alpha * 0.15})`;
            ctx.fill();

            // Core
            ctx.beginPath();
            ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 80%, 75%, ${alpha})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    // ── Connection Lines ─────────────────────────────────────────────────────
    const CONNECTION_DIST = 120;
    const MAX_CONNECTIONS = window.innerWidth <= 768 ? 30 : 80;

    function drawConnections() {
        let count = 0;
        for (let i = 0; i < particles.length && count < MAX_CONNECTIONS; i++) {
            for (let j = i + 1; j < particles.length && count < MAX_CONNECTIONS; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECTION_DIST) {
                    const alpha = (1 - dist / CONNECTION_DIST) * 0.08;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `hsla(270, 60%, 65%, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                    count++;
                }
            }
        }
    }

    // ── Mouse Glow Effect ────────────────────────────────────────────────────
    function drawMouseGlow() {
        if (!mouseActive) return;

        const gradient = ctx.createRadialGradient(
            mouseX, mouseY, 0,
            mouseX, mouseY, 250
        );
        gradient.addColorStop(0, 'hsla(270, 80%, 60%, 0.06)');
        gradient.addColorStop(0.3, 'hsla(290, 70%, 50%, 0.03)');
        gradient.addColorStop(1, 'hsla(0, 0%, 0%, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);
    }

    // ── Flowing Grid / Mesh Lines ────────────────────────────────────────────
    function drawFlowingMesh(t) {
        const spacing = 60;
        const cols = Math.ceil(W / spacing) + 2;
        const rows = Math.ceil(H / spacing) + 2;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.012)';
        ctx.lineWidth = 0.5;

        // Horizontal flowing lines
        for (let r = 0; r < rows; r++) {
            ctx.beginPath();
            for (let c = 0; c <= cols; c++) {
                const x = c * spacing;
                const y = r * spacing + noise2D(c * 0.08 + t * 0.15, r * 0.08) * 12;
                if (c === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        // Vertical flowing lines
        for (let c = 0; c < cols; c++) {
            ctx.beginPath();
            for (let r = 0; r <= rows; r++) {
                const x = c * spacing + noise2D(r * 0.08, c * 0.08 + t * 0.15) * 12;
                const y = r * spacing;
                if (r === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
    }

    // ── Shooting Stars (occasional) ──────────────────────────────────────────
    class ShootingStar {
        constructor() {
            this.reset();
        }

        reset() {
            this.active = false;
            this.timer = Math.random() * 400 + 200; // frames until next
        }

        trigger() {
            this.active = true;
            this.x = Math.random() * W * 0.8;
            this.y = Math.random() * H * 0.3;
            this.angle = Math.PI * 0.15 + Math.random() * Math.PI * 0.15;
            this.speed = 4 + Math.random() * 4;
            this.length = 60 + Math.random() * 80;
            this.life = 1;
            this.decay = 0.015 + Math.random() * 0.01;
            const hues = [270, 200, 320, 45];
            this.hue = hues[Math.floor(Math.random() * hues.length)];
        }

        update() {
            if (!this.active) {
                this.timer--;
                if (this.timer <= 0) this.trigger();
                return;
            }

            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.life -= this.decay;

            if (this.life <= 0) {
                this.reset();
            }
        }

        draw() {
            if (!this.active) return;

            const tailX = this.x - Math.cos(this.angle) * this.length * this.life;
            const tailY = this.y - Math.sin(this.angle) * this.length * this.life;

            const gradient = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
            gradient.addColorStop(0, `hsla(${this.hue}, 80%, 70%, 0)`);
            gradient.addColorStop(0.6, `hsla(${this.hue}, 80%, 70%, ${this.life * 0.3})`);
            gradient.addColorStop(1, `hsla(${this.hue}, 90%, 85%, ${this.life * 0.5})`);

            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Bright head glow
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 90%, 85%, ${this.life * 0.6})`;
            ctx.fill();
        }
    }

    const shootingStars = [new ShootingStar(), new ShootingStar(), new ShootingStar()];

    // ── Animation Loop ───────────────────────────────────────────────────────
    let rafId = null;
    let isVisible = !document.hidden;
    let startTime = performance.now();

    document.addEventListener('visibilitychange', () => {
        isVisible = !document.hidden;
        if (isVisible && !rafId) {
            startTime = performance.now() - lastT * 1000;
            rafId = requestAnimationFrame(tick);
        }
    });

    let lastT = 0;

    function tick(timestamp) {
        if (!isVisible) { rafId = null; return; }
        rafId = requestAnimationFrame(tick);

        const t = (timestamp - startTime) / 1000;
        lastT = t;

        // Smooth mouse interpolation
        mouseX += (targetMouseX - mouseX) * 0.08;
        mouseY += (targetMouseY - mouseY) * 0.08;

        // Clear with solid black
        ctx.fillStyle = '#050508';
        ctx.fillRect(0, 0, W, H);

        // Layer 1: Flowing mesh grid
        drawFlowingMesh(t);

        // Layer 2: Aurora gradient blobs
        ctx.globalCompositeOperation = 'screen';
        for (const blob of auroraBlobs) {
            blob.draw(t);
        }
        ctx.globalCompositeOperation = 'source-over';

        // Layer 3: Mouse glow
        ctx.globalCompositeOperation = 'screen';
        drawMouseGlow();
        ctx.globalCompositeOperation = 'source-over';

        // Layer 4: Particle connections
        drawConnections();

        // Layer 5: Particles
        for (const p of particles) {
            p.update(t);
            p.draw(t);
        }

        // Layer 6: Shooting stars
        for (const star of shootingStars) {
            star.update();
            star.draw();
        }

        // Layer 7: Vignette overlay
        const vignette = ctx.createRadialGradient(
            W / 2, H / 2, W * 0.25,
            W / 2, H / 2, W * 0.75
        );
        vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vignette.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, W, H);
    }

    // Kick off
    rafId = requestAnimationFrame(tick);

    // ── Cleanup ──────────────────────────────────────────────────────────────
    window.addEventListener('pagehide', () => {
        if (rafId) cancelAnimationFrame(rafId);
    });

})();
