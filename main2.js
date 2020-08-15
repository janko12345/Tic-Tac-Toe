// modules and factories
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



const PageNavigation = (function () {

    // DOM elements

    /* elements to hide/show */
    const choiceContainer = document.querySelector(".choice-container");
    const form = document.forms[0];
    const player2 = document.querySelector("#player2-setup");
    const game = document.querySelector(".game");
    const endRoundWinner = document.querySelector("#winner");
    const draw = document.querySelector("#draw");

    /* buttons */
    const computerBtn = choiceContainer.querySelector(".computer-btn");
    const playerBtn = choiceContainer.querySelector(".player-btn");
    const startBtn = form.querySelector(".start-btn");
    const newGameBtn = game.querySelector(".new-game-btn");
    const restartBtn = document.querySelector("#restart-btn");


    // binding events

    eventToggleHide(computerBtn, [choiceContainer, player2], form);
    eventToggleHide(playerBtn, [choiceContainer], form);
    eventToggleHide(startBtn, [form], game);
    newGameBtn.addEventListener("click", e => location.reload());
    restartBtn.addEventListener("click", e => location.reload());



    // functions for adding event to hide/show elements

    function eventToggleHide(element, elementsToHide, elementToShow, event = "click") {
        element.addEventListener(`${event}`, e => {
            e.preventDefault();
            elementsToHide.forEach(element => element.classList.add("hide"));
            elementToShow.classList.remove("hide");
        })
    }
})()
const SidePlayersInfo = (function () {
    const ultimateScore = document.querySelector("#ultimate-score");
    const player1Score = document.querySelector("#player1-score");
    const player1Mark = document.querySelector("#player1-mark");
    const player2Score = document.querySelector("#player2-score");
    const player2Mark = document.querySelector("#player2-mark");

    ultimateScore.textContent = `${GameRules.endScore()}`;


    function render() {
        player1Score.textContent = GameSetup.getPlayer1().getScore();
        player2Score.textContent = GameSetup.getPlayer2().getScore();
        player1Mark.textContent = GameSetup.getPlayer1().getChoice();
        player2Mark.textContent = GameSetup.getPlayer2().getChoice();
    }
    return {
        render,
    }
})()

const GameSetup = (function () {
    // caching the DOM

    /* inputs */
    const player1Name = document.querySelector("#player1");
    const player2Name = document.querySelector("#player2");

    /* buttons */
    const player1MarkX = document.querySelector("#player1-mark-x");
    const player1MarkO = document.querySelector("#player1-mark-o");
    const player2MarkX = document.querySelector("#player2-mark-x");
    const player2MarkO = document.querySelector("#player2-mark-o");
    const startBtn = document.querySelector(".start-btn");





    // binding events
    eventToggleMarkActive(player1MarkX, [player1MarkX, player2MarkO], [player1MarkO, player2MarkX])
    eventToggleMarkActive(player1MarkO, [player1MarkO, player2MarkX], [player1MarkX, player2MarkO])
    eventToggleMarkActive(player2MarkX, [player2MarkX, player1MarkO], [player2MarkO, player1MarkX])
    eventToggleMarkActive(player2MarkO, [player2MarkO, player1MarkX], [player2MarkX, player1MarkO])
    startBtn.addEventListener("click", playersSetup);
    startBtn.addEventListener("click", SidePlayersInfo.render);

    // functions
    function eventToggleMarkActive(element, elementsToStress, elemenetsToFaint, event = "click") {
        element.addEventListener(`${event}`, e => {
            e.preventDefault();
            elementsToStress.forEach(element => element.classList.add("mark-active"));
            elemenetsToFaint.forEach(element => element.classList.remove("mark-active"));
        })
    }
    function playersSetup() {
        let player1Mark = document.querySelector(".first-player-choice .mark-active");
        let player2Mark = document.querySelector(".second-player-choice .mark-active");
        player1 = Player(player1Name.value, player1Mark.textContent);
        player2 = Player(player2Name.value, player2Mark.textContent);
    }

    // players
    let player2;
    let player1;
    function getPlayer1() {
        return player1;
    }
    function getPlayer2() {
        return player2;
    }
    return {
        getPlayer1,
        getPlayer2,
    }
})()


const GameFlow = (function () {

    // ideally here should not be any HTML elements

    // searching DOM
    const startBtn = document.querySelector(".start-btn");

    // binding event listeners that will assign values to variables when it is needed
    startBtn.addEventListener("click", e => {
        player1 = GameSetup.getPlayer1();
        player2 = GameSetup.getPlayer2();
        turningPlayer = GameSetup.getPlayer1();
    });



    // players
    let player1;
    let player2;

    let turningPlayer;
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
    const roundWinner = document.querySelector("#winner");
    const ultWinnerCnt = document.querySelector("#ultimate-winner-display");
    const ultWinner = ultWinnerCnt.querySelector("span");

    // binding event listeners

    gameBoard.addEventListener("click", render);
    newRoundBtn.addEventListener("click", clearBoard);
    newRoundBtn.addEventListener("click", GameFlow.switchTurn);
    newRoundBtn.addEventListener("click", e => {
        roundWinner.classList.add("hide");
    })
    newGameBtn.addEventListener("click", clearBoard);

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

    //
    //
    // code i do not like
    //
    //
    function render(e) {
        let cell = e.target;
        if (GameFlow.isWinner())
            return;
        if (cell.className != "game-board__cell")
            return;
        if (cell.textContent)
            return;

        GameBoard.getBoard()[cell.dataset.index] = cell.textContent = GameFlow.getTurningPlayer().getChoice();

        if (GameFlow.isWinner()) {
            GameFlow.winner().updateScore();
            SidePlayersInfo.render();
            roundWinner.innerHTML = `Winner is ${GameFlow.winner().getName()} - congratulation <span class="smiley">&#x1F60E;</span>`;
            roundWinner.classList.remove("hide");

            if (GameFlow.ultimateWinner()) {
                ultWinner.textContent = GameFlow.winner().getName();
                ultWinner.classList.add("jump");
                ultWinnerCnt.classList.add("show-ultimate-winner");
                ultWinnerCnt.classList.add("blink");
            }
            // we do not want to continue to switch turn because it could create complications
            return;
        }
        GameFlow.switchTurn();
    }
})()

