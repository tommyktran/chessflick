config = {
    showNotation: false,
    movespeed: 'fast',
    position: 'start',
    showErrors: 'console',
    orientation: 'white',
    player: 'Varuzhan Eduardovich Akobian',
    viewFromPlayer: true,
    viewFromWinner: true
}
var board1 = Chessboard('board1', config);

const chess = new Chess()

var game = {
    moves: [],
    movenumber: -1,
    maxmoves: 0,
    pgn: [[
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
    ]],
    gamenumber: 0,

    firstMove: function() {
        if (this.movenumber == -1) {
            game.prevGame();
            return;
        }
        this.movenumber = -1;
        chess.reset();
        display();
    },
    prevMove: function() {
        if (this.movenumber > -1) {
            this.movenumber--;
        } else if (this.movenumber == -1) {
            game.prevGame();
            return;
        }
        chess.undo();
        display();
    },
    nextMove: function() {
        if (this.movenumber == this.maxmoves) {
            game.nextGame();
            return;
        }
        if (this.movenumber == -1) {
            this.movenumber = 0;
        } else if (this.movenumber < this.maxmoves) {
            this.movenumber++;
        }
        chess.move(this.moves[this.movenumber]);
        display();

        
    },
    lastMove: function() {
        if (this.movenumber == this.maxmoves) {
            game.nextGame();
            return;
        }
        this.movenumber = this.maxmoves;
        chess.load_pgn(game.pgn[0].join('\n'), {sloppy: true});
        display();
    },

    nextGame: function() {
        if (game.gamenumber == game.pgn.length-1) {
            game.gamenumber = 0;
        } else {
            game.gamenumber++;
        }
        loadGame(game.pgn[game.gamenumber]);
    },
    prevGame: function() {
        if (game.gamenumber == 0) {
            game.gamenumber = 0;
        } else {
            game.gamenumber--;
        }
        loadGame(game.pgn[game.gamenumber]);
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
        if (flick.flickOn == true) {
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

document.getElementById("import").addEventListener("click", function(){document.getElementById("import-modal").style="display:block;"});
document.getElementById("import-button").addEventListener("click", function(){
    game.pgn = (document.getElementById("import-box").value.split("\n\n\n"));
    for (x in game.pgn) {
        game.pgn[x] = game.pgn[x].split("\n");
    }
    game.gamenumber = 0;
    loadGame(game.pgn[0]);
    updateGameNumber();
});
document.getElementById("import-file-button").addEventListener("click", function(){
    let selectedfile = document.getElementById("importFile").files[0];
    var fr=new FileReader(); 
    fr.onload=function(){
        document.getElementById("import-box").innerHTML = fr.result;
    }
    fr.readAsText(selectedfile);
});

document.getElementById("exit-modal").addEventListener("click", function(){document.getElementById("import-modal").style="display:none;"});

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
    if (e.key == 'ArrowUp') {
        game.firstMove();
        flick.pauseFlick();
    }
    if (e.key == 'ArrowDown') {
        game.lastMove();
        flick.pauseFlick();
    }
});

function updateGameNumber() {
    document.getElementById("current-game-number").innerHTML = game.gamenumber + 1;
    document.getElementById("max-game-number").innerHTML = game.pgn.length;
}

function display() {
    board1.position(chess.fen());
    game.moveBold();
}

function loadGame(pgn) {
    chess.load_pgn(pgn.join("\n"), {sloppy: true});
    if (config.viewFromPlayer == true) {
        if (chess.header()["Black"] == config.player) {
            config.orientation = 'black'
        }
    } else if (config.viewFromWinner == true){
        if (chess.header()["Result"] == '0-1') {
            config.orientation = 'black'
        }
    } else {
        config.orientation = 'white'
    }
    board1 = Chessboard('board1', config);

    document.getElementById("white-player").innerHTML = chess.header()["White"];
    document.getElementById("black-player").innerHTML = chess.header()["Black"];

    game.movenumber = -1;
    game.moves = chess.history();
    game.maxmoves = game.moves.length-1;

    //Update move list
    loadMoveList(chess.header()["Result"]);

    chess.reset();
    updateGameNumber();
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function loadMoveList(result = "none") {
    removeAllChildNodes(document.getElementById("move-list"));
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

loadGame(game.pgn[0]);
board1.resize();

/*
[Event "Leningrad-Moscow"]
[Site "Leningrad URS"]
[Date "1967.05.??"]
[EventDate "?"]
[Round "?"]
[Result "1-0"]
[White "Vasily Smyslov"]
[Black "Viktor Korchnoi"]
[ECO "E10"]
[WhiteElo "?"]
[BlackElo "?"]
[PlyCount "147"]

1. d4 Nf6 2. c4 e6 3. Nf3 d5 4. g3 dxc4 5. Qa4+ Nbd7 6. Bg2 a6
7. Qxc4 c5 8. Qc2 b5 9. O-O Bb7 10. a4 Be7 11. dxc5 Bxc5
12. Bg5 Qb6 13. Bxf6 Nxf6 14. axb5 axb5 15. Rxa8+ Bxa8 16. Nc3
O-O 17. e3 Rc8 18. Qd3 b4 19. Na4 Qc6 20. Nxc5 Qxc5 21. Rd1 h6
22. Qd4 Qc2 23. Ne1 Qe2 24. Bxa8 Rxa8 25. Qd2 Qxd2 26. Rxd2
Ra1 27. Kf1 Rb1 28. Ke2 Nd5 29. Nd3 Rh1 30. h4 f5 31. Rd1 Rh2
32. Ne5 Nf6 33. Nf3 Rh3 34. Rd8+ Kf7 35. Ne5+ Ke7 36. Nc6+ Kf7
37. Nxb4 Ne4 38. Nd3 g5 39. hxg5 hxg5 40. Rc8 g4 41. Nc5 Nxc5
42. Rxc5 Rh1 43. Rc2 Ke7 44. e4 Ra1 45. Kd3 Kd6 46. exf5 exf5
47. Kc3 Kc6 48. Kd4+ Kd6 49. b3 Re1 50. Kc4 Kc6 51. Kd3+ Kd5
52. b4 Rb1 53. Kc3 Kc6 54. Kd4+ Kd6 55. Kc4 Kc6 56. Re2 Rc1+
57. Kd4 Kd6 58. Rb2 Ra1 59. b5 Ra4+ 60. Ke3 Kc7 61. b6+ Kb7
62. Rb5 Re4+ 63. Kd3 Re8 64. Rxf5 Kxb6 65. Rg5 Rd8+ 66. Ke4
Re8+ 67. Kf5 Rf8+ 68. Ke6 Rxf2 69. Rxg4 Re2+ 70. Kf5 Kc5
71. Re4 Rf2+ 72. Rf4 Rd2 73. g4 Rd5+ 74. Kg6 1-0


[Event "USSR vs. Rest of the World"]
[Site "Belgrade SRB"]
[Date "1970.04.02"]
[EventDate "1970.03.29"]
[Round "3.9"]
[Result "1-0"]
[White "Mikhail Tal"]
[Black "Miguel Najdorf"]
[ECO "B47"]
[WhiteElo "?"]
[BlackElo "?"]
[PlyCount "86"]

1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 e6 5.Nc3 Qc7 6.g3 a6 7.Bg2
Nf6 8.O-O d6 9.Re1 Bd7 10.Nxc6 bxc6 11.Na4 e5 12.c4 Be7 13.c5
O-O 14.cxd6 Bxd6 15.Bg5 Be7 16.Qc2 h6 17.Be3 Rab8 18.Rac1 Rfd8
19.h3 Nh7 20.Bc5 Be8 21.Red1 Rxd1+ 22.Rxd1 Ng5 23.Bxe7 Qxe7
24.Nc5 Ne6 25.Nxe6 Qxe6 26.b3 Qe7 27.Qc3 Rb4 28.h4 f6 29.Rd3
Kh7 30.Bh3 Bg6 31.Rd7 Qf8 32.Qxc6 Rxe4 33.Qxa6 Re1+ 34.Kh2 f5
35.Rd6 Bh5 36.Qd3 e4 37.Qd5 Bg4 38.Rd8 Qf6 39.Qg8+ Kg6 40.Qe8+
Kh7 41.Bxg4 fxg4 42.Qg8+ Kg6 43.Rf8 Qe7 1-0
*/