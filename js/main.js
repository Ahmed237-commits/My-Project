// Game State
let boardState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "x";
let gameActive = true;

// DOM Elements
const boardElement = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const turnIndicator = document.getElementById("current-player");
const restartBtn = document.getElementById("restart-btn");
const resultModal = document.getElementById("result-modal");
const resultMessage = document.getElementById("result-message");
const newGameBtn = document.getElementById("new-game-btn");

// Win Conditions
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Initialize Game
function initGame() {
    cells.forEach(cell => {
        cell.addEventListener("click", handleCellClick);
    });
    restartBtn.addEventListener("click", restartGame);
    newGameBtn.addEventListener("click", restartGame);
}

// Handle Cell Click
function handleCellClick(e) {
    const clickedCell = e.target;
    const currIndex = parseInt(clickedCell.getAttribute('data-index'));

    // If cell is taken or game is over, ignore
    if (boardState[currIndex] !== "" || !gameActive) {
        return;
    }

    // Update Game State
    handleCellPlayed(clickedCell, currIndex);
    handleResultValidation();
}

function handleCellPlayed(cell, index) {
    boardState[index] = currentPlayer;
    cell.classList.add("taken"); // Prevents hover effect

    // Create and append the element for animation
    const shape = document.createElement("div");
    shape.classList.add(currentPlayer);
    cell.appendChild(shape);
}

function handleResultValidation() {
    let roundWon = false;
    let winningLine = [];

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = boardState[winCondition[0]];
        let b = boardState[winCondition[1]];
        let c = boardState[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            winningLine = winCondition;
            break;
        }
    }

    if (roundWon) {
        endGame(false, winningLine);
        return;
    }

    let roundDraw = !boardState.includes("");
    if (roundDraw) {
        endGame(true);
        return;
    }

    switchPlayer();
}

function switchPlayer() {
    currentPlayer = currentPlayer === "x" ? "o" : "x";
    turnIndicator.innerText = currentPlayer.toUpperCase();

    // Toggle color class for the turn indicator
    turnIndicator.className = ""; // Reset classes
    if (currentPlayer === "x") {
        turnIndicator.classList.add("player-x");
    } else {
        turnIndicator.classList.add("player-o");
    }
}

function endGame(draw, winningLine = []) {
    gameActive = false;

    if (draw) {
        resultMessage.innerText = "تعادل!";
        resultMessage.style.color = "#fff";
    } else {
        resultMessage.innerHTML = `الفائز هو <span class="${currentPlayer === 'x' ? 'player-x' : 'player-o'}">${currentPlayer.toUpperCase()}</span> !`;

        // Highlight winning cells
        winningLine.forEach(index => {
            cells[index].classList.add("winning-cell");
        });
    }

    // Show Modal with delay
    setTimeout(() => {
        resultModal.classList.add("show");
    }, 500);
}

function restartGame() {
    gameActive = true;
    currentPlayer = "x";
    boardState = ["", "", "", "", "", "", "", "", ""];

    // Reset UI
    turnIndicator.innerText = "X";
    turnIndicator.className = "player-x";

    cells.forEach(cell => {
        cell.innerHTML = "";
        cell.classList.remove("taken", "winning-cell");
    });

    resultModal.classList.remove("show");
}

// Start the game
initGame();