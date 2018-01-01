
var player, 
    attackSide, 
    lastChess, 
    isCanvasSupport, 
    victoryConditionList;

var CHESS_SIZE = 60,
    VICTORY_CONDITION = 5,
    SLASH_DISTANCE = 1.414,
    STRAIGHT_DISTANCE = 1;

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
    var chessBoardRows = Math.floor(chessBoard.clientHeight / CHESS_SIZE);
    var chessBoardColumns = Math.floor(chessBoard.clientWidth / CHESS_SIZE);
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
function getOverlay(type) {
    var overlay;
    overlay = document.createElement('div');
    overlay.classList.add('chess__overlay');
    overlay.classList.add('chess__overlay--' + type);
    return overlay;
};

/**
 * 把新棋子放到棋盤上
 * 
 * @param {any} event 下棋事件
 */
function chess(event) {
    var target, 
        player, 
        chess,
        overlay;
    target = event.target;
    player = getPlayer();
    overlay = getOverlay('last');

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

        // 前一手棋移除最後一手的特效
        removeOverlay();

        // 把棋子放到十字上
        target.appendChild(chess);
        target.classList.add('selected');
        target.appendChild(overlay);
        lastChess = target;
        player.chesses.push(target);

        // 第一棋沒有最後一手
        if (lastChess) {
            // 判斷這一棋是不是將軍
            if (isCheckmate()) {
                console.log('checkmate ! ');
            } else {
                
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
    chessBox.width = (CHESS_SIZE / 2);
    chessBox.height = (CHESS_SIZE / 2);
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
 * 判斷是不是將軍了
 * 
 */
function isCheckmate() {
    var checkmat, 
        rangeChessList, 
        groupChessList, 
        group,
        sortChessList,
        checkmateChess,
        checkmateChessList;

    checkmat = false;
    rangeChessList = getRangeChesses();

    if (rangeChessList.length >= VICTORY_CONDITION) {
        groupChessList = getGroupChesses(rangeChessList);
        for (group in groupChessList) {
            if (groupChessList[group].length >= VICTORY_CONDITION) {
                sortChessList = getSortChesses(group, groupChessList[group]);
                checkmateChessList = getCheckmateChesses(group, sortChessList);
                if (checkmateChessList.length >= VICTORY_CONDITION) {
                    console.log(checkmateChessList);
                    removeOverlay();
                    for (i = 0; i < checkmateChessList.length; i++) {
                        checkmateChess = checkmateChessList[i];
                        checkmateChess.appendChild(getOverlay('victory'));
                    }
                    checkmat = true;
                    return checkmat;
                }
            }
        }
    }
    return checkmat;
}

/**
 * 把XY軸差距小於5的棋子拿進來，只有這些有機會將軍
 * 
 * @returns 
 */
function getRangeChesses() {
    var targetPosition, 
        chessList, 
        rangeChessList;
    targetPosition = getChessPosition(lastChess);
    chessList = player[attackSide].chesses;
    rangeChessList = chessList.filter(function(chess) {
        var item = chess.dataset;
        if (Math.abs((+item.X) - targetPosition.X) < VICTORY_CONDITION &&
            Math.abs((+item.Y) - targetPosition.Y) < VICTORY_CONDITION) {
            return true;
        } else {
            return false;
        }
    });
    return rangeChessList;
}

/**
 * 把棋子分組 (左上+右下), (左下+右上), (正上+正下), (正左+正右)
 * 
 * @param {any} chessList 
 * @returns 
 */
function getGroupChesses(chessList) {
    var targetPosition, 
        groupChessList,
        group,
        chess,
        asixX,
        asixY,
        i;
    targetPosition = getChessPosition(lastChess);
    groupChessList = {
        'leftTopToRightBottom': [],
        'leftBottomToRightTop': [],
        'vertical': [],
        'horizontal': []
    };

    for (i = 0; i < chessList.length; i++) {
        chess = chessList[i];
        var item = chess.dataset;
        asixX = Math.abs(+item.X - targetPosition.X);
        asixY = Math.abs(+item.Y - targetPosition.Y);
        // 和最後一手的位置相減一樣才會在同一條斜線上 EX: [(0,0), (1,1), (2,2)]
        if (asixX === asixY) {
            // 左上和右下
            if ((+item.X < targetPosition.X && +item.Y < targetPosition.Y) ||
                (+item.X > targetPosition.X && +item.Y > targetPosition.Y)) {
                groupChessList['leftTopToRightBottom'].push(chess);

            }
            // 左下和右上
            else if ((+item.X < targetPosition.X && +item.Y > targetPosition.Y) ||
                (+item.X > targetPosition.X && +item.Y < targetPosition.Y)) {
                groupChessList['leftBottomToRightTop'].push(chess);

            }
            // 將死一定要最後一手棋，所以放到每一組裡
            else if (+item.X === targetPosition.X && +item.Y === targetPosition.Y) {
                for (group in groupChessList) {
                    groupChessList[group].push(chess);
                }
            }
        } 
        // 垂直 X軸一樣
        else if (+item.X === targetPosition.X && +item.Y !== targetPosition.Y) {
            groupChessList['vertical'].push(chess);

        } 
        // 水平 Y軸一樣
        else if (+item.X !== targetPosition.X && +item.Y === targetPosition.Y) {
            groupChessList['horizontal'].push(chess);

        }
    };

    return groupChessList;
}

/**
 * 由小到大重新排列棋子
 * 
 * @param {string} group 分組名稱
 * @param {any} chessList 
 * @returns 
 */
function getSortChesses(group, chessList) {
    console.log(group);
    var sortChessList;
    switch(group) {
        // 只有水平方向差別在Y軸都一樣所以用X軸排序
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
        case 'leftTopToRightBottom':            
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

/**
 * 判斷這個棋子組有沒有將軍了
 * 
 * @param {string} group 分組名稱
 * @param {any} chessList 
 */
function getCheckmateChesses(group, chessList) {
    var onlineChessList, 
        prevPosition,
        nextPosition,
        expectDistance,
        actualDistance,
        i;

    onlineChessList = [];

    switch(group) {
        case 'leftTopToRightBottom':
        case 'leftBottomToRightTop':
            expectDistance = SLASH_DISTANCE;
            break;
        case 'vertical':
        case 'horizontal':
            expectDistance = STRAIGHT_DISTANCE;
            break;
    }

    for (i = 0; i < chessList.length; i++) {
        itemChess = chessList[i];
        if (onlineChessList.length === 0) {
            onlineChessList.push(itemChess);
        } else {
            prevPosition = getChessPosition(onlineChessList[onlineChessList.length-1]);
            nextPosition = getChessPosition(itemChess);
            // 前一個位置和目前位置的距離
            actualDistance = getChessDistance(prevPosition, nextPosition);
            // 和預期不一樣代表兩個棋子不是連在一起的
            if (expectDistance !== actualDistance) {
               onlineChessList.length = 0;
            }
            onlineChessList.push(itemChess);
        }

        if (onlineChessList.length >= VICTORY_CONDITION) {
            return onlineChessList;
        }
    }
    return onlineChessList;
}

/**
 * 取得最後一手棋的位置
 * 
 * @returns 
 */
function getChessPosition(target) {
    var targetPosition;
    targetPosition = { 
        X: +target.dataset.X, 
        Y: +target.dataset.Y 
    };
    return targetPosition;
}

/**
 * 計算一個棋子XY軸相加
 * 
 * @param {any} chess 
 * @returns 
 */
function chessCalculate(chess) {
    return (+chess.dataset.X) + (+chess.dataset.Y);
}

/**
 * 計算兩個棋子的距離
 * 
 * @param {any} a 
 * @param {any} b 
 * @returns 
 */
function getChessDistance(a, b) {
    var axisX, axisY;
    axisX = (+a.X) - (+b.X);
    axisY = (+a.Y) - (+b.Y);
    return +Math.pow((axisX * axisX + axisY * axisY), 0.5).toFixed(3);
}

/**
 * 刪除最後一手棋的特效
 * 
 */
function removeOverlay() {
    var overlayList,
        i;

    overlayList = document.getElementsByClassName('chess__overlay');
    for (i = 0; i < overlayList.length; i++) {
        overlayList[i].remove();
    }
}
