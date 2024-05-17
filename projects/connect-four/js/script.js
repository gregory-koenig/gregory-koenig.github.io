jQuery(function ($) {

/*
** Déclaration des variables
*/

    /*
    ** HTML
    */
        // Titre
        var title = $('<h1>PUISSANCE 4</h1>')

        // Formulaires
        var formPlayer1 = $('<form id="form-player1"></form>')
        var formPlayer2 = $('<form id="form-player2"></form>')
        var formLayout = $('<form id="form-layout"></form>')

        // Joueur 1
        var labelNamePlayer1 = $('<label for ="input-name-player1">Nom du joueur 1'
            + '</label>')
        var inputNamePlayer1 = $('<input type="text" name="" id="input-name-player1" '
            + 'placeholder="Joueur 1 (défaut)" />')
        var labelPlayer1 = $('<label for="select-color-player1">Couleur joueur 1'
            + '</label>')
        var selectPlayer1 = $('<select id="select-color-player1"></select>')
        var optionsPlayer1 = $('<option value="red">Rouge (défaut)</option>'
            + '<option value="aqua">Cyan</option>'
            + '<option value="fuchsia">Fuchsia</option>'
            + '<option value="silver">Gris</option>')

        // Joueur 2
        var labelNamePlayer2 = $('<label for ="input-name-player2">Nom du joueur 2'
            + '</label>')
        var inputNamePlayer2 = $('<input type="text" name="" id="input-name-player2" '
            + 'placeholder="Joueur 2 (défaut)" />')
        var labelPlayer2 = $('<label for="select-color-player2">Couleur joueur 2'
            + '</label>')
        var selectPlayer2 = $('<select id="select-color-player2"></select>')
        var optionsPlayer2 = $('<option value="yellow">Jaune (défaut)</option>'
            + '<option value="lime">Vert</option>'
            + '<option value="black">Noir</option>'
            + '<option value="maroon">Marron</option>')

        // Colonnes
        var labelColumn = $('<label for="select-column">Nombre de colonnes</label>')
        var selectColumn = $('<select id="select-column"></select>')
        var optionsColumn = $('<option value="7">7 (défaut)</option>'
            + '<option value="8">8</option>'
            + '<option value="9">9</option>'
            + '<option value="10">10</option>')

        // Lignes
        var labelLine = $('<label for="select-line">Nombre de lignes</label>')
        var selectLine = $('<select id="select-line"></select>')
        var optionsLine = $('<option value="6">6 (défaut)</option>'
            + '<option value="7">7</option>'
            + '<option value="8">8</option>'
            + '<option value="9">9</option>')

        // Boutons
        var btnStart = $('<button id="btn-start">Lancer le jeu</button>')
        var btnUndo = $('<button id="btn-undo">Annuler le dernier coup</button>')
        var btnReset = $('<button id="btn-reset">Redémarrer le jeu</button>')
        var btnRules = $('<button id="btn-rules">Règles du jeu</button>')

        // Plateau
        var table = $('<table></table>')

    /*
    ** jQuery
    */
        // Joueurs
        var namePlayer1, namePlayer2, colorPlayer1, colorPlayer2

        // Plateau
        var column, line

        // Ordre de jeux
        var turn = 0
        var lastTurn, turnUndo

        // Jetons
        var boardGame = []
        var counter, classColumn, selectorCounter

/*
** Construction du plug-in
*/

    // Titre
    $('#connect-four').prepend(title)

    // Formulaires
    $(title).after(formPlayer1)
    $(formPlayer1).after(formPlayer2)
    $(formPlayer2).after(formLayout)

    // Joueur 1
    $(formPlayer1).append(labelNamePlayer1)
    $(labelNamePlayer1).append(inputNamePlayer1)
    $(labelNamePlayer1).after(labelPlayer1)
    $(labelPlayer1).append(selectPlayer1)
    $(selectPlayer1).append(optionsPlayer1)

    // Joueur 2
    $(formPlayer2).append(labelNamePlayer2)
    $(labelNamePlayer2).append(inputNamePlayer2)
    $(labelNamePlayer2).after(labelPlayer2)
    $(labelPlayer2).append(selectPlayer2)
    $(selectPlayer2).append(optionsPlayer2)

    // Colonnes
    $(formLayout).append(labelColumn)
    $(labelColumn).append(selectColumn)
    $(selectColumn).append(optionsColumn)

    // Lignes
    $(labelColumn).after(labelLine)
    $(labelLine).append(selectLine)
    $(selectLine).append(optionsLine)

    // Boutons
    $(formLayout).after(btnStart)
    $(btnStart).after(btnReset)
    $(btnReset).after(btnUndo)
    $(btnUndo).after(btnRules)

    // Style
    $('#connect-four').css({
        margin: '0px 100px',
        padding: '50px 50px 350px 50px',

        border: '2px blue outset',
        'border-radius': '10px',

        'background-color': '#F0F0F0',

        'font-family': 'verdana',
        color: '#505050'
    })
    $('h1').css({
        'margin-right': '150px',
        'margin-bottom': '60px',
        'margin-left': '150px',
        'padding-top': '20px',
        'padding-bottom': '20px',

        border: '2px blue outset',
        'border-radius': '10px',

        'background-color': 'seashell',

        'text-align': 'center',
        'text-shadow': '1px 1px 4px gray'
    })
    $('form').css({
        'margin-top': '10px',
        'margin-bottom': '10px'
    })
    $('label').css('margin-right', '50px')
    $('input').css('margin-left', '20px')
    $('select').css({
        'margin-left': '20px',
        cursor: 'pointer'
    })
    $('button').css({
        display: 'block',
        'margin-top': '20px'
    })
    $('button:hover').css({
        'background': 'black'
    })
    $('button:active').css({
        'background': 'black'
    })
    $('#btn-start').css({
        'margin-top': '50px',
        cursor: 'pointer'
    })
    $('#btn-rules').css('cursor', 'help')

    // Désactivation des boutons
    $('#btn-undo').attr('disabled', 'disabled')
    $('#btn-reset').attr('disabled', 'disabled')

/*
** Fonctions
*/

    /*
    ** Action du bouton "Lancer le jeu"
    */
    $('#btn-start').on('click', function () {

        // Désactivation des éléments
        $(this).attr('disabled', 'disabled')
        $('#input-name-player1').attr('disabled', 'disabled')
        $('#input-name-player2').attr('disabled', 'disabled')
        $('#select-color-player1').attr('disabled', 'disabled')
        $('#select-color-player2').attr('disabled', 'disabled')
        $('#select-column').attr('disabled', 'disabled')
        $('#select-line').attr('disabled', 'disabled')

        // Réactivation du bouton "Redémarrer le jeu"
        $('#btn-reset').removeAttr('disabled', 'disabled')

        // Choix des utilisateurs
        namePlayer1 = $('input#input-name-player1').val() || "Joueur 1"
        namePlayer2 = $('input#input-name-player2').val() || "Joueur 2"
        colorPlayer1 = $('#select-color-player1').val()
        colorPlayer2 = $('#select-color-player2').val()
        column = $('#select-column').val()
        line = $('#select-line').val()

        // Construction du plateau
        counter = line - 1
        $(btnRules).after(table)
        $(btnStart).before('<p>Le jeu démarre. Bonne chance !</p>')
        for (var i = 0; i < line; i++) {
            var tr = $('<tr></tr>')
            for (var j = 0; j < column; j++) {
                var td = $('<td class=' + j + '></td>')
                $(tr).append(td)
                boardGame[j] = counter
            }
            $(table).append(tr)
        }

        // Style
        $('select').css('cursor', 'default')
        $('p').css({
            'margin-top': '50px',
            'margin-bottom': '50px',
            'padding-top': '20px',
            'padding-bottom': '20px',

            border: '2px blue outset',
            'border-radius': '10px',

            'background-color': '#505050',

            color: 'white',
            'text-align': 'center'
        })
        $(table).css({
            'margin-top': '-175px',
            'margin-right': '150px',
            'margin-bottom': '50px',
            float: 'right',

            border: '3px blue outset',
            'border-radius': '20px',

            'background-color': 'blue'
        })
        $('td').css({
            height: '1.25cm',
            width: '1.25cm',

            border: '2px blue outset',
            'border-color': 'blue',
            'border-radius': '2cm',

            'background-color': 'white',

            cursor: 'pointer'
        })
        $('#btn-start').css('cursor', 'default')
        $('#btn-reset').css('cursor', 'pointer')
        $('#input-name-player1').css({
            'border-radius': '5px',
            background: colorPlayer1
        })
        $('#input-name-player2').css({
            'border-radius': '5px',
            background: colorPlayer2
        })

        // Fonction remplaçant le contenu du paragraphe avec un délai
        setTimeout(function () {
            $('p').html('<span id="namePlayer1">' + namePlayer1 + '</span> commence :')
            $('#namePlayer1').css({
                'font-weight': 'bold',
                'font-variant': 'small-caps',
                color: colorPlayer1,
                'text-shadow': '0px 0px 2px black'
            })
        }, 1000)

        // Fonction gérant les actions du jeu
        $('td').click(function () {

            //// Position du jeton
            classColumn = $(this).attr('class')
            selectorCounter = '.' + classColumn + ':eq('
                + boardGame[classColumn] + ')'

            //// Si le plateau est plein
            if (boardGame.every(function (value) { return value === -1 })) {
                if (confirm("Personne n'a gagné.\nLa partie est terminée.\n"
                        + "Cliquer sur \"ok\" pour redémarrer le jeu.")) {
                    location.reload(true)
                }

            //// Si une colone est pleine
            } else if (boardGame[classColumn] === -1) {
                alert("Veuillez choisir une autre colonne...")

            //// Si c'est le tour du joueur 1
            } else if (turn % 2 === 0) {
                if (boardGame[classColumn] === 8) {
                    $('.' + classColumn + ':eq(' + 0 + ')')
                        .css('background', colorPlayer1)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 0 + ')')
                            .css('background', 'white')
                    }, 100)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 1 + ')')
                            .css('background', colorPlayer1)
                    }, 100)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 1 + ')')
                            .css('background', 'white')
                    }, 200)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 2 + ')')
                            .css('background', colorPlayer1)
                    }, 200)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 2 + ')')
                            .css('background', 'white')
                    }, 300)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 3 + ')')
                            .css('background', colorPlayer1)
                    }, 300)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 3 + ')')
                            .css('background', 'white')
                    }, 400)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 4 + ')')
                            .css('background', colorPlayer1)
                    }, 400)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 4 + ')')
                            .css('background', 'white')
                    }, 500)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 5 + ')')
                            .css('background', colorPlayer1)
                    }, 500)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 5 + ')')
                            .css('background', 'white')
                    }, 600)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 6 + ')')
                            .css('background', colorPlayer1)
                    }, 600)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 6 + ')')
                            .css('background', 'white')
                    }, 700)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 7 + ')')
                            .css('background', colorPlayer1)
                    }, 700)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 7 + ')')
                            .css('background', 'white')
                    }, 800)
                    setTimeout(function () {
                        $(selectorCounter).css('background', colorPlayer1)
                    }, 800)
                } else if (boardGame[classColumn] === 7) {
                    $('.' + classColumn + ':eq(' + 0 + ')')
                        .css('background', colorPlayer1)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 0 + ')')
                            .css('background', 'white')
                    }, 100)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 1 + ')')
                            .css('background', colorPlayer1)
                    }, 100)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 1 + ')')
                            .css('background', 'white')
                    }, 200)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 2 + ')')
                            .css('background', colorPlayer1)
                    }, 200)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 2 + ')')
                            .css('background', 'white')
                    }, 300)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 3 + ')')
                            .css('background', colorPlayer1)
                    }, 300)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 3 + ')')
                            .css('background', 'white')
                    }, 400)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 4 + ')')
                            .css('background', colorPlayer1)
                    }, 400)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 4 + ')')
                            .css('background', 'white')
                    }, 500)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 5 + ')')
                            .css('background', colorPlayer1)
                    }, 500)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 5 + ')')
                            .css('background', 'white')
                    }, 600)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 6 + ')')
                            .css('background', colorPlayer1)
                    }, 600)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 6 + ')')
                            .css('background', 'white')
                    }, 700)
                    setTimeout(function () {
                        $(selectorCounter).css('background', colorPlayer1)
                    }, 700)
                } else if (boardGame[classColumn] === 6) {
                    $('.' + classColumn + ':eq(' + 0 + ')')
                        .css('background', colorPlayer1)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 0 + ')')
                            .css('background', 'white')
                    }, 100)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 1 + ')')
                            .css('background', colorPlayer1)
                    }, 100)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 1 + ')')
                            .css('background', 'white')
                    }, 200)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 2 + ')')
                            .css('background', colorPlayer1)
                    }, 200)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 2 + ')')
                            .css('background', 'white')
                    }, 300)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 3 + ')')
                            .css('background', colorPlayer1)
                    }, 300)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 3 + ')')
                            .css('background', 'white')
                    }, 400)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 4 + ')')
                            .css('background', colorPlayer1)
                    }, 400)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 4 + ')')
                            .css('background', 'white')
                    }, 500)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 5 + ')')
                            .css('background', colorPlayer1)
                    }, 500)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 5 + ')')
                            .css('background', 'white')
                    }, 600)
                    setTimeout(function () {
                        $(selectorCounter).css('background', colorPlayer1)
                    }, 600)
                } else if (boardGame[classColumn] === 5) {
                    $('.' + classColumn + ':eq(' + 0 + ')')
                        .css('background', colorPlayer1)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 0 + ')')
                            .css('background', 'white')
                    }, 100)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 1 + ')')
                            .css('background', colorPlayer1)
                    }, 100)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 1 + ')')
                            .css('background', 'white')
                    }, 200)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 2 + ')')
                            .css('background', colorPlayer1)
                    }, 200)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 2 + ')')
                            .css('background', 'white')
                    }, 300)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 3 + ')')
                            .css('background', colorPlayer1)
                    }, 300)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 3 + ')')
                            .css('background', 'white')
                    }, 400)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 4 + ')')
                            .css('background', colorPlayer1)
                    }, 400)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 4 + ')')
                            .css('background', 'white')
                    }, 500)
                    setTimeout(function () {
                        $(selectorCounter).css('background', colorPlayer1)
                    }, 500)
                } else if (boardGame[classColumn] === 4) {
                    $('.' + classColumn + ':eq(' + 0 + ')')
                        .css('background', colorPlayer1)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 0 + ')')
                            .css('background', 'white')
                    }, 100)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 1 + ')')
                            .css('background', colorPlayer1)
                    }, 100)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 1 + ')')
                            .css('background', 'white')
                    }, 200)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 2 + ')')
                            .css('background', colorPlayer1)
                    }, 200)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 2 + ')')
                            .css('background', 'white')
                    }, 300)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 3 + ')')
                            .css('background', colorPlayer1)
                    }, 300)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 3 + ')')
                            .css('background', 'white')
                    }, 400)
                    setTimeout(function () {
                        $(selectorCounter).css('background', colorPlayer1)
                    }, 400)
                } else if (boardGame[classColumn] === 3) {
                    $('.' + classColumn + ':eq(' + 0 + ')')
                        .css('background', colorPlayer1)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 0 + ')')
                            .css('background', 'white')
                    }, 100)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 1 + ')')
                            .css('background', colorPlayer1)
                    }, 100)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 1 + ')')
                            .css('background', 'white')
                    }, 200)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 2 + ')')
                            .css('background', colorPlayer1)
                    }, 200)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 2 + ')')
                            .css('background', 'white')
                    }, 300)
                    setTimeout(function () {
                        $(selectorCounter).css('background', colorPlayer1)
                    }, 300)
                } else if (boardGame[classColumn] === 2) {
                    $('.' + classColumn + ':eq(' + 0 + ')')
                        .css('background', colorPlayer1)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 0 + ')')
                            .css('background', 'white')
                    }, 100)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 1 + ')')
                            .css('background', colorPlayer1)
                    }, 100)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 1 + ')')
                            .css('background', 'white')
                    }, 200)
                    setTimeout(function () {
                        $(selectorCounter).css('background', colorPlayer1)
                    }, 200)
                } else if (boardGame[classColumn] === 1) {
                    $('.' + classColumn + ':eq(' + 0 + ')')
                        .css('background', colorPlayer1)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 0 + ')')
                            .css('background', 'white')
                    }, 100)
                    setTimeout(function () {
                        $(selectorCounter).css('background', colorPlayer1)
                    }, 100)
                } else {
                    $(selectorCounter).css('background', colorPlayer1)
                }

                $('p').html('Au tour de <span id="namePlayer2">' + namePlayer2
                    + ' :</span>')
                $('#namePlayer2').css({
                    'font-weight': 'bold',
                    'font-variant': 'small-caps',
                    color: colorPlayer2,
                    'text-shadow': '0px 0px 2px black'
                })
                $('#btn-undo').removeAttr('disabled', 'disabled')
                $('#btn-undo').css('cursor', 'pointer')
                lastTurn = selectorCounter
                boardGame[classColumn] -= 1
                turn++
                turnUndo = 1

            //// Si c'est le tour du joueur 2
            } else if (turn % 2 !== 0) {

                if (boardGame[classColumn] === 8) {
                    $('.' + classColumn + ':eq(' + 0 + ')')
                        .css('background', colorPlayer2)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 0 + ')')
                            .css('background', 'white')
                    }, 100)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 1 + ')')
                            .css('background', colorPlayer2)
                    }, 100)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 1 + ')')
                            .css('background', 'white')
                    }, 200)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 2 + ')')
                            .css('background', colorPlayer2)
                    }, 200)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 2 + ')')
                            .css('background', 'white')
                    }, 300)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 3 + ')')
                            .css('background', colorPlayer2)
                    }, 300)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 3 + ')')
                            .css('background', 'white')
                    }, 400)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 4 + ')')
                            .css('background', colorPlayer2)
                    }, 400)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 4 + ')')
                            .css('background', 'white')
                    }, 500)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 5 + ')')
                            .css('background', colorPlayer2)
                    }, 500)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 5 + ')')
                            .css('background', 'white')
                    }, 600)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 6 + ')')
                            .css('background', colorPlayer2)
                    }, 600)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 6 + ')')
                            .css('background', 'white')
                    }, 700)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 7 + ')')
                            .css('background', colorPlayer2)
                    }, 700)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 7 + ')')
                            .css('background', 'white')
                    }, 800)
                    setTimeout(function () {
                        $(selectorCounter).css('background', colorPlayer2)
                    }, 800)
                } else if (boardGame[classColumn] === 7) {
                    $('.' + classColumn + ':eq(' + 0 + ')')
                        .css('background', colorPlayer2)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 0 + ')')
                            .css('background', 'white')
                    }, 100)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 1 + ')')
                            .css('background', colorPlayer2)
                    }, 100)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 1 + ')')
                            .css('background', 'white')
                    }, 200)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 2 + ')')
                            .css('background', colorPlayer2)
                    }, 200)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 2 + ')')
                            .css('background', 'white')
                    }, 300)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 3 + ')')
                            .css('background', colorPlayer2)
                    }, 300)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 3 + ')')
                            .css('background', 'white')
                    }, 400)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 4 + ')')
                            .css('background', colorPlayer2)
                    }, 400)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 4 + ')')
                            .css('background', 'white')
                    }, 500)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 5 + ')')
                            .css('background', colorPlayer2)
                    }, 500)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 5 + ')')
                            .css('background', 'white')
                    }, 600)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 6 + ')')
                            .css('background', colorPlayer2)
                    }, 600)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 6 + ')')
                            .css('background', 'white')
                    }, 700)
                    setTimeout(function () {
                        $(selectorCounter).css('background', colorPlayer2)
                    }, 700)
                } else if (boardGame[classColumn] === 6) {
                    $('.' + classColumn + ':eq(' + 0 + ')')
                        .css('background', colorPlayer2)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 0 + ')')
                            .css('background', 'white')
                    }, 100)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 1 + ')')
                            .css('background', colorPlayer2)
                    }, 100)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 1 + ')')
                            .css('background', 'white')
                    }, 200)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 2 + ')')
                            .css('background', colorPlayer2)
                    }, 200)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 2 + ')')
                            .css('background', 'white')
                    }, 300)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 3 + ')')
                            .css('background', colorPlayer2)
                    }, 300)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 3 + ')')
                            .css('background', 'white')
                    }, 400)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 4 + ')')
                            .css('background', colorPlayer2)
                    }, 400)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 4 + ')')
                            .css('background', 'white')
                    }, 500)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 5 + ')')
                            .css('background', colorPlayer2)
                    }, 500)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 5 + ')')
                            .css('background', 'white')
                    }, 600)
                    setTimeout(function () {
                        $(selectorCounter).css('background', colorPlayer2)
                    }, 600)
                } else if (boardGame[classColumn] === 5) {
                    $('.' + classColumn + ':eq(' + 0 + ')')
                        .css('background', colorPlayer2)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 0 + ')')
                            .css('background', 'white')
                    }, 100)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 1 + ')')
                            .css('background', colorPlayer2)
                    }, 100)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 1 + ')')
                            .css('background', 'white')
                    }, 200)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 2 + ')')
                            .css('background', colorPlayer2)
                    }, 200)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 2 + ')')
                            .css('background', 'white')
                    }, 300)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 3 + ')')
                            .css('background', colorPlayer2)
                    }, 300)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 3 + ')')
                            .css('background', 'white')
                    }, 400)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 4 + ')')
                            .css('background', colorPlayer2)
                    }, 400)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 4 + ')')
                            .css('background', 'white')
                    }, 500)
                    setTimeout(function () {
                        $(selectorCounter).css('background', colorPlayer2)
                    }, 500)
                } else if (boardGame[classColumn] === 4) {
                    $('.' + classColumn + ':eq(' + 0 + ')')
                        .css('background', colorPlayer2)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 0 + ')')
                            .css('background', 'white')
                    }, 100)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 1 + ')')
                            .css('background', colorPlayer2)
                    }, 100)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 1 + ')')
                            .css('background', 'white')
                    }, 200)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 2 + ')')
                            .css('background', colorPlayer2)
                    }, 200)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 2 + ')')
                            .css('background', 'white')
                    }, 300)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 3 + ')')
                            .css('background', colorPlayer2)
                    }, 300)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 3 + ')')
                            .css('background', 'white')
                    }, 400)
                    setTimeout(function () {
                        $(selectorCounter).css('background', colorPlayer2)
                    }, 400)
                } else if (boardGame[classColumn] === 3) {
                    $('.' + classColumn + ':eq(' + 0 + ')')
                        .css('background', colorPlayer2)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 0 + ')')
                            .css('background', 'white')
                    }, 100)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 1 + ')')
                            .css('background', colorPlayer2)
                    }, 100)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 1 + ')')
                            .css('background', 'white')
                    }, 200)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 2 + ')')
                            .css('background', colorPlayer2)
                    }, 200)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 2 + ')')
                            .css('background', 'white')
                    }, 300)
                    setTimeout(function () {
                        $(selectorCounter).css('background', colorPlayer2)
                    }, 300)
                } else if (boardGame[classColumn] === 2) {
                    $('.' + classColumn + ':eq(' + 0 + ')')
                        .css('background', colorPlayer2)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 0 + ')')
                            .css('background', 'white')
                    }, 100)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 1 + ')')
                            .css('background', colorPlayer2)
                    }, 100)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 1 + ')')
                            .css('background', 'white')
                    }, 200)
                    setTimeout(function () {
                        $(selectorCounter).css('background', colorPlayer2)
                    }, 200)
                } else if (boardGame[classColumn] === 1) {
                    $('.' + classColumn + ':eq(' + 0 + ')')
                        .css('background', colorPlayer2)
                    setTimeout(function () {
                        $('.' + classColumn + ':eq(' + 0 + ')')
                            .css('background', 'white')
                    }, 100)
                    setTimeout(function () {
                        $(selectorCounter).css('background', colorPlayer2)
                    }, 100)
                } else {
                    $(selectorCounter).css('background', colorPlayer2)
                }

                $('p').html('Au tour de <span id="namePlayer1">' + namePlayer1
                    + ' :</span>')
                $('#namePlayer1').css({
                    'font-weight': 'bold',
                    'font-variant': 'small-caps',
                    color: colorPlayer1,
                    'text-shadow': '0px 0px 2px black'
                })
                $('#btn-undo').removeAttr('disabled', 'disabled')
                $('#btn-undo').css('cursor', 'pointer')
                lastTurn = selectorCounter
                boardGame[classColumn] -= 1
                turn++
                turnUndo = 2
            }
        })
    })

    /*
    ** Action du bouton "Annuler le dernier coup"
    */
    $('#btn-undo').on('click', function () {
        $(this).attr('disabled', 'disabled')
        $(lastTurn).css('background', 'white')
        boardGame[classColumn] += 1
        turn -= 1
        if (turnUndo === 1) {
            $('p').html('<span id="namePlayer1">' + namePlayer1
                + "</span> peut rejouer :")
            $('#namePlayer1').css({
                'font-weight': 'bold',
                'font-variant': 'small-caps',
                color: colorPlayer1,
                'text-shadow': '0px 0px 2px black'
            })
        } else if (turnUndo === 2) {
            $('p').html('<span id="namePlayer2">' + namePlayer2
                + "</span> peut rejouer :")
            $('#namePlayer2').css({
                'font-weight': 'bold',
                'font-variant': 'small-caps',
                color: colorPlayer2,
                'text-shadow': '0px 0px 2px black'
            })
        }
    })

    /*
    ** Action du bouton "Redémarrer le jeu"
    */
    $('#btn-reset').on('click', function() {
        if (confirm("Attention, cette action annule la partie en cours.\n"
                + "Cliquer sur \"ok\" pour redémarrer le jeu.")) {
            location.reload(true)
        }
    })

    /*
    ** Action du bouton "Règles du jeu"
    */
    $('#btn-rules').on('click', function() {
        alert("Règles du jeu\n\n\nLe but du jeu est d'aligner une suite de "
            + "4 pions de même couleur sur une grille.\n\nChaque joueur "
            + "dispose de pions d'une couleur différente (par défaut, jaune ou"
            + " rouge). Tour à tour les deux joueurs placent un pion dans la "
            + "colonne de leur choix, le pion coulisse alors jusqu'à la "
            + "position la plus basse possible dans la dite colonne à la suite "
            + "de quoi c'est à l'adversaire de jouer.\n\nLe vainqueur est le "
            + "joueur qui réalise le premier un alignement (horizontal, vertical"
            + " ou diagonal) consécutif d'au moins quatre pions de sa couleur. "
            + "Si, alors que toutes les cases de la grille de jeu sont remplies,"
            + " aucun des deux joueurs n'a réalisé un tel alignement, la partie "
            + "est déclarée nulle.\n\nIl n'est possible que d'annuler un seul "
            + "coup par joueur et par tour.")
    })
})