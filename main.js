/* modules and factories */
/* we need to pay attention to order of our modules, because it is important for app to work. */
// this module will be needed throughout the whole application, so we need to declare it at the top
const PubSub = (function () {
    events = {

    }
    function on(eventName, fn) {
        events[eventName] = events[eventName] || [];
        events[eventName].push(fn);
        console.log(events[eventName]);
    }
    function off(eventName, fn) {
        if (events[eventName]) {
            let index = events[eventName].indexOf(fn);
            events[eventName].splice(index, 1);
            console.log(events[eventName]);
        }
    }
    function emit(eventName, data) {
        if (events[eventName]) {
            events[eventName].forEach(fn => {
                fn(data);
            })
        }
    }
    return {
        on,
        off,
        emit,
    }
})()
/* here we start creating modules, that our app will need to work properly, following few modules has no functionality whatsoever */
const getObjElement = (function () {

    // generic elements
    const choiceCont = document.querySelector("#choice-container");
    const form = document.forms[0];
    const player2Field = form.querySelector("#player2-setup");
    const gameCont = document.querySelector("#game-container");
    const announcer = gameCont.querySelector("#announcer");
    const gameBoard = gameCont.querySelector("#game-board");
    const ultWinnerDisplay = document.querySelector("#ultimate-winner-display");
    const ultWinner = ultWinnerDisplay.querySelector("#ultimate-winner");
    const ultimateScore = gameCont.querySelector("#ultimate-score");
    const player1NameSide = gameCont.querySelector("#player1-name");
    const player2NameSide = gameCont.querySelector("#player2-name");
    const player1ScoreSide = gameCont.querySelector("#player1-score");
    const player1MarkSide = gameCont.querySelector("#player1-mark");
    const player2ScoreSide = gameCont.querySelector("#player2-score");
    const player2MarkSide = gameCont.querySelector("#player2-mark");
    //inputs
    const player1Input = form.querySelector("#player1-input");
    const player2Input = form.querySelector("#player2-input");

    //buttons
    const computerBtn = choiceCont.querySelector("#computer-btn");
    const playerBtn = choiceCont.querySelector("#player-btn");
    const startBtn = form.querySelector("#start-btn");
    const newGameBtn = gameCont.querySelector("#new-game-btn");
    const newRoundBtn = gameCont.querySelector("#new-round-btn");
    const restartBtn = document.querySelector("#restart-btn");
    const player1ChoiceX = form.querySelector("#player1-mark-x");
    const player1ChoiceO = form.querySelector("#player1-mark-o");
    const player2ChoiceX = form.querySelector("#player2-mark-x");
    const player2ChoiceO = form.querySelector("#player2-mark-o");


    // elements, that can't be assigned straight away and therefore need a get function
    let player1ChoiceActive;
    let player2ChoiceActive;
    PubSub.on("startGame", () => {
        player1ChoiceActive = form.querySelector("[data-player1-mark-active=true]");
        player2ChoiceActive = form.querySelector("[data-player2-mark-active=true]");
    });
    function getPlayer1ChoiceActive() {
        return player1ChoiceActive;
    }
    function getPlayer2ChoiceActive() {
        return player2ChoiceActive;
    }
    return {
        choiceCont, form, player2Field, gameCont, announcer, ultWinnerDisplay, ultWinner, gameBoard, ultimateScore,
        player1NameSide, player1ScoreSide, player1MarkSide, player2NameSide, player2ScoreSide, player2MarkSide,
        computerBtn, playerBtn, startBtn, newRoundBtn, newGameBtn, restartBtn, player1ChoiceX, player1ChoiceO, player2ChoiceX, player2ChoiceO, //buttons
        player1Input, getPlayer1ChoiceActive, player2Input, getPlayer2ChoiceActive //inputs
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
        return [...winningIndexes]// we don't want someone to tweak our actual rules, so we need to copy it, because it is reference type variable;
    }
    function endScore() {
        return ultimateScore;
    }

    return {
        endScore,
        winnerCombo,
    }

})()
const GameBoard = (function () {
    // we don't need get method for this variable because: 1.it is a reference type and we want to tweak it.
    let gameBoard = []

    // initializing board
    for (let i = 0; i < 9; i++)
        gameBoard[i] = null;


    function clear() {
        for (let i = 0; i < 9; i++)
            gameBoard[i] = null;
    }


    return {
        clear,
        gameBoard,
    }
})()
function Player(name, choice) {

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





/* here we start giving our page functionality */

const PageNavigation = (function () {

    // DOM elements

    /* elements to hide/show */
    const choiceContainer = getObjElement.choiceCont;
    const form = getObjElement.form;
    const player2 = getObjElement.player2Field;
    const game = getObjElement.gameCont;

    /* buttons */
    const computerBtn = getObjElement.computerBtn;
    const playerBtn = getObjElement.playerBtn;
    const startBtn = getObjElement.startBtn;
    const newGameBtn = getObjElement.newGameBtn;
    const restartBtn = getObjElement.restartBtn;


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

const GameSetupDOM = (function () {
    // caching the DOM

    /* inputs */
    const player1Name = document.querySelector("#player1");
    const player2Name = document.querySelector("#player2");

    /* buttons */
    const computerBtn = getObjElement.computerBtn;
    const computerInput = getObjElement.player2Input;
    const playerBtn = getObjElement.playerBtn;
    const player1ChoiceX = getObjElement.player1ChoiceX;
    const player1ChoiceO = getObjElement.player1ChoiceO;
    const player2ChoiceX = getObjElement.player2ChoiceX;
    const player2ChoiceO = getObjElement.player2ChoiceO;
    const startBtn = getObjElement.startBtn;



    // binding events
    computerBtn.addEventListener("click", vsComputer);
    playerBtn.addEventListener("click", vsPlayer);
    eventToggleMarkActive(player1ChoiceX, [player1ChoiceX, player2ChoiceO], [player1ChoiceO, player2ChoiceX]);
    eventToggleMarkActive(player1ChoiceO, [player1ChoiceO, player2ChoiceX], [player1ChoiceX, player2ChoiceO]);
    eventToggleMarkActive(player2ChoiceX, [player1ChoiceO, player2ChoiceX], [player1ChoiceX, player2ChoiceO]);
    eventToggleMarkActive(player2ChoiceO, [player1ChoiceX, player2ChoiceO], [player1ChoiceO, player2ChoiceX]);
    startBtn.addEventListener("click", startGame);

    // functions
    function eventToggleMarkActive(element, elementsToStress, elemenetsToFaint, event = "click") {
        element.addEventListener(`${event}`, e => {
            e.preventDefault();
            elementsToStress.forEach((element, index) => {
                element.classList.add("mark-active")
                element.setAttribute(`data-player${index + 1}-mark-active`, "true");
            });
            elemenetsToFaint.forEach((element, index) => {
                element.classList.remove("mark-active")
                element.setAttribute(`data-player${index + 1}-mark-active`, "false");
            });
        })
    }

    function vsComputer() {
        computerInput.value = "Computer";
        PubSub.emit("pve");
    }
    function vsPlayer() {
        PubSub.emit("pvp");
    }
    function startGame() {
        PubSub.emit("startGame");
    }
})()



const Game = (function () {

    function gameInit() {
        player1 = Player(getObjElement.player1Input.value, getObjElement.getPlayer1ChoiceActive().textContent);
        player2 = Player(getObjElement.player2Input.value, getObjElement.getPlayer2ChoiceActive().textContent);
        turningPlayer = player1;
    };

    PubSub.on("startGame", gameInit);

    // players
    let player1;
    let player2;

    let turningPlayer;
    let winnerPlayer = "winner has not been announced yet";


    function getPlayer1() {
        return player1;
    }
    function getPlayer2() {
        return player2;
    }

    function getTurningPlayer() {
        return turningPlayer;
    }
    function switchTurn() {
        turningPlayer = turningPlayer === player1 ? player2 : player1;
    }
    function isDraw() {
        return GameBoard.gameBoard.every(item => item) && !isWinner();
    }
    function isWinner() {
        if (GameRules.winnerCombo().some(subArray => subArray.every(index => GameBoard.gameBoard[index] === turningPlayer.getChoice()))) {
            winnerPlayer = turningPlayer;
            return true;
        }
        return false;
    }
    function winner() {
        return winnerPlayer;
    }
    function isUltimateWinner() {
        return player1.getScore() === GameRules.endScore() || player2.getScore() === GameRules.endScore();
    }

    return {
        getPlayer1,
        getPlayer2,
        getTurningPlayer,
        switchTurn,
        isDraw,
        isWinner,
        winner,
        isUltimateWinner,
    }
})()


// in this module is missing rendering on the board (it is in GameFlow module),
// because i would have to repeat many of the logic from GameFlow placeMark method and do unnecesary steps

const GameDisplay = (function () {

    // getting DOM elements

    const gameBoard = getObjElement.gameBoard;
    const newRoundBtn = getObjElement.newRoundBtn;
    const announcer = getObjElement.announcer;
    const ultWinnerDisplay = getObjElement.ultWinnerDisplay;
    const ultWinner = getObjElement.ultWinner;

    // binding event listeners

    newRoundBtn.addEventListener("click", clearBoard);
    newRoundBtn.addEventListener("click", resetResultAnnouncer);

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
    function resetResultAnnouncer() {
        announcer.classList.add("hide");
        announcer.classList.remove("draw");
        announcer.classList.remove("winner");
    }
    function showDraw() {
        announcer.classList.remove("hide");
        announcer.classList.add("draw");
        announcer.innerHTML = "Draw";
    }
    function showWinner() {
        announcer.classList.remove("hide");
        announcer.classList.add("winner");
        announcer.innerHTML = `Winner is ${Game.winner().getName()} - congratulation <span class="smiley">&#x1F60E;</span>`;
    }
    function showComputerWinner() {
        announcer.classList.remove("hide");
        announcer.classList.add("winner");
        announcer.innerHTML = "Computer beat you - try again";
    }
    function showUltWinner() {
        ultWinner.textContent = Game.winner().getName();
        ultWinner.classList.add("jump");
        ultWinnerDisplay.classList.add("show-ultimate-winner");
    }

    return {
        showDraw,
        showWinner,
        showUltWinner,
        showComputerWinner,
    }


})()



const SidePlayersInfo = (function () {

    const ultimateScore = getObjElement.ultimateScore;

    const player1Name = getObjElement.player1NameSide;
    const player1Score = getObjElement.player1ScoreSide;
    const player1Mark = getObjElement.player1MarkSide;


    const player2Name = getObjElement.player2NameSide;
    const player2Score = getObjElement.player2ScoreSide;
    const player2Mark = getObjElement.player2MarkSide;

    ultimateScore.textContent = `${GameRules.endScore()}`;
    player1Score.textContent = 0;
    player2Score.textContent = 0;

    function renderSetup() {
        player1Name.textContent = `${Game.getPlayer1().getName()}'s`;
        player1Mark.textContent = Game.getPlayer1().getChoice();

        player2Name.textContent = `${Game.getPlayer2().getName()}'s`;
        player2Mark.textContent = Game.getPlayer2().getChoice();
    }
    function renderScore() {
        player1Score.textContent = Game.getPlayer1().getScore();
        player2Score.textContent = Game.getPlayer2().getScore();
    }
    // we want this to render on the start as well, because after that we will know players setup
    PubSub.on("startGame", renderSetup);
    return {
        renderScore,
    }
})();





const GameFlow = (function () {
    // helper variables. Those variables are created for better performance so my app doesn't have to check the same condition twice per round
    let isDraw = false;
    let isWinner = false;
    // elements

    const gameBoard = getObjElement.gameBoard;
    const newRoundBtn = getObjElement.newRoundBtn;



    //binding events
    newRoundBtn.addEventListener("click", () => {
        isDraw = false;
        isWinner = false;
    })


    //
    //
    // code i do not like
    //
    //

    //binding events
    function pvp() {
        gameBoard.addEventListener("click", pvpRound);
    }
    function pve() {
        gameBoard.addEventListener("click", pveRound);
    }

    PubSub.on("pvp", pvp);
    PubSub.on("pve", pve);

    function cantPutMark(cell) {

        return cell.className != "game-board__cell" || cell.textContent || isWinner || isDraw;
    }

    function pveRound(e) {
        let cell = e.target;

        if (cantPutMark(cell))
            return;
        GameBoard.gameBoard[cell.dataset.index] = cell.textContent = Game.getTurningPlayer().getChoice();

        if (isDraw = Game.isDraw()) {
            GameDisplay.showDraw();

            return;
        }

        if (isWinner = Game.isWinner()) {
            Game.winner().updateScore();
            GameDisplay.showWinner();
            SidePlayersInfo.renderScore();


            if (Game.isUltimateWinner())
                GameDisplay.showUltWinner();
            return;
        }
        Game.switchTurn();

        /* computer logic */

        let cells = [...getObjElement.gameBoard.children];
        let indexToPut = Math.floor(Math.random() * cells.length);
        while (cells[indexToPut].textContent)
            indexToPut = Math.floor(Math.random() * cells.length);

        GameBoard.gameBoard[indexToPut] = cells[indexToPut].textContent = Game.getTurningPlayer().getChoice();
        if (isDraw = Game.isDraw()) {
            GameDisplay.showDraw();

            Game.switchTurn();
            return;
        }
        if (isWinner = Game.isWinner()) {
            Game.winner().updateScore();
            GameDisplay.showComputerWinner();
            SidePlayersInfo.renderScore();
            if (Game.isUltimateWinner())
                GameDisplay.showUltWinner();

            Game.switchTurn();
            return;
        }
        Game.switchTurn();
    }
    function pvpRound(e) {
        let cell = e.target;

        if (cantPutMark(cell))
            return;
        GameBoard.gameBoard[cell.dataset.index] = cell.textContent = Game.getTurningPlayer().getChoice();
        if (isDraw = Game.isDraw()) {
            GameDisplay.showDraw();

            // those 2 lines are just for performance, so the app doesn't have to do winner check,
            // because it is already a tie, but before it, we have to switch the turn
            Game.switchTurn();
            return;
        }
        if (isWinner = Game.isWinner()) {
            Game.winner().updateScore();
            GameDisplay.showWinner();
            SidePlayersInfo.renderScore();


            if (Game.isUltimateWinner())
                GameDisplay.showUltWinner();
        }
        Game.switchTurn();


    }

})();