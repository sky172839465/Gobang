(function() {
    
    var chessQuery;
    
    // defined output function
    chessQuery = {
        getRangeChesses: getRangeChesses,
        getGroupChesses: getGroupChesses,
        getSortChesses: getSortChesses,
        getCheckmateChesses: getCheckmateChesses,
        getPosition: getPosition,
        getDistance: getDistance
    };

    window.chessQuery = chessQuery;    

    /**
     * 把XY軸差距小於指定勝利條件(5)的棋子拿進來，只有這些有機會將軍
     * 
     * @param {any} VICTORY_CONDITION 獲勝條件
     * @param {any} lastChess 最後一手棋
     * @param {any} attackPlayer 攻擊方
     * @returns 
     */
    function getRangeChesses(VICTORY_CONDITION, lastChess, attackPlayer) {
        var targetPosition, chessList, rangeChessList, item;

        targetPosition = getPosition(lastChess);
        chessList = attackPlayer.chesses;

        rangeChessList = chessList.filter(function(chess) {
            item = chess.dataset;
            if (isWithinScope(item, targetPosition, VICTORY_CONDITION)) {
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
     * @param {any} lastChess 用來當基準的最後一手棋
     * @param {any} chessList 未被分組的棋子
     * @returns 
     */
    function getGroupChesses(lastChess, chessList) {
        var targetPosition, group, chess, item, distanceX, distanceY, i,
            groupChessList = {
                'leftTopToRightBottom': [],
                'leftBottomToRightTop': [],
                'vertical': [],
                'horizontal': []
            };

        targetPosition = getPosition(lastChess);

        for (i = 0; i < chessList.length; i++) {
            chess = chessList[i];
            item = chess.dataset;
            distanceX = Math.abs(+item.asixX - targetPosition.asixX);
            distanceY = Math.abs(+item.asixY - targetPosition.asixY);
            // 和最後一手的位置相減一樣才會在同一條斜線上 EX: [(0,0), (1,1), (2,2)]
            if (distanceX === distanceY) {
                // 左上和右下
                if (isFromLeftTopToRightBottomChess(item, targetPosition)) {
                    groupChessList['leftTopToRightBottom'].push(chess);
                }
                // 左下和右上
                else if (isFromLeftBottomToRightTopChess(item, targetPosition)) {
                    groupChessList['leftBottomToRightTop'].push(chess);
                }
                // 將死一定要最後一手棋，所以放到每一組裡
                else if (+item.asixX === targetPosition.asixX && +item.asixY === targetPosition.asixY) {
                    for (group in groupChessList) {
                        groupChessList[group].push(chess);
                    }
                }
            } 
            // 垂直 X軸一樣
            else if (+item.asixX === targetPosition.asixX && +item.asixY !== targetPosition.asixY) {
                groupChessList['vertical'].push(chess);

            } 
            // 水平 Y軸一樣
            else if (+item.asixX !== targetPosition.asixX && +item.asixY === targetPosition.asixY) {
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
        var sortChessList;

        switch(group) {
            // 只有水平方向差別在Y軸都一樣所以用X軸排序
            case 'horizontal':        
                sortChessList = chessList.sort(function(a, b) {
                    if (+a.dataset.asixX > +b.dataset.asixX) {
                        return 1;
                    } else if (+a.dataset.asixX < +b.dataset.asixX) {
                        return -1;
                    } 
                    return 0;
                });
                break;
            case 'leftTopToRightBottom':            
            case 'leftBottomToRightTop':
            case 'vertical':
                sortChessList = chessList.sort(function(a, b) {
                    if (+a.dataset.asixY > +b.dataset.asixY) {
                        return 1;
                    } else if (+a.dataset.asixY < +b.dataset.asixY) {
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
     * @param {any} VICTORY_CONDITION 獲勝條件
     * @param {any} expectDistance 預期兩手棋間的距離
     * @param {any} chessList 
     */
    function getCheckmateChesses(VICTORY_CONDITION, expectDistance, chessList) {
        var itemChess, prevPosition, nextPosition, actualDistance, i,
            onlineChessList = [];

        for (i = 0; i < chessList.length; i++) {
            itemChess = chessList[i];
            if (onlineChessList.length === 0) {
                onlineChessList.push(itemChess);
            } else {
                prevPosition = getPosition(onlineChessList[onlineChessList.length-1]);
                nextPosition = getPosition(itemChess);
                // 前一個位置和目前位置的距離
                actualDistance = getDistance(prevPosition, nextPosition);
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
     * 取得棋子的位置
     * 
     * @returns 
     */
    function getPosition(target) {
        var targetPosition;

        targetPosition = { 
            asixX: +target.dataset.asixX, 
            asixY: +target.dataset.asixY 
        };

        return targetPosition;
    }

    /**
     * 計算兩個棋子的距離
     * 
     * @param {any} a 
     * @param {any} b 
     * @returns 
     */
    function getDistance(a, b) {
        var distanceX, distanceY;

        distanceX = (+a.asixX) - (+b.asixX);
        distanceY = (+a.asixY) - (+b.asixY);

        return +Math.pow((distanceX * distanceX + distanceY * distanceY), 0.5).toFixed(3);
    }

    /**
     * 判斷棋子是否在指定的範圍內
     * 
     * @param {any} other 其他棋子位置
     * @param {any} target 最後一手棋位置
     * @param {any} VICTORY_CONDITION 獲勝條件 
     */
    function isWithinScope(other, target, VICTORY_CONDITION) {
        if (Math.abs((+other.asixX) - target.asixX) < VICTORY_CONDITION && 
            Math.abs((+other.asixY) - target.asixY) < VICTORY_CONDITION) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 判斷這顆棋子是不是在最後一手棋的左上或右下
     * 
     * @param {any} other 其他棋子位置
     * @param {any} target 最後一手棋位置
     * @returns 
     */
    function isFromLeftTopToRightBottomChess(other, target) {
        if ((+other.asixX < target.asixX && +other.asixY < target.asixY) ||
            (+other.asixX > target.asixX && +other.asixY > target.asixY)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 判斷這顆棋子是不是在最後一手棋的左下或右上
     * 
     * @param {any} other 其他棋子位置
     * @param {any} target 最後一手棋位置
     * @returns 
     */
    function isFromLeftBottomToRightTopChess(other, target) {
        if((+other.asixX < target.asixX && +other.asixY > target.asixY) ||
            (+other.asixX > target.asixX && +other.asixY < target.asixY)) {
            return true;
        } else {
            return false;
        }
    }

})();