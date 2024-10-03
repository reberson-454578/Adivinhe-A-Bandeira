let flags = [];
let usedFlags = new Set();
let currentFlagIndex = 1;
let correctAnswers = 0;
let currentFlag = {};
const totalFlags = 25;
const delay = 1000; // Delay de 1 segundo para a próxima bandeira

const flagElement = document.getElementById("flag");
const options = document.querySelectorAll(".option");
const currentFlagElement = document.getElementById("current-flag");
const startButton = document.getElementById("start-btn");
const endModal = document.getElementById("end-modal");
const correctCountElement = document.getElementById("correct-count");
const restartButton = document.getElementById("restart-btn");

// Telas
const initialScreen = document.getElementById("initial-screen");
const playButton = document.getElementById("play-btn");
const gameContainer = document.getElementById("game-container");

playButton.addEventListener("click", () => {
  initialScreen.style.display = "none"; // Ocultar a tela inicial
  gameContainer.style.display = "block"; // Mostrar o jogo
  loadFlags(); // Iniciar o carregamento das bandeiras
});

restartButton.addEventListener("click", restartGame);

// Função para carregar as bandeiras do arquivo JSON e pré-carregá-las
function loadFlags() {
  fetch("flags.json")
    .then((response) => response.json())
    .then((data) => {
      flags = data;
      preloadImages(flags); // Pré-carrega as imagens das bandeiras
      startGame(); // Inicia o jogo após carregar as bandeiras
    })
    .catch((error) => {
      console.error("Erro ao carregar o arquivo JSON:", error);
      initialScreen.innerHTML =
        "<p>Erro ao carregar as bandeiras. Tente novamente mais tarde.</p>";
    });
}

// Função para pré-carregar as imagens
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
  currentFlagElement.textContent = currentFlagIndex;
  startButton.disabled = true;
  nextFlag();
}

function nextFlag() {
  if (currentFlagIndex > totalFlags) {
    endGame();
    return;
  }

  let randomFlagIndex;
  do {
    randomFlagIndex = Math.floor(Math.random() * flags.length);
  } while (usedFlags.has(randomFlagIndex));

  usedFlags.add(randomFlagIndex);
  currentFlag = flags[randomFlagIndex];

  flagElement.classList.add("flag-hidden");
  setTimeout(() => {
    flagElement.src = currentFlag.flagUrl;
    flagElement.classList.remove("flag-hidden");
    flagElement.classList.add("fadeInFlag");
  }, 200); // Tempo reduzido para uma transição mais suave e rápida

  let optionsArray = getRandomOptions(currentFlag);
  shuffleArray(optionsArray);

  options.forEach((option, index) => {
    option.textContent = optionsArray[index].country;
    option.classList.remove("wrong-answer");
    option.style.backgroundColor = "#4facfe";
    option.onclick = () => checkAnswer(option, option.textContent);
  });

  currentFlagElement.textContent = currentFlagIndex;
}

function checkAnswer(optionElement, answer) {
  if (answer === currentFlag.country) {
    optionElement.style.backgroundColor = "#4caf50";
    correctAnswers++;
  } else {
    optionElement.classList.add("wrong-answer");
    optionElement.style.backgroundColor = "#ff4d4d";

    options.forEach((option) => {
      if (option.textContent === currentFlag.country) {
        option.style.backgroundColor = "#4caf50";
      }
    });
  }

  currentFlagIndex++;
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
  endModal.style.display = "block";
  startButton.disabled = false;
}

const restartInlineButton = document.getElementById("restart-btn-inline");

restartInlineButton.addEventListener("click", () => {
  restartGame();
});

// Atualizar a função restartGame para resetar o estado completo do jogo
function restartGame() {
  correctAnswers = 0;
  currentFlagIndex = 1;
  usedFlags.clear();
  currentFlagElement.textContent = currentFlagIndex;
  flagElement.src = ""; // Limpar a bandeira
  options.forEach((option) => {
    option.textContent = ""; // Limpar as opções
    option.style.backgroundColor = "#4facfe"; // Resetar cor dos botões
  });
  endModal.style.display = "none"; // Esconder o modal de fim de jogo, se estiver aberto
  startButton.disabled = true; // Garantir que o botão de iniciar continue desativado
  nextFlag(); // Começar um novo jogo
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
