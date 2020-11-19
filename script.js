var board1 = Chessboard('board1', {
    movespeed: 'fast',
    position: 'start'
});
const chess = new Chess()

var game = {
    moves: [],
    movenumber: 0,
    maxmoves: 0,
    lastfen: "",
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
        this.movenumber = 0;
        chess.reset();
        display();
    },
    prevMove: function() {
        if (this.movenumber > 0) {
            this.movenumber--;
        };
        chess.undo();
        display();
    },
    nextMove: function() {
        chess.move(this.moves[this.movenumber]);
        display();
        if (this.movenumber < this.maxmoves) {
            this.movenumber++;
        }
    },
    lastMove: function() {
        this.movenumber = this.maxmoves;
        chess.load_pgn(game.pgn.join('\n'));
        display();
    }
}

document.getElementById("first").addEventListener("click", function(){game.firstMove();});
document.getElementById("previous").addEventListener("click", function(){game.prevMove();});
document.getElementById("next").addEventListener("click", function(){game.nextMove();});
document.getElementById("last").addEventListener("click", function(){game.lastMove();});



function display() {
    board1.position(chess.fen());
}

function loadGame(pgn) {
    chess.load_pgn(pgn.join('\n'));
    board1 = Chessboard('board1', 'start');

    document.getElementById("white-player").innerHTML = chess.header()["White"];
    document.getElementById("black-player").innerHTML = chess.header()["Black"];

    game.lastfen = chess.fen();
    game.moves = chess.history();
    game.maxmoves = game.moves.length;

    //Update move list
    loadMoveList(chess.header()["Result"]);

    chess.reset();
}

function loadMoveList(result = "none") {
    for (let x = 0; x < game.maxmoves; x+=2) {
        var node = document.createElement("LI");
        if (typeof game.moves[x+1] != "undefined") {
            var textnode = document.createTextNode(game.moves[x] + " " + game.moves[x+1]);
        } else {
            var textnode = document.createTextNode(game.moves[x]);
        }
        node.appendChild(textnode);
        document.getElementById("move-list").appendChild(node);
    }
    if (result != "none") {
        var node1 = document.createElement("LI");
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