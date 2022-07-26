export const createInfoElement = () => {
  const modal = document.createElement("div");
  modal.id = "modal";
  modal.innerHTML = `
    <img src="./dino.png" alt="dino">
    <p>Presiona click y espacio para jugar</p>
  `;
  document.body.appendChild(modal);

  const deleteModal = () => {
    modal.remove();
  };

  modal.addEventListener("click", deleteModal);
};

export const gameOver = (sound) => {
  sound.play();
  let isGameOver = true;

  const advice = document.createElement("p");
  advice.classList.add("text");
  advice.classList.add("title");
  advice.innerText = "Game over";
  advice.id = "advice";

  document.body.appendChild(advice);

  return isGameOver;
};

export const restartGame = (cactusGroup) => {
  let isGameOver = false;

  cactusGroup.children.length = 0;

  const gameOverAdvice = document.getElementById("advice");
  if (gameOverAdvice) {
    gameOverAdvice.remove();
  }

  return isGameOver;
};

export const increaseScore = (score) => {
  let scoreElement = document.getElementById("score");
  if (!scoreElement) {
    scoreElement = document.createElement("p");
    scoreElement.id = "score";
    scoreElement.classList.add("text");
    document.body.appendChild(scoreElement);
  }
  scoreElement.innerText = Math.floor(score).toString().padStart(5, "0");
};

export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const randomFloat = (min, max) => {
  return Math.random() * (max - min) + min;
};
