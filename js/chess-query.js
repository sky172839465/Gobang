(function() {
    var chessQuery;
    chessQuery = {
        log: log
    };

    /**
     * aaaaaaaa
     * 
     * @param {any} t 
     */
    function log(t) {
        console.log(t);
    }

    window.chessQuery = chessQuery;
    // return chessQuery;
})();