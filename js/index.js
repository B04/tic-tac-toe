var TicTacToe = function(max_depth){
    this.running = true;
    this.max_depth = max_depth;
    this.winningPositions = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],
                  [1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    this.next_move = 5;
}
TicTacToe.prototype = {
    initiase: function() {
    this.board = ["","","",
             "","","",
             "","",""];
    },
    get_legal_move: function(board) {
        return [0,1,2,3,4,5,6,7,8].filter(function(i) { return board[i] == ""; });
    },
    is_full: function(board) {
        return !this.get_legal_move(board).length;
    },
    is_winning: function(board, the_player) {
        return this.winningPositions.some(
                function(position) {
                    return position.every(
                        function(x) {
                            return (board[x] == the_player);
                        });
                }
        );
    },
    is_terminal: function(board) {
    	return this.is_full(board) || this.is_winning(board, "X") || this.is_winning(board, "O");
    },
    score: function(board) {
        if (this.is_winning(board, "X")) {
            return 100;
        }
        if (this.is_winning(board, "O")) {
            return -100;
        }
        return 0;
    },
    minimax: function(board, depth, player) {
	    if (depth >= this.max_depth || this.is_terminal(board)) {
		    return this.score(board);
	    }
	var max_score,
		min_score,
		scores = [],
		moves = [],
		opponent = (player == "X") ? "O" : "X",
		successors = this.get_legal_move(board);
	for (var s in successors) {
		var possible_board = board;
		possible_board[successors[s]] = player;
		scores.push(this.minimax(possible_board, depth + 1, opponent));
		possible_board[successors[s]] = "";
		moves.push(successors[s]);
	}
	if (player == "X") {
		this.next_move = moves[0];
		max_score = scores[0];
		for (var s in scores) {
			if (scores[s] > max_score) {
				max_score = scores[s];
				this.next_move = moves[s];
			}
		}
		return max_score;
	} else {
		this.next_move = moves[0];
		min_score = scores[0];
		for (var s in scores) {
			if (scores[s] < min_score) {
				min_score = scores[s];
				this.next_move = moves[s];
			}
		}
		return min_score;
	}

    }

}

var game = new TicTacToe(3);
var board =  ["","","","","","","","",""];
var player = "X";
var opponent = "O";
$(document).ready(function() {
  $('.cell').click(function(e) {
    //get tile
    var tile = +e.target.getAttribute("tile");
    // if the move is legal
    if (!(game.get_legal_move(board).indexOf(tile) !== -1)) {
      return false;
    }
    if (!game.running) {
      return false;
    }
    // update the move
    board[tile] = player;
    $(e.target).html(player);
    // computer play
    game.minimax(board, 0, opponent);

    // player is winning ?
    if (game.is_winning(board, player)) {
      game.running = false;
      $('.message').html("you win !").addClass('bg-success');
    }
    if (game.is_full(board)) {
      game.running = false;
      $('.message').text("Draw !").addClass('bg-warning');
    }
 
    computer_move = game.next_move;
    board[computer_move] = opponent;
    $('#c'+computer_move).html(opponent);

    // computer is winning ?
    if (game.is_winning(board, opponent)) {
      game.running = false;
      $('.message').html("computer win !").addClass('bg-danger');
    }
    if (game.is_full(board)) {
      game.running = false;
      $('.message').html("Draw !");
    }

  });
  $('#X').click(function(e) {
    board =  ["","","","","","","","",""];
    $('.message').text('').removeClass("bg-*");
    $('.cell').text('');
    game.running=true;

  })
  $('#O').click(function(e) {
     board = ["","","","","","","","",""];
     $('.message').text('').removeClass("bg-*");
     $('.cell').text('');
     game.minimax(board, 0, "O");
     computer_move = game.next_move;
     board[computer_move] = "O";
     $('#c'+computer_move).text("O");
     game.running = true;
  })

});