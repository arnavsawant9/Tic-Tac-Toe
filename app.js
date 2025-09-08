let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector(".reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let pvpBtn = document.querySelector("#pvp-btn");
let aiBtn = document.querySelector("#ai-btn");
let difficultyContainer = document.querySelector("#difficulty-container");
let difficultySelect = document.querySelector("#difficulty");

let turnO = true; 
let isAI = false; 
let difficulty = "hard"; // default

let board = ["", "", "", "", "", "", "", "", ""];

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

let huPlayer = "O";
let aiPlayer = "X";

let scores = {
  X: 10,
  O: -10,
  tie: 0,
};

// ---------------- GAME LOGIC ----------------

boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    if (box.innerText === "" && !checkWinner()) {
      if (isAI) {
        // Human move
        box.innerText = huPlayer;
        board[index] = huPlayer;
        box.disabled = true;

        let result = checkWinner();
        if (result) {
          endGame(result);
          return;
        }

        // AI move (depends on difficulty)
        if (difficulty === "easy") {
          randomMove();
        } else {
          bestMove(); // hard
        }
      } else {
        // PvP mode
        if (turnO) {
          box.innerText = "O";
          board[index] = "O";
          turnO = false;
        } else {
          box.innerText = "X";
          board[index] = "X";
          turnO = true;
        }
        box.disabled = true;
        let result = checkWinner();
        if (result) endGame(result);
      }
    }
  });
});

const disableBoxes = () => {
  for (let box of boxes) box.disabled = true;
};

const enableBoxes = () => {
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].disabled = false;
    boxes[i].innerText = "";
    board[i] = "";
  }
};

const resetButton = () => {
  turnO = true;
  enableBoxes();
  msgContainer.classList.add("hide");
};

// Show winner
const endGame = (winner) => {
  if (winner === "tie") {
    msg.innerText = "It's a Tie!";
  } else {
    msg.innerText = `Winner is ${winner}`;
  }
  msgContainer.classList.remove("hide");
  disableBoxes();
};

// Check winner
function checkWinner() {
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (board.every(cell => cell !== "")) {
    return "tie";
  }
  return null;
}

// ---------------- EASY AI (RANDOM) ----------------
function randomMove() {
  let empty = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") empty.push(i);
  }
  let move = empty[Math.floor(Math.random() * empty.length)];

  board[move] = aiPlayer;
  boxes[move].innerText = aiPlayer;
  boxes[move].disabled = true;

  let result = checkWinner();
  if (result) endGame(result);
}

// ---------------- HARD AI (MINIMAX) ----------------
function bestMove() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = aiPlayer;
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  board[move] = aiPlayer;
  boxes[move].innerText = aiPlayer;
  boxes[move].disabled = true;

  let result = checkWinner();
  if (result) endGame(result);
}

function minimax(newBoard, depth, isMaximizing) {
  let result = checkWinner();
  if (result !== null) {
    return scores[result];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = aiPlayer;
        let score = minimax(newBoard, depth + 1, false);
        newBoard[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = huPlayer;
        let score = minimax(newBoard, depth + 1, true);
        newBoard[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// ---------------- MODE SWITCH ----------------
pvpBtn.addEventListener("click", () => {
  isAI = false;
  difficultyContainer.classList.add("hide");
  resetButton();
  msg.innerText = "Mode: Player vs Player";
});

aiBtn.addEventListener("click", () => {
  isAI = true;
  difficultyContainer.classList.remove("hide");
  resetButton();
  msg.innerText = "Mode: Player vs AI";
});

// Difficulty selector
difficultySelect.addEventListener("change", (e) => {
  difficulty = e.target.value;
});

newGameBtn.addEventListener("click", resetButton);
resetBtn.addEventListener("click", resetButton);
