
boardContainer = document.getElementById("board-container");

const Gameboard = (function(boardContainer) {

    const _populateBoardArray = function(board) {
        for (let i in board) {
            for (let j in board[i]) {
                board[i][j] = _createBoardCell(i, j);
            }
        }
        return board;
    };

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

    const nodesBoard = _populateBoardArray(emptyArray);

    _renderBoard(boardContainer, nodesBoard);

    return {nodesBoard};
})(boardContainer);

const player = function(symbol) {
    const getSymbol = function() {
        return symbol
    };

    return {getSymbol};
};

players = [player("X"), player("O")];

const displayController = function(nodesBoard, players) {
    let _playerAsTurn = true;

    const _switchPlayer = function() {
        _playerAsTurn = _playerAsTurn ? false : true;
    };

    const _checkIfWon = function(playerClass) {
        playedByPlayer = Array.from(boardContainer.querySelectorAll("div." + playerClass));

    };

    const _startFlow = function() {
        if (_playerAsTurn) {
            this.textContent = players[0].getSymbol();
            this.classList.toggle("pa");
            _switchPlayer();
            _removeEvent.call(this);
        }
        else {
            this.textContent = players[1].getSymbol();
            this.classList.toggle("pb");
            _switchPlayer();
            _removeEvent.call(this);
        }
    };

    const _removeEvent = function() {
            this.removeEventListener("click", _onClick);
            this.classList.toggle("unactivable");
    };

    const _onClick = function() {
        _startFlow.call(this);
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