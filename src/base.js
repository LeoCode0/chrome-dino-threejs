import * as THREE from "three";

export const createCamera = () => {
  let camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(2, 5, 10);
  camera.lookAt(3, 3, 0);
  return camera;
};

export const createRenderer = () => {
  let renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x121f3d);
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);
  return renderer;
};

export const createLighting = (scene) => {
  let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.intensity = 2;
  directionalLight.position.set(2, 5, 10);

  scene.add(directionalLight);

  const light = new THREE.AmbientLight(0x7f7f7f);
  light.intensity = 1;
  scene.add(light);

  return directionalLight;
};
