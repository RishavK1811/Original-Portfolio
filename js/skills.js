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

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
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

    // --- GLOBAL MOUSE DOT GLOW (Premium Mask Light tracking cursor) ---
    const dotGlow = document.querySelector('.bg-dot-glow');
    if (dotGlow) {
        document.addEventListener('mousemove', (e) => {
            // Apply the mask mapping directly to the client cursor position securely
            const mask = `radial-gradient(circle 120px at ${e.clientX}px ${e.clientY}px, black 0%, transparent 100%)`;
            dotGlow.style.webkitMaskImage = mask;
            dotGlow.style.maskImage = mask;
        });

        document.addEventListener('mouseleave', () => {
            const clearMask = `radial-gradient(circle 0px at 50% 50%, black 0%, transparent 100%)`;
            dotGlow.style.webkitMaskImage = clearMask;
            dotGlow.style.maskImage = clearMask;
        });
    }

    // ICONS GROUP (Orbiting Elements)
    const group = new THREE.Group();
    scene.add(group);

    // Definiton of Skills using FontAwesome Unicodes
    const skills = [
        { name: 'React', unicode: '\uf41b', color: '#61dbfb' },
        { name: 'JavaScript', unicode: '\uf3b8', color: '#f0db4f' },
        { name: 'Node.js', unicode: '\uf3d3', color: '#68a063' },
        { name: 'Python', unicode: '\uf3e2', color: '#306998' },
        { name: 'Java', unicode: '\uf4e4', color: '#f89820' },
        { name: 'Spring Boot', unicode: '\uf011', color: '#6db33f', font: '"Font Awesome 6 Free"', weight: '900' }, // Power icon
        { name: 'Docker', unicode: '\uf395', color: '#0db7ed' },
        { name: 'Git', unicode: '\uf1d3', color: '#f34f29' },
        { name: 'GitHub', unicode: '\uf09b', color: '#ffffff' },
        { name: 'CSS3', unicode: '\uf38b', color: '#264de4' },
        { name: 'HTML5', unicode: '\uf13b', color: '#e34c26' },
        { name: 'Database', unicode: '\uf1c0', color: '#4db33d', font: '"Font Awesome 6 Free"', weight: '900' },
        { name: 'Linux', unicode: '\uf17c', color: '#f8fafc' },
        { name: 'Vue.js', unicode: '\uf41f', color: '#41b883' }
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

    // ANIMATION LOOP
    function animate() {
        requestAnimationFrame(animate);

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
                    activeSprite = null; // Animation sequence finished
                }
            }
        }

        // Animate all sprites towards their target scale smoothly
        group.children.forEach(sprite => {
            const diff = sprite.userData.targetScale - sprite.scale.x;
            // Avoid endless micro-updates due to floating point comparisons.
            if (Math.abs(diff) > 0.01) {
                sprite.scale.x += diff * 0.15; // Smooth scale spring
                sprite.scale.y = sprite.scale.x; // Keep aspect ratio
            }
        });

        renderer.render(scene, camera);
    }
    animate();

    // RESIZE HANDLING
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
}
