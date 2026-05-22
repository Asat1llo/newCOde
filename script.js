let scene, camera, renderer, particles, geometries = [];
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0008);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    createParticles();
    createGeometries();
    createLights();

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('scroll', onScroll, false);

    animate();
}

function createParticles() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];

    for (let i = 0; i < 5000; i++) {
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 200;
        const z = (Math.random() - 0.5) * 200;
        vertices.push(x, y, z);

        const color = new THREE.Color();
        color.setHSL(Math.random(), 0.8, 0.5);
        colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function createGeometries() {
    const geometryTypes = [
        new THREE.TorusKnotGeometry(10, 3, 100, 16),
        new THREE.OctahedronGeometry(8),
        new THREE.IcosahedronGeometry(8),
        new THREE.TetrahedronGeometry(10)
    ];

    const positions = [
        { x: -30, y: 20, z: -20 },
        { x: 30, y: -20, z: -30 },
        { x: -25, y: -25, z: -25 },
        { x: 25, y: 25, z: -35 }
    ];

    geometryTypes.forEach((geom, index) => {
        const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(index * 0.25, 0.8, 0.5),
            wireframe: true,
            transparent: true,
            opacity: 0.6,
            emissive: new THREE.Color().setHSL(index * 0.25, 0.5, 0.3)
        });

        const mesh = new THREE.Mesh(geom, material);
        mesh.position.set(positions[index].x, positions[index].y, positions[index].z);
        mesh.userData = {
            rotationSpeed: {
                x: Math.random() * 0.02 - 0.01,
                y: Math.random() * 0.02 - 0.01,
                z: Math.random() * 0.02 - 0.01
            },
            floatSpeed: Math.random() * 0.01 + 0.005,
            floatOffset: Math.random() * Math.PI * 2
        };
        scene.add(mesh);
        geometries.push(mesh);
    });
}

function createLights() {
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00f5ff, 2, 100);
    pointLight1.position.set(50, 50, 50);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff00ff, 2, 100);
    pointLight2.position.set(-50, -50, 50);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x00ff88, 2, 100);
    pointLight3.position.set(0, 50, -50);
    scene.add(pointLight3);
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / 100;
    mouseY = (event.clientY - windowHalfY) / 100;
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onScroll() {
    const scrollY = window.scrollY;
    camera.position.y = -scrollY * 0.01;
    camera.rotation.x = scrollY * 0.0001;
}

function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    if (particles) {
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.001;
    }

    geometries.forEach((mesh, index) => {
        mesh.rotation.x += mesh.userData.rotationSpeed.x;
        mesh.rotation.y += mesh.userData.rotationSpeed.y;
        mesh.rotation.z += mesh.userData.rotationSpeed.z;

        mesh.position.y += Math.sin(time * mesh.userData.floatSpeed + mesh.userData.floatOffset) * 0.05;

        mesh.material.emissiveIntensity = 0.5 + Math.sin(time * 2 + index) * 0.3;
    });

    renderer.render(scene, camera);
}

function scrollToSection() {
    window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
    });
}

init();