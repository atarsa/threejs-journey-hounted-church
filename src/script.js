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

const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load(
  '/textures/door/ambientOcclusion.jpg'
);
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg');
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg');
const bricksAmbientOclusionTexture = textureLoader.load(
  '/textures/bricks/ambientOcclusion.jpg'
);
const bricksRoughnessTexture = textureLoader.load(
  '/textures/bricks/roughness.jpg'
);

const windowColorTexture = textureLoader.load('/textures/window/color.jpg');
const windowAlphaTexture = textureLoader.load('/textures/window/alpha.jpg');
const windowAmbientOcclusionTexture = textureLoader.load(
  '/textures/window/ambientOcclusion.jpg'
);
const windowHeightTexture = textureLoader.load('/textures/window/height.png');
const windowNormalTexture = textureLoader.load('/textures/window/normal.jpg');
const windowRoughnessTexture = textureLoader.load(
  '/textures/window/roughness.jpg'
);
const windowMetalnessTexture = textureLoader.load(
  '/textures/window/metallic.jpg'
);

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg');
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg');
const grassAmbientOclusionTexture = textureLoader.load(
  '/textures/grass/ambientOcclusion.jpg'
);
const grassRoughnessTexture = textureLoader.load(
  '/textures/grass/roughness.jpg'
);

grassColorTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassAmbientOclusionTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOclusionTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOclusionTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

/**
 * Church
 */
const church = new THREE.Group();
church.position.z = 3;
scene.add(church);

// Walls
const brickMaterial = new THREE.MeshStandardMaterial({
  map: bricksColorTexture,
  aoMap: bricksAmbientOclusionTexture,
  normalMap: bricksNormalTexture,
  roughnessMap: bricksRoughnessTexture,
});
const walls1 = new THREE.Mesh(
  new THREE.BoxBufferGeometry(2.5, 7, 3),
  brickMaterial
);
walls1.position.y = 7 / 2;
walls1.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(walls1.geometry.attributes.uv.array, 2)
);
// important to make ambient oclussion map working!!
const walls2 = new THREE.Mesh(
  new THREE.BoxBufferGeometry(7, 4, 5.5),
  brickMaterial
);
walls2.position.y = 4 / 2;
// walls2.position.x = 2.5 / 2;
walls2.position.z = -3.5;
walls2.rotation.y = Math.PI * 0.5;

walls2.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(walls2.geometry.attributes.uv.array, 2)
);
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
  new THREE.PlaneBufferGeometry(2.2, 3, 10, 10),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    // metalnessMap: doorMetalnessTexture,
    // roughnessMap: doorRoughnessTexture,
  })
);

door.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
); // important to make ambient oclussion map working!!
door.position.y = 1.4;
door.position.z = 1.51;

church.add(door);

// Windows
// order: window side east 1, window side east 2, window side west 3, window side west 1, window side west 2, window side west 3,
const windowsPositions = [
  [2.76, 2.5, -1.5],
  [2.76, 2.5, -3.5],
  [2.76, 2.5, -5.5],
  [-2.76, 2.5, -1.5],
  [-2.76, 2.5, -3.5],
  [-2.76, 2.5, -5.5],
];

const windowsYRotation = [
  Math.PI * 0.5,
  Math.PI * 0.5,
  Math.PI * 0.5,
  -Math.PI * 0.5,
  -Math.PI * 0.5,
  -Math.PI * 0.5,
];
const windowGeometry = new THREE.PlaneBufferGeometry(1, 2);
const windowMaterial = new THREE.MeshStandardMaterial({
  // map: windowColorTexture,
  color: '#152238',
  transparent: true,
  alphaMap: windowAlphaTexture,
  normalMap: windowNormalTexture,
  aoMap: windowAmbientOcclusionTexture,
  roughnessMap: windowRoughnessTexture,
  metalnessMap: windowMetalnessTexture,
  displacementMap: windowHeightTexture,
});

for (let i = 0; i < windowsPositions.length; i++) {
  const churchWindow = new THREE.Mesh(windowGeometry, windowMaterial);
  churchWindow.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(
      churchWindow.geometry.attributes.uv.array,
      2
    )
  );
  churchWindow.position.set(...windowsPositions[i]); // spread values from the array

  churchWindow.rotation.y = windowsYRotation[i];
  church.add(churchWindow);
}

const belfry = new THREE.Mesh(
  new THREE.BoxBufferGeometry(0.75, 1.25, 3.1),
  new THREE.MeshStandardMaterial({ color: '#262837' })
);
belfry.position.set(0, 6, 0.01);
church.add(belfry);

// Lamp
const lamp = new THREE.Mesh(
  new THREE.CylinderGeometry(0.15, 0.15, 0.3, 6),
  new THREE.MeshBasicMaterial({
    color: '#ff7d46',
    opacity: 0.8,
    transparent: true,
  })
);
lamp.position.set(0, 3, 1.6);
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

// church.add(bush1, bush2, bush3, bush4);

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
  grave.castShadow = true;
  graves.add(grave);
}

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(60, 40),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);

floor.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);

floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;

scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12);
// gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12);
moonLight.position.set(4, 5, -2);
// gui.add(moonLight, 'intensity').min(0).max(1).step(0.001);
// gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001);
// gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001);
// gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001);
scene.add(moonLight);

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
doorLight.position.set(0, 3, 2.2);
church.add(doorLight);

// walls light
const leftWallLight = new THREE.PointLight('#ff7d46', 0.5, 7);
leftWallLight.position.set(-4, 4, -3);
church.add(leftWallLight);

const rightWallLight = new THREE.PointLight('#ff7d46', 0.5, 7);
rightWallLight.position.set(4, 4, -3);
church.add(rightWallLight);

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3);
scene.add(ghost1);

const ghost2 = new THREE.PointLight('#ffff00', 2, 3);
scene.add(ghost2);

const ghost3 = new THREE.PointLight('#00ffff', 2, 3);
scene.add(ghost3);
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
camera.position.set(4, 5, 17);

scene.add(camera);

const cameraFolder = gui.addFolder('Camera');
cameraFolder.add(camera.position, 'x').min(0).max(15).step(1);
cameraFolder.add(camera.position, 'y').min(0).max(15).step(1);
cameraFolder.add(camera.position, 'z').min(0).max(25).step(1);
cameraFolder.open();
// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.minPolarAngle = 0
controls.maxPolarAngle = Math.PI/2 ;


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor('#262837');

/**
 * Shadows
 */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

moonLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls1.castShadow = true;
walls2.castShadow = true;

bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

floor.receiveShadow = true;

moonLight.shadow.mapSize.width = 256;
moonLight.shadow.mapSize.height = 256;
moonLight.shadow.camera.far = 15;

doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // update ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 7;
  ghost1.position.y = Math.sin(ghost1Angle) * 2;
  ghost1.position.z = Math.sin(ghost1Angle) * 7;

  const ghost2Angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 7;
  ghost2.position.y = Math.sin(ghost2Angle) * 3 + Math.sin(ghost2Angle * 2.5);
  ghost2.position.z = Math.sin(ghost2Angle) * 7;

  const ghost3Angle = elapsedTime * 0.18;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (10 + Math.sin(elapsedTime * 0.32));
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2);
  ghost3.position.z =
    Math.sin(ghost3Angle) * (10 + Math.sin(elapsedTime * 0.52));
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
