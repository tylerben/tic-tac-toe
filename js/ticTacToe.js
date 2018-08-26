!function() {
	// Declare const variables
	const $start = $( '#start' ),
		  $board = $( '#board' ),
			$finish = $( '#finish' ),
		  $boxes = $board.find( ".boxes .box" ),
		  $startBtn = $start.find( 'a.button' ),
		  $playerName = $start.find( '.player-name' ),
		  $player1Scorecard = $board.find( '#player1' ),
		  $player2Scorecard = $board.find( '#player2' ),
			$newGameBtn = $finish.find( 'a.button' ),
		  players = [];

	// Declare let variables
	let activePlayer = {},
			gameState = [];

	/**
	 * Function used to load the game's start screen
	 */
	const loadGame = () => {
		$board.hide();
		$finish.hide();
		$start.hide().fadeIn('slow');
	}

	/**
	 * Function used to start the game when the user clicks the start button
	 * Calls the createPlayers function to create game players
	 */
	const startGame = () => {
		createPlayers();
		$start.fadeOut();
		$board.fadeIn();
		initializeBoard();
	}

	/**
	 * This function is used to set the initial board state
	 * @return {[type]} [description]
	 */
	const initializeBoard = () => {
		$player1Scorecard.addClass("active");
		$player1Scorecard.find( ".player-name-label" ).text(players[0].name );
		$player2Scorecard.find( ".player-name-label" ).text(players[1].name );
		$boxes.each(function() {
			$( this ).attr("data-value", "unchecked");
		})
		activePlayer = players[0];
	}

	/**
	 * Function used to reset the game
	 * clear the game state
	 * reset activePlayer
	 * show the game board
	 */
	const resetGame = () => {
		$boxes.each((index, box) => {
			const $box = $( box );
			$box
				.attr("class", "box")
				.attr("data-value", "unchecked");
		})
		activePlayer = players[0];
		$player1Scorecard.addClass("active");
		$player2Scorecard.removeClass("active");

		$start.hide();
		$finish.hide();
		$board.hide().fadeIn('slow');
	}

	/**
	 * This function is used to determine if the game is complete
	 * aka if every box has been checked
	 * @param  {array} gameState [array representation of the game board]
	 * @return {string}           [string indicating whether the game is complete or incomplete]
	 */
	const checkGameCompletion = (gameState) => {
		let state = "incomplete";
		const arr = gameState.reduce((acc, cur) => {
			return acc.concat(cur);
		})

		if ( !arr.some((a) => a === "unchecked") ) {
			state = "complete";
		}
		return state;
	}

	/**
	 * This function is used to set and maintain the state of the game
	 * and keep track of the game score
	 * @return {array} const [array containing representation of game board state]
	 */
	const setGameState = () => {
		let arr = [];
		$boxes.each(function(k) {
				arr.push( $( this ).attr("data-value") );
		})

		let row1 = arr.filter((v,k) => k < 3 );
		let row2 = arr.filter((v,k) => k >= 3 && k < 6 );
		let row3 = arr.filter((v,k) => k >= 6 && k < 9 );
		return [row1,row2,row3];
	}

	/**
	 * This function is used to evalute the current state of the game board
	 * @param  {[type]} gameState [array representation of the game board]
	 * @return {[type]}           [description]
	 */
	const evaluateGameState = (gameState) => {
		const rowChecks = gameState.map((row) => checkRow(row)),
					cols = colsToRows(gameState),
					colChecks = cols.map((row) => checkRow(row)),
					diagonals = diagonalsToRows(gameState),
					diagonalChecks = diagonals.map((row) => checkRow(row)),
					$message = $finish.find( '.message' );

		// Combine all checks into one array
		const evaluatedGameState = rowChecks.concat(colChecks,diagonalChecks);

		// Check if a player has won
		if ( evaluatedGameState.includes("O wins") ) {
			$board.hide()
			$finish.attr("class", "screen");
			$finish.addClass("screen-win");
			$finish.addClass("screen-win-one");
			$message.text(`${players[0].name} wins!`);
			$finish.fadeIn('slow');
		} else if ( evaluatedGameState.includes("X wins") ) {
			$board.hide()
			$finish.attr("class", "screen");
			$finish.addClass("screen-win");
			$finish.addClass("screen-win-two");
			$message.text(`${players[1].name} wins!`);
			$finish.fadeIn('slow');
		} else if ( checkGameCompletion(gameState) === "complete" ) {
			$board.hide()
			$finish.attr("class", "screen");
			$finish.addClass("screen-win");
			$finish.addClass('screen-win-tie');
			$message.text(`It's a draw!`);
			$finish.fadeIn('slow');
		}
	}

	/**
	 * This function is used to check if a game board row contains 3 Xs or 3 Os
	 * @param  {array} row [array representing game board row]
	 * @return {boolean}     [boolean indicating whether 3 Xs or 3 Os were found]
	 */
	const checkRow = (row) => {
		let state;

		if ( row.every((box) => box === "x") ) {
			state = "X wins";
		} else if ( row.every((box) => box === "o") ) {
			state = "O wins";
		} else {
			state = false;
		}
		return state;
	}

	/**
	 * This function is used to convert the game board columns to rows
	 * @param  {array} row [array representation of the game board]
	 * @return {array}     [returns the game state but transposed]
	 */
	const colsToRows = (gameState) => {
		let rows = [],
				col1 = [],
				col2 = [],
				col3 = [];

		gameState.forEach((v,k) => {
			col1.push(v.filter((row, index) => index === 0)[0]);
			col2.push(v.filter((row, index) => index === 1)[0]);
			col3.push(v.filter((row, index) => index === 2)[0]);
		});
		rows = [col1,col2,col3];
		return rows;
	}

	/**
	 * This function is used to convert the game board diagonals to rows
	 * @param  {array} row [array representation of the game board]
	 * @return {array}     [returns the game state but transposed]
	 */
	const diagonalsToRows = (gameState) => {
		let rows = [],
				diagonal1 = [],
				diagonal2 = [];

		// Create first diagonal array
		gameState.forEach((v,k) => {
			diagonal1.push(v[k]);
		});

		// Create second diagonal array
		gameState.forEach((v,k) => {
			diagonal2.push(v[(gameState.length - 1) - k]);
		});

		rows = [diagonal1, diagonal2];
		return rows;
	}

	/**
	 * This function is used to allow the computer to automatically make a move
	 * Gets a list of possible moves and then uses a random number within
	 * the range of acceptable array indexes
	 * Update board appearance accordingly
	 * Update and evaluate game state
	 * @param  {array} gameState [array representation of the game board]
	 */
	const computerMove = (gameState) => {
		if ( activePlayer.computer ) {

			// get possible moves and then randomly choose next move
			const possibleMoves = getOpenBoxes(gameState),
						randomNo = Math.floor(Math.random() * possibleMoves.length),
						nextMove = possibleMoves[randomNo];

			// Update board styles and appearance accordingly
			$( $boxes[nextMove.index] ).removeClass( activePlayer.symbolClassHollow );
			$( $boxes[nextMove.index] ).addClass( activePlayer.symbolClassFilled );
			$( $boxes[nextMove.index] ).addClass( 'box-filled' );
			$( $boxes[nextMove.index] ).attr("data-value", activePlayer.symbol);

			// update and evaluate game state
			gameState = setGameState();
			evaluateGameState(gameState);
			switchPlayer();
			setTimeout(() => computerMove(gameState), 300);
		}
	}

	/**
	 * This function is used to determine which boxes on the game board are open
	 * @param  {array} gameState [array representation of the game board]
	 * @return {array}           [array representation of possible moves]
	 */
	const getOpenBoxes = (gameState) => {
		// flatten gameState array into single level array
		const gameStateFlattened = gameState.reduce((acc, cur) => {
			return acc.concat(cur);
		})

		// restructure array and filter to only unchecked moves
		const possibleMoves = gameStateFlattened
			.map((move,index) => {
				return {
					index: index,
					state: move
				}
			})
			.filter((move) => move.state === "unchecked");
		return possibleMoves;
	}

	/**
	 * This function is used to create the game's players
	 */
	const createPlayers = () => {
		$playerName.each(function(k,v) {
			const $player = $( v );
			players.push({
				name: $player.val() || `Player ${k+1}`,
				symbol: $player.attr("symbol"),
				playerNo: k+1,
				symbolClassHollow: `box-hollow-${k+1}`,
				symbolClassFilled: `box-filled-${k+1}`,
				computer: false
			})

			// If the name for player 2 is undefined player 2 should be a computer
			if ( k === 1 && $player.val() === "" ) {
				players[k].computer = true;
			}
		})
	}

	/**
	 * This function is used to toggle the active player based on whose turn it is
	 */
	const switchPlayer = () => {
		if (activePlayer.playerNo === 1) {
			activePlayer = players[1];
			$player1Scorecard.removeClass("active");
			$player2Scorecard.addClass("active");
		} else {
			activePlayer = players[0];
			$player2Scorecard.removeClass("active");
			$player1Scorecard.addClass("active");
		}
	}

	/**
	 * This function is to used to set the box state of a box
	 * There is different logic for hover and click events
	 * @param  {object} e [JavaScript event object]
	 */
	const setBoxState = (e) => {
		const $target = $( e.target ),
			  type = e.type.toLowerCase();

		if ( type === "mouseover" && !$target.hasClass('box-filled') ) {
			$target.attr("class", "box");
			$target.addClass( activePlayer.symbolClassHollow );
		} else if ( type === "mouseout"  && !$target.hasClass('box-filled')) {
			$target.attr("class", "box");
			//$target.removeClass( activePlayer.symbolClassHollow );
		}

		// check to see if box has already been selected
		if ( type === "click" && !$target.hasClass('box-filled')) {
			$target.removeClass( activePlayer.symbolClassHollow );
			$target.addClass( activePlayer.symbolClassFilled );
			$target.addClass( 'box-filled' );
			$target.attr("data-value", activePlayer.symbol);
			gameState = setGameState();
			evaluateGameState(gameState);
			switchPlayer();
			setTimeout(() => computerMove(gameState), 300);
		}
	}

	/**
	 * This function is used to bind all events for the game and load the game
	 */
	const bindEvents = (() => {
		loadGame();
		$startBtn.on("click", startGame);
		$newGameBtn.on("click", resetGame);
		$boxes.on("click mouseover mouseout", setBoxState);
	})();
}();
