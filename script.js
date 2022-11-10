
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

const displayController = function(nodesBoard) {
    const _onClick = function() {
        this.textContent = "X"
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
}(Gameboard.nodesBoard);

const player = function(name) {
    let playerName = name;
    return {playerName, extendName};
};
