// HTML elements

const compBtn = document.querySelector(".computer-btn");
const playerBtn = document.querySelector(".player-btn");
const choice = document.querySelector(".choice-container");
const secondPlayer = document.querySelector(".second-player");
const form = document.querySelector(".player-form");
const player1Name = document.querySelector("#player1");
const player2Name = document.querySelector("#player2");
const startBtn = document.querySelector(".start-btn");
const gameBoardContainer = document.querySelector(".game-board-container");
const gameBoard = document.querySelector(".game-board");
const newGameBtn = document.querySelector(".new-game-btn");
const newRoundBtn = document.querySelector(".new-round-btn");
const announcerBtn = document.querySelector(".announcer-btn");
playerBtn.addEventListener("click", () => {
    choice.classList.add("hide");
    console.log(form);
    form.classList.remove("hide");
    secondPlayer.classList.remove
        ("hide");
});
compBtn.addEventListener("click", () => {
    choice.classList.add("hide");
    console.log(form);
    form.classList.remove("hide");
    secondPlayer.classList.add("hide");
    player2Name.value = "Computer";
});
startBtn.addEventListener("click", (e) => {
    e.preventDefault();
    form.classList.add("hide");
    gameBoardContainer.classList.remove("hide");
})
newRoundBtn.addEventListener("click", () => {
    gameBoard.innerHTML = "";
    GameBoard();
})
newGameBtn.addEventListener("click", () => {
    gameBoardContainer.classList.add("hide");
    choice.classList.remove("hide");
    gameBoard.innerHTML = "";
    GameBoard();
    form.reset();
})
newGameBtn.addEventListener("click", () => {
    console.log("event");
})
function GameBoard() {
    let XorO = 0;
    let gameBoardArray = [];
    // followed array serves as game over check
    let multiArray = [];

    for (let i = 0; i < 9; i++) {

        let gameBoardCell = document.createElement("div");
        gameBoardCell.classList.add("game-board__cell");
        gameBoardArray.push(gameBoardCell);
        gameBoardCell.addEventListener("click", () => {
            if (gameBoardCell.textContent)
                return;
            if (winnerAnouncement(multiArray))
                return;

            else if (XorO % 2)
                gameBoardCell.textContent = "o";
            else
                gameBoardCell.textContent = "x";
            if (winnerAnouncement(multiArray)) {
                announcerBtn.textContent = winnerAnouncement(multiArray);

            }
            XorO++;
        })
        gameBoard.appendChild(gameBoardCell);
    }
    for (let i = 0; i < 3; i++) {
        let row = new RegExp(`[${i * 3}${i * 3 + 1}${i * 3 + 2}]`);
        let column = new RegExp(`[${i}${i + 3}${i + 6}]`);
        multiArray.push(gameBoardArray.filter((item, index) => row.test(index)));
        multiArray.push(gameBoardArray.filter((item, index) => column.test(index)));
    }
    // ltr diagonal
    multiArray.push([gameBoardArray[0], gameBoardArray[4], gameBoardArray[8]]);
    // rtl diagonal
    multiArray.push([gameBoardArray[2], gameBoardArray[4], gameBoardArray[6]]);
}
function winnerAnouncement(array) {
    if (array.some(subArray => subArray.every(item => item.textContent === "x")))
        return `${player1Name.value} is the winner`;
    else if (array.some(subArray => subArray.every(item => item.textContent === "o")))
        return `${player2Name.value} is the winner`;
}
GameBoard();


