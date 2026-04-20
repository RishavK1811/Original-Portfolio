/**
 * hero-bg.js — Performance-optimized Three.js particle background
 * for the hero section.
 *
 * Design choices for performance:
 *  - BufferGeometry (vs Geometry) — fastest possible GPU upload
 *  - PointsMaterial (no custom shaders)
 *  - Low particle count (140) + sparse connecting lines (max 120)
 *  - Tab-visibility API → pauses RAF when tab is hidden
 *  - ResizeObserver for clean canvas resize without layout thrash
 *  - Frustum-culled camera; no shadow maps, no expensive post-FX
 */

(function () {
    'use strict';

    // ── Wait for Three.js ────────────────────────────────────────────────────
    if (typeof THREE === 'undefined') {
        console.warn('hero-bg.js: Three.js not loaded yet, retrying…');
        setTimeout(arguments.callee, 200);
        return;
    }

    // ── Canvas Setup ─────────────────────────────────────────────────────────
    const heroSection = document.getElementById('home');
    if (!heroSection) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'hero-bg-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    heroSection.insertBefore(canvas, heroSection.firstChild);

    // ── Scene, Camera, Renderer ──────────────────────────────────────────────
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.z = 80;

    // On very small screens, skip the particle canvas entirely for perf
    const isMobile = window.innerWidth <= 768;
    const isTinyScreen = window.innerWidth <= 480;
    if (isTinyScreen) return; // Not worth the GPU cost on small phones

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: true,
        powerPreference: isMobile ? 'low-power' : 'default',
    });
    // Cap pixel ratio to 1.5 to reduce fill-rate pressure
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
    renderer.setClearColor(0x000000, 0);

    // ── Particles ────────────────────────────────────────────────────────────
    // Fewer particles on mobile = massive GPU savings
    const PARTICLE_COUNT = isMobile ? 60  : 140;
    const SPREAD         = 120;
    const DEPTH          = 60;
    const LINE_THRESHOLD = 22;
    const MAX_LINES      = isMobile ? 40  : 120;

    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = [];        // tiny drift per particle

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * SPREAD;
        positions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD;
        positions[i * 3 + 2] = (Math.random() - 0.5) * DEPTH;
        velocities.push({
            x: (Math.random() - 0.5) * 0.018,
            y: (Math.random() - 0.5) * 0.018,
        });
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
        color: 0x9d4edd,
        size: 0.9,
        transparent: true,
        opacity: 0.75,
        sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── Connecting Lines (dynamic, rebuilt each frame but capped) ────────────
    const lineGeo = new THREE.BufferGeometry();
    // pre-allocate maximum buffer (MAX_LINES * 2 vertices * 3 coords)
    const linePositions = new Float32Array(MAX_LINES * 6);
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setDrawRange(0, 0);  // start empty

    const lineMat = new THREE.LineSegmentsGeometry
        ? undefined   // skip if using custom lib
        : new THREE.LineBasicMaterial({
            color: 0x9d4edd,
            transparent: true,
            opacity: 0.18,
        });

    // Fallback to standard LineSegments
    const lineSegments = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
        color: 0x9d4edd,
        transparent: true,
        opacity: 0.18,
    }));
    scene.add(lineSegments);

    // ── Mouse-based subtle parallax ──────────────────────────────────────────
    let mouseNX = 0, mouseNY = 0;  // normalized -1..1

    window.addEventListener('mousemove', (e) => {
        mouseNX = (e.clientX / window.innerWidth  - 0.5) * 2;
        mouseNY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    // ── Resize Handling ──────────────────────────────────────────────────────
    function resize() {
        const w = heroSection.offsetWidth;
        const h = heroSection.offsetHeight;
        renderer.setSize(w, h, false); // false = don't set canvas CSS (CSS handles it)
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }

    const ro = new ResizeObserver(resize);
    ro.observe(heroSection);
    resize(); // initial

    // ── Animation Loop ───────────────────────────────────────────────────────
    let rafId = null;
    let isVisible = !document.hidden;

    document.addEventListener('visibilitychange', () => {
        isVisible = !document.hidden;
        if (isVisible && !rafId) rafId = requestAnimationFrame(tick);
    });

    function tick() {
        if (!isVisible) { rafId = null; return; }
        rafId = requestAnimationFrame(tick);

        const pos = particleGeo.attributes.position.array;

        // Update particle positions (drift)
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            pos[i * 3]     += velocities[i].x;
            pos[i * 3 + 1] += velocities[i].y;

            // Wrap around boundaries
            if (pos[i * 3]     >  SPREAD / 2) pos[i * 3]     = -SPREAD / 2;
            if (pos[i * 3]     < -SPREAD / 2) pos[i * 3]     =  SPREAD / 2;
            if (pos[i * 3 + 1] >  SPREAD / 2) pos[i * 3 + 1] = -SPREAD / 2;
            if (pos[i * 3 + 1] < -SPREAD / 2) pos[i * 3 + 1] =  SPREAD / 2;
        }
        particleGeo.attributes.position.needsUpdate = true;

        // Build connecting line segments (capped at MAX_LINES)
        const lp = lineGeo.attributes.position.array;
        let lineCount = 0;
        const thresh2 = LINE_THRESHOLD * LINE_THRESHOLD;

        outer:
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            for (let j = i + 1; j < PARTICLE_COUNT; j++) {
                if (lineCount >= MAX_LINES) break outer;
                const dx = pos[i * 3]     - pos[j * 3];
                const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
                const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
                if (dx * dx + dy * dy + dz * dz < thresh2) {
                    const base = lineCount * 6;
                    lp[base]     = pos[i * 3];
                    lp[base + 1] = pos[i * 3 + 1];
                    lp[base + 2] = pos[i * 3 + 2];
                    lp[base + 3] = pos[j * 3];
                    lp[base + 4] = pos[j * 3 + 1];
                    lp[base + 5] = pos[j * 3 + 2];
                    lineCount++;
                }
            }
        }
        lineGeo.setDrawRange(0, lineCount * 2);
        lineGeo.attributes.position.needsUpdate = true;

        // Subtle mouse parallax on the whole scene
        particles.rotation.x += (mouseNY * 0.04 - particles.rotation.x) * 0.03;
        particles.rotation.y += (mouseNX * 0.06 - particles.rotation.y) * 0.03;
        lineSegments.rotation.x = particles.rotation.x;
        lineSegments.rotation.y = particles.rotation.y;

        renderer.render(scene, camera);
    }

    // Kick off
    rafId = requestAnimationFrame(tick);

    // ── Cleanup on page hide (GC friendly) ──────────────────────────────────
    window.addEventListener('pagehide', () => {
        if (rafId) cancelAnimationFrame(rafId);
        ro.disconnect();
        renderer.dispose();
        particleGeo.dispose();
        particleMat.dispose();
        lineGeo.dispose();
    });

})();
