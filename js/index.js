
var player, 
    attactSide, 
    lastChess, 
    isCanvasSupport, 
    chessSize;

init();

/**
 * 遊戲初始化數值
 * 
 */
function init() {
    player = { 
        whiteSide: { key: 'white', chesses: [] }, 
        blackSide: { key: 'black', chesses: [] }
    };
    attackSide = 'whiteSide';
    isCanvasSupport = checkIsCanvasSupprot();
    chessSize = 60;
    console.log(isCanvasSupport);    
}

/**
 * 畫出棋盤
 * 
 */
(function createChessBoard() {
    var chessRow, 
        chessColumn, 
        chessColumnBlockRow, 
        chessColumnBlockItem, 
        blockColor,
        gridAmount,
        i, 
        j,
        k,
        m;

    var chessBoard = document.querySelector('.chessboard');
    var chessBoardRows = Math.floor(chessBoard.clientHeight / chessSize);
    var chessBoardColumns = Math.floor(chessBoard.clientWidth / chessSize);
    var gridPosition = ['top-left', 'top-right', 'bottom-left', 'bottom-right']

    for (i = 0; i < chessBoardRows; i++) {
        // 棋盤列
        chessRow = document.createElement('div');
        chessRow.classList.add('chessboard__row');
        for (j = 0; j < chessBoardColumns; j++) {
            // 棋盤欄
            chessColumn = document.createElement('div');
            chessColumn.classList.add('chessboard__column');
            chessColumn.classList.add('pointer');
            // 下棋事件
            chessColumn.onclick = function(event) { chess(event) };

            gridAmount = 0;

            for(k = 0; k < 2; k++) {
                chessColumnBlockRow = document.createElement('div');
                chessColumnBlockRow.classList.add('chessboard__grid');
                
                for(m = 0; m < 2; m++) {
                    chessColumnBlockItem = document.createElement('div');
                    chessColumnBlockItem.classList.add('chessboard__block');
                    blockColor = 'chessboard__block--' + gridPosition[gridAmount];
                    if (i === 0) {
                        if (j === 0) {
                            if (gridAmount === 2 || gridAmount === 3) {
                                chessColumnBlockItem.classList.add(blockColor);
                            }
                        } else if (j === (chessBoardColumns - 1)) {
                            if (gridAmount === 2 || gridAmount === 0) {
                                chessColumnBlockItem.classList.add(blockColor);
                            }
                        } else {
                            if (gridAmount !== 1) {
                                chessColumnBlockItem.classList.add(blockColor);
                            }
                        }
                    } else if (i === (chessBoardRows-1)) {
                        if (j === 0) {
                            if (gridAmount === 1 || gridAmount === 3) {
                                chessColumnBlockItem.classList.add(blockColor);
                            }
                        } else if (j === (chessBoardColumns - 1)) {
                            if (gridAmount === 0 || gridAmount === 1) {
                                chessColumnBlockItem.classList.add(blockColor);
                            }
                        } else {
                            if (gridAmount !== 2) {
                                chessColumnBlockItem.classList.add(blockColor);
                            }
                        }
                    } else {
                        if (j === 0) {
                            if (gridAmount !== 0) {
                                chessColumnBlockItem.classList.add(blockColor);
                            }
                        } else if (j === (chessBoardColumns-1)) {
                            if (gridAmount !== 3) {
                                chessColumnBlockItem.classList.add(blockColor);
                            }
                        } else {
                            chessColumnBlockItem.classList.add(blockColor);
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
})();

/**
 * 把新棋子放到棋盤上
 * 
 * @param {any} event 下棋事件
 */
function chess(event) {
    var target, player, chess;
    target = event.target;
    player = getPlayer();
    if (!checkClassExist(target.classList, 'chessboard__column')) {
        target = target.closest('.chessboard__column');
    }
    // 判斷棋格有沒有被選走
    if (!checkClassExist(target.classList, 'selected')) {
        if (isCanvasSupport) {
            chess = createCanvasChess(player);
        } else {
            chess = createDivChess(player);
        }        
        target.appendChild(chess);
        target.classList.add('selected');
        changeAttackPlayer();
        lastChess = chess;
    }
}

/**
 * 取得目前是哪個角色在下棋
 * 
 * @returns 現在下棋的角色
 */
function getPlayer() {
    return player[attackSide];
}

/**
 * 用canvas新增棋子
 * 
 * @param {any} player 目前下棋的角色
 * @returns {Element}
 */
function createCanvasChess(player) {
    var chessBox, chess;
    chessBox = document.createElement('canvas');
    chessBox.width = (chessSize / 2);
    chessBox.height = (chessSize / 2);
    chessBox.classList.add('chess');
    chess = chessBox.getContext("2d");
    chess.beginPath();
    chess.arc(15, 15, 15, 0, 2 * Math.PI);
    chess.fillStyle = player.key;
    chess.fill();
    return chessBox;
}

/**
 * 用div新增棋子
 * 
 * @param {any} player 目前下棋的角色
 * @returns {Element}
 */
function createDivChess(player) {
    var chess;
    chess = document.createElement('div');
    chess.classList.add('chess');
    chess.classList.add('chess__div');
    chess.classList.add('chess__div--' + player.key);
    return chess;
}

/**
 * 切換下棋角色
 * 
 */
function changeAttackPlayer() {
    if (attackSide === 'whiteSide') {
        attackSide = 'blackSide';
    } else {
        attackSide = 'whiteSide';
    }
}

/**
 * 判斷瀏覽器是否支援HTML5 Canvas
 * https://stackoverflow.com/questions/2745432/best-way-to-detect-that-html5-canvas-is-not-supported?answertab=active#tab-top
 * 
 * @returns {boolean} 
 */
function checkIsCanvasSupprot() {
    var canvas;
    canvas = document.createElement('canvas');
    return !!(canvas.getContext && canvas.getContext('2d'));
}

/**
 * 判斷指定的class是不是存在classList裡
 * 
 * @param {any} list classList
 * @param {any} className class
 * @returns {boolean} 
 */
function checkClassExist(list, className) {
    var isClassExist, 
        i;

    isClassExist = false;
    for (i = 0; i < list.length; i++) {
        if (list[i] === className) {
            isClassExist = true;
            break;
        }
    }
    return isClassExist;
}