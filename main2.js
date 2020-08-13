
const Player = function (name, choice) {

    let score = 0;
    function getName() {
        return name;
    }
    function getChoice() {
        return choice;
    }
    function getScore() {
        return score;
    }
    function updateScore() {
        score++;
    }
    return {
        getName,
        getChoice,
        getScore,
        updateScore,
    }
}


const GameBoard = (function () {
    let gameBoard = []

    // initializing board
    for (let i = 0; i < 9; i++)
        gameBoard[i] = null;


    function clear() {
        for (let i = 0; i < 9; i++)
            gameBoard[i] = null;
    }
    function getBoard() {
        return gameBoard;
    }

    return {
        clear,
        getBoard,
    }
})()


const GameRules = (function () {
    let ultimateScore = 5;

    let winningIndexes = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], //columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ]

    function winnerCombo() {
        return [...winningIndexes];
    }
    function endScore() {
        return ultimateScore;
    }

    return {
        endScore,
        winnerCombo,
    }

})()
const HTMLSetup = (function () {

    // DOM elements

    /* elements to hide/show */
    const choiceContainer = document.querySelector(".choice-container");
    const form = document.forms[0];
    const gameBoardContainer = document.querySelector(".game-board-container");

    /* buttons */
    const computerBtn = choiceContainer.querySelector(".computer-btn");
    const playerBtn = choiceContainer.querySelector(".player-btn");
    const startBtn = form.querySelector(".start-btn");

    // form inputs
    const player2 = document.querySelector("#player2-setup");

    // binding events

    toggleHide(computerBtn, [choiceContainer, player2], form);
    toggleHide(playerBtn, [choiceContainer], form);
    toggleHide(startBtn, [form], gameBoardContainer);


    // functions for adding event to hide/show elements

    function toggleHide(element, elementsToHide, elementToShow, event = "click") {
        element.addEventListener(`${event}`, e => {
            e.preventDefault();
            elementsToHide.forEach(element => element.classList.add("hide"));
            elementToShow.classList.remove("hide");
        })
    }
})()



const Game = (function () {
    // caching the DOM
    const input1 = document.querySelector("#player1");
    const input2 = document.querySelector("#player2");


    // players
    const player1 = Player(input1.value, "x");
    const player2 = Player(input2.value, "o");
    let turningPlayer = player1;
    let winnerPlayer = "winner has not been announced yet";

    function ultimateWinner() {
        if (player1.getScore() === GameRules.endScore())
            return player1;
        else if (player2.getScore() === GameRules.endScore())
            return player2;
    }
    function getTurningPlayer() {
        return turningPlayer;
    }
    function switchTurn() {
        turningPlayer = turningPlayer === player1 ? player2 : player1;
    }
    function isWinner() {
        if (GameRules.winnerCombo().some(subArray => subArray.every(index => GameBoard.getBoard()[index] === turningPlayer.getChoice()))) {
            winnerPlayer = turningPlayer;
            return true;
        }
        return false;
    }
    function winner() {
        return winnerPlayer;
    }


    return {
        getTurningPlayer,
        switchTurn,
        isWinner,
        winner,
        ultimateWinner,
    }
})()


// to handle rendering to the gameboard
const DisplayController = (function () {

    // getting DOM elements

    const gameBoard = document.querySelector(".game-board");
    const newGameBtn = document.querySelector(".new-game-btn");
    const newRoundBtn = document.querySelector(".new-round-btn");


    // binding event listeners

    gameBoard.addEventListener("click", render);
    newRoundBtn.addEventListener("click", clearBoard);
    newGameBtn.addEventListener("click", clearBoard);
    newGameBtn.addEventListener("click", e => location.reload());

    // initializing html board through js
    for (let i = 0; i < 9; i++) {
        let cell = document.createElement("div");
        cell.classList.add("game-board__cell");
        cell.setAttribute("data-index", i);
        gameBoard.appendChild(cell);
    }

    // functions
    function clearBoard() {
        [...gameBoard.children].forEach(cell => cell.textContent = "");
        GameBoard.clear();
    }


    function render(e) {
        let cell = e.target;
        if (cell.className != "game-board__cell")
            return;
        if (cell.textContent)
            return;
        if (Game.isWinner()) {
            return;
        }
        GameBoard.getBoard()[cell.dataset.index] = cell.textContent = Game.getTurningPlayer().getChoice();
        if (Game.isWinner()) {
            console.log("winner of this round is", Game.winner().getName());
            Game.winner().updateScore();

            // we do not want to continue to switch turn because it could create complications
            return;
        }
        Game.switchTurn();
    }


    return {
        clearBoard,
    }
})()