var board1 = Chessboard('board1', {
    movespeed: 'fast',
    position: 'start'
});
const chess = new Chess()

var game = {
    moves: [],
    movenumber: -1,
    maxmoves: 0,
    pgn: [
        '[Event "Casual Game"]',
        '[Site "Berlin GER"]',
        '[Date "1852.??.??"]',
        '[EventDate "?"]',
        '[Round "?"]',
        '[Result "1-0"]',
        '[White "Adolf Anderssen"]',
        '[Black "Jean Dufresne"]',
        '[ECO "C52"]',
        '[WhiteElo "?"]',
        '[BlackElo "?"]',
        '[PlyCount "47"]',
        '',
        '1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.b4 Bxb4 5.c3 Ba5 6.d4 exd4 7.O-O',
        'd3 8.Qb3 Qf6 9.e5 Qg6 10.Re1 Nge7 11.Ba3 b5 12.Qxb5 Rb8 13.Qa4',
        'Bb6 14.Nbd2 Bb7 15.Ne4 Qf5 16.Bxd3 Qh5 17.Nf6+ gxf6 18.exf6',
        'Rg8 19.Rad1 Qxf3 20.Rxe7+ Nxe7 21.Qxd7+ Kxd7 22.Bf5+ Ke8',
        '23.Bd7+ Kf8 24.Bxe7# 1-0'
    ],

    firstMove: function() {
        this.movenumber = -1;
        chess.reset();
        display();
    },
    prevMove: function() {
        if (this.movenumber > -1) {
            console.log("hi");
            this.movenumber--;
        };
        chess.undo();
        display();
    },
    nextMove: function() {
        if (this.movenumber == -1) {
            this.movenumber = 0;
        } else if (this.movenumber < this.maxmoves) {
            this.movenumber++;
        }
        chess.move(this.moves[this.movenumber]);
        display();
    },
    lastMove: function() {
        this.movenumber = this.maxmoves;
        chess.load_pgn(game.pgn.join('\n'));
        display();
    },

    moveBold: function() {
        var myList = document.getElementById('move-list'); 
        var myListItems = myList.getElementsByTagName('button');
        if (game.movenumber == -1) {
            $("#play-pause").trigger("focus");
        } else if (game.movenumber < game.maxmoves+1) {  
            $("#"+myListItems[game.movenumber].id).trigger("focus");
        } else {
            $("#"+myListItems[game.movenumber-1].id).trigger("focus");
        }
    }
}
var flick = {
    flickSpeed: 1000,
    flickOn: false,
    intervalArray: [],
    toggleFlick: function() {
        if (flick.flickOn == false) {
            this.flickOn = true;
            document.getElementById("play-pause").innerHTML = "&#x23F8;";
        } else {
            this.flickOn = false;
            document.getElementById("play-pause").innerHTML = "&#x23F5;";
        }
        if (game.movenumber !== game.maxmoves) {
            flick.playFlick();
        }
    },
    playFlick: function() {
        if (flick.flickOn == true && game.movenumber !== game.maxmoves) {
            flick.intervalArray[0] = window.setTimeout(function() {
                game.nextMove();
                display();
                flick.playFlick();
            }, flick.flickSpeed)
        } else {
            flick.pauseFlick();
        }
    },
    pauseFlick: function() {
        display();
        clearInterval(this.intervalArray[0]);
        flick.flickOn = false;
        document.getElementById("play-pause").innerHTML = "&#x23F5;";
    }
}
document.getElementById("first").addEventListener("click", function(){game.firstMove();});
document.getElementById("previous").addEventListener("click", function(){game.prevMove();});
document.getElementById("next").addEventListener("click", function(){game.nextMove();});
document.getElementById("last").addEventListener("click", function(){game.lastMove();});
document.getElementById("play-pause").addEventListener("click", function(){
    flick.toggleFlick();
});
document.addEventListener("keydown", function(e){
    if (e.key == 'ArrowRight') {
        game.nextMove();
        flick.pauseFlick();
    }
    if (e.key == 'ArrowLeft') {
        game.prevMove();
        flick.pauseFlick();
    }
    if (e.key == ' ') {
        e.preventDefault();
        game.moveBold();
        flick.toggleFlick();
    }
});



function display() {
    console.log(game.movenumber);
    board1.position(chess.fen());
    game.moveBold();
}

function loadGame(pgn) {
    chess.load_pgn(pgn.join('\n'));
    board1 = Chessboard('board1', 'start');

    document.getElementById("white-player").innerHTML = chess.header()["White"];
    document.getElementById("black-player").innerHTML = chess.header()["Black"];

    game.moves = chess.history();
    game.maxmoves = game.moves.length-1;

    //Update move list
    loadMoveList(chess.header()["Result"]);

    chess.reset();
}

function loadMoveList(result = "none") {
    for (let x = 0; x < game.maxmoves+1; x++) {
        var node = document.createElement("button");
        if (x%2 == 0) {
            var textnode = document.createTextNode((x/2+1) + ". " + game.moves[x]);
        } else {
            var textnode = document.createTextNode(game.moves[x]);
            node.style = "padding-right: 3px;"
        }
        node.id = "mv"+x;

        // Go to move on click
        node.onclick = function() {
            flick.pauseFlick();
            chess.reset();
            for (let y = 0; y <= x; y++) {
                chess.move(game.moves[y]);
            }
            game.movenumber = x;
            display();
        };
        node.appendChild(textnode);
        document.getElementById("move-list").appendChild(node);
    }
    if (result != "none") {
        var node1 = document.createElement("p");
        var textnode1 = document.createTextNode(result);
        node1.appendChild(textnode1);
        document.getElementById("move-list").appendChild(node1);
        node1.id = "game-result";
    }
}

function clearGame() {
    chess.reset();
    document.getElementById("white-player").innerHTML = "?";
    document.getElementById("black-player").innerHTML = "?";
    display();
}

loadGame(game.pgn);
board1.resize();