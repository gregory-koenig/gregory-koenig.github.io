jQuery(function ($) {
	/**
	 * VARIABLES
	 */
	let $matches
	let level, match
	let turn = 0
	let nbMatches = 11
	let countPlayer = 0
	let countAi = 0

	/**
	 * FUNCTIONS
	 */

	/**
	 * Easy mode for the AI
	 */
	function easyMode() {
		if (nbMatches <= 3) {
			match = Math.floor(Math.random() * (nbMatches - 1)) + 1
		} else {
			match = Math.floor(Math.random() * 3) + 1
		}
	}

	/**
	 * Medium mode for the AI
	 */
	function mediumMode() {
		if ((nbMatches - 2) % 4 === 0) {
			match = 1
		} else if ((nbMatches - 3) % 4 === 0) {
			match = 2
		} else if ((nbMatches - 4) % 4 === 0) {
			match = 3
		} else {
			match = Math.floor(Math.random() * 3) + 1
		}
	}

	/**
	 * Hard mode for the AI
	 */
	function hardMode() {
		if ((nbMatches - 2) % 4 === 0) {
			match = 1
		} else if ((nbMatches - 3) % 4 === 0) {
			match = 2
		} else if ((nbMatches - 4) % 4 === 0) {
			match = 3
		} else {
			match = 1
		}
	}

	/**
	 * Set the default settings in order to reset the game
	 */
	function resetGame() {
		$('#select-level').removeAttr('disabled', 'disabled')
		$('#select-level').val('')
		$('#btn-start').attr('disabled', 'disabled')
		$('#btn-reset').attr('disabled', 'disabled')
		$('#matches').empty()
		$('#matches').hide()
		$('#turn').hide()
	}

	/**
	 * Display the ending message according to the winner
	 */
	function winMessage() {
		if (nbMatches <= 0) {
			if (turn === 1) {
				alert("I lost... sniff... but I'll get you next time!!")
				resetGame()

				countPlayer++

				$('#count-player').text('You: ' + countPlayer)
			} else if (turn === 0) {
				alert("You lost, too bad...")
				resetGame()

				countAi++

				$('#count-ai').text('AI: ' + countAi)
			}
		} else if (turn === 1) {
			$('#turn').text('Your turn:')

			turn = 0
		} else if (turn === 0) {
			$('#turn').text('AI turn...')

			turn = 1
		}
	}

	/**
	 * AI turn
	 */
	function AiTurn() {
		if (level === 'easy') {
			easyMode()
		} else if (level === 'medium') {
			mediumMode()
		} else if (level === 'hard') {
			hardMode()
		}

		nbMatches -= match
		$matches = $('#matches').children()

		$matches.slice(-match).remove()

		winMessage()
	}

	/**
	 * Player turn
	 */
	function playerTurn() {
		$('#matches').children().click(function () {
			$matches = $('#matches').children()
			turn = 0
			match = nbMatches - this.id

			if (match <= 3) {
				nbMatches -= match

				$matches.slice(-match).remove()

				winMessage()

				if (nbMatches > 0) {
					AiTurn()
				}
			}
		}).stop().hover(function () {
			$matches = $('#matches').children()
			match = nbMatches - this.id

			if (match <= 3) {
				$matches.slice(-match).addClass('img-selected')
			}
		}, function () {
			$matches = $('#matches').children()

			$matches.slice(-3).removeClass('img-selected')
		})
	}

	/**
	 * CONSTRUCTOR
	 */
	$('#btn-start').attr('disabled', 'disabled')
	$('#btn-reset-victory').attr('disabled', 'disabled')
	$('#btn-reset').attr('disabled', 'disabled')
	$('#menu').after('<p id="turn">Your turn:</p>')
	$('#turn').hide()
	$('#matches').hide()
	$('#count-victory').append('<h3>Victory meter</h3>')
	$('#count-victory').append('<span id="count-ai">AI: ' + countAi
		+ '</span><br />')
	$('#count-victory').append('<span id="count-player">You: ' + countPlayer
		+ '</span>')
	$('#count-victory').hide()

	/**
	 * ACTIONS
	 */

	/**
	 * Select the difficulty
	 */
	$('#select-level').change(function () {
		if ($('#select-level option:selected').val() !== '') {
			$('#select-level').attr('disabled', 'disabled')
			$('#btn-start').removeAttr('disabled', 'disabled')
			$('#btn-reset').removeAttr('disabled', 'disabled')

			level = $('#select-level option:selected').val()
		}
	})

	/**
	 * Start the game when clicks on the button
	 */
	$('#btn-start').click(function () {
		$('#btn-start').attr('disabled', 'disabled')
		$('#btn-reset-victory').removeAttr('disabled', 'disabled')
		$('#turn').show()
		$('#turn').text('Your turn:')
		$('#matches').show()
		$('#count-victory').show()

		for (let i = 0; i <= 10; i++) {
			$('#matches').append('<img src="img/match.png" '
				+ 'alt="Match" title="Match" id="' + i + '" />')
		}

		nbMatches = 11

		playerTurn()
	})

	/**
	 * Reset the victory meter when clicks on the button
	 */
	$('#btn-reset-victory').click(function () {
		countAi = 0
		countPlayer = 0

		$('#count-ai').text('AI: ' + countAi)
		$('#count-player').text('You: ' + countPlayer)
	})

	/**
	 * Reset the all game when clicks on the button
	 */
	$('#btn-reset').click(function () {
		resetGame()
	})

	/**
	 * Display rules when clicks on the button
	 */
	$('#btn-rules').click(function () {
		alert('Matchstick is a Nim game based on matches. There is a single '
			+ 'line with 11 matches. Players play in turn from the left.'
			+ 'Each player can only take between one and three matches. The one'
			+ ' who takes the last match lose.')
	})
})