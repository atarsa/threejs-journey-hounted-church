import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { PlaneBufferGeometry } from 'three';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Fog
const fog = new THREE.Fog('#262837', 1, 20);
scene.fog = fog;

const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

/**
 * Church
 */
const church = new THREE.Group();
church.position.z = 3;
scene.add(church);

// Walls
const walls1 = new THREE.Mesh(
  new THREE.BoxBufferGeometry(2.5, 7, 3),
  new THREE.MeshStandardMaterial({ color: '#ac8e82' })
);
walls1.position.y = 7 / 2;

const walls2 = new THREE.Mesh(
  new THREE.BoxBufferGeometry(7, 4, 5.5),
  new THREE.MeshStandardMaterial({ color: '#ac8e82' })
);
walls2.position.y = 4 / 2;
// walls2.position.x = 2.5 / 2;
walls2.position.z = -3.5;
walls2.rotation.y = Math.PI * 0.5;
church.add(walls1, walls2);

// Roof

const roofMaterial = new THREE.MeshStandardMaterial({ color: '#b35f45' });
const roof1 = new THREE.Mesh(
  new THREE.ConeBufferGeometry(2.5, 3, 4),
  roofMaterial
);

roof1.position.y = 8 + 0.5;
roof1.rotation.y = Math.PI * 0.25;

const roof2 = new THREE.Mesh(
  new THREE.ConeBufferGeometry(5, 2, 4),
  roofMaterial
);

roof2.position.y = 5;
roof2.position.z = -3.5;
roof2.rotation.y = Math.PI * 0.25;
church.add(roof1, roof2);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1.2, 3),
  new THREE.MeshStandardMaterial({ color: '#aa7b7b' })
);
door.position.y = 1;
door.position.z = 1.51;

church.add(door);

// Windows
// order: front window, window side east 1, window side east 2, window side west 3, window side west 1, window side west 2, window side west 3,
const windowsPositions = [
  [0, 5.5, 1.51],
  [2.76, 2.5, -2],
  [2.76, 2.5, -4],
  [2.76, 2.5, -6],
  [-2.76, 2.5, -2],
  [-2.76, 2.5, -4],
  [-2.76, 2.5, -6],
];

const windowsYRotation = [
  0,
  Math.PI * 0.5,
  Math.PI * 0.5,
  Math.PI * 0.5,
  -Math.PI * 0.5,
  -Math.PI * 0.5,
  -Math.PI * 0.5,
];
const windowGeometry = new THREE.PlaneBufferGeometry(0.5, 1);
const windowMaterial = new THREE.MeshStandardMaterial({ color: '#152238' });

for (let i = 0; i < windowsPositions.length; i++) {
  const churchWindow = new THREE.Mesh(windowGeometry, windowMaterial);

  churchWindow.position.set(...windowsPositions[i]); // spread values from the array

  churchWindow.rotation.y = windowsYRotation[i];
  church.add(churchWindow);
}
// Lamp
const lamp = new THREE.Mesh(
  new THREE.CylinderGeometry(0.15, 0.15, 0.3, 6),
  new THREE.MeshBasicMaterial({
    color: '#ff7d46',
    opacity: 0.8,
    transparent: true,
  })
);
lamp.position.set(0, 3, 1.8);
church.add(lamp);
// Bushes
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

church.add(bush1, bush2, bush3, bush4);

// Graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxBufferGeometry(0.6, 1.2, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' });

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 7 + Math.random() * 7;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  const y = Math.random() * 0.5;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, y, z);
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  graves.add(grave);
}

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(30, 30),
  new THREE.MeshStandardMaterial({ color: '#a9c388' })
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001);
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001);
scene.add(moonLight);

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
doorLight.position.set(0, 3, 2.2);
church.add(doorLight);
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 12;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor('#262837')

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
