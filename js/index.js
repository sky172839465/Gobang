
var player, 
    attackSide, 
    lastChess, 
    lastChessOverlay,
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
    // console.log(isCanvasSupport);
}

function test() {
    console.log(player);
    // isCheckmate();
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
            chessColumn.dataset.Y = i;
            chessColumn.dataset.X = j;            
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
 * 建立下最後一手的棋格背景
 * 
 */
(function newOverlay() {
    var overlay;
    overlay = document.createElement('div');
    overlay.classList.add('chess--overlay');
    lastChessOverlay = overlay;
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

    // 判斷點到的是不是十字棋格，不是的話就找到最近的棋格
    if (!isClassExist(target.classList, 'chessboard__column')) {
        target = target.closest('.chessboard__column');
    }
    // 判斷棋格有沒有被選走
    if (!isClassExist(target.classList, 'selected')) {
        if (isCanvasSupport) {
            chess = createCanvasChess(player);
        } else {
            chess = createDivChess(player);
        }

        // 把棋子放到十字上
        target.appendChild(chess);
        target.classList.add('selected');
        target.appendChild(lastChessOverlay);
        lastChess = target;
        player.chesses.push(target);

        // 第一棋沒有最後一手
        if (lastChess) {
            lastChess.classList.remove('chess--last');

            // 判斷這一棋是不是將死
            if (isCheckmate()) {
            
            }      
        }
        changeAttackPlayer();
        // changeAttackPlayer();
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
function isClassExist(list, className) {
    var classExist, 
        i;

    classExist = false;
    for (i = 0; i < list.length; i++) {
        if (list[i] === className) {
            classExist = true;
            break;
        }
    }
    return classExist;
}

/**
 * 判斷是不是將死了
 * 
 */
function isCheckmate() {
    var checkmat, 
        rangeChessList, 
        groupChessList, 
        group,
        sortChessList;
    checkmat = false;
    rangeChessList = getRangeChesses();
    if (rangeChessList.length >= 5) {
        groupChessList = getGroupChesses(rangeChessList);
        for (group in groupChessList) {
            if (groupChessList[group].length >= 5) {
                sortChessList = getSortChesses(group, groupChessList[group]);
                groupChessList[group] = sortChessList;
            }
        }
        console.log(groupChessList);
    }
    return checkmat;
}

/**
 * 把XY軸差距小於5的棋子拿進來，只有這些有機會將死
 * 
 * @returns 
 */
function getRangeChesses() {
    var targetPosition, 
        chessList, 
        rangeChessList;
    targetPosition = gettargetPosition();
    chessList = player[attackSide].chesses;
    rangeChessList = chessList.filter(function(chess) {
        var item = chess.dataset;
        if (Math.abs((+item.X) - targetPosition.X) <= 4 &&
            Math.abs((+item.Y) - targetPosition.Y) <= 4) {
            return true;
        } else {
            return false;
        }
    });
    return rangeChessList;
}

/**
 * 把棋子分成 (左上+右下), (左下+右上), (正上+正下), (正左+正右)
 * 
 * @param {any} chessList 
 * @returns 
 */
function getGroupChesses(chessList) {
    var targetPosition, 
        groupChessList,
        group;
    targetPosition = gettargetPosition();
    groupChessList = {
        'leftTopToRightBottom': [],
        'leftBottomToRightTop': [],
        'vertical': [],
        'horizontal': []
    };

    chessList.forEach(function(chess) {
        var item = chess.dataset;
        if ((+item.X < targetPosition.X && +item.Y > targetPosition.Y) ||
            (+item.X > targetPosition.X && +item.Y < targetPosition.Y)) {
            groupChessList['leftTopToRightBottom'].push(chess);

        } else if ((+item.X > targetPosition.X && +item.Y > targetPosition.Y) ||
            (+item.X < targetPosition.X && +item.Y < targetPosition.Y)) {
            groupChessList['leftBottomToRightTop'].push(chess);

        }else if (+item.X === targetPosition.X && +item.Y !== targetPosition.Y) {
            groupChessList['vertical'].push(chess);

        } else if (+item.X !== targetPosition.X && +item.Y === targetPosition.Y) {
            groupChessList['horizontal'].push(chess);

        } else {
            for(group in groupChessList) {
                groupChessList[group].push(chess);
            }
        }
    });

    return groupChessList;
}

/**
 * 取得最後一手棋的位置
 * 
 * @returns 
 */
function gettargetPosition() {
    var targetPosition;
    targetPosition = { 
        X: +lastChess.dataset.X, 
        Y: +lastChess.dataset.Y 
    };
    return targetPosition;
}

/**
 * 由小到大重新排列棋子
 * 
 * @param {any} group 
 * @param {any} chessList 
 * @returns 
 */
function getSortChesses(group, chessList) {
    console.log(group);
    var sortChessList;
    switch(group) {
        case 'leftTopToRightBottom':
        case 'horizontal':
            sortChessList = chessList.sort(function(a, b) {
                if (+a.dataset.X > +b.dataset.X) {
                    return 1;
                } else if (+a.dataset.X < +b.dataset.X) {
                    return -1;
                } 
                return 0;
            });
            break;
        case 'leftBottomToRightTop':
        case 'vertical':
            sortChessList = chessList.sort(function(a, b) {
                if (+a.dataset.Y > +b.dataset.Y) {
                    return 1;
                } else if (+a.dataset.Y < +b.dataset.Y) {
                    return -1;
                } 
                return 0;
            });
            break;
    }
    return sortChessList;
}