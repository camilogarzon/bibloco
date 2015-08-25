/**
 * Modulo que gestiona las acciones relacionadas con el "resaltado" de texto en una lectura
 * @author Camilo Garzon
 * @version 1.0
 * @since 2015-08-22
 */

var Highlight = {};

/**
 * Funcion autoejecutable encargada de definir todas las variables y funciones 
 */
(function() {

    //////////////////////////////////////////////////////////////////////
    // ATRIBUTOS /////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    Highlight.actualHighlightID = '';
    Highlight.color = 'rgba(255,239,80,.4)';
    Highlight.colorRemove = 'rgba(255,80,80,.4)';
    Highlight.colorTake = 'rgba(80,255,80,.4)';
    Highlight.highlightedHTML = [];
    Highlight.highlightedClassName = 'highlighted';
    Highlight.container = 'bodyText';
    Highlight.optionContainer = 'selectionSharerPopover';
    Highlight.optionRemove = 'removeHighlight';
    Highlight.optionTake = 'takeHighlight';
    Highlight.selectedTextContainer = 'selectedtext_hidden';
    Highlight.selectedTextContainerHighlighted = [];
    Highlight.NoteContainer = {};
    Highlight.NoteContainer.container = ".add-note-wrapper";
    Highlight.NoteContainer.btnCancel = "btn_cancelar_note";
    Highlight.NoteContainer.note = "#note";
    Highlight.NoteContainer.selectedText = "selectedtext";
    Highlight.savedText = '';
    Highlight.savedTextHtml = '';
    Highlight.serialized = '';

    //////////////////////////////////////////////////////////////////////
    // METODOS ///////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////


    /**
     * Metodo que se ejecuta cuando el puntero se pone sobre una frase resaltada. 
     * Maneja el comportamiento de la casilla de opciones del resaltado y cambia 
     * color de elementos resaltados
     * @param {event} evento de mouse over
     */
    Highlight.onMouseOverHighlighted = function(event) {
        if (event.target.className == Highlight.highlightedClassName) {
            $('#' + Highlight.optionContainer).css({top: event.pageY, left: event.pageX});
            Highlight.actualHighlightID = event.target.dataset.timestamp;
//            for (var i in Highlight.highlightedHTML) {
//                if (Highlight.highlightedHTML[i].id == Highlight.actualHighlightID) {
//                    console.log(Highlight.highlightedHTML[i].html);
//                    $('#' + Highlight.selectedTextContainer).html(Highlight.highlightedHTML[i].html);
//                    var selectedTextContainerHighlighted = $('#' + Highlight.selectedTextContainer + ' .' + Highlight.highlightedClassName);
//                    Highlight.selectedTextContainerHighlighted = [];
//                    selectedTextContainerHighlighted.each(function(event) {
//                        var obj = {};
//                        obj.time = $(selectedTextContainerHighlighted[event]).data('timestamp');
//                        obj.html = $(selectedTextContainerHighlighted[event]).html();
//                        Highlight.selectedTextContainerHighlighted.push(obj);
//                    });
//                    for (var j in Highlight.selectedTextContainerHighlighted) {
//                        $($($('#' + Highlight.selectedTextContainer + ' .' + Highlight.highlightedClassName))[0]).replaceWith(Highlight.selectedTextContainerHighlighted[j].html);
//                    }
//                    console.log($('#' + Highlight.selectedTextContainer).html());
//                }
//            }
            $('#' + Highlight.optionContainer).show();
        } else {
            var highlighs = document.getElementsByClassName(Highlight.highlightedClassName);
            if (highlighs.length > 0) {
                for (var i in highlighs) {
                    (highlighs[i].style != undefined) ? highlighs[i].style.backgroundColor = Highlight.color : '';
                }
                $('#' + Highlight.optionContainer).hide();
            }
        }
    };

    /**
     * Metodo que selecciona y cambia de color los elementos resaltados a eliminar
     */
    Highlight.onMouseOverHighlightedOnRemove = function(event) {
        var highlighs = document.getElementsByClassName(Highlight.highlightedClassName);
        for (var i in highlighs) {
            if (highlighs[i].dataset && highlighs[i].dataset.timestamp == Highlight.actualHighlightID) {
                highlighs[i].style.backgroundColor = Highlight.colorRemove;
            } else {
                (highlighs[i].style != undefined) ? highlighs[i].style.backgroundColor = Highlight.color : '';
            }
        }
    };

    /**
     * Metodo que selecciona y cambia de color los elementos resaltados a eliminar
     */
    Highlight.onMouseOverHighlightedOnTake = function(event) {
        var highlighs = document.getElementsByClassName(Highlight.highlightedClassName);
        for (var i in highlighs) {
            if (highlighs[i].dataset && highlighs[i].dataset.timestamp == Highlight.actualHighlightID) {
                highlighs[i].style.backgroundColor = Highlight.colorTake;
            } else {
                (highlighs[i].style != undefined) ? highlighs[i].style.backgroundColor = Highlight.color : '';
            }
        }
    };

    /**
     * Metodo para almacenar o actualizar un arreglo que contiene los elementos resaltados
     * @param {number} id
     * @param {string} html
     * @param {boolean} update
     */
    Highlight.highlightedHTMLSave = function(id, html, text, update) {
        var htmlSelected = {};
        htmlSelected.id = id;
        if (!update) {
            htmlSelected.html = html;
            htmlSelected.text = text;
            Highlight.highlightedHTML.push(htmlSelected);
        } else {
            htmlSelected.html = Highlight.highlightedHTML[Highlight.highlightedHTML.length - 1].html;
            htmlSelected.text = Highlight.highlightedHTML[Highlight.highlightedHTML.length - 1].text;
            Highlight.highlightedHTML.pop();
            Highlight.highlightedHTML.push(htmlSelected);
        }

    };
    /**
     * Metodo que se ejecuta antes de realizar un Highlight
     * @param {Range} Contunto de elementos seleccionados
     * @returns {boolean} true | false, define si se hace el resaltado
     */
    Highlight.onBeforeHighlight = function(range) {

    };

    /**
     * Metodo que se ejecuta antes de realizar un Highlight
     * @param {Range} Contunto de elementos seleccionados
     * @returns {boolean} true | false, define si se hace el resaltado
     */
    Highlight.onBeforeHighlight = function(range) {
//        window.range = range;
        var rangeText = range + '';
        var t = document.createElement('pre');
        t.appendChild(range.cloneContents());
        Highlight.highlightedHTMLSave((new Date).getTime(), t.innerHTML, rangeText, false);
        return true;
    };

    /**
     * Metodo que se ejecuta despues de realizar un Highlight
     * @param {Range} Contunto de elementos seleccionados
     */
    Highlight.onAfterHighlight = function(range, highlights) {
        if (highlights.length > 0) {
//            window.range = range;
            var rangeText = range+'';
//            highlights.map(function (h) { 
//                console.log(h);
//            });
//            console.log('' + highlights.map(function (h) { 
//                console.log(h);
////                return '"' + h.innerText + '"'; 
//            }
//                    ));//.join(';#;'));
            Highlight.highlightedHTMLSave(highlights[0].dataset.timestamp, '', rangeText, true);
        }
    };
    /**
     * Metodo para eliminar elementos resaltados
     * @param {object} hl , objeto con elementos resaltados
     * @returns {Boolean}
     */
    Highlight.onRemoveHighlight = function(hl) {
        $('#' + Highlight.optionContainer).hide();
        Highlight.NoteContainer.openClose('close');
        if (hl.dataset.timestamp == Highlight.actualHighlightID) {
            //solo se elimina el elemento seleccionado en el evento del mouseOver
            return true;
        } else {
            return false;
        }
    };

    Highlight.NoteContainer.load = function(event) {
        for (var i in Highlight.highlightedHTML) {
            if (Highlight.highlightedHTML[i].id == Highlight.actualHighlightID) {
                $('#' + Highlight.selectedTextContainer).html(Highlight.highlightedHTML[i].html);
                var selectedTextContainerHighlighted = $('#' + Highlight.selectedTextContainer + ' .' + Highlight.highlightedClassName);
                Highlight.selectedTextContainerHighlighted = [];
                selectedTextContainerHighlighted.each(function(event) {
                    var obj = {};
                    obj.time = $(selectedTextContainerHighlighted[event]).data('timestamp');
                    obj.html = $(selectedTextContainerHighlighted[event]).html();
                    Highlight.selectedTextContainerHighlighted.push(obj);
                });
                for (var j in Highlight.selectedTextContainerHighlighted) {
                    $($($('#' + Highlight.selectedTextContainer + ' .' + Highlight.highlightedClassName))[0]).replaceWith(Highlight.selectedTextContainerHighlighted[j].html);
                }

                Highlight.savedTextHtml = document.getElementById(Highlight.selectedTextContainer).innerHTML;
                Highlight.savedText = Highlight.highlightedHTML[i].text;
                $("#scroll_top").val($('#scrollWrapper').scrollTop());
                $("#scroll_height").val($('#scrollWrapper').height());
                $("#scroll_width").val($('#scrollWrapper').width());
                //se almacena el mismo texto en 3 lugares diferentes
                //1. para almacenar el texto plano, que servira para analisis y mineria de datos
                //$(Highlight.NoteContainer.selectedText).val($.selection());
                $('#' + Highlight.NoteContainer.selectedText).val(Highlight.savedText);
                //2. para almacenar el texto con etiquetas HTML, que servira la visualizacion
                $('#' + Highlight.NoteContainer.selectedText + '_html').val(Highlight.savedTextHtml);
                //3. para almacenar el texto plano, que servira para analisis y mineria de datos
                $('#' + Highlight.NoteContainer.selectedText + '_display').html($('#' + Highlight.NoteContainer.selectedText + '_html').val());
//                $('#' + Highlight.NoteContainer.selectedText + '_display').html(Highlight.savedTextHtml);
                Highlight.NoteContainer.openClose('open');
            }
        }
    };

    Highlight.NoteContainer.openClose = function(action) {
        if (action == 'open') {
            $(Highlight.NoteContainer.container).animate({bottom: "0%"}, 500);
        } else if (action == 'close') {
            $(Highlight.NoteContainer.container).animate({bottom: "-18em"}, 10);
            $(Highlight.NoteContainer.note).val('');
            $('#' + Highlight.NoteContainer.selectedText + '_display').html('');
        }
    };

    Highlight.preloadHighlights = function(hls) {
        Highlight.hltr2.removeHighlights();
        if (hls instanceof Array) {
            for (var i in hls) {
                Highlight.hltr.find(hls[i]);
            }
        }
    };

    Highlight.loadHighlights = function(hls, i) {
        if (hls instanceof Array) {
            Highlight.hltr2.removeHighlights();
            Highlight.hltr.find(hls[i]);
            $('.closer-box').trigger( 'click' );
        }
    };

    /** 
     * Metodo que inicializa el modulo
     */
    Highlight.initialize = function() {
        Highlight.hltr = new TextHighlighter(document.getElementById(Highlight.container), {onBeforeHighlight: Highlight.onBeforeHighlight, onAfterHighlight: Highlight.onAfterHighlight, onRemoveHighlight: Highlight.onRemoveHighlight});
        Highlight.hltr.setColor(Highlight.color);
        document.getElementById(Highlight.container).addEventListener('mouseover', Highlight.onMouseOverHighlighted);
        document.getElementById(Highlight.optionRemove).addEventListener('mouseover', Highlight.onMouseOverHighlightedOnRemove);
        document.getElementById(Highlight.optionRemove).addEventListener('click', function(event) {
            Highlight.hltr.removeHighlights();
        });
        document.getElementById(Highlight.optionTake).addEventListener('mouseover', Highlight.onMouseOverHighlightedOnTake);
        document.getElementById(Highlight.optionTake).addEventListener('click', Highlight.NoteContainer.load);
        document.getElementById(Highlight.NoteContainer.btnCancel).addEventListener('click', function(event) {
            Highlight.NoteContainer.openClose('close');
        });
        Highlight.hltr2 = new TextHighlighter(document.getElementById(Highlight.container), 
        {onRemoveHighlight: function(hl){
                return true;
        }});
        Highlight.hltr2.setColor(Highlight.color);

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
    Highlight.initialize();
});
