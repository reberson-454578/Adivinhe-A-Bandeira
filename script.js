let flags = [];
let usedFlags = new Set();
let currentFlagIndex = 1;
let correctAnswers = 0;
let currentFlag = {};
const totalFlags = 25;
const delay = 950;
let hasAnswered = false;

const flagElement = document.getElementById("flag");
const options = document.querySelectorAll(".option");
const currentFlagElement = document.getElementById("current-flag");
const endModal = document.getElementById("end-modal");
const correctCountElement = document.getElementById("correct-count");
const restartButton = document.getElementById("restart-btn");
const scoreValue = document.getElementById("score-value");
const progressFill = document.getElementById("progress-fill");

const initialScreen = document.getElementById("initial-screen");
const playButton = document.getElementById("play-btn");
const gameContainer = document.getElementById("game-container");
const restartInlineButton = document.getElementById("restart-btn-inline");

playButton.addEventListener("click", () => {
  initialScreen.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  gameContainer.classList.add("show-panel");
  loadFlags();
});

restartButton.addEventListener("click", restartGame);
restartInlineButton.addEventListener("click", restartGame);

function loadFlags() {
  fetch("flags.json")
    .then((response) => response.json())
    .then((data) => {
      flags = data;
      preloadImages(flags);
      startGame();
    })
    .catch((error) => {
      console.error("Erro ao carregar o arquivo JSON:", error);
      initialScreen.classList.remove("hidden");
      gameContainer.classList.add("hidden");
      initialScreen.innerHTML =
        '<div class="mascot-badge" aria-hidden="true">⚠️</div><h1>Erro ao abrir o jogo</h1><p class="subtitle">Não foi possível carregar as bandeiras.</p><button id="reload-btn" class="primary-btn" onclick="location.reload()">Tentar novamente</button>';
    });
}

function preloadImages(flags) {
  flags.forEach((flag) => {
    const img = new Image();
    img.src = flag.flagUrl;
  });
}

function startGame() {
  correctAnswers = 0;
  currentFlagIndex = 1;
  usedFlags.clear();
  hasAnswered = false;
  endModal.classList.remove("show");
  updateHud();
  nextFlag();
}

function nextFlag() {
  if (currentFlagIndex > totalFlags) {
    endGame();
    return;
  }

  hasAnswered = false;

  let randomFlagIndex;
  do {
    randomFlagIndex = Math.floor(Math.random() * flags.length);
  } while (usedFlags.has(randomFlagIndex));

  usedFlags.add(randomFlagIndex);
  currentFlag = flags[randomFlagIndex];

  flagElement.classList.remove("flag-pop");
  flagElement.classList.add("flag-hidden");

  setTimeout(() => {
    flagElement.src = currentFlag.flagUrl;
    flagElement.classList.remove("flag-hidden");
    flagElement.classList.add("flag-pop");
  }, 180);

  let optionsArray = getRandomOptions(currentFlag);
  shuffleArray(optionsArray);

  options.forEach((option, index) => {
    option.textContent = optionsArray[index].country;
    option.classList.remove("wrong-answer", "correct-answer", "locked");
    option.disabled = false;
    option.onclick = () => checkAnswer(option, option.textContent);
  });

  updateHud();
}

function checkAnswer(optionElement, answer) {
  if (hasAnswered) return;
  hasAnswered = true;

  options.forEach((option) => {
    option.disabled = true;
    option.classList.add("locked");
  });

  if (answer === currentFlag.country) {
    optionElement.classList.add("correct-answer");
    correctAnswers++;
  } else {
    optionElement.classList.add("wrong-answer");

    options.forEach((option) => {
      if (option.textContent === currentFlag.country) {
        option.classList.add("correct-answer");
      }
    });
  }

  currentFlagIndex++;
  updateHud();

  setTimeout(() => {
    nextFlag();
  }, delay);
}

function getRandomOptions(correctFlag) {
  let optionsSet = new Set();
  optionsSet.add(correctFlag);

  while (optionsSet.size < 4) {
    const randomFlag = flags[Math.floor(Math.random() * flags.length)];
    optionsSet.add(randomFlag);
  }

  return Array.from(optionsSet);
}

function endGame() {
  correctCountElement.textContent = correctAnswers;
  endModal.classList.add("show");
  endModal.setAttribute("aria-hidden", "false");
}

function restartGame() {
  correctAnswers = 0;
  currentFlagIndex = 1;
  usedFlags.clear();
  hasAnswered = false;
  flagElement.src = "";
  options.forEach((option) => {
    option.textContent = "";
    option.classList.remove("wrong-answer", "correct-answer", "locked");
    option.disabled = false;
  });
  endModal.classList.remove("show");
  endModal.setAttribute("aria-hidden", "true");
  updateHud();
  nextFlag();
}

function updateHud() {
  currentFlagElement.textContent = Math.min(currentFlagIndex, totalFlags);
  scoreValue.textContent = correctAnswers;
  const progress = ((currentFlagIndex - 1) / totalFlags) * 100;
  progressFill.style.width = `${Math.max(0, Math.min(progress, 100))}%`;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
