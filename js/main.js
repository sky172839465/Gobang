(function() {

    var gobang = {};

    var player, attackSide, lastChess, isCanvasSupport, gameoverElement, checkmateChessList;

    var CHESS_SIZE = 60,
        VICTORY_CONDITION = 5,
        SLASH_DISTANCE = 1.414,
        STRAIGHT_DISTANCE = 1;

    isCanvasSupport = checkIsCanvasSupprot(),
    gameoverElement = document.querySelector('.gameover');

    // defined global variable in this IIFE
    gobang = {
        // output function 
        start: start,
        // global variables
        player: player,
        attackSide: attackSide,
        lastChess: lastChess,
        isCanvasSupport: isCanvasSupport,
        gameoverElement: gameoverElement,
        checkmateChessList: checkmateChessList
    }

    window.gobang = gobang;    

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
     * 開始遊戲
     * 
     * @param {any} event 
     */
    function start(event) {
        event.target.innerText = 'Restart';
        init();
        cleanChessBoard();
        createChessBoard();
    }

    /**
     * 遊戲初始化數值
     * 
     */
    function init() {
        gobang.gameoverElement.classList.add('gameover--hide');
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
    function cleanChessBoard() {
        var chessboard;
        
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
    function createChessBoard() {
        var chessRow, chessColumn, gridByDiv, gridByCanvas, gridWidth, gridHeight, 
            chessboard, chessboardRows, chessboardColumns, i, j;

        chessboard = document.querySelector('.chessboard');
        // 棋格列數
        chessboardRows = Math.floor(chessboard.clientHeight / CHESS_SIZE);
        // 棋格欄數
        chessboardColumns = Math.floor(chessboard.clientWidth / CHESS_SIZE);
        gridWidth = chessboardColumns * CHESS_SIZE - (CHESS_SIZE - 1);
        gridHeight = chessboardRows * CHESS_SIZE - (CHESS_SIZE - 1);

        // 準備畫圖時把棋盤寬度定死，避免調整瀏覽器大小的時候影響棋格
        chessboard.setAttribute('style', 'width:' + chessboard.clientWidth + 'px');
        chessboard.style.width= chessboard.clientWidth + 'px';

        if (gobang.isCanvasSupport) {
            gridByCanvas = getGridByCanvas(gridWidth, gridHeight);
            chessboard.appendChild(gridByCanvas);
        } else {
            gridByDiv = getGridByDiv(gridWidth, gridHeight);
            chessboard.appendChild(gridByDiv);
        }

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
                chessColumn.onclick = function(event) { chess(event) };
                chessRow.appendChild(chessColumn);
            }
            chessboard.appendChild(chessRow);
        }
    }    

    /**
     * 用canvas畫出棋格
     * 
     * @param {any} chessboard 
     */
    function getGridByCanvas(gridWidth, gridHeight) {
        var canvas, context,
            stepX = 0, 
            stepY = 0, 
            lineWidth = 1, 
            color = 'black',
            i;

        canvas = document.createElement("canvas");
        canvas.classList.add('chessboard__grid');
        canvas.width = gridWidth;
        canvas.height = gridHeight;
        context = canvas.getContext("2d");

        context.save();  
        context.lineWidth = lineWidth;  
        context.strokeStyle = color; 

        for(i = stepY + 0.5 ; i < context.canvas.height; i += CHESS_SIZE){  
            context.beginPath();  
            context.moveTo(0, i);  
            context.lineTo(context.canvas.width, i);  
            context.stroke();
        }
  
        for(i = stepX + 0.5; i < context.canvas.width; i += CHESS_SIZE){  
            context.beginPath();  
            context.moveTo(i, 0);  
            context.lineTo(i, context.canvas.height);  
            context.stroke();
        }  

        context.restore();

        return canvas;
    }

    /**
     * 用div畫出棋格 (.chessboard__grid--div)
     * 
     * @param {any} div 
     * @returns 
     */
    function getGridByDiv(gridWidth, gridHeight) {
        var div;

        div = document.createElement('div');
        div.style.width = gridWidth + 'px';
        div.style.height = gridHeight + 'px';
        div.classList.add('chessboard__grid');
        div.classList.add('chessboard__grid--div');

        return div;
    }

    /**
     * 建立下最後一手的棋格背景
     * 
     */
    function getOverlay(type) {
        var overlay;
        
        overlay = document.createElement('div');
        overlay.classList.add('chessman__overlay');
        
        if (!gobang.isCanvasSupport) {
            overlay.classList.add('chessman__overlay--div');
        }
        
        overlay.classList.add('chessman__overlay--' + type);

        return overlay;
    };

    /**
     * 取得目前是哪個角色在下棋
     * 
     * @returns 現在下棋的角色
     */
    function getPlayer() {
        return gobang.player[gobang.attackSide];
    }

    /**
     * 切換下棋角色
     * 
     */
    function changeAttackPlayer(side) {
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
    function chess(event) {
        var target, player, overlay, chess;

        target = event.target;
        player = getPlayer();
        overlay = getOverlay('last');

        // 判斷點到的是不是十字棋格，不是的話就找到最近的棋格
        if (target.className.indexOf('chessboard__column') === -1) {
            target = target.closest('.chessboard__column');
        }

        // 判斷棋格有沒有被選走
        if (target.className.indexOf('selected') === -1) {
            if (gobang.isCanvasSupport) {
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
     * 判斷是不是將軍了
     * 
     */
    function isCheckmate() {
        var attackPlayer, rangeChessList, groupChessList, group, sortChessList, expectDistance,
            checkmat = false;
        
        attackPlayer = gobang.player[gobang.attackSide];
        rangeChessList = chessQuery.getRangeChesses(VICTORY_CONDITION, gobang.lastChess, attackPlayer);

        if (rangeChessList.length >= VICTORY_CONDITION) {
            groupChessList = chessQuery.getGroupChesses(gobang.lastChess, rangeChessList);
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
                    gobang.checkmateChessList = chessQuery.getConnectChesses(VICTORY_CONDITION, expectDistance, sortChessList);

                    if (gobang.checkmateChessList.length >= VICTORY_CONDITION) {
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
        var overlayList;

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
        var checkmateChess, childNodes, i, j;

        for (i = 0; i < chessList.length; i++) {
            checkmateChess = chessList[i];
            checkmateChess.classList.add('chessboard__column--victory');

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
        var message;
        
        message = document.querySelector('.gameover__message');
        message.innerText = 'Winner is ' + side + ' !';
        gobang.gameoverElement.classList.remove('gameover--hide');
    }    

})();

function start(event) {
    gobang.start(event);
}
