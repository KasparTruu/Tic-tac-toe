const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart');
const playerChoice = document.getElementById('player-choice');
const chooseXButton = document.getElementById('choose-x');
const chooseOButton = document.getElementById('choose-o');
const gameModeSelection = document.getElementById('game-mode-selection');
const pvpButton = document.getElementById('pvp');
const pvbButton = document.getElementById('pvb');
const gameBoard = document.querySelector('.game-board');
const homeButton = document.getElementById('home');

let currentPlayer = 'X';
let playerSymbol = 'X';
let botSymbol = 'O';
let gameActive = true;
let gameMode = 'PvP';  // Default to Player vs Player
const gameState = Array(9).fill(null);

const baseWinningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let winningConditions = [];

function shuffleConditions() {
    winningConditions = [...baseWinningConditions].sort(() => Math.random() - 0.5);
}

function handleCellClick(event) {
    if (!gameActive) return; // If the game is over, prevent further moves.

    const cell = event.target;
    const y = parseInt(cell.dataset.y);
    const x = parseInt(cell.dataset.x);
    const index = y * 3 + x;

    if (gameState[index]) return; // Ignore click if the cell is already taken.

    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add('taken');
    console.log(`Player ${currentPlayer} clicked on cell (${y}, ${x})`);

    if (checkWin()) {
        message.textContent = `Player ${currentPlayer} wins!`;
        console.log(`Player ${currentPlayer} wins!`);
        gameActive = false;
    } else if (gameState.every(cell => cell !== null)) {
        message.textContent = "It's a draw!";
        console.log("It's a draw!");
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === playerSymbol ? botSymbol : playerSymbol;
        message.textContent = `Player ${currentPlayer}'s turn`;

        if (gameMode === 'PvB' && currentPlayer === botSymbol) {
            setTimeout(() => botMove(), 500);  // Let bot play after player moves
        }
    }
}

function checkWin(board = gameState) {
    return winningConditions.some(condition => {
        const [a, b, c] = condition;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}

function getBlockMove() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        const cellsInCondition = [gameState[a], gameState[b], gameState[c]];
        if (cellsInCondition.filter(cell => cell === playerSymbol).length === 2 && cellsInCondition.includes(null)) {
            return condition.find(index => gameState[index] === null);
        }
    }
    return null;
}

function getRandomMove() {
    const availableCells = gameState.map((value, index) => value === null ? index : null).filter(index => index !== null);
    return availableCells[Math.floor(Math.random() * availableCells.length)];
}

function botMove() {
    if (!gameActive) return;

    console.log('Bot is making its move...');

    let move = getBlockMove();
    if (move === null) {
        move = getRandomMove();
    }

    gameState[move] = botSymbol;
    const botCell = cells[move];
    botCell.textContent = botSymbol;
    botCell.classList.add('taken');
    console.log(`Bot clicked on cell (${Math.floor(move / 3)}, ${move % 3})`);

    if (checkWin()) {
        message.textContent = `Player ${botSymbol} wins!`;
        console.log(`Player ${botSymbol} wins!`);
        gameActive = false;
    } else if (gameState.every(cell => cell !== null)) {
        message.textContent = "It's a draw!";
        console.log("It's a draw!");
        gameActive = false;
    }

    currentPlayer = playerSymbol;
    message.textContent = `Player ${currentPlayer}'s turn`;
}

function initializeGame() {
    cells.forEach((cell, index) => {
        cell.textContent = '';
        cell.classList.remove('taken');
        cell.addEventListener('click', handleCellClick);
        const y = Math.floor(index / 3);
        const x = index % 3;
        cell.dataset.y = y;
        cell.dataset.x = x;
    });

    currentPlayer = playerSymbol;
    gameActive = true;
    gameState.fill(null);
    shuffleConditions();
    message.textContent = `Player ${currentPlayer}'s turn`;

    console.log('Game initialized.');

    if (gameMode === 'PvB' && Math.random() < 0.5) {
        currentPlayer = botSymbol;
        message.textContent = `Player ${currentPlayer}'s turn`;
        console.log('Bot starts the game...');
        setTimeout(() => botMove(), 500);  // Let bot start immediately
    }
}

function startGame(symbol) {
    playerSymbol = symbol;
    botSymbol = symbol === 'X' ? 'O' : 'X';
    playerChoice.style.display = 'none';
    gameModeSelection.style.display = 'none';
    gameBoard.style.display = 'grid';
    restartButton.style.display = 'inline-block';
    homeButton.style.display = 'inline-block';
    console.log(`Starting game with ${playerSymbol} as player and ${botSymbol} as bot.`);
    initializeGame();
}

function resetToHome() {
    playerChoice.style.display = 'block';
    gameModeSelection.style.display = 'block';
    gameBoard.style.display = 'none';
    restartButton.style.display = 'none';
    homeButton.style.display = 'none';
    message.textContent = '';
    console.log('Resetting to home screen.');
}

chooseXButton.addEventListener('click', () => {
    gameModeSelection.style.display = 'block';
    playerSymbol = 'X';
    botSymbol = 'O';
    playerChoice.style.display = 'none';
});

chooseOButton.addEventListener('click', () => {
    gameModeSelection.style.display = 'block';
    playerSymbol = 'O';
    botSymbol = 'X';
    playerChoice.style.display = 'none';
});

pvpButton.addEventListener('click', () => {
    gameMode = 'PvP';
    console.log('Player vs Player mode selected');
    startGame(playerSymbol);
});

pvbButton.addEventListener('click', () => {
    gameMode = 'PvB';
    console.log('Player vs Bot mode selected');
    startGame(playerSymbol);
});

restartButton.addEventListener('click', initializeGame);
homeButton.addEventListener('click', resetToHome);
