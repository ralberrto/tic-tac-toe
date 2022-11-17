
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

    const _populateMatrix = function() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                values[i][j] = functionToPopulate(i, j);
            }
        }
    }();

    const mapArray = function(functionToApply) {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j <cols; j++) {
                functionToApply(values[i][j]);
            }
        }
    };

    const compareToMatrix = function(matrix, comparison) {
        console.log("Hello, world");
    };
    return {rows, cols, values, mapArray, compareToMatrix};
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
    nodesBoard.mapArray(_renderBoard);

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
    
    const makeWinner = function() {
        won = true;
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

    const _disableElement = function(element) {
            element.removeEventListener("click", _onClick);
            element.classList.add("disabled");
    };

    const _closeModal = function() {
        modalBox.classList.toggle("on");
        screen.classList.toggle("on");
        nodesBoard.mapArray(_disableElement);
    };

    closeModalButton.addEventListener("click", _closeModal);

    const isAvailable = matrix(3, 3, () => true);

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
        const isWinner = _checkIfWon(player);
        if (isWinner) {
            player.makeWinner()
            const pName = document.querySelector("#modal-box .player-name");
            const pMessage = document.getElementById("message");
            pName.textContent = player.getName();
            pMessage.textContent = "ha ganado!";
            modalBox.classList.toggle("on");
            screen.classList.toggle("on");
        }
    };

    const _checkIfCanWin = function(player) {
    };

    const _checkIfWon = function(player) {
        /* Check for rows */
        const takenByPlayer = player.takenSquares.values;
        let wonRow = takenByPlayer.some((row) => row.every((x) => x));

        /* Check for columns */
        let wonCol;
        for (let col in takenByPlayer[0]) {
            wonCol = takenByPlayer.map(row => row[col]).every(x => x);
            if (wonCol) {break;}
        }

        /* Check for diagonals */
        let takenInDiagonal = true, takenInBckwrdsDiagonal = true;
        let colsMaxIndex = takenByPlayer[0].length - 1;
        for (let row in takenByPlayer) {
            takenInBckwrdsDiagonal &&= takenByPlayer[row][colsMaxIndex - row];
            takenInDiagonal &&= takenByPlayer[row][row];
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

    const _addEvents = function(element) {
        element.addEventListener("click", _onClick);
    };

    nodesBoard.mapArray(_addEvents);

    /* Styling aid */
    const footer = document.querySelector("footer");
    const footerHeight = footer.offsetHeight;
    boardContainer.style.marginBottom = `calc(${footerHeight}px + min(5vh, 5vw))`;

    return {isAvailable};

}(Gameboard.nodesBoard, players);
