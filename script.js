
boardContainer = document.getElementById("board-container");

const Gameboard = (function(boardContainer) {

    const _createBoardArray = function(rows, columns) {
        //let row = Array.apply(null, Array(columns));
        //let row =  [...Array(3)];
        array2d = [...Array(rows)];
        for (let i in array2d) {
            array2d[i] = [...Array(columns)];
        }
        array2d = _populateBoardArray(array2d);
        return array2d;
    };

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

    const nodesBoard = _createBoardArray(3, 3);
    _renderBoard(boardContainer, nodesBoard);

    return {nodesBoard};
})(boardContainer);

const player = function(symbol) {
    const getSymbol = function() {
        return symbol
    };

    return {getSymbol};
};

playerA = player("X");
playerB = player("O");

const displayController = function(nodesBoard, players) {
    let _binaryStatus = true;

    const _startFlow = function() {
        if (_binaryStatus) {
            this.textContent = playerA.getSymbol();
            _binaryStatus = false;
            _removeEvent.call(this);
        }
        else {
            this.textContent = playerB.getSymbol();
            _binaryStatus = true;
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

}(Gameboard.nodesBoard, [playerA, playerB]);
