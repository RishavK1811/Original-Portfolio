// -----------------------------------------------------------------
// Skills 3D Sphere using Three.js & Canvas Textures (Perfect Icons)
// -----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('threejs-canvas');
    if (!container) return;

    // WAIT FOR FONTS TO LOAD (Crucial for Canvas FontAwesome)
    document.fonts.ready.then(() => {
        initThreeJSGlobe(container);
    });
});

function initThreeJSGlobe(container) {
    // SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 300; // Pulled back slightly for better view

    // Use lower-cost settings on mobile/low-end devices
    const isMobile = window.innerWidth <= 768;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
    renderer.setSize(container.clientWidth, container.clientHeight);
    // Cap pixel ratio at 1.5 to reduce GPU fill-rate pressure
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // BACKGROUND WIREFRAME GLOBE
    // Icosahedron with detail 2 gives that premium geometric/triangular globe look
    const globeGeometry = new THREE.IcosahedronGeometry(80, 2);
    const globeMaterial = new THREE.MeshBasicMaterial({
        color: 0x4a148c, // Deep purple wireframe
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // --- NIGHT SKY STARS (Background Particles) ---
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 500;
    const posArray = new Float32Array(starsCount * 3);
    for(let i = 0; i < starsCount * 3; i++) {
        // Range -500 to 500 for a massive night sky scatter
        posArray[i] = (Math.random() - 0.5) * 1000; 
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starsMaterial = new THREE.PointsMaterial({
        size: 1.5,
        color: 0xffffff,
        transparent: true,
        opacity: 0.6
    });
    const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
    starsMesh.position.z = -150; // Push stars deep into the background
    scene.add(starsMesh);

    // NOTE: bg-dot-glow tracking is handled centrally in main.js — removed duplicate here

    // ICONS GROUP (Orbiting Elements)
    const group = new THREE.Group();
    scene.add(group);

    // Definiton of Skills using FontAwesome Unicodes
    const skills = [
        { name: 'Python', unicode: '\uf3e2', color: '#306998' },
        { name: 'JavaScript', unicode: '\uf3b8', color: '#f0db4f' },
        { name: 'HTML5', unicode: '\uf13b', color: '#e34c26' },
        { name: 'CSS3', unicode: '\uf38b', color: '#264de4' },
        { name: 'Linux', unicode: '\uf17c', color: '#f8fafc' },
        { name: 'Ubuntu', unicode: '\uf31b', color: '#E95420' },
        { name: 'Networking', unicode: '\uf6ff', color: '#0ea5e9', font: '"Font Awesome 6 Free"', weight: '900' },
        { name: 'Ethical Hacking', unicode: '\uf21b', color: '#9d4edd', font: '"Font Awesome 6 Free"', weight: '900' },
        { name: 'Security', unicode: '\uf3ed', color: '#10b981', font: '"Font Awesome 6 Free"', weight: '900' },
        { name: 'Nmap', unicode: '\uf002', color: '#f59e0b', font: '"Font Awesome 6 Free"', weight: '900' },
        { name: 'Wireshark', unicode: '\uf06e', color: '#38B2AC', font: '"Font Awesome 6 Free"', weight: '900' },
        { name: 'Frontend', unicode: '\uf121', color: '#61dbfb', font: '"Font Awesome 6 Free"', weight: '900' }
    ];

    // Function to generate the exact icon look via Canvas
    function createIconTexture(skill) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        // Draw Icon
        const fontFamily = skill.font || '"Font Awesome 6 Brands"';
        const fontWeight = skill.weight || '400';
        ctx.font = `${fontWeight} 90px ${fontFamily}`;
        ctx.fillStyle = skill.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(skill.unicode, 128, 100);

        // Draw Text below icon
        ctx.font = 'bold 24px "Outfit", "Inter", sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(skill.name.toUpperCase(), 128, 180);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    const radius = 65; // Orbit distance inside the globe

    skills.forEach((skill, index) => {
        // Fibonacci sphere distribution for perfectly even mapping
        const phi = Math.acos(1 - 2 * (index + 0.5) / skills.length);
        const theta = Math.PI * (1 + Math.sqrt(5)) * index;

        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(theta) * Math.sin(phi);

        const texture = createIconTexture(skill);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(material);
        
        const baseSize = 28;
        sprite.scale.set(baseSize, baseSize, 1); 
        sprite.userData = { baseScale: baseSize, targetScale: baseSize }; // Setup for click animation
        sprite.position.set(x, y, z);
        group.add(sprite);
    });

    // CLICK ANIMATION & MOUSE TRACKING STATE
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(0, 0); // Normalized device coordinates
    let activeSprite = null;
    let activeSpriteTimer = 0;
    


    // DRAG / TOUCH INTERACTION
    let isDragging = false;
    let hasMoved = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0.2; // slight initial tilt
    let targetRotationY = 0;
    const autoRotateSpeed = 0.002;

    const updateMouseNDC = (clientX, clientY) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    container.addEventListener('mousemove', (e) => updateMouseNDC(e.clientX, e.clientY));

    const onPointerDown = (e) => {
        isDragging = true;
        hasMoved = false; // Reset movement flag for click detection
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        previousMousePosition = { x: clientX, y: clientY };
        updateMouseNDC(clientX, clientY);
        document.body.style.userSelect = 'none';
        container.style.cursor = 'grabbing';
    };

    const onPointerMove = (e) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        // Always track for glow interaction even if not dragging
        if (e.touches && e.touches.length > 0) {
            updateMouseNDC(clientX, clientY);
        }

        if (!isDragging) return;
        
        const deltaX = clientX - previousMousePosition.x;
        const deltaY = clientY - previousMousePosition.y;

        if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
            hasMoved = true;
        }

        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.008;

        // Clamp extreme X (vertical) rotations to avoid flipping upside down completely
        targetRotationX = Math.max(-1.5, Math.min(1.5, targetRotationX));

        previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = (e) => {
        isDragging = false;
        document.body.style.userSelect = '';
        container.style.cursor = 'grab';

        // CLICK DETECTION LOGIC
        if (!hasMoved) {
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(group.children);

            if (intersects.length > 0) {
                const clickedSprite = intersects[0].object;
                if (activeSprite && activeSprite !== clickedSprite) {
                    activeSprite.userData.targetScale = activeSprite.userData.baseScale;
                }
                activeSprite = clickedSprite;
                activeSprite.userData.targetScale = 52; // Enlarge significantly
                activeSpriteTimer = 80; // Hold large for ~1.3 seconds
            }
        }
    };

    container.style.cursor = 'grab';
    container.addEventListener('mousedown', onPointerDown);
    container.addEventListener('touchstart', onPointerDown, { passive: true });
    
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('mousemove', onPointerMove);
    
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);

    // Initial states
    globe.rotation.x = targetRotationX;
    group.rotation.x = targetRotationX;

    // ANIMATION LOOP — only runs when canvas is visible (IntersectionObserver)
    let rafId = null;
    let isVisible = false;

    function animate() {
        if (!isVisible) { rafId = null; return; }
        rafId = requestAnimationFrame(animate);

        // SLOWLY ANIMATE STARFIELD
        starsMesh.rotation.y += 0.0003;
        starsMesh.rotation.x += 0.0001;

        if (!isDragging) {
            targetRotationY -= autoRotateSpeed; // Continuous auto rotation
        }

        // Smooth interpolation for group rotations
        group.rotation.y += (targetRotationY - group.rotation.y) * 0.08;
        group.rotation.x += (targetRotationX - group.rotation.x) * 0.08;
        globe.rotation.y += (targetRotationY - globe.rotation.y) * 0.08;
        globe.rotation.x += (targetRotationX - globe.rotation.x) * 0.08;

        // HANDLE SPRITE CLICK ANIMATION
        if (activeSprite) {
            activeSpriteTimer--;
            if (activeSpriteTimer <= 0) {
                activeSprite.userData.targetScale = activeSprite.userData.baseScale;
                if (Math.abs(activeSprite.scale.x - activeSprite.userData.baseScale) < 0.1) {
                    activeSprite = null;
                }
            }
        }

        // Animate all sprites towards their target scale smoothly
        group.children.forEach(sprite => {
            const diff = sprite.userData.targetScale - sprite.scale.x;
            if (Math.abs(diff) > 0.01) {
                sprite.scale.x += diff * 0.15;
                sprite.scale.y = sprite.scale.x;
            }
        });

        renderer.render(scene, camera);
    }

    // Start/stop animation based on visibility
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (isVisible && !rafId) {
                rafId = requestAnimationFrame(animate);
            }
        });
    }, { threshold: 0.1 });
    observer.observe(container);

    // Also pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
        isVisible = !document.hidden && observer;
        if (isVisible && !rafId) rafId = requestAnimationFrame(animate);
    });

    // RESIZE HANDLING — debounced to avoid layout thrash
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }, 150);
    }, { passive: true });

    // Cleanup on page hide
    window.addEventListener('pagehide', () => {
        if (rafId) cancelAnimationFrame(rafId);
        observer.disconnect();
        renderer.dispose();
    });
}
