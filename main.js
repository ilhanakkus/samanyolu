import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import gsap from 'gsap';

// --- Bilimsel Veriler ---
const REAL_STARS = [
    { 
        name: 'Güneş Sistemi', 
        aliases: ['güneş', 'sun', 'solar system'], 
        dist: 0, 
        pos: { x: 7.8, y: 0, z: 2.5 }, 
        type: 'G2V Sarı Cüce', 
        travelTime: '8.3 Dakika (Işık Hızıyla)',
        planets: ['Merkür', 'Venüs', 'Dünya', 'Mars', 'Jüpiter', 'Satürn', 'Uranüs', 'Neptün'], 
        info: 'Samanyolu\'nun Orion Kolu\'nda yer alan yaşam yuvamız.',
        img: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Planets2013.jpg'
    },
    { 
        name: 'Saggitarius A*', 
        aliases: ['merkez', 'kara delik', 'center', 'black hole', 'sagittarius'], 
        dist: 26000, 
        pos: { x: 0, y: 0, z: 0 }, 
        type: 'Süper Kütleli Kara Delik', 
        travelTime: '26.000 Yıl (Işık Hızıyla)',
        planets: ['S-Yıldızları'], 
        info: 'Galaksimizin kalbindeki devasa kara delik.',
        img: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Sagittarius_A%2A_%282022_crop%29.jpg'
    },
    { 
        name: 'Proxima Centauri', 
        aliases: ['proksima', 'en yakın yıldız'], 
        dist: 4.24, 
        pos: { x: 7.82, y: 0.001, z: 2.51 }, 
        type: 'M5.5 Kızıl Cüce', 
        travelTime: '4.2 Yıl (Işık Hızıyla)',
        planets: ['Proxima b'], 
        info: 'Güneş\'e en yakın yıldız.',
        img: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Proxima_Centauri_2.jpg'
    }
];

const PLANET_DATA = {
    'merkür': { name: 'Merkür', dist: '91 Milyon km', travelTime: '3-6 Ay', info: 'Güneşe en yakın gezegen.', img: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg', parent: 'Güneş Sistemi', index: 1, tex: '/textures/moon.jpg' }, 
    'venüs': { name: 'Venüs', dist: '41 Milyon km', travelTime: '3-4 Ay', info: 'Güneş sisteminin en sıcak gezegeni.', img: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg', parent: 'Güneş Sistemi', index: 1.5, tex: '/textures/venus.jpg' },
    'venus': { name: 'Venüs', dist: '41 Milyon km', travelTime: '3-4 Ay', info: 'Güneş sisteminin en sıcak gezegeni.', img: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg', parent: 'Güneş Sistemi', index: 1.5, tex: '/textures/venus.jpg' },
    'dünya': { name: 'Dünya', dist: '0 km', travelTime: '0 (Buradasınız)', info: 'Yaşamın bilinen tek adresi.', img: 'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg', parent: 'Güneş Sistemi', index: 2, tex: '/textures/earth.jpg' },
    'earth': { name: 'Dünya', dist: '0 km', travelTime: '0 (Buradasınız)', info: 'Yaşamın bilinen tek adresi.', img: 'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg', parent: 'Güneş Sistemi', index: 2, tex: '/textures/earth.jpg' },
    'ay': { name: 'Ay', dist: '384.400 km', travelTime: '3 Gün', info: 'Dünyanın doğal uydusu.', img: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg', parent: 'Güneş Sistemi', index: 2.2, tex: '/textures/moon.jpg' },
    'moon': { name: 'Ay', dist: '384.400 km', travelTime: '3 Gün', info: 'Dünyanın doğal uydusu.', img: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg', parent: 'Güneş Sistemi', index: 2.2, tex: '/textures/moon.jpg' },
    'mars': { name: 'Mars', dist: '78 Milyon km', travelTime: '6-9 Ay', info: 'Kızıl gezegen.', img: 'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg', parent: 'Güneş Sistemi', index: 3, tex: '/textures/mars.jpg' },
    'jüpiter': { name: 'Jüpiter', dist: '628 Milyon km', travelTime: '6 Yıl', info: 'Dev gaz devi.', img: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg', parent: 'Güneş Sistemi', index: 4, tex: '/textures/jupiter.jpg' },
    'jupiter': { name: 'Jüpiter', dist: '628 Milyon km', travelTime: '6 Yıl', info: 'Dev gaz devi.', img: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg', parent: 'Güneş Sistemi', index: 4, tex: '/textures/jupiter.jpg' },
    'satürn': { name: 'Satürn', dist: '1.2 Milyar km', travelTime: '7 Yıl', info: 'Halkalı gezegen.', img: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg', parent: 'Güneş Sistemi', index: 5, tex: '/textures/saturn.jpg' },
    'saturn': { name: 'Satürn', dist: '1.2 Milyar km', travelTime: '7 Yıl', info: 'Halkalı gezegen.', img: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg', parent: 'Güneş Sistemi', index: 5, tex: '/textures/saturn.jpg' },
    'uranüs': { name: 'Uranüs', dist: '2.6 Milyar km', travelTime: '9 Yıl', info: 'Buz devi.', img: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg', parent: 'Güneş Sistemi', index: 6, tex: '/textures/uranus.jpg' },
    'uranus': { name: 'Uranüs', dist: '2.6 Milyar km', travelTime: '9 Yıl', info: 'Buz devi.', img: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg', parent: 'Güneş Sistemi', index: 6, tex: '/textures/uranus.jpg' },
    'neptün': { name: 'Neptün', dist: '4.3 Milyar km', travelTime: '12 Yıl', info: 'En uzak gezegen.', img: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg', parent: 'Güneş Sistemi', index: 7, tex: '/textures/neptune.jpg' },
    'neptune': { name: 'Neptün', dist: '4.3 Milyar km', travelTime: '12 Yıl', info: 'En uzak gezegen.', img: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg', parent: 'Güneş Sistemi', index: 7, tex: '/textures/neptune.jpg' }
};

const PARAMS = { 
    starsCount: 80000, 
    dustCount: 150000,
    radius: 16, 
    branches: 4, 
    spin: 1.5, 
    randomness: 0.25, 
    randomnessPower: 3.5, 
    coreColor: '#ffe4c4', // Warm whitish-orange core (Milky Way)
    midColor: '#00d2ff', // Cyan mid-arms
    outsideColor: '#000a33' // Deep dark blue edges
};

let scene, camera, renderer, controls, composer, textureLoader, bloomPass;
let galaxyPoints, dustPoints, raycaster, mouse;
let infoPanel, starNameEl, distanceEl, systemTypeEl, planetListEl, regionDescEl, starImgEl, travelTimeEl;
let systemGroup;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.set(20, 12, 20);
    const canvas = document.querySelector('#galaxy-canvas');
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ReinhardToneMapping;
    textureLoader = new THREE.TextureLoader();
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.6, 0.5, 0.85);
    composer.addPass(bloomPass);

    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.maxDistance = 60;
    controls.minDistance = 2;
    raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 0.2;
    mouse = new THREE.Vector2();

    infoPanel = document.getElementById('info-panel');
    starNameEl = document.getElementById('star-name');
    distanceEl = document.getElementById('distance');
    systemTypeEl = document.getElementById('system-type');
    planetListEl = document.getElementById('planet-list');
    regionDescEl = document.getElementById('region-description');
    starImgEl = document.getElementById('star-image');
    travelTimeEl = document.getElementById('travel-time');
    
    document.getElementById('star-search').addEventListener('keypress', (e) => { if(e.key === 'Enter') handleSearch(e.target.value); });
    document.getElementById('close-panel').addEventListener('click', resetView);
    window.addEventListener('click', onCanvasClick);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('keydown', (e) => { if(e.key === 'Escape') resetView(); });

    setupLocalSystem();
    createGalaxy();
    createStarSystems();
    animate();
}

function handleSearch(query) {
    const q = query.toLowerCase().trim();
    if(!q) return;
    if(PLANET_DATA[q]) {
        const p = PLANET_DATA[q];
        const parent = REAL_STARS.find(s => s.name === p.parent);
        zoomToPlanet(new THREE.Vector3(parent.pos.x, parent.pos.y, parent.pos.z), parent, p);
    } else {
        const found = REAL_STARS.find(s => s.name.toLowerCase().includes(q) || s.aliases.some(a => a.includes(q)));
        if(found) zoomTo(new THREE.Vector3(found.pos.x, found.pos.y, found.pos.z), found);
    }
}

function generateGalaxyGeometry(count) {
    const geometry = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3), col = new Float32Array(count * 3);
    const cCore = new THREE.Color(PARAMS.coreColor);
    const cMid = new THREE.Color(PARAMS.midColor);
    const cOut = new THREE.Color(PARAMS.outsideColor);
    
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        
        // Use an exponential/logarithmic distribution to cluster at center
        const r = Math.pow(Math.random(), 1.5) * PARAMS.radius;
        const spinAngle = r * PARAMS.spin;
        const branchAngle = (i % PARAMS.branches) / PARAMS.branches * Math.PI * 2;
        
        // Taper randomness towards the center for a dense core
        const taper = r / PARAMS.radius;
        const randSpread = PARAMS.randomness * taper;
        
        const randomX = Math.pow(Math.random(), PARAMS.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randSpread * r;
        const randomY = Math.pow(Math.random(), PARAMS.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randSpread * r * 0.2; // Very flat disk
        const randomZ = Math.pow(Math.random(), PARAMS.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randSpread * r;

        pos[i3] = Math.cos(branchAngle + spinAngle) * r + randomX;
        pos[i3 + 1] = randomY + (Math.random() - 0.5) * 0.1 * (1 - taper); // Central bulge thickness
        pos[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;
        
        let mixColor = new THREE.Color();
        if(taper < 0.2) {
            mixColor.copy(cCore).lerp(cMid, taper / 0.2);
        } else {
            mixColor.copy(cMid).lerp(cOut, (taper - 0.2) / 0.8);
        }
        
        col[i3] = mixColor.r; col[i3 + 1] = mixColor.g; col[i3 + 2] = mixColor.b;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return geometry;
}

function createGalaxy() {
    if(galaxyPoints) { scene.remove(galaxyPoints); galaxyPoints.geometry.dispose(); galaxyPoints.material.dispose(); }
    if(dustPoints) { scene.remove(dustPoints); dustPoints.geometry.dispose(); dustPoints.material.dispose(); }
    
    // 1. DUST CLOUDS (Large, soft, highly transparent)
    const dustGeo = generateGalaxyGeometry(PARAMS.dustCount);
    const ptCanvas = document.createElement('canvas'); ptCanvas.width = 64; ptCanvas.height = 64;
    const ctx = ptCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(255,255,255,0.4)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad; ctx.fillRect(0,0,64,64);
    const dustTex = new THREE.CanvasTexture(ptCanvas);

    dustPoints = new THREE.Points(dustGeo, new THREE.PointsMaterial({ 
        size: 0.6, // Large clouds
        sizeAttenuation: true, 
        depthWrite: false, 
        blending: THREE.AdditiveBlending, 
        vertexColors: true, 
        transparent: true, 
        opacity: 0.15,
        map: dustTex
    }));
    scene.add(dustPoints);

    // 2. SHARP STARS (Tiny, sharp, opaque)
    const starGeo = generateGalaxyGeometry(PARAMS.starsCount);
    galaxyPoints = new THREE.Points(starGeo, new THREE.PointsMaterial({ 
        size: 0.015, // Tiny pinpricks
        sizeAttenuation: true, 
        depthWrite: false, 
        blending: THREE.AdditiveBlending, 
        vertexColors: true, 
        transparent: true, 
        opacity: 0.9
    }));
    scene.add(galaxyPoints);
    
    // 3. CENTRAL BULGE GLOW (Mass Effect Core)
    const coreGlowCanvas = document.createElement('canvas'); coreGlowCanvas.width = 256; coreGlowCanvas.height = 256;
    const ctxC = coreGlowCanvas.getContext('2d');
    const gradC = ctxC.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradC.addColorStop(0, 'rgba(255, 240, 200, 1)');
    gradC.addColorStop(0.2, 'rgba(255, 210, 140, 0.7)');
    gradC.addColorStop(0.5, 'rgba(0, 180, 255, 0.2)');
    gradC.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctxC.fillStyle = gradC; ctxC.fillRect(0,0,256,256);
    const coreTex = new THREE.CanvasTexture(coreGlowCanvas);
    const coreSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: coreTex, blending: THREE.AdditiveBlending, depthWrite: false }));
    // Reduced core size so it doesn't wash out the arms
    coreSprite.scale.set(6, 6, 1);
    galaxyPoints.add(coreSprite);
}

function createStarSystems() {
    REAL_STARS.forEach(d => {
        const sprite = createStarSprite('#ffffff');
        sprite.position.set(d.pos.x, d.pos.y, d.pos.z);
        sprite.userData = d; sprite.name = "RealStar";
        scene.add(sprite);
    });
}

function createStarSprite(color) {
    const canvas = document.createElement('canvas'); canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'white'); grad.addColorStop(0.2, color); grad.addColorStop(0.4, 'transparent');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 64, 64);
    return new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), blending: THREE.AdditiveBlending }));
}

function setupLocalSystem() { systemGroup = new THREE.Group(); systemGroup.visible = false; scene.add(systemGroup); }

function updateLocalSystem(data, targetPlanet = null) {
    while(systemGroup.children.length > 0) systemGroup.remove(systemGroup.children[0]);
    if (!targetPlanet) {
        const sun = new THREE.Mesh(new THREE.SphereGeometry(0.12, 32, 32), new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 2 }));
        systemGroup.add(sun); systemGroup.add(new THREE.PointLight(0xffffff, 2, 10));
        
        // Mass Effect Style Orbital Rings
        for(let i=1; i<=6; i++) {
            const ringGeo = new THREE.RingGeometry(i*0.3, i*0.3 + 0.003, 64);
            const ringMat = new THREE.MeshBasicMaterial({ color: 0x00d2ff, side: THREE.DoubleSide, transparent: true, opacity: 0.25 });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI / 2;
            systemGroup.add(ring);
        }
    } else {
        // REAL TEXTURE FROM LOCAL PATH
        const pGeo = new THREE.SphereGeometry(0.12, 64, 64);
        const pMat = new THREE.MeshStandardMaterial({ 
            map: textureLoader.load(targetPlanet.tex),
            roughness: 0.8,
            metalness: 0.1
        });
        const p = new THREE.Mesh(pGeo, pMat);
        systemGroup.add(p);
        const light = new THREE.DirectionalLight(0xffffff, 2.5);
        light.position.set(2, 2, 2);
        systemGroup.add(light);
        systemGroup.add(new THREE.AmbientLight(0xffffff, 0.4));
    }
}

function onCanvasClick() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        const hit = intersects.find(i => i.object.name === "RealStar") || intersects[0];
        const d = hit.object.userData.name ? hit.object.userData : { name: 'Keşfedilmemiş', dist: '?', type: '?', travelTime: 'Bilinmiyor', planets: [], info: 'Kataloglanmamış.', img: '' };
        zoomTo(hit.point, d);
    }
}

function zoomToPlanet(starPos, starData, planetData) {
    bloomPass.strength = 0; 
    controls.autoRotate = false; 
    updateLocalSystem(starData, planetData); 
    systemGroup.position.copy(starPos); 
    systemGroup.visible = true;
    galaxyPoints.visible = false;
    dustPoints.visible = false;
    scene.children.forEach(c => { if(c.name === "RealStar") c.visible = false; });
    starNameEl.innerText = planetData.name; distanceEl.innerText = planetData.dist; systemTypeEl.innerText = 'Gezegen'; travelTimeEl.innerText = planetData.travelTime;
    planetListEl.innerHTML = `<li>${planetData.name} (Hedef)</li>`; regionDescEl.innerText = planetData.info;
    if(planetData.img) { starImgEl.src = planetData.img; starImgEl.classList.remove('hidden'); }
    infoPanel.classList.remove('hidden');
    gsap.to(camera.position, { x: starPos.x + 0.4, y: starPos.y + 0.1, z: starPos.z + 0.4, duration: 2.5, ease: 'power3.inOut' });
    gsap.to(controls.target, { x: starPos.x, y: starPos.y, z: starPos.z, duration: 2.5, ease: 'power3.inOut' });
}

function zoomTo(pos, data) {
    bloomPass.strength = 1.0;
    controls.autoRotate = false; updateLocalSystem(data); systemGroup.position.copy(pos); systemGroup.visible = true;
    galaxyPoints.visible = true;
    dustPoints.visible = true;
    scene.children.forEach(c => { if(c.name === "RealStar") c.visible = true; });
    starNameEl.innerText = data.name; systemTypeEl.innerText = data.type; travelTimeEl.innerText = data.travelTime;
    distanceEl.innerText = data.name === 'Güneş Sistemi' ? '0 km' : (pos.distanceTo(new THREE.Vector3(7.8,0,2.5)) * 2500).toFixed(0) + " Işık Yılı";
    planetListEl.innerHTML = data.planets.map(p => `<li>${p}</li>`).join(''); regionDescEl.innerText = data.info;
    if(data.img) { starImgEl.src = data.img; starImgEl.classList.remove('hidden'); } else starImgEl.classList.add('hidden');
    infoPanel.classList.remove('hidden');
    gsap.to(camera.position, { x: pos.x+1.5, y: pos.y+0.3, z: pos.z+1.5, duration: 2.5, ease: 'power3.inOut' });
    gsap.to(controls.target, { x: pos.x, y: pos.y, z: pos.z, duration: 2.5, ease: 'power3.inOut' });
}

function resetView() { bloomPass.strength = 1.6; infoPanel.classList.add('hidden'); systemGroup.visible = false; galaxyPoints.visible = true; dustPoints.visible = true; scene.children.forEach(c => { if(c.name === "RealStar") c.visible = true; }); controls.autoRotate = true; gsap.to(camera.position, { x: 20, y: 12, z: 20, duration: 2.5, ease: 'power3.inOut' }); gsap.to(controls.target, { x: 0, y: 0, z: 0, duration: 2.5, ease: 'power3.inOut' }); }
function onMouseMove(e) { mouse.x = (e.clientX/window.innerWidth)*2-1; mouse.y = -(e.clientY/window.innerHeight)*2+1; }
function onWindowResize() { camera.aspect = window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); composer.setSize(window.innerWidth, window.innerHeight); }
function animate() { requestAnimationFrame(animate); controls.update(); if(systemGroup.visible) systemGroup.rotation.y += 0.005; composer.render(); }
init();
