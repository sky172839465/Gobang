webpackJsonp([0,1],[function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.CHESS_SIZE=60,t.VICTORY_CONDITION=5,t.SLASH_DISTANCE=1.414,t.STRAIGHT_DISTANCE=1},function(e,t,s){"use strict";function i(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&(t[s]=e[s]);return t.default=e,t}Object.defineProperty(t,"__esModule",{value:!0}),t.start=void 0;var a=i(s(0)),o=i(s(6)),n=i(s(7)),r=i(s(8)),c=void 0,d=void 0,l=[],h=document.querySelector(".gameover"),u={},v=function(){h.classList.add("gameover--hide"),u.player={whiteSide:{key:"white",chesses:[]},blackSide:{key:"black",chesses:[]}},u.attackSide="whiteSide",u.checkmateChessList=[]},f=function(){var e=void 0;for((e=document.querySelector(".chessboard")).setAttribute("style","width:"+e.clientWidth+"px"),e.style.width=e.clientWidth+"px";e.childNodes.length>0;)e.childNodes[0].parentNode.removeChild(e.childNodes[0])},x=function(){var e,t,s,i,o,n=void 0,r=void 0,d=void 0,l=void 0,h=void 0;for(d=document.querySelector(".chessboard"),i=Math.floor(d.clientHeight/a.CHESS_SIZE),t=(o=Math.floor(d.clientWidth/a.CHESS_SIZE))*a.CHESS_SIZE-(a.CHESS_SIZE-1),s=i*a.CHESS_SIZE-(a.CHESS_SIZE-1),d.setAttribute("style","width:"+d.clientWidth+"px"),d.style.width=d.clientWidth+"px",e=c(t,s),d.appendChild(e),l=0;l<i;l++){for((n=document.createElement("div")).classList.add("chessboard__row"),h=0;h<o;h++)(r=document.createElement("div")).classList.add("chessboard__column"),r.classList.add("pointer"),r.setAttribute("data-asix-x",h),r.setAttribute("data-asix-y",l),r.onclick=function(e){p(e)},n.appendChild(r);d.appendChild(n)}},g=function(e){var t=void 0;return t=document.createElement("div"),l.forEach(function(e){t.classList.add(e)}),t.classList.add("chessman__overlay--"+e),t},_=function(){return u.player[u.attackSide]},p=function(e){var t,s=void 0,i=void 0,a=void 0;s=e.target,i=_(),t=g("last"),-1===s.className.indexOf("chessboard__column")&&(s=s.closest(".chessboard__column")),-1===s.className.indexOf("selected")&&(a=d(i),m(),s.appendChild(a),s.appendChild(t),s.classList.add("selected"),u.lastChess=s,i.chesses.push(s),u.lastChess&&S()&&(m(),y(u.checkmateChessList),T(u.attackSide)),u.attackSide="whiteSide"===u.attackSide?"blackSide":"whiteSide")},S=function(){var e,t,s=void 0,i=void 0,n=void 0,r=void 0,c=void 0;if(c=!1,e=_(),(t=o.getRangeChesses(a.VICTORY_CONDITION,u.lastChess,e)).length>=a.VICTORY_CONDITION)for(i in s=o.getGroupChesses(u.lastChess,t))if(s[i].length>=a.VICTORY_CONDITION&&(n=o.getSortChesses(i,s[i]),r=C(i),u.checkmateChessList=o.getConnectChesses(a.VICTORY_CONDITION,r,n),u.checkmateChessList.length>=a.VICTORY_CONDITION))return c=!0;return c},m=function(){var e;for(e=document.getElementsByClassName("chessman__overlay");e.length>0;)e[0].parentNode.removeChild(e[0])},C=function(e){var t=void 0;switch(e){case"leftTopToRightBottom":case"leftBottomToRightTop":t=a.SLASH_DISTANCE;break;case"vertical":case"horizontal":t=a.STRAIGHT_DISTANCE}return t},y=function(e){var t=void 0,s=void 0,i=void 0,a=void 0,o=void 0;for(a=0;a<e.length;a++){for((t=e[a]).classList.add("chessboard__column--victory"),s=t.childNodes,o=0;o<s.length;o++)-1!==s[o].className.indexOf("chessman")&&s[o].classList.add("chessman--victory");i=g("victory"),t.appendChild(i)}},T=function(e){document.querySelector(".gameover__message").innerText="Winner is "+e+" !",h.classList.remove("gameover--hide")};t.start=function(e){var t;e.target.innerText="Restart",t=void 0,(t=document.createElement("canvas")).getContext&&t.getContext("2d")?(c=n.getGrid,d=n.createChess,l=n.overlayStyles):(c=r.getGrid,d=r.createChess,l=r.overlayStyles),v(),f(),x()}},function(e,t){},function(e,t,s){e.exports=s.p+"img/Octocat.png"},function(e,t,s){e.exports=s.p+"img/favicon.png"},function(e,t,s){e.exports=s.p+"img/gobang.png"},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=function(e){return{asixX:+e.getAttribute("data-asix-x"),asixY:+e.getAttribute("data-asix-y")}},a=function(e,t){var s,i;return s=e.asixX-t.asixX,i=e.asixY-t.asixY,+Math.pow(s*s+i*i,.5).toFixed(3)},o=function(e,t,s){return Math.abs(e.asixX-t.asixX)<s&&Math.abs(e.asixY-t.asixY)<s},n=function(e,t){return e.asixX<t.asixX&&e.asixY<t.asixY||e.asixX>t.asixX&&e.asixY>t.asixY},r=function(e,t){return e.asixX<t.asixX&&e.asixY>t.asixY||e.asixX>t.asixX&&e.asixY<t.asixY};t.getRangeChesses=function(e,t,s){var a,n=void 0;return a=i(t),s.chesses.filter(function(t){return n=i(t),!!o(n,a,e)})},t.getGroupChesses=function(e,t){var s,a=void 0,o=void 0,c=void 0,d=void 0,l=void 0;for(l={leftTopToRightBottom:[],leftBottomToRightTop:[],vertical:[],horizontal:[]},s=i(e),d=0;d<t.length;d++)if(o=t[d],c=i(o),Math.abs(c.asixX-s.asixX)===Math.abs(c.asixY-s.asixY)){if(n(c,s))l.leftTopToRightBottom.push(o);else if(r(c,s))l.leftBottomToRightTop.push(o);else if(c.asixX===s.asixX&&c.asixY===s.asixY)for(a in l)l[a].push(o)}else c.asixX===s.asixX&&c.asixY!==s.asixY?l.vertical.push(o):c.asixX!==s.asixX&&c.asixY===s.asixY&&l.horizontal.push(o);return l},t.getSortChesses=function(e,t){var s=void 0;switch(e){case"horizontal":s=t.sort(function(e,t){var s,a;return s=i(e),a=i(t),s.asixX>a.asixX?1:s.asixX<a.asixX?-1:0});break;case"leftTopToRightBottom":case"leftBottomToRightTop":case"vertical":s=t.sort(function(e,t){var s,a;return s=i(e),a=i(t),s.asixY>a.asixY?1:s.asixY<a.asixY?-1:0})}return s},t.getConnectChesses=function(e,t,s){var o=void 0,n=void 0,r=void 0,c=void 0,d=void 0;for(d=[],c=0;c<s.length;c++)if(o=s[c],0===d.length?d.push(o):(n=i(d[d.length-1]),r=i(o),t!==a(n,r)&&(d.length=0),d.push(o)),d.length>=e)return d;return d}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.overlayStyles=t.createChess=t.getGrid=void 0;var i=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&(t[s]=e[s]);return t.default=e,t}(s(0));t.getGrid=function(e,t){var s=void 0,a=void 0,o=void 0;for((s=document.createElement("canvas")).classList.add("chessboard__grid"),s.width=e,s.height=t,(a=s.getContext("2d")).save(),a.lineWidth=1,a.strokeStyle="black",o=.5;o<a.canvas.height;o+=i.CHESS_SIZE)a.beginPath(),a.moveTo(0,o),a.lineTo(a.canvas.width,o),a.stroke();for(o=.5;o<a.canvas.width;o+=i.CHESS_SIZE)a.beginPath(),a.moveTo(o,0),a.lineTo(o,a.canvas.height),a.stroke();return a.restore(),s},t.createChess=function(e){var t=void 0,s=void 0;return(t=document.createElement("canvas")).width=i.CHESS_SIZE/2,t.height=i.CHESS_SIZE/2,t.classList.add("chessman"),(s=t.getContext("2d")).beginPath(),s.arc(15,15,15,0,2*Math.PI),s.fillStyle=e.key,s.fill(),t},t.overlayStyles=["chessman__overlay"]},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.overlayStyles=["chessman__overlay","chessman__overlay--div"],t.getGrid=function(e,t){var s=void 0;return(s=document.createElement("div")).style.width=e+"px",s.style.height=t+"px",s.classList.add("chessboard__grid"),s.classList.add("chessboard__grid--div"),s},t.createChess=function(e){var t=void 0;return(t=document.createElement("div")).classList.add("chessman"),t.classList.add("chessman__div"),t.classList.add("chessman__div--"+e.key),t}},function(e,t,s){"use strict";var i=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&(t[s]=e[s]);return t.default=e,t}(s(1));s(2),s(4),s(5),s(3),window.start=function(e){i.start(e)}}],[9]);