import * as THREE from 'three';

// Global variables
let scene, camera, renderer;
let particleGeometry, particleMaterial, particleSystem;
let lineGeometry, lineMaterial, lineSegments;

const PARTICLE_COUNT = 150;
const MAX_DISTANCE = 90;
const particlesData = [];

// Mouse tracking
let mouseX = 0;
let mouseY = 0;
let targetMouseX = 0;
let targetMouseY = 0;

// Scroll tracking
let scrollY = 0;
let targetScrollY = 0;

// Initialize Three.js
export function initThree() {
  const canvas = document.getElementById('three-bg-canvas');
  if (!canvas) return;

  // Scene setup
  scene = new THREE.Scene();

  // Camera setup
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 400;

  // Renderer setup
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Create programmatical glowing particle texture
  const particleTexture = createGlowTexture();

  // Particles Setup
  particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(PARTICLE_COUNT * 3);

  const r = 500; // spread radius

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const x = Math.random() * r - r / 2;
    const y = Math.random() * r - r / 2;
    const z = Math.random() * r - r / 2;

    particlePositions[i * 3] = x;
    particlePositions[i * 3 + 1] = y;
    particlePositions[i * 3 + 2] = z;

    // Save random velocity and original positions for boundaries
    particlesData.push({
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.6,
        (Math.random() - 0.5) * 0.6,
        (Math.random() - 0.5) * 0.6
      ),
      numConnections: 0
    });
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  // Particle Material
  particleMaterial = new THREE.PointsMaterial({
    color: 0x00f2fe,
    size: 6,
    map: particleTexture,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.8,
    depthWrite: false
  });

  particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);

  // Line connections setup
  lineGeometry = new THREE.BufferGeometry();
  
  // Max possible line vertices
  const maxLines = PARTICLE_COUNT * PARTICLE_COUNT;
  const linePositions = new Float32Array(maxLines * 3);
  const lineColors = new Float32Array(maxLines * 3);

  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

  // Cybernetic gradient line material
  lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.15,
    linewidth: 1 // Note: WebGL standard ignores linewidth, always 1
  });

  lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lineSegments);

  // Event Listeners
  window.addEventListener('resize', onWindowResize);
  document.addEventListener('mousemove', onMouseMove);
  window.addEventListener('scroll', onScroll);

  // Start animation loop
  animate();
}

// Create a radial glow gradient texture on canvas
function createGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.2, 'rgba(0, 242, 254, 1)');
  grad.addColorStop(0.5, 'rgba(127, 86, 217, 0.25)');
  grad.addColorStop(1, 'rgba(6, 9, 19, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);

  return new THREE.CanvasTexture(canvas);
}

// Mouse move tracking
function onMouseMove(event) {
  targetMouseX = (event.clientX - window.innerWidth / 2);
  targetMouseY = (event.clientY - window.innerHeight / 2);
}

// Scroll tracking
function onScroll() {
  targetScrollY = window.scrollY;
}

// Window resize handler
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Smooth mouse movement interpolation
  mouseX += (targetMouseX - mouseX) * 0.05;
  mouseY += (targetScrollY * 0.2 + targetMouseY - mouseY) * 0.05;

  // Smooth scroll interpolation
  scrollY += (targetScrollY - scrollY) * 0.05;

  // Rotate scene based on mouse and scroll
  if (particleSystem) {
    particleSystem.rotation.y = mouseX * 0.0003;
    particleSystem.rotation.x = mouseY * 0.0003;
  }
  if (lineSegments) {
    lineSegments.rotation.y = mouseX * 0.0003;
    lineSegments.rotation.x = mouseY * 0.0003;
  }

  // Camera slightly shifts forward/backward depending on scroll
  camera.position.z = 400 + (scrollY * 0.05);

  const positions = particleGeometry.attributes.position.array;
  
  // Connection line buffers
  const linePositions = lineGeometry.attributes.position.array;
  const lineColors = lineGeometry.attributes.position.array;
  
  let lineCount = 0;

  // Update particle positions and compute distances
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Apply velocity drift
    positions[i * 3] += particlesData[i].velocity.x;
    positions[i * 3 + 1] += particlesData[i].velocity.y;
    positions[i * 3 + 2] += particlesData[i].velocity.z;

    // Boundary checks
    const limit = 250;
    if (Math.abs(positions[i * 3]) > limit) particlesData[i].velocity.x *= -1;
    if (Math.abs(positions[i * 3 + 1]) > limit) particlesData[i].velocity.y *= -1;
    if (Math.abs(positions[i * 3 + 2]) > limit) particlesData[i].velocity.z *= -1;
  }

  // Find connections
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const ax = positions[i * 3];
    const ay = positions[i * 3 + 1];
    const az = positions[i * 3 + 2];

    for (let j = i + 1; j < PARTICLE_COUNT; j++) {
      const bx = positions[j * 3];
      const by = positions[j * 3 + 1];
      const bz = positions[j * 3 + 2];

      // Distance squared is faster to calculate
      const dx = ax - bx;
      const dy = ay - by;
      const dz = az - bz;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < MAX_DISTANCE) {
        // Add coordinates to connection lines position buffer
        linePositions[lineCount * 3] = ax;
        linePositions[lineCount * 3 + 1] = ay;
        linePositions[lineCount * 3 + 2] = az;

        linePositions[lineCount * 3 + 3] = bx;
        linePositions[lineCount * 3 + 4] = by;
        linePositions[lineCount * 3 + 5] = bz;

        // Line fades as points get further apart
        const alpha = 1.0 - dist / MAX_DISTANCE;

        // Color gradient between Cyan (0.0, 0.95, 1.0) and Purple (0.5, 0.3, 0.8)
        lineColors[lineCount * 3] = 0.0 * alpha;
        lineColors[lineCount * 3 + 1] = 0.95 * alpha;
        lineColors[lineCount * 3 + 2] = 1.0 * alpha;

        lineColors[lineCount * 3 + 3] = 0.5 * alpha;
        lineColors[lineCount * 3 + 4] = 0.3 * alpha;
        lineColors[lineCount * 3 + 5] = 0.8 * alpha;

        lineCount += 2;
      }
    }
  }

  // Update geometry buffers
  particleGeometry.attributes.position.needsUpdate = true;
  lineGeometry.attributes.position.needsUpdate = true;
  lineGeometry.attributes.color.needsUpdate = true;

  // Limit rendering to active connections
  lineGeometry.setDrawRange(0, lineCount);

  renderer.render(scene, camera);
}

// Auto-run if document is loaded (though we export it too)
document.addEventListener('DOMContentLoaded', () => {
  initThree();
});
