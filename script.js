
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

const player = function(name, symbol) {
    const takenSquares = populateArray(createEmptyArray(3, 3), () => false);

    let won = false;

    const getName = function() {
        return name;
    };

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

    return {getName, getSymbol, takeSquare, takenSquares, isWinner, makeWinner};
};

players = [player("Player 1", "X"), player("Player 2", "O")];

const displayController = function(nodesBoard, players) {
    let _isPlayerTurn = true;
    const announcementBox = document.getElementById("announcement-box");
    const screen = document.getElementById("screen");
    const closeAnnouncementBoxButton = document.querySelector("#announcement-box #close");

    const _applyToGrid = function(functionToApply) {
        for (row in nodesBoard) {
            for (col in nodesBoard[row]) {
                functionToApply(nodesBoard[row][col]);
            }
        }
    };

    const _disableElement = function(element) {
            element.removeEventListener("click", _onClick);
            element.classList.add("unactivable");
    };

    const _closeAnnouncementBox = function() {
        announcementBox.classList.toggle("on");
        screen.classList.toggle("on");
        _applyToGrid(_disableElement);
    };

    closeAnnouncementBoxButton.addEventListener("click", _closeAnnouncementBox);

    const isAvailable = populateArray(createEmptyArray(3, 3), () => true);

    const _determinePosition = function(element) {
        const row = element.getAttribute("row").substring(1);
        const col = element.getAttribute("col").substring(1);
        return [row, col];
    };

    const _makeUnavailable = function(i, j) {
        isAvailable[i][j] = false;
    };

    const _switchPlayer = function() {
        _isPlayerTurn = _isPlayerTurn ? false : true;
    };

    const _declareWinner = function(player) {
        const isWinner = _checkIfWon(player);
        if (isWinner) {
            player.makeWinner()
            const pName = document.querySelector("#announcement-box .player-name");
            const pMessage = document.getElementById("message");
            pName.textContent = player.getName();
            pMessage.textContent = "has won!";
            announcementBox.classList.toggle("on");
            screen.classList.toggle("on");
        }
    };

    const _checkIfWon = function(player) {
        /* Check for rows */
        let wonRow = player.takenSquares.some((row) => row.every((x) => x));

        /* Check for columns */
        let wonCol;
        for (let col in player.takenSquares[0]) {
            wonCol = player.takenSquares.map(row => row[col]).every(x => x);
            if (wonCol) {break;}
        }

        /* Check for diagonals */
        let takenInDiagonal = true, takenInBckwrdsDiagonal = true;
        let colsMaxIndex = player.takenSquares[0].length - 1;
        for (let row in player.takenSquares) {
            takenInBckwrdsDiagonal &&= player.takenSquares[row][colsMaxIndex - row];
            takenInDiagonal &&= player.takenSquares[row][row];
        }
        return wonRow || wonCol || takenInBckwrdsDiagonal || takenInDiagonal;
    };

    const _startGame = function() {
        if (_isPlayerTurn) {
            this.textContent = players[0].getSymbol();
            this.classList.toggle("pa");
            const [row, col] = _determinePosition(this);
            _makeUnavailable(row, col);
            players[0].takeSquare(row, col);
            _switchPlayer();
            _disableElement(this);
            _declareWinner(players[0]);
        }
        else {
            this.textContent = players[1].getSymbol();
            this.classList.toggle("pb");
            const [row, col] = _determinePosition(this);
            _makeUnavailable(row, col);
            players[1].takeSquare(row, col);
            _switchPlayer();
            _disableElement(this);
            _declareWinner(players[1]);
        }
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

    return {isAvailable};

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
