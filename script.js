console.log("All set up");

const Gameboard = (function() {
    const _createBoard = function(rows, columns) {
        let row = Array.apply(null, Array(columns));
        let array2d = [];
        for (let i = 0; i < columns; i++) {
            array2d.push(row);
        }
        return array2d;
    };
    const board = _createBoard(3, 3);
    return {board};
})();