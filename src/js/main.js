import * as chessDefined from './chess-defined';
import * as chessQuery from './chess-query';
import * as byCanvas from './draw-by-canvas';
import * as byDiv from './draw-by-div';

let player, attackSide, lastChess, checkmateChessList,
    getChessboardGrid, createChess,
    chessOverlayStyles = [],
    gameoverElement = document.querySelector('.gameover'),
    gobang = {};

/**
 * 判斷瀏覽器支援不支援canvas, 不支援就改用div提供繪圖
 * https://stackoverflow.com/questions/2745432/best-way-to-detect-that-html5-canvas-is-not-supported?answertab=active#tab-top
 * 
 * @returns {boolean} 
 */
const setCommonFunction = () => {
    let canvas, isCanvasSupport;
    canvas = document.createElement('canvas');
    isCanvasSupport = !!(canvas.getContext && canvas.getContext('2d'));

    if (isCanvasSupport) {
        getChessboardGrid = byCanvas.getGrid;
        createChess = byCanvas.createChess;
        chessOverlayStyles = byCanvas.overlayStyles;
    } else {
        getChessboardGrid = byDiv.getGrid;
        createChess = byDiv.createChess;
        chessOverlayStyles = byDiv.overlayStyles;
    }
}    

/**
 * 開始遊戲
 * 
 * @param {any} event 
 */
const start = (event) => {
    event.target.innerText = 'Restart';
    setCommonFunction();
    init();
    cleanChessBoard();
    createChessBoard();
}

/**
 * 遊戲初始化數值
 * 
 */
const init = () => {
    gameoverElement.classList.add('gameover--hide');
    gobang.player = { 
        whiteSide: { key: 'white', chesses: [] }, 
        blackSide: { key: 'black', chesses: [] }
    };
    gobang.attackSide = 'whiteSide';
    gobang.checkmateChessList = [];
}

/**
 * 清理棋盤，把棋子、旗子特效、禁止選擇棋格都清除
 * 
 */
const cleanChessBoard = () => {
    let chessboard;
    chessboard = document.querySelector('.chessboard');

    chessboard.setAttribute('style', 'width:' + chessboard.clientWidth + 'px');
    chessboard.style.width= chessboard.clientWidth + 'px';

    while(chessboard.childNodes.length > 0){
        chessboard.childNodes[0].parentNode.removeChild(chessboard.childNodes[0]);
    }
}

/**
 * 畫出棋盤
 * 
 */
const createChessBoard = () => {
    let chessRow, chessColumn, chessBoardGrid, gridWidth, gridHeight, 
        chessboard, chessboardRows, chessboardColumns, i, j;

    chessboard = document.querySelector('.chessboard');
    // 棋格列數
    chessboardRows = Math.floor(chessboard.clientHeight / chessDefined.CHESS_SIZE);
    // 棋格欄數
    chessboardColumns = Math.floor(chessboard.clientWidth / chessDefined.CHESS_SIZE);
    gridWidth = chessboardColumns * chessDefined.CHESS_SIZE - (chessDefined.CHESS_SIZE - 1);
    gridHeight = chessboardRows * chessDefined.CHESS_SIZE - (chessDefined.CHESS_SIZE - 1);

    // 準備畫圖時把棋盤寬度定死，避免調整瀏覽器大小的時候影響棋格
    chessboard.setAttribute('style', 'width:' + chessboard.clientWidth + 'px');
    chessboard.style.width= chessboard.clientWidth + 'px';

    // 畫出棋盤
    chessBoardGrid = getChessboardGrid(gridWidth, gridHeight);
    chessboard.appendChild(chessBoardGrid);

    // 畫出透明棋格讓棋子看起來像是在線的交叉點上
    for (i = 0; i < chessboardRows; i++) {
        // 棋盤列
        chessRow = document.createElement('div');
        chessRow.classList.add('chessboard__row');
        for (j = 0; j < chessboardColumns; j++) {
            // 棋盤欄
            chessColumn = document.createElement('div');
            chessColumn.classList.add('chessboard__column');
            chessColumn.classList.add('pointer');
            chessColumn.setAttribute('data-asix-x', j);
            chessColumn.setAttribute('data-asix-y', i);
            // chessColumn.dataset.asixX = j;
            // chessColumn.dataset.asixY = i;
            // 下棋事件
            chessColumn.onclick = (event) => { chess(event) };
            chessRow.appendChild(chessColumn);
        }
        chessboard.appendChild(chessRow);
    }
}

/**
 * 建立下最後一手的棋格背景
 * 
 */
const getOverlay = (type) => {
    let overlay;
    
    overlay = document.createElement('div');
    chessOverlayStyles.forEach((chessOverlayStyle) => {
        overlay.classList.add(chessOverlayStyle);
    });
    overlay.classList.add('chessman__overlay--' + type);

    return overlay;
};

/**
 * 取得目前是哪個角色在下棋
 * 
 * @returns 現在下棋的角色
 */
const getPlayer = () => {
    return gobang.player[gobang.attackSide];
}

/**
 * 切換下棋角色
 * 
 */
const changeAttackPlayer = (side) => {
    if (side === 'whiteSide') {
        return 'blackSide';
    } else {
        return 'whiteSide';
    }
}    

/**
 * 把新棋子放到棋盤上
 * 
 * @param {any} event 下棋事件
 */
const chess = (event) => {
    let target, player, overlay, chess;

    target = event.target;
    player = getPlayer();
    overlay = getOverlay('last');

    // 判斷點到的是不是十字棋格，不是的話就找到最近的棋格
    if (target.className.indexOf('chessboard__column') === -1) {
        target = target.closest('.chessboard__column');
    }

    // 判斷棋格有沒有被選走
    if (target.className.indexOf('selected') === -1) {
        chess = createChess(player);

        // 前一手棋移除最後一手的特效
        removeOverlay();

        // 把棋子放到十字上
        target.appendChild(chess);
        target.appendChild(overlay);
        target.classList.add('selected');
        gobang.lastChess = target;
        player.chesses.push(target);

        // 第一棋沒有最後一手
        if (gobang.lastChess) {
            // 判斷這一棋是不是將軍
            if (isCheckmate()) {
                // console.log('checkmate ! ');
                removeOverlay();
                setVictoryChesses(gobang.checkmateChessList);
                setVictoryMessage(gobang.attackSide);
            }
        }
        gobang.attackSide = changeAttackPlayer(gobang.attackSide);
    }
}

/**
 * 判斷是不是將軍了
 * 
 */
const isCheckmate = () => {
    let attackPlayer, rangeChessList, groupChessList, group, sortChessList, expectDistance,
        checkmat;

    checkmat = false;
    attackPlayer = getPlayer();
    rangeChessList = chessQuery.getRangeChesses(chessDefined.VICTORY_CONDITION, gobang.lastChess, attackPlayer);

    // 範圍內棋子數量不足獲勝條件的棋子數就不需要判斷
    if (rangeChessList.length >= chessDefined.VICTORY_CONDITION) {
        groupChessList = chessQuery.getGroupChesses(gobang.lastChess, rangeChessList);
        for (group in groupChessList) {
            // 分組內棋子不足獲勝條件的棋子數就不需要判斷
            if (groupChessList[group].length >= chessDefined.VICTORY_CONDITION) {
                sortChessList = chessQuery.getSortChesses(group, groupChessList[group]);
                expectDistance = getExpectDistance(group);
                gobang.checkmateChessList = chessQuery.getConnectChesses(chessDefined.VICTORY_CONDITION, expectDistance, sortChessList);

                // 連線棋子到達獲利條件的棋子數量代表獲勝了
                if (gobang.checkmateChessList.length >= chessDefined.VICTORY_CONDITION) {
                    checkmat = true;
                    return checkmat;
                }
            }
        }
    }

    return checkmat;
}

/**
 * 刪除最後一手棋的特效
 * 
 */
const removeOverlay = () => {
    var overlayList;

    overlayList = document.getElementsByClassName('chessman__overlay');
    while(overlayList.length > 0) {
        overlayList[0].parentNode.removeChild(overlayList[0]);
    }
}

/**
 * 取得預期兩顆棋子的直線距離
 * 
 * @param {any} group 
 */
const getExpectDistance = (group) => {
    let expectDistance;

    switch(group) {
        case 'leftTopToRightBottom':
        case 'leftBottomToRightTop':
            expectDistance = chessDefined.SLASH_DISTANCE;
            break;
        case 'vertical':
        case 'horizontal':
            expectDistance = chessDefined.STRAIGHT_DISTANCE;
            break;
    }
    
    return expectDistance;
}

/**
 * 高亮連線的棋子
 * 
 * @param {any} chessList 
 */
const setVictoryChesses = (chessList) => {
    let checkmateChess, childNodes, victoryOverlay, i, j;

    for (i = 0; i < chessList.length; i++) {
        checkmateChess = chessList[i];
        checkmateChess.classList.add('chessboard__column--victory');

        childNodes = checkmateChess.childNodes;
        for (j = 0; j < childNodes.length; j++) {
            if (childNodes[j].className.indexOf('chessman') !== -1) {
                childNodes[j].classList.add('chessman--victory');
            }
        }
        victoryOverlay = getOverlay('victory');
        checkmateChess.appendChild(victoryOverlay);
    }
}

/**
 * 顯示勝利者是誰的訊息
 * 
 * @param {any} side 
 */
const setVictoryMessage = (side) => {
    let message;
    
    message = document.querySelector('.gameover__message');
    message.innerText = 'Winner is ' + side + ' !';
    gameoverElement.classList.remove('gameover--hide');
}

export { start };