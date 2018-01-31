
const overlayStyles = [
    'chessman__overlay', 
    'chessman__overlay--div'
];

/**
 * 用div畫出棋格 (.chessboard__grid--div)
 * 
 * @param {any} div 
 * @returns 
 */
const getGrid = (gridWidth, gridHeight) => {
    let div;

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
const createChess = (player) => {
    let chess;

    chess = document.createElement('div');
    chess.classList.add('chessman');
    chess.classList.add('chessman__div');
    chess.classList.add('chessman__div--' + player.key);

    return chess;
}

export { 
    overlayStyles,
    getGrid,
    createChess 
};