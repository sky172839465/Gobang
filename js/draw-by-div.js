(function() {

    var byDiv = {}, 
        overlayStyles = [
            'chessman__overlay', 
            'chessman__overlay--div'
        ];

    byDiv = {
        getGrid: getGrid,
        createChess: createChess,
        overlayStyles: overlayStyles
    };

    window.byDiv = byDiv;

    /**
     * 用div畫出棋格 (.chessboard__grid--div)
     * 
     * @param {any} div 
     * @returns 
     */
    function getGrid (gridWidth, gridHeight) {
        var div;

        div = document.createElement('div');
        div.style.width = gridWidth + 'px';
        div.style.height = gridHeight + 'px';
        div.classList.add('chessboard__grid');
        div.classList.add('chessboard__grid--div');

        return div;
    }

    /**
     * 用div新增棋子
     * 
     * @param {any} player 目前下棋的角色
     * @returns {Element}
     */
    function createChess(player) {
        var chess;

        chess = document.createElement('div');
        chess.classList.add('chessman');
        chess.classList.add('chessman__div');
        chess.classList.add('chessman__div--' + player.key);

        return chess;
    }    

})();