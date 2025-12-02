// ============================================
// 3D GAME ENGINE - Three.js Minecraft-style
// Tạo thế giới 3D voxel với các buildings và portals
// ============================================

let scene, camera, renderer, controls;
let character, buildings = [];
let raycaster, mouse;

// Khởi tạo 3D scene
export function initGameEngine() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;
    
    // Tạo scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue
    scene.fog = new THREE.Fog(0x87CEEB, 0, 100);
    
    // Tạo camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 10, 20);
    camera.lookAt(0, 0, 0);
    
    // Tạo renderer
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(20, 30, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // Tạo ground (voxel style)
    createGround();
    
    // Tạo character (voxel style)
    createCharacter();
    
    // Tạo buildings cho các mini-games
    createGameBuildings();
    
    // Tạo sky
    createSky();
    
    // Raycaster cho click detection
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    // Event listeners
    window.addEventListener('resize', onWindowResize);
    canvas.addEventListener('click', onCanvasClick);
    canvas.addEventListener('mousemove', onMouseMove);
    
    // Bắt đầu animation loop
    animate();
}

// Tạo ground
function createGround() {
    const groundSize = 100;
    const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize);
    const groundMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x7cb342 // Voxel green
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Thêm grass blocks (voxel style)
    for (let i = -40; i <= 40; i += 2) {
        for (let j = -40; j <= 40; j += 2) {
            if (Math.random() > 0.7) {
                const block = createVoxelBlock(0x8bc34a, 0.5);
                block.position.set(i, 0.25, j);
                scene.add(block);
            }
        }
    }
}

// Tạo voxel block
function createVoxelBlock(color, size = 1) {
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshLambertMaterial({ color });
    const block = new THREE.Mesh(geometry, material);
    block.castShadow = true;
    block.receiveShadow = true;
    return block;
}

// Tạo character
function createCharacter() {
    character = new THREE.Group();
    
    // Body
    const body = createVoxelBlock(0x42a5f5, 1);
    body.position.y = 1;
    character.add(body);
    
    // Head
    const head = createVoxelBlock(0xffdbac, 0.8);
    head.position.y = 2;
    character.add(head);
    
    // Arms
    const leftArm = createVoxelBlock(0x42a5f5, 0.3);
    leftArm.position.set(-0.7, 1, 0);
    character.add(leftArm);
    
    const rightArm = createVoxelBlock(0x42a5f5, 0.3);
    rightArm.position.set(0.7, 1, 0);
    character.add(rightArm);
    
    // Legs
    const leftLeg = createVoxelBlock(0x1976d2, 0.3);
    leftLeg.position.set(-0.3, 0.3, 0);
    character.add(leftLeg);
    
    const rightLeg = createVoxelBlock(0x1976d2, 0.3);
    rightLeg.position.set(0.3, 0.3, 0);
    character.add(rightLeg);
    
    character.position.set(0, 0, 0);
    scene.add(character);
}

// Tạo buildings cho các mini-games
function createGameBuildings() {
    const gameBuildings = [
        { name: 'meditation-32', icon: '🧘', position: [-15, 0, -15], color: 0x9c27b0 },
        { name: 'memory', icon: '🧩', position: [15, 0, -15], color: 0x2196f3 },
        { name: 'breathing', icon: '💨', position: [-15, 0, 15], color: 0x00bcd4 },
        { name: 'body-scan', icon: '👁️', position: [15, 0, 15], color: 0x4caf50 },
        { name: 'whack-mole', icon: '⚡', position: [0, 0, -20], color: 0xff9800 },
        { name: 'quiz', icon: '📚', position: [0, 0, 20], color: 0xf44336 }
    ];
    
    gameBuildings.forEach(building => {
        const buildingGroup = createGameBuilding(building);
        buildings.push(buildingGroup);
        scene.add(buildingGroup);
    });
}

// Tạo building cho một game
function createGameBuilding(config) {
    const group = new THREE.Group();
    group.userData = { gameName: config.name };
    
    // Base
    const base = createVoxelBlock(config.color, 3);
    base.position.y = 1.5;
    group.add(base);
    
    // Walls
    for (let i = 0; i < 4; i++) {
        const wall = createVoxelBlock(config.color, 0.2);
        const angle = (i * Math.PI) / 2;
        wall.position.set(
            Math.cos(angle) * 1.4,
            2,
            Math.sin(angle) * 1.4
        );
        group.add(wall);
    }
    
    // Roof
    const roof = createVoxelBlock(0x8d6e63, 3.5);
    roof.position.y = 3.5;
    roof.rotation.y = Math.PI / 4;
    group.add(roof);
    
    // Portal effect (glowing ring)
    const portalGeometry = new THREE.RingGeometry(1.2, 1.5, 32);
    const portalMaterial = new THREE.MeshBasicMaterial({
        color: config.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
    });
    const portal = new THREE.Mesh(portalGeometry, portalMaterial);
    portal.position.y = 0.1;
    portal.rotation.x = -Math.PI / 2;
    group.add(portal);
    
    // Icon text (sẽ được render bằng HTML overlay)
    group.position.set(config.position[0], config.position[1], config.position[2]);
    
    // Animation
    animateBuilding(group);
    
    return group;
}

// Animate building
function animateBuilding(building) {
    const originalY = building.position.y;
    let time = 0;
    
    function animate() {
        time += 0.01;
        building.position.y = originalY + Math.sin(time) * 0.2;
        building.rotation.y += 0.005;
        
        // Portal glow effect
        const portal = building.children.find(child => child.type === 'Mesh' && child.geometry.type === 'RingGeometry');
        if (portal) {
            portal.material.opacity = 0.4 + Math.sin(time * 2) * 0.2;
        }
        
        requestAnimationFrame(animate);
    }
    animate();
}

// Tạo sky
function createSky() {
    const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
    const skyMaterial = new THREE.MeshBasicMaterial({
        color: 0x87CEEB,
        side: THREE.BackSide
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);
    
    // Clouds
    for (let i = 0; i < 20; i++) {
        const cloud = createCloud();
        cloud.position.set(
            (Math.random() - 0.5) * 200,
            50 + Math.random() * 50,
            (Math.random() - 0.5) * 200
        );
        scene.add(cloud);
    }
}

// Tạo cloud
function createCloud() {
    const cloud = new THREE.Group();
    const cloudGeometry = new THREE.SphereGeometry(5, 8, 8);
    const cloudMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });
    
    for (let i = 0; i < 5; i++) {
        const sphere = new THREE.Mesh(cloudGeometry, cloudMaterial);
        sphere.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 10
        );
        sphere.scale.set(
            1 + Math.random(),
            1 + Math.random() * 0.5,
            1 + Math.random()
        );
        cloud.add(sphere);
    }
    
    return cloud;
}

// Window resize handler
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Canvas click handler
function onCanvasClick(event) {
    const canvas = document.getElementById('game-canvas');
    const rect = canvas.getBoundingClientRect();
    
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(buildings, true);
    
    if (intersects.length > 0) {
        const building = intersects[0].object.parent;
        if (building.userData && building.userData.gameName) {
            // Trigger game
            const event = new CustomEvent('gameSelected', {
                detail: { gameName: building.userData.gameName }
            });
            window.dispatchEvent(event);
        }
    }
}

// Mouse move handler
function onMouseMove(event) {
    const canvas = document.getElementById('game-canvas');
    const rect = canvas.getBoundingClientRect();
    
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(buildings, true);
    
    if (intersects.length > 0) {
        canvas.style.cursor = 'pointer';
    } else {
        canvas.style.cursor = 'crosshair';
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate character
    if (character) {
        character.rotation.y += 0.01;
    }
    
    // Rotate camera around scene
    const time = Date.now() * 0.0005;
    camera.position.x = Math.cos(time) * 25;
    camera.position.z = Math.sin(time) * 25;
    camera.lookAt(0, 0, 0);
    
    renderer.render(scene, camera);
}

// Export để sử dụng ở file khác
export { scene, camera, renderer };

