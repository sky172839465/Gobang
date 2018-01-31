import * as chessDefined from './chess-defined';

const overlayStyles = ['chessman__overlay'];    

/**
 * 用canvas畫出棋格
 * 
 * @param {any} chessboard 
 */
const getGrid = (gridWidth, gridHeight) => {
    var canvas, context, i,
        stepX = 0, 
        stepY = 0, 
        lineWidth = 1, 
        color = 'black';

    canvas = document.createElement("canvas");
    canvas.classList.add('chessboard__grid');
    canvas.width = gridWidth;
    canvas.height = gridHeight;
    context = canvas.getContext("2d");

    context.save();  
    context.lineWidth = lineWidth;  
    context.strokeStyle = color; 

    for (i = stepY + 0.5 ; i < context.canvas.height; i += chessDefined.CHESS_SIZE) {  
        context.beginPath();  
        context.moveTo(0, i);  
        context.lineTo(context.canvas.width, i);  
        context.stroke();
    }

    for (i = stepX + 0.5; i < context.canvas.width; i += chessDefined.CHESS_SIZE) {  
        context.beginPath();  
        context.moveTo(i, 0);  
        context.lineTo(i, context.canvas.height);  
        context.stroke();
    }  

    context.restore();

    return canvas;
}

/**
 * 用canvas新增棋子
 * 
 * @param {any} player 目前下棋的角色
 * @returns {Element}
 */
const createChess = (player) => {
    var chessBox, chess;

    chessBox = document.createElement('canvas');
    chessBox.width = (chessDefined.CHESS_SIZE / 2);
    chessBox.height = (chessDefined.CHESS_SIZE / 2);
    chessBox.classList.add('chessman');
    chess = chessBox.getContext("2d");

    chess.beginPath();
    chess.arc(15, 15, 15, 0, 2 * Math.PI);
    chess.fillStyle = player.key;
    chess.fill();

    return chessBox;
}

export {
    getGrid,
    createChess,
    overlayStyles
};
