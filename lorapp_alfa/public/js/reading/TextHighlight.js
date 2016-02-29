/**
 * Modulo que gestiona las acciones de las notas del usuario en una lectura
 * @author Camilo Garzon
 * @version 1.0
 * @since 2015-07-11
 */

var TextHighlight = {};

/**
 * Funcion autoejecutable encargada de definir todas las variables y funciones 
 */
(function() {

    //////////////////////////////////////////////////////////////////////
    // ATRIBUTOS /////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////

    /* Almacena el texto subrayado */
    TextHighlight.savedText = '';
    TextHighlight.savedTextHtml = '';

    /* Objeto que almacena las funciones de seleccion de texto */
    TextHighlight.Selector = {};
    TextHighlight.NoteContainer = {};

    //////////////////////////////////////////////////////////////////////
    // METODOS ///////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////



    /**
     * Metodo para seleccionar texto en los diferentes navegadores
     * @returns String texto seleccionado sin formato HTML
     */
    TextHighlight.Selector.getSelected = function() {
        var t = '';
        if (window.getSelection) {
            t = window.getSelection();
        } else if (document.getSelection) {
            t = document.getSelection();
        } else if (document.selection) {
            t = document.selection.createRange().text;
        }
        return t;
    };

    /**
     * Metodo para seleccionar texto en los diferentes navegadores
     * @returns String texto seleccionado CON formato HTML
     */
    TextHighlight.Selector.getSelectedHtml = function() {
        var range = window.getSelection().getRangeAt(0);
        var content = range.extractContents();
        var span = document.createElement('SPAN');
        span.appendChild(content);
        var htmlContent = span.innerHTML;
        range.insertNode(span);
        console.log(htmlContent);
        return htmlContent;
    };

    TextHighlight.Selector.undoSelect = function() {
        if (document.selection) {
            document.selection.empty();
        } else if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }

    };

    /**
     * Metodo para manejar el evento mouseup, al terminar de seleccionar un texto
     */
    TextHighlight.Selector.mouseup = function(textSelected, textSelectedHtml) {
        if (textSelected != null){
            TextHighlight.savedText = textSelected;
            TextHighlight.savedTextHtml = textSelectedHtml;
        } else {
            TextHighlight.savedText = TextHighlight.Selector.getSelected();
            TextHighlight.savedTextHtml = TextHighlight.Selector.getSelectedHtml();
        }
        //console.log(TextHighlight.savedText);
        //delay para controlar rebote o doble clic
        setTimeout(function() {
            var isEmpty = TextHighlight.savedText.toString().length === 0;
            if (!isEmpty) {
                //si hay texto seleccionado se muestra seccion para tomar notas
                //var texto = TextHighlight.savedText + '';
                //var texto = $.selection('html');
                //var texto = TextHighlight.Selector.getSelectedHtml();
                var texto = TextHighlight.savedTextHtml;
                $("#scroll_top").val($('#scrollWrapper').scrollTop());
                $("#scroll_height").val($('#scrollWrapper').height());
                $("#scroll_width").val($('#scrollWrapper').width());
                //se almacena el mismo texto en 3 lugares diferentes
                //1. para almacenar el texto plano, que servira para analisis y mineria de datos
                //$(TextHighlight.NoteContainer.selectedText).val($.selection());
                $(TextHighlight.NoteContainer.selectedText).val(TextHighlight.savedText);
                //2. para almacenar el texto con etiquetas HTML, que servira la visualizacion
                $(TextHighlight.NoteContainer.selectedText + '_html').val(texto);
                //3. para almacenar el texto plano, que servira para analisis y mineria de datos
                $(TextHighlight.NoteContainer.selectedText + '_display').html($(TextHighlight.NoteContainer.selectedText + '_html').val());
                TextHighlight.NoteContainer.openClose('open');
            } else {
                TextHighlight.NoteContainer.openClose('close');
            }
        }, 100);


    };

    TextHighlight.NoteContainer.openClose = function(action) {
//        if (action == 'open') {
//            $(TextHighlight.NoteContainer.container).animate({bottom: "0%"}, 500);
//        } else if (action == 'close') {
//            $(TextHighlight.NoteContainer.container).animate({bottom: "-18em"}, 10);
//            $(TextHighlight.NoteContainer.note).val('');
//            $(TextHighlight.NoteContainer.selectedText + '_display').html('');
//            TextHighlight.Selector.undoSelect();
//        }
    };

    /** 
     * Metodo que inicializa el modulo
     */
    TextHighlight.initialize = function() {
        TextHighlight.NoteContainer.container = ".add-note-wrapper";
        TextHighlight.NoteContainer.btnCancel = "#btn_cancelar_note";
        TextHighlight.NoteContainer.note = "#note";
        TextHighlight.NoteContainer.selectedText = "#selectedtext";
        $(TextHighlight.NoteContainer.btnCancel).click(function(event) {
            TextHighlight.NoteContainer.openClose('close');
        });
        //para hacer resize del area de lectura
        $('#scrollWrapper').height($(window).height());
        $('#scrollWrapper').width($(window).width());
        window.onresize = function() {
            $('#scrollWrapper').height($(window).height());
            $('#scrollWrapper').width($(window).width());
        };

    };



})();

/**
 * Funcion de inicializacion en el momento en que se completa el DOM llamada desde jquery
 * Esta funcion realiza los procesos de inicializacion de la aplicacion
 */
$(function() {
    TextHighlight.initialize();
});
