
boardContainer = document.getElementById("board-container");

const Gameboard = (function(boardContainer) {

    const _createBoardCell = function(x, y) {
        let divElement = document.createElement("div");
        divElement.setAttribute("row", "r" + String(x));
        divElement.setAttribute("col", "c" + String(y));
        return divElement;
    };

    const _renderBoard = function(containerElement, nodesBoard) {
        for (let i in nodesBoard) {
            for (let j in nodesBoard[i]) {
                containerElement.appendChild(nodesBoard[i][j]);
            }
        }
    };

    const emptyArray = createEmptyArray(3, 3);

    const nodesBoard = populateArray(emptyArray, _createBoardCell);

    _renderBoard(boardContainer, nodesBoard);

    return {nodesBoard};
})(boardContainer);

const player = function(symbol) {
    const takenSquares = populateArray(createEmptyArray(3, 3), () => false);

    let won = false;

    const getSymbol = function() {
        return symbol
    };

    const takeSquare = function(i, j) {
        takenSquares[i][j] = true;
    };
    
    const makeWinner = function() {
        won = true;
    };

    const isWinner = function() {
        return won;
    };

    return {getSymbol, takeSquare, takenSquares, isWinner, makeWinner};
};

players = [player("X"), player("O")];

const displayController = function(nodesBoard, players) {
    let _playerAsTurn = true;

    const _determinePosition = function(element) {
        const row = element.getAttribute("row").substring(1);
        const col = element.getAttribute("col").substring(1);
        return [row, col]
    };

    const _switchPlayer = function() {
        _playerAsTurn = _playerAsTurn ? false : true;
    };

    const _checkIfWon = function(player) {
        /* Check for rows */
        let isWinner = false;
        isWinner = player.takenSquares.some((row) => row.every((x) => x));
        if (isWinner) {player.makeWinner(); return null;}
        /* Check for columns */
        for (let col in player.takenSquares[0]) {
            isWinner = player.takenSquares.map(row => row[col]).every(x => x);
            if (isWinner) {player.makeWinner(); return null;}
        }
        /* Check for diagonals */
        let takenInDiagonal = true, takenInBckwrdsDiagonal = true;
        let colsMaxIndex = player.takenSquares[0].length - 1;
        for (let row in player.takenSquares) {
            takenInBckwrdsDiagonal &&= player.takenSquares[row][colsMaxIndex - row];
            takenInDiagonal &&= player.takenSquares[row][row];x => x
        }
        isWinner = takenInBckwrdsDiagonal || takenInDiagonal;
        if (isWinner) {player.makeWinner(); return null;}
    };

    const _startGame = function() {
        if (_playerAsTurn) {
            this.textContent = players[0].getSymbol();
            this.classList.toggle("pa");
            const [row, col] = _determinePosition(this);
            players[0].takeSquare(row, col);
            _checkIfWon(players[0]);
            _switchPlayer();
            _removeEvent.call(this);
        }
        else {
            this.textContent = players[1].getSymbol();
            this.classList.toggle("pb");
            const [row, col] = _determinePosition(this);
            players[1].takeSquare(row, col);
            _checkIfWon(players[1]);
            _switchPlayer();
            _removeEvent.call(this);
        }
    };

    const _removeEvent = function() {
            this.removeEventListener("click", _onClick);
            this.classList.toggle("unactivable");
    };

    const _onClick = function() {
        _startGame.call(this);
        //console.log(`You clicked ${this.getAttribute("position")}`);
    };

    const _addEvents = function() {
        for (i in nodesBoard) {
            for (j in nodesBoard[i]) {
                nodesBoard[i][j].addEventListener("click", _onClick);
            }
        }
    };

    _addEvents();

}(Gameboard.nodesBoard, players);

/* Globally defined functions */
function createEmptyArray(rows, columns) {
    //let row = Array.apply(null, Array(columns));
    //let row =  [...Array(3)];
    array2d = [...Array(rows)];
    for (let i in array2d) {
        array2d[i] = [...Array(columns)];
    }
    return array2d;
};

function populateArray(emptyArray, genFunction) {
    for (let i in emptyArray) {
        for (let j in emptyArray[i]) {
            emptyArray[i][j] = genFunction(i, j);
        }
    }
    return emptyArray;
};
