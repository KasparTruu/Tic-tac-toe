const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart');
const playerChoice = document.getElementById('player-choice');
const chooseXButton = document.getElementById('choose-x');
const chooseOButton = document.getElementById('choose-o');
const gameBoard = document.querySelector('.game-board');

let currentPlayer = 'X';
let playerSymbol = 'X';
let botSymbol = 'O';
let gameActive = true;
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
    console.log('Winning conditions shuffled:', winningConditions);
}

function handleCellClick(event) {
    const cell = event.target;
    const y = parseInt(cell.dataset.y);
    const x = parseInt(cell.dataset.x);
    const index = y * 3 + x;

    if (gameState[index] || !gameActive) return;

    console.log(`Player ${currentPlayer} clicked cell (${x}, ${y})`);

    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add('taken');
    currentPlayer === 'X' ? cell.classList.add('x') : cell.classList.add('o');

    if (checkWin()) {
        message.textContent = `Player ${currentPlayer} wins!`;
        console.log(`Player ${currentPlayer} wins!`);
        gameActive = false;
    } else if (gameState.every(cell => cell !== null)) {
        message.textContent = "It's a draw!";
        console.log("It's a draw!");
        gameActive = false;
    }

    currentPlayer = currentPlayer === playerSymbol ? botSymbol : playerSymbol;
    message.textContent = `Player ${currentPlayer}'s turn`;

    if (currentPlayer === botSymbol) {
        console.log('Bot is making a move...');
        botMove();
    }
}

function checkWin(board = gameState) {
    return winningConditions.reduce((winner, condition) => {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            winner = board[a]; // Return the symbol of the winning player
        }
        return winner;
    }, null);
}

function minimax(board, depth, isMaximizing) {
    const winner = checkWin(board);
    if (winner === playerSymbol) return 10 - depth; // Favor player
    if (winner === botSymbol) return depth - 10; // Favor bot
    if (board.every(cell => cell !== null)) return 0; // Draw

    return board.reduce((bestScore, _, index) => {
        if (board[index] === null) {
            board[index] = isMaximizing ? botSymbol : playerSymbol;
            const score = minimax(board, depth + 1, !isMaximizing);
            board[index] = null;

            return isMaximizing
                ? Math.max(bestScore, score)
                : Math.min(bestScore, score);
        }
        return bestScore;
    }, isMaximizing ? -Infinity : Infinity);
}

function bestMove() {
    let bestMove = -1;
    let bestValue = -Infinity;

    gameState.forEach((cell, index) => {
        if (cell === null) {
            gameState[index] = botSymbol;
            const moveValue = minimax(gameState, 0, false);
            gameState[index] = null;

            if (moveValue > bestValue) {
                bestValue = moveValue;
                bestMove = index;
            }
        }
    });

    console.log(`Bot chose cell index: ${bestMove}`);
    return bestMove;
}

function botMove() {
    const move = bestMove();
    gameState[move] = botSymbol;
    const botCell = cells[move];
    botCell.textContent = botSymbol;
    botCell.classList.add('taken');

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

    // Randomly decide if the bot starts
    if (Math.random() < 0.5) {
        currentPlayer = botSymbol;
        message.textContent = `Player ${currentPlayer}'s turn`;
        console.log('Bot starts the game!');
        botMove();
    }
}

function startGame(symbol) {
    playerSymbol = symbol;
    botSymbol = symbol === 'X' ? 'O' : 'X';
    playerChoice.style.display = 'none';
    gameBoard.style.display = 'grid';
    restartButton.style.display = 'inline-block';
    console.log(`Game started! Player chose ${playerSymbol}, Bot is ${botSymbol}`);
    initializeGame();
}

chooseXButton.addEventListener('click', () => startGame('X'));
chooseOButton.addEventListener('click', () => startGame('O'));
restartButton.addEventListener('click', initializeGame);

shuffleConditions();
