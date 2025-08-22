const GameBoard = (() => {
    let gameboard = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => gameboard;

    const setSquare = (index, marker) => {
        if (gameboard[index] === "") {
            gameboard[index] = marker;
            return true;
        }
        return false;
    };

    const reset = () => {
        gameboard = ["", "", "", "", "", "", "", "", ""];
        render();
    };

    const render = () => {
        let boardHTML = "";
        gameboard.forEach((square, index) => {
            boardHTML += `<div class="square" data-index="${index}">${square}</div>`;
        });
        document.querySelector('#game-board').innerHTML = boardHTML;
    };

    return {
        getBoard,
        setSquare,
        reset,
        render
    };
})();

const createPlayer = (name, marker) => {
    return { name, marker };
};

const Game = (() => {
    let players = [];
    let currentPlayerIndex = 0;
    let gameOver = false;

    const start = () => {
        players = [
            createPlayer(document.querySelector('#player1-name').value || "Player 1", "X"),
            createPlayer(document.querySelector('#player2-name').value || "Player 2", "O")
        ];
        currentPlayerIndex = 0;
        gameOver = false;
        GameBoard.reset();
        addListeners();
    };

    const addListeners = () => {
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            square.addEventListener('click', handleClick);
        });
    };

    const handleClick = (event) => {
        if (gameOver) return;
        let index = event.target.dataset.index;
        if (GameBoard.setSquare(index, players[currentPlayerIndex].marker)) {
            GameBoard.render();
            addListeners(); // reattach after re-render

            if (checkWinner(GameBoard.getBoard())) {
                document.querySelector('#message').textContent = `${players[currentPlayerIndex].name} wins!`;
                gameOver = true;
                return;
            }
            if (!GameBoard.getBoard().includes("")) {
                document.querySelector('#message').textContent = "It's a tie!";
                gameOver = true;
                return;
            }
            currentPlayerIndex = 1 - currentPlayerIndex; // switch
        }
    };

    const checkWinner = (board) => {
        const winningCombos = [
            [0,1,2],[3,4,5],[6,7,8],
            [0,3,6],[1,4,7],[2,5,8],
            [0,4,8],[2,4,6]
        ];
        return winningCombos.some(combo =>
            combo.every(i => board[i] === board[combo[0]] && board[i] !== "")
        );
    };

    return {
        start
    };
})();

document.getElementById('start-game').addEventListener('click', () => {
    Game.start();
});

document.getElementById('reset-button').addEventListener('click', () => {
    GameBoard.reset();
    document.querySelector('#message').textContent = "";
});
