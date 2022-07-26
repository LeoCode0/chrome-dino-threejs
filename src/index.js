import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { createCamera, createRenderer, createLighting } from "./base";
import { createFloor, enableShadow } from "./environment";
import {
  randomFloat,
  randomInt,
  createInfoElement,
  gameOver,
  restartGame,
  increaseScore,
} from "./utils";

import "./styles/main.css";

createInfoElement();

const scene = new THREE.Scene();
const clock = new THREE.Clock();
let trex, cactus, floor, directionalLight, renderer, camera;
let jumpSound = new Audio("jump.wav");
let gameOverSound = new Audio("gameOver.wav");
let jump = false;
let speed = 0;
let nextCactusSpawnTime = 0;
let score = 0;
let isGameOver = true;
const cactusGroup = new THREE.Group();
scene.add(cactusGroup);

camera = createCamera();
renderer = createRenderer();
directionalLight = createLighting(scene);
floor = createFloor(scene);
enableShadow(renderer, directionalLight);

const loader = new GLTFLoader();

loader.load(
  "models/t-rex.glb",
  (model) => {
    trex = model.scene;

    trex.rotation.y = 3;

    scene.add(trex);
  },
  (xhr) => {
    if (xhr.total === 0) {
      console.log("Asset loaded");
    }
  },
  (error) => {
    console.log(error.message);
  }
);

loader.load(
  "models/cactus.glb",
  (model) => {
    cactus = model.scene;
  },
  (xhr) => {
    if (xhr.total === 0) {
      console.log("Asset loaded");
    }
  },
  (error) => {
    console.log(error.message);
  }
);

const onKeyDown = () => {
  if (isGameOver) {
    isGameOver = restartGame(cactusGroup);
    score = 0;
    return;
  }
  jumpSound.play();
  jump = true;
};

document.addEventListener("keydown", onKeyDown, false);
renderer.domElement.addEventListener("touchstart", onKeyDown);

window.addEventListener(
  "resize",
  () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);

const update = (delta) => {
  if (!cactus) return;
  if (!trex) return;
  if (!floor) return;
  if (isGameOver) return;

  const TREX_JUMP_SPEED = 23;

  const CACTUS_SPAWN_X = 30;
  const CACTUS_DESTROY_X = -20;
  const CACTUS_MAX_SCALE = 1;
  const CACTUS_MIN_SCALE = 0.5;
  const CACTUS_SPAWN_MAX_INTERVAL = 3;
  const CACTUS_SPAWN_MIN_INTERVAL = 2;

  const GRAVITY = -50;
  const FLOOR_SPEED = -10;
  const SCORE_INCREASE_SPEED = 10;

  if (jump) {
    jump = false;

    if (trex.position.y == 0) {
      speed = TREX_JUMP_SPEED;
      trex.position.y = speed * delta;
    }
  }

  if (trex.position.y > 0) {
    speed += GRAVITY * delta;
    trex.position.y += speed * delta;
  } else {
    trex.position.y = 0;
  }

  if (clock.elapsedTime > nextCactusSpawnTime) {
    const interval = randomFloat(
      CACTUS_SPAWN_MIN_INTERVAL,
      CACTUS_SPAWN_MAX_INTERVAL
    );

    nextCactusSpawnTime = clock.elapsedTime + interval;

    const numCactus = randomInt(1, 4);
    for (let i = 0; i < numCactus; i++) {
      const clone = cactus.clone();
      clone.position.x = CACTUS_SPAWN_X + i;
      clone.scale.multiplyScalar(
        randomFloat(CACTUS_MIN_SCALE, CACTUS_MAX_SCALE)
      );

      cactusGroup.add(clone);
    }
  }

  for (const cactus of cactusGroup.children) {
    cactus.position.x += FLOOR_SPEED * delta;
  }

  while (
    cactusGroup.children.length > 0 &&
    cactusGroup.children[0].position.x < CACTUS_DESTROY_X // out of the screen
  ) {
    cactusGroup.remove(cactusGroup.children[0]);
  }

  const trexAABB = new THREE.Box3(
    new THREE.Vector3(-1, trex.position.y, 0),
    new THREE.Vector3(1, trex.position.y + 2, 0)
  );

  for (const cactus of cactusGroup.children) {
    const cactusAABB = new THREE.Box3();
    cactusAABB.setFromObject(cactus);

    if (cactusAABB.intersectsBox(trexAABB)) {
      isGameOver = gameOver(gameOverSound);
      return;
    }
  }

  floor.material.map.offset.add(new THREE.Vector2(delta, 0));

  trex.traverse((child) => {
    child.castShadow = true;
    child.receiveShadow = false;
  });

  score += delta * SCORE_INCREASE_SPEED;
  increaseScore(score);
};

const animate = () => {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  update(delta);

  renderer.render(scene, camera);
};
animate();
