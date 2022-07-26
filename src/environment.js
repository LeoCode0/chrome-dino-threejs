import * as THREE from "three";

export const createFloor = (scene) => {
  const geometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
  const texture = new THREE.TextureLoader().load("sand.png");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(100, 100);

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    color: 0xc4733b,
  });

  let floor = new THREE.Mesh(geometry, material);
  floor.material.side = THREE.DoubleSide;
  floor.rotation.x = -Math.PI / 2;

  floor.castShadow = false;
  floor.receiveShadow = true;

  scene.add(floor);

  return floor;
};

export const enableShadow = (renderer, light) => {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  light.castShadow = true;
};
