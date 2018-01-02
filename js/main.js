(function() {

    var gobang = {};

    var player, 
        attackSide, 
        lastChess, 
        isCanvasSupport, 
        victoryConditionList,
        gameoverElement;

    var CHESS_SIZE = 60,
        VICTORY_CONDITION = 5,
        SLASH_DISTANCE = 1.414,
        STRAIGHT_DISTANCE = 1;

    gobang = {
        start: start,
        init: init,
        cleanChessBoard: cleanChessBoard,
        checkIsCanvasSupprot: checkIsCanvasSupprot,
        getOverlay: getOverlay,
        chess: chess,
        getPlayer: getPlayer,
        createCanvasChess: createCanvasChess,
        createDivChess: createDivChess,
        changeAttackPlayer: changeAttackPlayer,
        isCheckmate: isCheckmate,
        removeOverlay: removeOverlay,
        setVictoryChesses: setVictoryChesses,
        setVictoryMessage: setVictoryMessage
    }

    /**
     * 開始遊戲
     * 
     * @param {any} event 
     */
    function start(event) {
        event.target.innerText = 'Restart';
        init();
        cleanChessBoard();
    }

    /**
     * 遊戲初始化數值
     * 
     */
    function init() {
        gameoverElement.classList.add('gameover--hide');
        player = { 
            whiteSide: { key: 'white', chesses: [] }, 
            blackSide: { key: 'black', chesses: [] }
        };
        attackSide = 'whiteSide';
        isCanvasSupport = checkIsCanvasSupprot();
    }

    /**
     * 清理棋盤，把棋子、旗子特效、禁止選擇棋格都清除
     * 
     */
    function cleanChessBoard() {
        var chessColumn,
            chesses,
            overlays,
            i,
            j;
        
        chessColumn = document.getElementsByClassName('selected');
        chesses = document.getElementsByClassName('chessman');
        overlays = document.getElementsByClassName('chessman__overlay');

        while(chessColumn.length > 0){
            chessColumn[0].classList.remove('selected');
        }

        while(chesses.length > 0){
            chesses[0].parentNode.removeChild(chesses[0]);
        }
        
        while(overlays.length > 0){
            overlays[0].parentNode.removeChild(overlays[0]);
        }    
    }

    /**
     * 用canvas畫出棋格
     * 
     * @param {any} chessboard 
     */
    function drawGridByCanvas(chessboard) {
        var canvas,
            context,
            stepX = 0, 
            stepY = 0, 
            lineWidth = 1, 
            color = 'black';

        canvas = document.createElement("canvas");
        canvas.classList.add('chessboard__canvas');
        canvas.width = Math.round(chessboard.clientWidth / CHESS_SIZE) * CHESS_SIZE - (CHESS_SIZE - 1);
        canvas.height = Math.round(chessboard.clientHeight / CHESS_SIZE) * CHESS_SIZE - (CHESS_SIZE - 1);
        context = canvas.getContext("2d");

        context.save();  
        context.lineWidth = lineWidth;  
        context.strokeStyle = color;  
        for(var i = stepY + 0.5 ; i < context.canvas.height; i += CHESS_SIZE){  
            context.beginPath();  
            context.moveTo(0, i);  
            context.lineTo(context.canvas.width, i);  
            context.stroke();
        }
  
        for(var i = stepX + 0.5; i < context.canvas.width; i += CHESS_SIZE){  
            context.beginPath();  
            context.moveTo(i, 0);  
            context.lineTo(i, context.canvas.height);  
            context.stroke();
        }  
        context.restore();

        chessboard.appendChild(canvas);
    }

    /**
     * 用div畫出棋格
     * 
     * @param {any} chessboardRows 
     * @param {any} chessboardColumns 
     * @param {any} chessColumn 
     * @param {any} i 
     * @param {any} j 
     * @returns 
     */
    function drawGridByDiv(chessboardRows, chessboardColumns, chessColumn, i, j) {
        var chessColumnBlockRow,
            chessColumnBlockItem,
            blockColor,
            gridPosition,
            gridAmount,
            k,
            m;

        gridAmount = 0;
        gridPosition = ['top-left', 'top-right', 'bottom-left', 'bottom-right']

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
                    } else if (j === (chessboardColumns - 1)) {
                        if (gridAmount === 2 || gridAmount === 0) {
                            chessColumnBlockItem.classList.add(blockColor);
                        }
                    } else {
                        if (gridAmount !== 1) {
                            chessColumnBlockItem.classList.add(blockColor);
                        }
                    }
                } else if (i === (chessboardRows-1)) {
                    if (j === 0) {
                        if (gridAmount === 1 || gridAmount === 3) {
                            chessColumnBlockItem.classList.add(blockColor);
                        }
                    } else if (j === (chessboardColumns - 1)) {
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
                    } else if (j === (chessboardColumns-1)) {
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

        return chessColumn;
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
        // return false;
    }

    /**
     * 建立下最後一手的棋格背景
     * 
     */
    function getOverlay(type) {
        var overlay;
        overlay = document.createElement('div');
        overlay.classList.add('chessman__overlay');
        if (!isCanvasSupport) {
            overlay.classList.add('chessman__overlay--div');
        }        
        overlay.classList.add('chessman__overlay--' + type);
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
        if (target.className.indexOf('chessboard__column') === -1) {
            target = target.closest('.chessboard__column');
        }

        // 判斷棋格有沒有被選走
        if (target.className.indexOf('selected') === -1) {
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
                    // console.log('checkmate ! ');
                    setVictoryMessage(attackSide);
                }
            }
            changeAttackPlayer();
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
        chessBox.classList.add('chessman');
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
        chess.classList.add('chessman');
        chess.classList.add('chessman__div');
        chess.classList.add('chessman__div--' + player.key);
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
     * 判斷是不是將軍了
     * 
     */
    function isCheckmate() {
        var checkmat, 
            rangeChessList, 
            groupChessList, 
            group,
            sortChessList,
            checkmateChessList,
            expectDistance;

        checkmat = false;
        rangeChessList = chessQuery.getRangeChesses(VICTORY_CONDITION, lastChess, player, attackSide);

        if (rangeChessList.length >= VICTORY_CONDITION) {
            groupChessList = chessQuery.getGroupChesses(rangeChessList, lastChess);
            for (group in groupChessList) {
                if (groupChessList[group].length >= VICTORY_CONDITION) {

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

                    sortChessList = chessQuery.getSortChesses(group, groupChessList[group]);
                    checkmateChessList = chessQuery.getCheckmateChesses(VICTORY_CONDITION, expectDistance, sortChessList);
                    if (checkmateChessList.length >= VICTORY_CONDITION) {
                        setVictoryChesses(checkmateChessList);
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
    function removeOverlay() {
        var overlayList,
            i;

        overlayList = document.getElementsByClassName('chessman__overlay');
        while(overlayList.length > 0) {
            overlayList[0].parentNode.removeChild(overlayList[0]);
        }
    }

    /**
     * 高亮連線的棋子
     * 
     * @param {any} chessList 
     */
    function setVictoryChesses(chessList) {
        var checkmateChess, 
            childNodes,
            i,
            j;
        removeOverlay(chessList);
        gameoverElement.classList.remove('gameover--hide');
        for (i = 0; i < chessList.length; i++) {
            checkmateChess = chessList[i];
            if (isCanvasSupport) {
                checkmateChess.classList.add('chessboard__column--victory');
            }
            childNodes = checkmateChess.childNodes;
            for (j = 0; j < childNodes.length; j++) {
                if (childNodes[j].className.indexOf('chessman') !== -1) {
                    childNodes[j].classList.add('chessman--victory');
                }
            }
            checkmateChess.appendChild(getOverlay('victory'));
        }
    }

    /**
     * 顯示勝利者是誰的訊息
     * 
     * @param {any} side 
     */
    function setVictoryMessage(side) {
        var message = document.getElementsByClassName('gameover__message')[0];
        message.innerText = 'Winner is ' + side + ' !';
    }    

    window.gobang = gobang;

    /**
     * 畫出棋盤
     * 
     */
    (function createChessBoard() {
        var chessRow, 
            chessColumn,
            gridChessColumn,
            i, 
            j;

        var chessboard = document.querySelector('.chessboard');
        var chessboardRows = Math.floor(chessboard.clientHeight / CHESS_SIZE);
        var chessboardColumns = Math.floor(chessboard.clientWidth / CHESS_SIZE);

        if (checkIsCanvasSupprot()) {
            drawGridByCanvas(chessboard);
        }        

        for (i = 0; i < chessboardRows; i++) {
            // 棋盤列
            chessRow = document.createElement('div');
            chessRow.classList.add('chessboard__row');
            for (j = 0; j < chessboardColumns; j++) {
                // 棋盤欄
                chessColumn = document.createElement('div');
                chessColumn.classList.add('chessboard__column');
                chessColumn.classList.add('pointer');
                chessColumn.dataset.Y = i;
                chessColumn.dataset.X = j;            
                // 下棋事件
                chessColumn.onclick = function(event) { chess(event) };

                if (checkIsCanvasSupprot()) { 
                    chessColumn.classList.add('chessboard__column--canvas');
                    chessRow.appendChild(chessColumn);
                } else {
                    chessColumn.classList.add('chessboard__column--div');
                    gridChessColumn = drawGridByDiv(chessboardRows, chessboardColumns, chessColumn, i, j);
                    chessRow.appendChild(gridChessColumn);
                }
            }
            chessboard.appendChild(chessRow);
        }
    })();

    /**
     * 取得遊戲結束時要顯示的背景
     * 
     */
    (function getGameoverElement() {
        gameoverElement = document.getElementsByClassName('gameover')[0];
    })();

})();

function start(event) {
    gobang.start(event);
}
