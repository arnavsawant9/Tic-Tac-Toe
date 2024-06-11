let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector(".reset-btn"); // selecting those buttons
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let turnO = true; //at start the turn is of O

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

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (turnO) {
      box.innerText = "O";
      turnO = false; // this ensures that once O played then X plays!
    } else {
      box.innerText = "X";
      turnO = true;
    }
    box.disabled = true; // after X is on the box and O wants to play so it cant make X as O

    checkWinner(); // after every button is clicked it will check if there is a winner or not
  }); // after clicking each box
});

const disableBoxes = () => {
  for (let box of boxes) {
    box.disabled = true; // so that after we get one winner, you cant click all boxes again
  }
};

const enableBoxes = () => {
  for (let box of boxes) {
    box.disabled = false; // so that after we get one winner, you cant click all boxes again
    box.innerText = "";
  }
};

const resetButton = () => {
  turnO = true;
  enableBoxes();
  msgContainer.classList.add("hide");
};

const showWinner = (pos1Val) => {
  msg.innerText = `Congratulations Winner is ${pos1Val}`;
  msgContainer.classList.remove("hide"); // this is to remove one of the classes of the attribute
  disableBoxes();
};

const checkWinner = () => {
  for (let pattern of winPatterns) {
    // console.log(pattern[0], pattern[1], pattern[2]);
    // console.log(
    //   boxes[pattern[0]].innerText, // so this tells whats on the position X or O
    //   boxes[pattern[1]].innerText,
    //   boxes[pattern[2]].innerText
    // ); //it is checking for that pattern box, like the winning patterns boxes button element!

    let pos1Val = boxes[pattern[0]].innerText;
    let pos2Val = boxes[pattern[1]].innerText;
    let pos3Val = boxes[pattern[2]].innerText;

    if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
      // check that sqaure is not empty
      if (pos1Val === pos2Val && pos2Val === pos3Val) {
        showWinner(pos1Val);
      }
    }
  } // basically the boxes is a nodeList and if like pattern[0] is 1, then boxes[1] is being printed!
};

newGameBtn.addEventListener("click", resetButton);
resetBtn.addEventListener("click", resetButton);
