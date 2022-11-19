
boardContainer = document.getElementById("board-container");

const matrix = function(rows, cols, functionToPopulate) {
    const values = function (rows, columns) {
        //let row = Array.apply(null, Array(columns));
        //let row =  [...Array(3)];
        array2d = [...Array(rows)];
        for (let i in array2d) {
            array2d[i] = [...Array(columns)];
        }
        return array2d;
    }(rows, cols);

    const populateMatrix = function(functionToPopulate) {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++)  {
                values[i][j] = functionToPopulate(i, j);
            }
        }
    };

    const mapMatrix = function(functionToApply) {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j <cols; j++) {
                functionToApply(values[i][j]);
            }
        }
    };

    const compareToMatrix = function(comparisonMatrix, comparison) {
        if (!(this.rows === comparisonMatrix.rows) || !(this.cols === comparisonMatrix.cols)) {
            throw "Matrices should have equals dimensions."
        }
        const comparedMatrix = matrix(this.rows, this.cols, () => undefined);
        for (i = 0; i < this.rows; i++) {
            for (j = 0; j < this.cols; j++) {
                comparedMatrix.values[i][j] = comparison(this.values[i][j], comparisonMatrix.values[i][j]);
            }
        }
        return comparedMatrix;
    };

    populateMatrix(functionToPopulate);

    return {rows, cols, values, populateMatrix, mapMatrix, compareToMatrix};
};

const Gameboard = (function(boardContainer) {

    const _createBoardCell = function(x, y) {
        let divElement = document.createElement("div");
        divElement.setAttribute("row", "r" + String(x));
        divElement.setAttribute("col", "c" + String(y));
        return divElement;
    };

    const _renderBoard = function(element) {
        boardContainer.appendChild(element);
    };

    const nodesBoard = matrix(3, 3, _createBoardCell);
    nodesBoard.mapMatrix(_renderBoard);

    return {nodesBoard};
})(boardContainer);

const player = function(name, symbol) {
    const takenSquares = matrix(3, 3, () => false);

    let won = false;

    const getName = function() {
        return name;
    };

    const getSymbol = function() {
        return symbol
    };

    const takeSquare = function(i, j) {
        takenSquares.values[i][j] = true;
    };
    
    const makeWinner = function(make) {
        won = make;
    };

    const isWinner = function() {
        return won;
    };

    return {getName, getSymbol, takeSquare, takenSquares, isWinner, makeWinner};
};

players = [player("Jugador 1", "X"), player("Jugador 2", "O")];

const displayController = function(nodesBoard, players) {
    let _isPlayerTurn = true;
    const modalBox = document.getElementById("modal-box");
    const screen = document.getElementById("screen");
    const closeModalButton = document.querySelector("#modal-box #close");
    const replayButtons = Array.from(document.querySelectorAll("button.replay"));

    const isAvailable = matrix(3, 3, () => true);

    const _clearBoard = function() {
        _closeModal();
        nodesBoard.mapMatrix((element) => {
            element.textContent = "";
            element.classList.remove("pa");
            element.classList.remove("pb");
            element.classList.remove("disabled");
            _addEvents(element);
        });
        players.forEach(player => {
            player.makeWinner(false);
            player.takenSquares.populateMatrix(() => false);
        });
        isAvailable.populateMatrix(() => true);
    };

    replayButtons.forEach(button => button.addEventListener("click", _clearBoard));

    const _disableElement = function(element) {
            element.removeEventListener("click", _onClick);
            element.classList.add("disabled");
    };

    const _closeModal = function() {
        modalBox.classList.remove("on");
        screen.classList.remove("on");
        nodesBoard.mapMatrix(_disableElement);
    };

    closeModalButton.addEventListener("click", _closeModal);


    const _determinePosition = function(element) {
        const row = element.getAttribute("row").substring(1);
        const col = element.getAttribute("col").substring(1);
        return [row, col];
    };

    const _makeUnavailable = function(i, j) {
        isAvailable.values[i][j] = false;
    };

    const _switchPlayer = function() {
        _isPlayerTurn = _isPlayerTurn ? false : true;
    };

    const _declareWinner = function(player) {
        const isWinner = _checkIfAligned(player.takenSquares);
        if (isWinner) {
            player.makeWinner(true)
            const pName = document.querySelector("#modal-box .player-name");
            const pMessage = document.getElementById("message");
            pName.textContent = "¡" + player.getName();
            pMessage.textContent = "ha ganado!";
            modalBox.classList.toggle("on");
            screen.classList.toggle("on");
        }
        else if (!_checkIfCanWin(player)) {
            const player2 = players[Number(!Boolean(players.indexOf(player)))];
            if (!_checkIfCanWin(player2)) {
                const pName = document.querySelector("#modal-box .player-name");
                const pMessage = document.getElementById("message");
                pName.textContent = "¡Es un";
                pMessage.textContent = "empate!";
                modalBox.classList.toggle("on");
                screen.classList.toggle("on");
            }
        }
    };

    const _checkIfCanWin = function(player) {
        canTakeMatrix = player.takenSquares.compareToMatrix(isAvailable, (a, b) => a || b);
        const isAligned = _checkIfAligned(canTakeMatrix);
        return isAligned;
    };

    const _checkEveryInRow = function(matrixToCheck) {
        let everyInRow = matrixToCheck.values.some(row => row.every(x => x));
        return everyInRow;
    };

    const _checkEveryInColumn = function(matrixToCheck) {
        let everyInColumn;
        for (let col = 0; col < matrixToCheck.cols; col++) {
            everyInColumn = matrixToCheck.values.map(row => row[col]).every(x => x);
            if (everyInColumn) {break;}
        }
        return everyInColumn;
    };

    const _checkEveryInDiagonals = function(matrixToCheck) {
        let takenInDiagonal = true, takenInBckwrdsDiagonal = true;
        let colsMaxIndex = matrixToCheck.cols - 1;
        for (let row in matrixToCheck.values) {
            takenInBckwrdsDiagonal &&= matrixToCheck.values[row][colsMaxIndex - row];
            takenInDiagonal &&= matrixToCheck.values[row][row];
        }
        return takenInBckwrdsDiagonal || takenInDiagonal;
    };

    const _checkIfAligned = function(matrixToCheck) {
        let alignedRow = _checkEveryInRow(matrixToCheck);
        let alignedCol = _checkEveryInColumn(matrixToCheck);
        let alignedDiag = _checkEveryInDiagonals(matrixToCheck);
        return alignedRow || alignedCol || alignedDiag;
    };

    const _playTurn = function(player) {
        this.textContent = player.getSymbol();
        this.classList.toggle("pa");
        const [row, col] = _determinePosition(this);
        _makeUnavailable(row, col);
        player.takeSquare(row, col);
        _switchPlayer();
        _disableElement(this);
        _declareWinner(player);
    };

    const _onClick = function() {
        if (_isPlayerTurn) {
            _playTurn.call(this, players[0]);
        }
        else {
            _playTurn.call(this, players[1]);
        }
    };

    const _addEvents = function(element) {
        element.addEventListener("click", _onClick);
    };

    nodesBoard.mapMatrix(_addEvents);

    /* Styling aid */
    const footer = document.querySelector("footer");
    const footerHeight = footer.offsetHeight;
    boardContainer.style.marginBottom = `calc(${footerHeight}px + min(5vh, 5vw))`;

    return {isAvailable};

}(Gameboard.nodesBoard, players);
