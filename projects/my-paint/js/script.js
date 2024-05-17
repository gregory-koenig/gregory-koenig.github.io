jQuery(function ($) {

    /**
     * Variables
     */

    // Selectors
    let $canvas = $('#canvas')
    let canvas = document.getElementById('canvas')

    // Draw context on canvas
    let context = canvas.getContext('2d')

    // Parameters
    let draw = 'pencil', rect, circle
    let cursorX, cursorY, startX, startY

    // Configuration
    let painting = false
    let started = false
    let secondClick = false
    let color = '#000000'
    let size = 5

    /**
     * Check
     */

    if (!canvas) {
        alert('Impossible de récupérer le canvas')
        return
    }

    if (!context) {
        alert('Impossible de récupérer le contexte du canvas')
        return
    }

    /**
     * HTML construction
     */
    // Disable pencil button beacause pencil is the used tool by default
    $('#btn-pencil').attr('disabled', 'disabled')

    // Select size
    for (i = 1; i <= 50; i++) {
        if (i === 5) {
            $('#select-size').append($('<option selected></option>').val(i).html(i))
        } else {
            $('#select-size').append($('<option></option>').val(i).html(i))
        }
    }

    /**
     * Event handler on canvas
     */

    /**
     * Mouse
     */

    // Initialize a clear canvas to get a white background instead of a transparent one on the first mouse move
    $canvas.one('mousemove', function () {
        clearCanvas()
    })

    // Actions on mouse click according to draw options
    $canvas.mousedown(function (e) {
        cursorX = (e.pageX - this.offsetLeft)
        cursorY = (e.pageY - this.offsetTop)

        if (draw === 'pencil' || draw === 'eraser') {
            painting = true
        } else if (draw === 'line') {
            drawLine(cursorX, cursorY)
        } else if (draw === 'rect') {
            drawRect(cursorX, cursorY)
        } else if (draw === 'circle') {
            drawCircle(cursorX, cursorY)
        }
    })

    // Stop drawing when mouse click is stopping
    $canvas.mouseup(function () {
        painting = false
        started = false
    })

    // Stop drawing when mouse is out of the canvas
    $canvas.mouseout(function () {
        painting = false
        started = false
    })

    // Action on mouse move for pencil only
    $canvas.mousemove(function (e) {
        if (painting) {
            cursorX = (e.pageX - this.offsetLeft) - 10
            cursorY = (e.pageY - this.offsetTop) - 10

            drawPencil()
        }
    })

    /**
     * Button tools
     */

    // Action on pencil button
    $('#btn-pencil').click(function () {
        draw = 'pencil'
        color = $('#input-color').val()

        enableHTMLElems()

        $(this).attr('disabled', 'disabled')
    })

    // Action on line button
    $('#btn-line').click(function () {
        draw = 'line'
        color = $('#input-color').val()
        context.lineCap = 'square'

        enableHTMLElems()

        $(this).attr('disabled', 'disabled')
    })

    // Action on stroke rectangle button
    $('#btn-stroke-rect').click(function () {
        draw = 'rect'
        rect = 'stroke'
        color = $('#input-color').val()

        enableHTMLElems()

        $(this).attr('disabled', 'disabled')
    })

    // Action on fill rectangle button
    $('#btn-fill-rect').click(function () {
        draw = 'rect'
        rect = 'fill'
        color = $('#input-color').val()

        enableHTMLElems()

        $(this).attr('disabled', 'disabled')
    })

    // Action on stroke circle button
    $('#btn-stroke-circle').click(function () {
        draw = 'circle'
        circle = 'stroke'
        color = $('#input-color').val()

        enableHTMLElems()

        $(this).attr('disabled', 'disabled')
    })

    // Action on fill circle button
    $('#btn-fill-circle').click(function () {
        draw = 'circle'
        circle = 'fill'
        color = $('#input-color').val()

        enableHTMLElems()

        $(this).attr('disabled', 'disabled')
    })

    // Action on eraser button
    $('#btn-eraser').click(function () {
        draw = 'eraser'
        color = '#FFF'

        enableHTMLElems()

        $(this).attr('disabled', 'disabled')
        $('#input-color').attr('disabled', 'disabled')
    })

    // Action on edit button
    $('#input-edit').change(editImage)

    // Action on save button
    $('#btn-save').click(function () {
        window.open(canvas.toDataURL('image/png'))
    })

    // Action on reset button
    $('#btn-reset').click(function () {
        draw = 'pencil'
        color = '#000000'
        size = 5

        clearCanvas()
        enableHTMLElems()

        $('#btn-pencil').attr('disabled', 'disabled')
        $('#select-size').val(5)
        $('#input-color').val('#000000')
    })

    // Action on size select
    $('#select-size').change(function () {
        if (!isNaN($(this).val())) {
            size = $(this).val()
        }
    })

    // Action on color input
    $('#input-color').change(function () {
        color = $(this).val()
    })

    /**
     * Drag and drop image
     */

    // Drop the dragging image into the canvas
    $canvas.on('drop', function (e) {
        e.preventDefault()

        if (e.originalEvent.dataTransfer.files[0].type.search('image') !== -1) {
            let url = URL.createObjectURL(e.originalEvent.dataTransfer.files[0])
            let img = new Image()

            $(img).on('load', function () {
                $canvas.width = img.width
                $canvas.height = img.height
                context.drawImage(img, 0, 0)
            })

            $(img).attr('src', url)
        }
    })

    // Allow drag into the canvas
    $canvas.on('dragover', function () {
        return false
    })

    // Allow drag into the canvas
    $canvas.on('dragleave', function () {
        return false
    })

    /**
     * Functions
     */

    // Clear the canvas with a white background
    function clearCanvas() {
        context.fillStyle = '#FFFFFF'

        context.clearRect(0, 0, canvas.width, canvas.height)
        context.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Enable the HTML elements
    function enableHTMLElems() {
        $('#btn-pencil').removeAttr('disabled', 'disabled')
        $('#btn-line').removeAttr('disabled', 'disabled')
        $('#btn-fill-rect').removeAttr('disabled', 'disabled')
        $('#btn-stroke-rect').removeAttr('disabled', 'disabled')
        $('#btn-fill-circle').removeAttr('disabled', 'disabled')
        $('#btn-stroke-circle').removeAttr('disabled', 'disabled')
        $('#btn-eraser').removeAttr('disabled', 'disabled')
        $('#input-color').removeAttr('disabled', 'disabled')
    }

    // Draw with pencil or eraser
    function drawPencil() {
        if (draw === 'pencil') {
            context.lineCap = 'round'
        } else {
            context.lineCap = 'square'
        }

        if (!started) {
            started = true

            context.beginPath()
            context.moveTo(cursorX, cursorY)
        } else {
            context.strokeStyle = color
            context.lineWidth = size

            context.lineTo(cursorX, cursorY)
            context.stroke()
        }
    }

    // Draw a line
    function drawLine(cursorX, cursorY) {
        if (!secondClick) {
            secondClick = true

            context.beginPath()
            context.moveTo(cursorX, cursorY)
        } else {
            secondClick = false
            context.strokeStyle = color
            context.lineWidth = size

            context.lineTo(cursorX, cursorY)
            context.stroke()
            context.closePath()
        }
    }

    // Draw a stroke or a fill rectangle
    function drawRect(cursorX, cursorY) {
        if (!secondClick) {
            secondClick = true
            startX = cursorX
            startY = cursorY

            context.beginPath()
        } else {
            secondClick = false
            let width = cursorX - startX
            let height = cursorY - startY
            context.lineWidth = size

            context.rect(startX, startY, width, height)

            if (rect === 'stroke') {
                context.strokeStyle = color
                context.stroke()
            } else {
                context.fillStyle = color
                context.fill()
            }

            context.closePath()
        }
    }

    // Draw a stroke or a fill circle
    function drawCircle(cursorX, cursorY) {
        if (!secondClick) {
            secondClick = true
            startX = cursorX
            startY = cursorY

            context.beginPath()
        } else {
            secondClick = false
            let r = Math.sqrt(Math.pow(startX - cursorX, 2) + Math.pow(startY - cursorY, 2))

            context.arc(startX, startY, r, 0, 2 * Math.PI)
            context.lineWidth = size

            if (circle === 'stroke') {
                context.strokeStyle = color
                context.stroke()
            } else {
                context.fillStyle = color
                context.fill()
            }

            context.closePath()
        }
    }

    // Edit an image
    function editImage(e) {
        let reader = new FileReader()

        reader.onload = function (e) {
            let img = new Image()

            img.onload = function () {
                $canvas.width = img.width
                $canvas.height = img.height
                context.drawImage(img, 0, 0)
            }

            img.src = e.target.result
        }

        reader.readAsDataURL(e.target.files[0]);
    }
})