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
        img: 'https://images.unsplash.com/photo-1529788295308-1eace7f14066?w=600&q=80'
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
        img: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80'
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
        img: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&q=80'
    }
];

const PLANET_DATA = {
    'merkür': { name: 'Merkür', dist: '91 Milyon km', travelTime: '3-6 Ay', info: 'Güneşe en yakın gezegen.', img: 'https://images.unsplash.com/photo-1614732414444-af9613f3f1a3?w=600&q=80', parent: 'Güneş Sistemi', index: 1, tex: 'textures/moon.jpg' }, // Fallback to moon tex for mercury
    'venüs': { name: 'Venüs', dist: '41 Milyon km', travelTime: '3-4 Ay', info: 'Güneş sisteminin en sıcak gezegeni.', img: 'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=600&q=80', parent: 'Güneş Sistemi', index: 1.5, tex: 'textures/venus.jpg' },
    'venus': { name: 'Venüs', dist: '41 Milyon km', travelTime: '3-4 Ay', info: 'Güneş sisteminin en sıcak gezegeni.', img: 'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=600&q=80', parent: 'Güneş Sistemi', index: 1.5, tex: 'textures/venus.jpg' },
    'dünya': { name: 'Dünya', dist: '0 km', travelTime: '0 (Buradasınız)', info: 'Yaşamın bilinen tek adresi.', img: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bac4?w=600&q=80', parent: 'Güneş Sistemi', index: 2, tex: 'textures/earth.jpg' },
    'earth': { name: 'Dünya', dist: '0 km', travelTime: '0 (Buradasınız)', info: 'Yaşamın bilinen tek adresi.', img: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bac4?w=600&q=80', parent: 'Güneş Sistemi', index: 2, tex: 'textures/earth.jpg' },
    'ay': { name: 'Ay', dist: '384.400 km', travelTime: '3 Gün', info: 'Dünyanın doğal uydusu.', img: 'https://images.unsplash.com/photo-1522030239044-dd671f3e748d?w=600&q=80', parent: 'Güneş Sistemi', index: 2.2, tex: 'textures/moon.jpg' },
    'moon': { name: 'Ay', dist: '384.400 km', travelTime: '3 Gün', info: 'Dünyanın doğal uydusu.', img: 'https://images.unsplash.com/photo-1522030239044-dd671f3e748d?w=600&q=80', parent: 'Güneş Sistemi', index: 2.2, tex: 'textures/moon.jpg' },
    'mars': { name: 'Mars', dist: '78 Milyon km', travelTime: '6-9 Ay', info: 'Kızıl gezegen.', img: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&q=80', parent: 'Güneş Sistemi', index: 3, tex: 'textures/mars.jpg' },
    'jüpiter': { name: 'Jüpiter', dist: '628 Milyon km', travelTime: '6 Yıl', info: 'Dev gaz devi.', img: 'https://images.unsplash.com/photo-1630839437035-dac17da580d0?w=600&q=80', parent: 'Güneş Sistemi', index: 4, tex: 'textures/jupiter.jpg' },
    'jupiter': { name: 'Jüpiter', dist: '628 Milyon km', travelTime: '6 Yıl', info: 'Dev gaz devi.', img: 'https://images.unsplash.com/photo-1630839437035-dac17da580d0?w=600&q=80', parent: 'Güneş Sistemi', index: 4, tex: 'textures/jupiter.jpg' }
};

const PARAMS = { count: 250000, size: 0.008, radius: 12, branches: 4, spin: 0.8, randomness: 0.25, randomnessPower: 3, insideColor: '#ffbb77', outsideColor: '#3d61ff' };

let scene, camera, renderer, controls, composer, textureLoader, bloomPass;
let galaxyPoints, raycaster, mouse;
let infoPanel, starNameEl, distanceEl, systemTypeEl, planetListEl, regionDescEl, starImgEl, travelTimeEl;
let systemGroup;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.set(15, 10, 15);
    const canvas = document.querySelector('#galaxy-canvas');
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ReinhardToneMapping;
    textureLoader = new THREE.TextureLoader();
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.0, 0.4, 0.85);
    composer.addPass(bloomPass);

    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.autoRotate = true;
    raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 0.05;
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

function createGalaxy() {
    const geometry = new THREE.BufferGeometry();
    const pos = new Float32Array(PARAMS.count * 3), col = new Float32Array(PARAMS.count * 3);
    const cIn = new THREE.Color(PARAMS.insideColor), cOut = new THREE.Color(PARAMS.outsideColor);
    for (let i = 0; i < PARAMS.count; i++) {
        const i3 = i * 3, r = Math.random() * PARAMS.radius, s = r * PARAMS.spin, b = (i % PARAMS.branches) / PARAMS.branches * Math.PI * 2;
        pos[i3] = Math.cos(b + s) * r + Math.pow(Math.random(), 3) * (Math.random()<0.5?1:-1) * 0.25 * r;
        pos[i3+1] = Math.pow(Math.random(), 3) * (Math.random()<0.5?1:-1) * 0.25 * r * 0.4;
        pos[i3+2] = Math.sin(b + s) * r + Math.pow(Math.random(), 3) * (Math.random()<0.5?1:-1) * 0.25 * r;
        const c = cIn.clone().lerp(cOut, r / PARAMS.radius);
        col[i3] = c.r; col[i3+1] = c.g; col[i3+2] = c.b;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(col, 3));
    galaxyPoints = new THREE.Points(geometry, new THREE.PointsMaterial({ size: PARAMS.size, blending: THREE.AdditiveBlending, vertexColors: true, transparent: true, opacity: 0.7 }));
    scene.add(galaxyPoints);
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
        const sun = new THREE.Mesh(new THREE.SphereGeometry(0.12, 32, 32), new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 1 }));
        systemGroup.add(sun); systemGroup.add(new THREE.PointLight(0xffffff, 2, 10));
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
    scene.children.forEach(c => { if(c.name === "RealStar") c.visible = false; });
    starNameEl.innerText = planetData.name; distanceEl.innerText = planetData.dist; systemTypeEl.innerText = 'Gezegen'; travelTimeEl.innerText = planetData.travelTime;
    planetListEl.innerHTML = `<li>${planetData.name} (Hedef)</li>`; regionDescEl.innerText = planetData.info;
    if(planetData.img) { starImgEl.src = planetData.img; starImgEl.classList.remove('hidden'); }
    infoPanel.classList.remove('hidden');
    gsap.to(camera.position, { x: starPos.x + 0.3, y: starPos.y + 0.1, z: starPos.z + 0.3, duration: 2 });
    gsap.to(controls.target, { x: starPos.x, y: starPos.y, z: starPos.z, duration: 2 });
}

function zoomTo(pos, data) {
    bloomPass.strength = 1.0;
    controls.autoRotate = false; updateLocalSystem(data); systemGroup.position.copy(pos); systemGroup.visible = true;
    galaxyPoints.visible = true;
    scene.children.forEach(c => { if(c.name === "RealStar") c.visible = true; });
    starNameEl.innerText = data.name; systemTypeEl.innerText = data.type; travelTimeEl.innerText = data.travelTime;
    distanceEl.innerText = data.name === 'Güneş Sistemi' ? '0 km' : (pos.distanceTo(new THREE.Vector3(7.8,0,2.5)) * 2500).toFixed(0) + " Işık Yılı";
    planetListEl.innerHTML = data.planets.map(p => `<li>${p}</li>`).join(''); regionDescEl.innerText = data.info;
    if(data.img) { starImgEl.src = data.img; starImgEl.classList.remove('hidden'); } else starImgEl.classList.add('hidden');
    infoPanel.classList.remove('hidden');
    gsap.to(camera.position, { x: pos.x+1, y: pos.y+0.5, z: pos.z+1, duration: 2 });
    gsap.to(controls.target, { x: pos.x, y: pos.y, z: pos.z, duration: 2 });
}

function resetView() { bloomPass.strength = 1.0; infoPanel.classList.add('hidden'); systemGroup.visible = false; galaxyPoints.visible = true; scene.children.forEach(c => { if(c.name === "RealStar") c.visible = true; }); controls.autoRotate = true; gsap.to(camera.position, { x: 15, y: 10, z: 15, duration: 2 }); gsap.to(controls.target, { x: 0, y: 0, z: 0, duration: 2 }); }
function onMouseMove(e) { mouse.x = (e.clientX/window.innerWidth)*2-1; mouse.y = -(e.clientY/window.innerHeight)*2+1; }
function onWindowResize() { camera.aspect = window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); composer.setSize(window.innerWidth, window.innerHeight); }
function animate() { requestAnimationFrame(animate); controls.update(); if(systemGroup.visible) systemGroup.rotation.y += 0.005; composer.render(); }
init();
