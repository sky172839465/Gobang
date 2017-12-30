init();

function init() {
    createChessBoard();
}

function createChessBoard() {
    let chessRow, 
        chessColumn, 
        chessColumnBlockRow, 
        chessColumnBlockItem, 
        gridAmount,
        i, 
        j,
        k,
        m;

    const chessBoard = document.querySelector('.chessboard');
    const chessBoardRows = Math.floor(chessBoard.clientHeight / 60);
    const chessBoardColumns = Math.floor(chessBoard.clientWidth / 60);
    const gridPosition = ['top-left', 'top-right', 'bottom-left', 'bottom-right']

    for (i = 0; i < chessBoardRows; i++) {
        // 棋盤列
        chessRow = document.createElement('div');
        chessRow.classList.add('chessboard__row');
        for (j = 0; j < chessBoardColumns; j++) {
            // 棋盤欄
            chessColumn = document.createElement('div');
            chessColumn.classList.add('chessboard__column');
            chessColumn.classList.add('pointer');
            // 下棋
            chessColumn.onclick = event => chess(event);

            gridAmount = 0;

            for(k = 0; k < 2; k++) {
                chessColumnBlockRow = document.createElement('div');
                chessColumnBlockRow.classList.add('chessboard__grid');
                
                for(m = 0; m < 2; m++) {
                    chessColumnBlockItem = document.createElement('div');
                    chessColumnBlockItem.classList.add('chessboard__block');
                    // chessColumnBlockItem.innerText = `${gridAmount}`;
                    if (i === 0) {
                        if (j === 0) {
                            if (gridAmount === 2 || gridAmount === 3) {
                                chessColumnBlockItem.classList.add(`chessboard__block--${gridPosition[gridAmount]}`);
                            }
                        } else if (j === (chessBoardColumns - 1)) {
                            if (gridAmount === 2 || gridAmount === 0) {
                                chessColumnBlockItem.classList.add(`chessboard__block--${gridPosition[gridAmount]}`);
                            }
                        } else {
                            if (gridAmount !== 1) {
                                chessColumnBlockItem.classList.add(`chessboard__block--${gridPosition[gridAmount]}`);
                            }
                        }
                    } else if (i === (chessBoardRows-1)) {
                        if (j === 0) {
                            if (gridAmount === 1 || gridAmount === 3) {
                                chessColumnBlockItem.classList.add(`chessboard__block--${gridPosition[gridAmount]}`);
                            }
                        } else if (j === (chessBoardColumns - 1)) {
                            if (gridAmount === 0 || gridAmount === 1) {
                                chessColumnBlockItem.classList.add(`chessboard__block--${gridPosition[gridAmount]}`);
                            }
                        } else {
                            if (gridAmount !== 2) {
                                chessColumnBlockItem.classList.add(`chessboard__block--${gridPosition[gridAmount]}`);
                            }
                        }
                    } else {
                        if (j === 0) {
                            if (gridAmount !== 0) {
                                chessColumnBlockItem.classList.add(`chessboard__block--${gridPosition[gridAmount]}`);
                            }
                        } else if (j === (chessBoardColumns-1)) {
                            if (gridAmount !== 3) {
                                chessColumnBlockItem.classList.add(`chessboard__block--${gridPosition[gridAmount]}`);
                            }
                        } else {
                            chessColumnBlockItem.classList.add(`chessboard__block--${gridPosition[gridAmount]}`);
                        }
                    }
                    chessColumnBlockRow.appendChild(chessColumnBlockItem);
                    gridAmount++;                    
                }
                chessColumn.appendChild(chessColumnBlockRow);
            }

            chessRow.appendChild(chessColumn);
        }
        chessBoard.appendChild(chessRow);
    }
}

function chess(event) {
    let target = event.target;
    const chess = document.createElement('div');
    chess.classList.add('chess');
    chess.classList.add('chess--black');
    if (target.classList.value.indexOf('chessboard__column') === -1) {
        target = target.closest('.chessboard__column');
    }
    target.appendChild(chess);
    target.classList.add('selected');
}