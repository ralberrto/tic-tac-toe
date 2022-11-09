console.log("All set up");

const Gameboard = (function() {
    const fillArray = function() {
        for (let i in board) {
            for (let j in board[i]) {
                board[i][j] = "o";
            }
        }
        return board;
    };
    const _createBoard = function(rows, columns) {
        //let row = Array.apply(null, Array(columns));
        let row =  [...Array(3)];
        let array2d = Array(3).fill(row);
        return array2d;
    };
    const board = _createBoard(3, 3);
    return {board, fillArray};
})();

const player = function(name) {
    let playerName = name;
    return {playerName, extendName};
};