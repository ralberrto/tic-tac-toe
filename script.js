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

    let playerName = name;
    let won = false;
    let lost = false;

    const resetPlayer = function() {
        won = false;
        lost = false;
        takenSquares.populateMatrix(() => false);
    };

    const getName = function() {
        return playerName;
    };

    const chName = function(newName) {
        playerName = newName;
        return newName;
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

    const makeLoser = function() {
        lost = true;
    };

    const isLoser = function() {
        return lost;
    };

    return {getName, getSymbol, takeSquare, takenSquares,
        makeWinner, isWinner, makeLoser, isLoser, resetPlayer, chName};
};

players = [player("Beto", "X"), player("Enrique", "O")];

const flowController = function() {
    const isAvailable = matrix(3, 3, () => true);
    let _isPlayerTurn = true;

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

    const _checkIfWon = function(player) {
        const isWinner = _checkIfAligned(player.takenSquares);
        if (isWinner) {player.makeWinner()}
    };

    const _checkIfAligned = function(matrixToCheck) {
        let alignedRow = _checkEveryInRow(matrixToCheck);
        let alignedCol = _checkEveryInColumn(matrixToCheck);
        let alignedDiag = _checkEveryInDiagonals(matrixToCheck);
        return alignedRow || alignedCol || alignedDiag;
    };

    const _checkIfCanWin = function(player) {
        canTakeMatrix = player.takenSquares.compareToMatrix(isAvailable, (a, b) => a || b);
        const canWin = _checkIfAligned(canTakeMatrix);
        if (!canWin) {player.makeLoser()}
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
    
    const getIsPlayerTurn = function() {
        return _isPlayerTurn;
    };

    const catchSelection = function (element, player) {
        const [row, col] = _determinePosition(element);
        _makeUnavailable(row, col);
        player.takeSquare(row, col);
        displayController.disableElement(element);
        _checkIfWon(player);
        const player2 = players[Number(!Boolean(players.indexOf(player)))];
        _checkIfCanWin(player);
        _checkIfCanWin(player2);
        _switchPlayer();
    };

    return {catchSelection, isAvailable, getIsPlayerTurn};

}();

const displayController = function(nodesBoard, players) {
    const modalBox = document.getElementById("modal-box");
    const screen = document.getElementById("screen");
    const closeModalButton = document.querySelector("#modal-box #close");
    const replayButtons = Array.from(document.querySelectorAll("button.replay"));
    const playerContainers = Array.from(document.querySelectorAll(".player-cont"));
    const indicators = Array.from(document.querySelectorAll(".indicator"));

    const _displayPlayerNames = function(container) {
        const index = playerContainers.indexOf(container);
        const pName = document.createElement("input");
        const pSymbol = document.createElement("p");
        pName.setAttribute("type", "text");
        pName.setAttribute("placeholder", players[index].getName());
        pName.setAttribute("maxlength", 10);
        pSymbol.textContent = players[index].getSymbol();
        pSymbol.classList.add("symbol");
        container.appendChild(pName);
        container.appendChild(pSymbol);
    };

    playerContainers.forEach(_displayPlayerNames);
    const nameInputs = Array.from(document.querySelectorAll("input"));
    console.log(nameInputs);

    const _updateName = function() {
        const index = nameInputs.indexOf(this);
        players[index].chName(this.value.trim());
    };

    nameInputs.forEach(element => element.addEventListener("input", _updateName));

    const _clearBoard = function() {
        _closeModal();
        nodesBoard.mapMatrix((element) => {
            element.textContent = "";
            element.classList.remove("disabled");
            _addEvents(element);
        });
        players.forEach(player => player.resetPlayer());
        flowController.isAvailable.populateMatrix(() => true);
        _highlightPlayer();
    };

    replayButtons.forEach(button => button.addEventListener("click", _clearBoard));

    const disableElement = function(element) {
            element.removeEventListener("click", _onClick);
            element.classList.add("disabled");
    };

    const _closeModal = function() {
        modalBox.classList.remove("on");
        screen.classList.remove("on");
        nodesBoard.mapMatrix(disableElement);
    };

    closeModalButton.addEventListener("click", _closeModal);

    const _declareWinner = function(player) {
        const pName = document.querySelector("#modal-box .player-name");
        const pMessage = document.getElementById("message");
        pName.textContent = "¡" + player.getName();
        pMessage.textContent = "ha ganado!";
        modalBox.classList.toggle("on");
        screen.classList.toggle("on");
    };

    const _declareDraw = function() {
        const pName = document.querySelector("#modal-box .player-name");
        const pMessage = document.getElementById("message");
        pName.textContent = "¡Es un";
        pMessage.textContent = "empate!";
        modalBox.classList.toggle("on");
        screen.classList.toggle("on");
        _highlightPlayer(true);
    };

    const _highlightPlayer = function(none=false) {
        const index = flowController.getIsPlayerTurn() ? 0 : 1;
        const index2 = Number(!Boolean(index));
        if (!none) {
            indicators[index].classList.add("active");
            indicators[index2].classList.remove("active");
        }
        else {
            indicators[index].classList.remove("active");
            indicators[index2].classList.remove("active");
        }
    };

    const _onClick = function() {
        const player = flowController.getIsPlayerTurn() ? players[0] : players[1];
        flowController.catchSelection(this, player);
        this.textContent = player.getSymbol();
        if (player.isWinner()) {_declareWinner(player);}
        else if (player.isLoser()){
            const player2 = players[Number(!Boolean(players.indexOf(player)))];
            if (player2.isLoser()) {_declareDraw();}
        }
        else {_highlightPlayer()};
    };

    const _addEvents = function(element) {
        element.addEventListener("click", _onClick);
    };

    _highlightPlayer();
    nodesBoard.mapMatrix(_addEvents);

    return {disableElement};

}(Gameboard.nodesBoard, players);
