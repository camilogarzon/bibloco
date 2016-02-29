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
    Highlight.colorConfirm = 'rgba(170,239,170,.4)';
    Highlight.colorRemove = 'rgba(211,211,211,.4)';
    Highlight.colorTake = '';
    Highlight.highlightedHTML = [];
    Highlight.highlightedClassName = 'highlighted';
    Highlight.container = 'bodyText';
    Highlight.optionContainer = 'selectionSharerPopover';
    Highlight.optionRemove = 'removeHighlight';
    Highlight.optionTake = 'takeHighlight';
    Highlight.optionConfirm = 'confirmHighlight';
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
    Highlight.latest = 0;
    Highlight.pendingRemove = false;
    Highlight.track = {};
    Highlight.userEnable = false;

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
        if(!Highlight.userEnable) return false;
        if (event.target.className == Highlight.highlightedClassName) {
            $('#' + Highlight.optionContainer).css({top: event.pageY - 50, left: event.pageX - 40});
            $('#' + Highlight.optionContainer).show();
            Highlight.actualHighlightID = event.target.dataset.timestamp;
        } else {
            var highlighs = document.getElementsByClassName(Highlight.highlightedClassName);
            $('#' + Highlight.optionContainer).hide();
            if (highlighs.length > 0) {
                for (var i in highlighs) {
                    (highlighs[i].style != undefined) ? highlighs[i].style.backgroundColor = Highlight.color : '';
                }
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
    Highlight.onMouseOverHighlightedOnConfirm = function(event) {
        var highlighs = document.getElementsByClassName(Highlight.highlightedClassName);
        for (var i in highlighs) {
            if (highlighs[i].dataset && highlighs[i].dataset.timestamp == Highlight.actualHighlightID) {
                highlighs[i].style.backgroundColor = Highlight.colorConfirm;
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
     * Metodo que se ejecuta inmediatamente despues de subrayar un texto. Se encarga de resaltar el texto seleccionado
     * previamente, utilizando parametros seteados desde el evento Highlight.onBeforeHighlight
     * @param event
     * onMouseDown
     * onMouseMove
     * onBeforeHighlight
     * onMouseUp
     */
    Highlight.onMouseDown = function(event){
        Highlight.removeLatestSelection(event);
        Highlight.track.onMouseDown = true;
        Highlight.track.onMouseMove = false;
        Highlight.track.onMouseUp = false;
    };
    Highlight.onMouseMove = function(event){
        Highlight.track.onMouseMove = true;

    };
    Highlight.onMouseUp = function(event){
        if(!Highlight.userEnable) return false;
        if(Highlight.track.onMouseDown && !Highlight.track.onMouseMove){
            Highlight.onMouseOverHighlighted(event);
        } else if(Highlight.track.onMouseDown && Highlight.track.onMouseMove){
            $('#' + Highlight.optionContainer).css({top: event.pageY - 50, left: event.pageX - 40});
            $('#' + Highlight.optionContainer).show();
            Highlight.pendingRemove = true;
        }
        Highlight.track.onMouseDown = false;
        Highlight.track.onMouseMove = false;
        Highlight.track.onMouseUp = true;
    };

    /**
     * Resalta el ultimo texto seleccionado
     */
    Highlight.highlighLatestSelection = function(){
        if (Highlight.latest > 0){
            for (var i in Highlight.highlightedHTML) {
                if (Highlight.highlightedHTML[i].id == Highlight.latest){
                    var selectedtext = Highlight.highlightedHTML[i].text
                    selectedtext =selectedtext.replace(/(\r\n|\n|\r)/gm,'#;#');
                    for (var i=0; i<10;i++){
                        selectedtext = selectedtext.replace('#;##;##;#','#;#').replace('#;##;#','#;#').replace('#;#','\n');
                    }
                    Highlight.hltr.find(selectedtext);
                    break;
                }
            }
        }
    }
    /**
     * Elimina el ultimo texto resaltado
     */
    Highlight.removeLatestSelection = function(e){
        if (Highlight.pendingRemove && Highlight.latest > 0){
            for (var i in Highlight.highlightedHTML) {
                if (Highlight.highlightedHTML[i].id == Highlight.latest) {
                    Highlight.highlightedHTML.splice(i, 1);
                    break;
                }
            }
            var highlighs = document.getElementsByClassName(Highlight.highlightedClassName);
            for (var i in highlighs) {
                if ((highlighs[i] !== undefined) && highlighs[i].dataset
                    && (parseInt(highlighs[i].dataset.timestamp) == Highlight.latest)) {
                    $(highlighs[i]).each(function(a,b){
                        Highlight.removeHtml(b);
                    });
                }
            }
            Highlight.latest = 0;
            Highlight.pendingRemove = false;
        }
    }

    Highlight.removeHtml = function(e){
        var textNodes = Highlight.hltr.dom(e).unwrap();
        textNodes.forEach(function (node) {
            Highlight.mergeSiblingTextNodes(node);
        });
    }

    Highlight.mergeSiblingTextNodes = function(textNode) {
        var prev = textNode.previousSibling,
            next = textNode.nextSibling;

        if (prev && prev.nodeType === 3) {
            textNode.nodeValue = prev.nodeValue + textNode.nodeValue;
            Highlight.hltr.dom(prev).remove();
        }
        if (next && next.nodeType === 3) {
            textNode.nodeValue = textNode.nodeValue + next.nodeValue;
            Highlight.hltr.dom(next).remove();
        }
    }


    /**
     * Metodo para almacenar o actualizar un arreglo que contiene los elementos resaltados
     * @param {number} id
     * @param {string} html
     * @param {boolean} update
     */
    Highlight.highlightedHTMLSave = function(id, html, text, update) {
        var htmlSelected = {};
        var add = true;
        htmlSelected.id = id;
        if (!update) {
            htmlSelected.html = html;
            htmlSelected.text = text;
            if (Highlight.highlightedHTML.length > 0){
                for (var i in Highlight.highlightedHTML) {
                    if (Highlight.highlightedHTML[i].text == htmlSelected.text){
                        add = false;
                    }
                }
                if (add){
                    Highlight.highlightedHTML.push(htmlSelected);
                }
            } else {
                Highlight.highlightedHTML.push(htmlSelected);
            }
        } else {
//            if (Highlight.highlightedHTML.length == 0){
            htmlSelected.html = Highlight.highlightedHTML[Highlight.highlightedHTML.length - 1].html;
            htmlSelected.text = Highlight.highlightedHTML[Highlight.highlightedHTML.length - 1].text;
            Highlight.highlightedHTML.pop();
            Highlight.highlightedHTML.push(htmlSelected);
//            } else {
//                htmlSelected.html = Highlight.highlightedHTML[Highlight.highlightedHTML.length - 1].html;
//                htmlSelected.text = Highlight.highlightedHTML[Highlight.highlightedHTML.length - 1].text;
//                Highlight.highlightedHTML.pop();
//                Highlight.highlightedHTML.push(htmlSelected);
//            }
        }
    };

    /**
     * Metodo que calcula el porcentaje de texto resaltado
     * @returns porcentaje de texto total resaltado
     */
    Highlight.calculatePercent = function() {
        var bodyText = document.getElementById(Highlight.container);
        var bodyTextPlainLength = bodyText.innerText.length;
        var highlightedHTMLLength = 0;
        for (var i in Highlight.highlightedHTML) {
            highlightedHTMLLength += Highlight.highlightedHTML[i].text.length;
        }
        var highlightedPercent = Math.round((highlightedHTMLLength * 100) / bodyTextPlainLength);
        return highlightedPercent;
    }
    /**
     * Metodo que se ejecuta antes de realizar un Highlight
     * @param {Range} Contunto de elementos seleccionados
     * @returns {boolean} true | false, define si se hace el resaltado
     */
//    Highlight.onBeforeHighlight = function(range) {
//        return window.confirm('Selected text: ' + range + '\nReally highlight?');
//    };

    /**
     * Metodo que se ejecuta antes de realizar un Highlight
     * @param {Range} Contunto de elementos seleccionados
     * @returns {boolean} true | false, define si se hace el resaltado
     */
    Highlight.onBeforeHighlight = function(range) {
//        window.range = range;
        var rangeText = range + '';
        var t = document.createElement('pre');
        if (!global.ul){
            Util.alertBootstrap('Para poder resaltar debes ingresar <br>con tu cuenta de Lorapp, <a href="/?a=login">Ingresa ahora!</a>', 'error');
            return false;
        }
        if (Highlight.calculatePercent() > 20 ){
            Util.alertBootstrap('Has resaltado más del 20% de esta lectura. <br>No puedes resaltar más texto.', 'error');
            return false;
        }
        if (rangeText.length < 500){
            t.appendChild(range.cloneContents());
            Highlight.highlightedHTMLSave((new Date).getTime(), t.innerHTML, rangeText, false);
            return true;
        } else {
            Util.alertBootstrap('No se puede resaltar más de 500 caracteres. <br>Intenta de nuevo, resaltando un texto más corto.', 'error');
            return false;
        }
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
            Highlight.actualHighlightID = Highlight.latest = highlights[0].dataset.timestamp;
            Highlight.highlightedHTMLSave(highlights[0].dataset.timestamp, '', rangeText, true);
        }
    };
    /**
     * Metodo para eliminar elementos resaltados
     * @param {object} hl , objeto con elementos resaltados
     * @returns {Boolean}
     */
    Highlight.onRemoveHighlight = function(hl) {
        Highlight.NoteContainer.openClose('close');
        if (hl.dataset.timestamp == Highlight.actualHighlightID) {
            for (var i in Highlight.highlightedHTML) {
            	if (Highlight.highlightedHTML[i].id == hl.dataset.timestamp){
                	Highlight.highlightedHTML.splice(i, 1);
                	break;
            	}
            }
            //solo se elimina el elemento seleccionado en el evento del mouseOver
            return true;
        } else {
            return false;
        }
    };

    Highlight.NoteContainer.load = function(noRepeat) {
        var text = '';
        if (noRepeat){
            for (var k in Highlight.highlightedHTML) {
                if (Highlight.highlightedHTML[k].id == Highlight.actualHighlightID) {
                    text = Highlight.highlightedHTML[k].text.replace(/\s+/g, '');
                    break;
                }
            }
            for (var ki in global.preloadHighlights) {
                var tex = global.preloadHighlights[ki].replace(/\s+/g, '');
                if (tex == text) {
                    return false;
                }
            }
        }

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
                return true;
            }
        }
        return false;
    };

    Highlight.NoteContainer.loadForNote = function() {
        if(Highlight.NoteContainer.load(false)) Highlight.NoteContainer.openClose('open');
    };

    Highlight.NoteContainer.openClose = function(action) {
        $('#' + Highlight.optionContainer).hide();
        if (action == 'open') {
            // Hace focus en el textarea
            setTimeout(function() {
              $('#note').focus();
            }, 0);
            $(Highlight.NoteContainer.container).addClass("show");
        } else if (action == 'close') {
            Highlight.removeLatestSelection();
            $(Highlight.NoteContainer.container).removeClass("show");
            $(Highlight.NoteContainer.note).val('');
            $('#' + Highlight.NoteContainer.selectedText + '_display').html('');
        }
    };

    Highlight.preloadHighlights = function(hls) {
//        Highlight.hltr2.removeHighlights();
        if (hls instanceof Array) {
            for (var i in hls) {
                Highlight.hltr.find(hls[i]);
            }
        }
    };

    Highlight.loadHighlights = function(hls, i) {
        if (hls instanceof Array) {
//            Highlight.hltr2.removeHighlights();
            Highlight.hltr.find(hls[i]);
            $('.closer-box').trigger( 'click' );
        }
    };

    /** 
     * Metodo que inicializa el modulo
     */
    Highlight.initialize = function() {
        Highlight.userEnable = global.userEnable();
        Highlight.hltr = new TextHighlighter(document.getElementById(Highlight.container), {onBeforeHighlight: Highlight.onBeforeHighlight, onAfterHighlight: Highlight.onAfterHighlight, onRemoveHighlight: Highlight.onRemoveHighlight});
        Highlight.hltr.setColor(Highlight.color);
        ////document.getElementById(Highlight.container).addEventListener('mouseover', Highlight.onMouseOverHighlighted);
        ////document.getElementById(Highlight.container).addEventListener('click', Highlight.onMouseOverHighlighted);
        //los anteriores dos eventos se reemplazan por los siguientes tres
        document.getElementById(Highlight.container).addEventListener('mousedown', Highlight.onMouseDown);
        $( document ).on( "vmousedown", "#"+Highlight.container, Highlight.onMouseDown);
        document.getElementById(Highlight.container).addEventListener('mousemove', Highlight.onMouseMove);
        $( document ).on( "vmousemove", "#"+Highlight.container, Highlight.onMouseMove);
        document.getElementById(Highlight.container).addEventListener('mouseup', Highlight.onMouseUp);
        $( document ).on( "vmouseup", "#"+Highlight.container, Highlight.onMouseUp);
        document.getElementById(Highlight.optionRemove).addEventListener('mouseover', Highlight.onMouseOverHighlightedOnRemove);
        document.getElementById(Highlight.optionRemove).addEventListener('click', function(event) {
            Highlight.hltr.removeHighlights();
        });
        document.getElementById(Highlight.optionConfirm).addEventListener('mouseover', Highlight.onMouseOverHighlightedOnConfirm);
        document.getElementById(Highlight.optionConfirm).addEventListener('click', function(event) {
            Highlight.latest = 0;
            Highlight.pendingRemove = false;
            $('#' + Highlight.optionContainer).hide();
            if(Highlight.NoteContainer.load(true)) NoteAction.saveNote(null);
        });
        document.getElementById(Highlight.optionTake).addEventListener('mouseover', Highlight.onMouseOverHighlightedOnTake);
        document.getElementById(Highlight.optionTake).addEventListener('click', function(event) {
            //Highlight.latest = 0;
            //Highlight.pendingRemove = true;
            Highlight.NoteContainer.loadForNote();
        });
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
