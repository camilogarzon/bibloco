/**
 * Modulo myLecture
 * @namespace myLecture
 * @author Camilo Garzon
 * @description Modulo para operaciones sobre la lectura
 * @requires jquery
 * @requires util
 */
var myLecture = {
    /**
     * Almacena el texto subrayado
     * @type String
     */
    savedText: '',
    /**
     * ID de la nota visualizada
     * @type Number
     */
    noteElementtId: 0,
    /**
     * Hace impresion de contenido seleccionado por ID y agrega CSS para la impresion
     * @param String id elemento
     */
    printContentById: function(id) {
        var prtContent = document.getElementById(id);
        var printDivCSS = new String('<link href="' + global.url + '/css/print.css" rel="stylesheet" type="text/css"><div align="center" style="cursor: pointer; width:100%;"><div onclick="window.print();" style="background-color: #D6D6D6;width: 200px;margin: 40px;padding-bottom: 10px;padding-top: 10px;border-radius: 10px;cursor: pointer;"><span style="color: blue; ">CLIC PARA IMPRIMIR</span></div></div>');
        var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
        WinPrint.document.write(printDivCSS + prtContent.innerHTML);
        WinPrint.document.close();
        WinPrint.focus();
        //estas lineas imprimen directamente, el timeout es para esperar el render de navegador
//        setTimeout(function(){
//            WinPrint.print();
//            WinPrint.close();
//        },200);
    },
    /**
     * Cambia el tamano del letra que se encuentra en el elemento "e" (jQuerySelector)
     * @param String e
     * @param String c
     */
    changeFontSize: function(e, c) {
        var f = parseInt($(e).css("font-size"));
        if (c === '+') {
            f = (f < 24) ? f + 1 : f;
        } else if (c === '-') {
            f = (f > 12) ? f - 1 : f;
        } else if (c === 'get') {
            return f;
        }
        $(e).css({'font-size': f});
    },
    /**
     * Selecciona el texto que se va a resaltar y a utilizar en las notas
     * @see jquery.highlight.js
     */
    saveSelection: function() {
        if (window.getSelection) {
            var sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                return sel.getRangeAt(0);
            }
        } else if (document.selection && document.selection.createRange) {
            return document.selection.createRange();
        }
        return null;
    },
    /**
     * Procesa el texto dentro del elemento seleccionado, para ser resaltado
     * @example mirar en consola valor de "sel.focusNode.innerHTML"
     * @see jquery.highlight.js
     * @param DOM Element range
     */
    restoreSelection: function(range) {
        if (range) {
            if (window.getSelection) {
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (document.selection && range.select) {
                range.select();
            }
        }
    },
    /**
     * Muestra opciones del toolbox de lectura: seleccionar, resaltar, limpiar, crear nota
     * @param Event e
     */
    floatMenu: function(e) {
        myLecture.savedText = myLecture.saveSelection();
        setTimeout(function() {
            var isEmpty = myLecture.savedText.toString().length === 0;
            if (!isEmpty) {
                $("#highlight-button").css({position: 'absolute', top: e.pageY, left: e.pageX});
                //$("#float_note").css({top: e.pageY + 40});
                $("#highlight-button").show();
            } else {
                //$(".add-note-wrapper").animate({bottom: "-18em"}, 10);
                $("#highlight-button").hide();
                $("#float_note").hide();
            }
        }, 10);
    },
    /**
     * Resalta texto seleccionado
     */
    highlighter: function() {
        if (!myLecture.savedText)
            return;
        var texto = myLecture.savedText + '';
        //texto = texto.replace(/\n/gi,"<br>");
//        texto = texto.replace(/\r?\n/g, "<br>");
//        texto = texto.replace('"', '\"');
        texto = texto.replace(/\n/gi, "<br>");
        //texto = texto.replace(/\r/gi, "<br2>");
        //console.log(texto);
        $("#scroll_top").val($('#scrollWrapper').scrollTop());
        $("#scroll_height").val($('#scrollWrapper').height());
        $("#scroll_width").val($('#scrollWrapper').width());
        $("#count_words").val(myLecture.wordCount(texto).words);
        $("#font_size").val(myLecture.changeFontSize('.lecture', 'get'));
        $("#note").val('');
        $("#selected_text").empty();
        //$("#selected_text").append(texto);
        $("#selected_text").html(texto);
        $("#selectedtext").val(texto);
        $("body p").highlight(texto);
        myLecture.restoreSelection(myLecture.savedText);
        $(".add-note-wrapper").animate({bottom: "0%"}, 500);
        return false;
    },
    /**
     * Limpia texto resaltado
     */
    unHighlight: function() {
        $("body p").unhighlight();
    },
    /**
     * Metodo para contar palabras, caracteres y lineas
     */
    wordCount: function(val) {
        return {
            charactersNoSpaces: val.replace(/\s+/g, '').length,
            characters: val.length,
            words: val.match(/\S+/g).length,
            lines: val.split(/\r*\n/).length
        };
    },
    /**
     * Abre ventana flotante para crear una nota sobre un texto seleccionado
     * @param Event e
     */
//    addNote: function(e) {
//        if (!myLecture.savedText)
//            return;
//        var texto = myLecture.savedText + '';
//        //texto = texto.replace(/\r?\n/g, "<br>");
//        $("#scroll_top").val($(window).scrollTop());
//        $("#note").val('');
//        $("#selected_text").empty();
//        //$("#selected_text").append(texto);
//        $("#selected_text").html(texto);
//        $("#selectedtext").val(texto);
//        $("#highlight-button").hide();
//        $("#highlight-button").css({position: 'fixed', top: -9999});
//        myLecture.restoreSelection(myLecture.savedText);
//        $("#float_note").show();
//        return false;
//    },
    /**
     * Cierra ventana flotante para crear una nota
     */
    closeNote: function() {
        $("#highlight-button").hide();
        $("#float_note").hide();
        $(".add-note-wrapper").animate({bottom: "-18em"}, 10);
    },
    closeSelectedTextNote: function(e) {
        e.preventDefault();
        myLecture.closeNote();
    },
    /**
     * Guarda la informacion de la nota
     */
    saveNote: function(e) {
        e.preventDefault();
        var d = $('#form_note_create').serialize();
//        var d = {};
//        d.user_id = $("#user_id").val();
//        d.lecturesection_id = $("#lecturesection_id").val();
//        d.lecture_id = $("#lecture_id").val();
//        d.scroll_top = $("#scroll_top").val();
//        d.scroll_height = $("#scroll_height").val();
//        d.scroll_width = $("#scroll_width").val();
//        d.count_words = $("#count_words").val();
//        d.font_size = $("#font_size").val();
//        d.note = $("#note").val();
//        var texto = myLecture.savedText + '';
//        d.selectedtext = texto;//.toString();

        util.cursorBusy();
        $.ajax({
            data: d,
            type: "POST",
            dataType: "json",
            url: global.url + "/mynotes/savenote",
            success: function(data) {
                util.cursorNormal();
                if (data.valid) {
                    myLecture.closeNote();
                    util.alertBootstrap('Información guardada correctamente!','info');
                } else {
                    alert('Error: ' + data.error);
                }
            }, error: function(data) {
                util.cursorNormal();
                myLecture.closeNote();
                util.alertBootstrap('No se guardó la información!','error');
            }
        });
    },
    openNoteLoader: function(id) {
        myLecture.getNote(id);
        $('#note_loader_container').show();
    },
    loadHighlight: function(id) {
        var d = {};
        d.id = id;
        $.ajax({
            data: d,
            type: "POST",
            dataType: "json",
            url: global.url + "/mynotes/lecturesection",
            success: function(data) {
                util.cursorNormal();
                if (data.valid) {
                    var res = data.response;
                    for (var i in res) {
                        var lecturesections = res[i].lecturesections;
                        for (var j in lecturesections) {
                            var notte = lecturesections[j].notes;
                            for (var k in notte) {
                                $("body p").highlight(notte[k].selectedtext);
                            }
                        }
                    }
                }
            }
        });
    },
    closeNoteLoader: function() {
        $('#note_loader_container').hide();
        $('#note_loader').empty();
    },
    /**
     * Carga las notas de un usuario
     */
    getNote: function(id) {
        var d = {};
        d.id = id;
        util.cursorBusy();
        $.ajax({
            data: d,
            type: "POST",
            dataType: "json",
            url: global.url + "/mynotes/lecturesection",
            success: function(data) {
                util.cursorNormal();
                if (data.valid) {
                    var res = data.response;
                    var notes = '';
                    var m = 0;
                    for (var i in res) {
//                        notes += '<div class="titleWrapper" style="-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;" unselectable="on" onselectstart="return false;" onmousedown="return false;">';
//                        notes += '<h2 class="readingTitle">' + res[i].title + '</h2>';
//                        notes += '<p class="readingAuthor">' + res[i].author + '</p>';
//                        notes += '</div>';
//                        notes += '<div class="bodyText">';
                        var lecturesections = res[i].lecturesections;
                        for (var j in lecturesections) {
                            var notte = lecturesections[j].notes;
                            notes += '<h4 class="chapterTitle">' + lecturesections[j].name + '</h4>';
                            
                            for (var k in notte) {
//                                notes += '<div id=rn' + m + '>';
                                notes += '<div id=rn' + m + ' class="notesGroup">';
                                notes += '<span onclick="myLecture.deleteNote(' + notte[k].id + ',' + m + ')" class="delete-note-icon" title="Borrar apunte"><img src="' + global.url + '/images/icons/svg/delete-icon.svg"></span>';
//                                notes += '<div style="cursor:pointer" id="load_selectedtexthtml' + m + '" title="Clic para ver en la lectura..." onclick="myLecture.loadNoteIntoReading(' + m + ')"  class="notesHighlight">' + notte[k].selectedtext + '</div>';
                                notes += '<div id="load_selectedtexthtml' + m + '" class="notesHighlight">' + notte[k].selectedtext + '</div>';
                                notes += '<div class="notesNote" title="Editar nota" onclick="myLecture.editNoteShow(' + m + ', true)"><div id="note_text' + m + '" >' + notte[k].note + '</div>';
                                notes += '<input type="hidden" id="load_scroll_top' + m + '" value="' + notte[k].scroll_top + '"/>';
                                notes += '<input type="hidden" id="load_font_size' + m + '" value="' + notte[k].font_size + '"/>';
                                notes += '<textarea id="note_text_edit' + m + '" rows="5" style="width: 96%; display: none">' + notte[k].note + '</textarea>';
                                notes += '</div>';
                                notes += '<div align="right" class="note_option">';
                                notes += '<span id="btn_note_save' + m + '" onclick="myLecture.updateNote(' + notte[k].id + ', ' + m + ')" class="btn-save-note unselectable" style="display: none">Guardar</span>';
                                notes += '<span id="btn_note_cancel' + m + '" onclick="myLecture.editNoteShow(' + m + ', false)" class="btn-save-note unselectable" style="display: none">Cancelar</span>';
                                notes += '</div>';
                                notes += '</div>';
//                                notes += '</div>';
                                m++;
                            }
                        }
//                        notes += '</div>';
                    }
                    if (m == 0) {
                        notes = '<h2 class="readingTitle">No has tomado ninguna nota de esta Lectura.</h2>';
                    }
                    $("#note_loader").empty();
                    $("#note_loader").append(notes);
                } else {
                    alert('Error: ' + data.error);
                }
            }, error: function(data) {
                util.cursorNormal();
                var notes = '<h2 class="readingTitle">No has tomado ninguna nota de esta Lectura.</h2>';
                $("#note_loader").empty();
                $("#note_loader").append(notes);
            }
        });
    },
    /**
     * Actualiza la informacion de la nota
     * @param Number id
     * @param Number idelem
     */
    loadNoteIntoReading: function(m) {
        var load_scroll_top = parseInt($("#load_scroll_top" + m).val());
        var load_font_size = parseInt($("#load_font_size" + m).val());
        var load_selectedtext = $("#load_selectedtexthtml" + m).html();
        //load_selectedtext = load_selectedtext.replace(/["]/g, '\\"');
        //load_selectedtext = load_selectedtext.replace('<br>', ' ');
        //load_selectedtext = load_selectedtext.replace('<br>', '\r');
        console.log(load_selectedtext);
        load_selectedtext = load_selectedtext.replace(/<br>/gi, '\n');
        console.log(load_selectedtext);
        $("#load_scroll_top").val(load_scroll_top);
        $("#load_font_size").val(load_font_size);
        var _this = $('.icon-notes-reading');
        var current = _this.attr("src");
        var swap = _this.attr("data-swap");
        _this.attr('src', swap).attr("data-swap", current);
        if ($("#icon_note").hasClass("isDown")) {
            $(".notesMainWrapper").animate({left: "100%"}, 1000);
        } else {
            $(".notesMainWrapper").animate({left: "0%"}, 1000);
        }
        $("#icon_note").toggleClass("isDown");
        if (load_font_size > 0) {
            $('.lecture').css({'font-size': load_font_size + 'px'});
        }
        $('#scrollWrapper').scrollTop(load_scroll_top);
        //@TODO: no se puede resaltar una zona ya resaltada
        //pero que pertenece a otra nota,
        //por lo tanto debe eliminarse lo ya resaltado
        $("body p").unhighlight();
        $("body p").highlight(load_selectedtext);
    },
    /**
     * Actualiza la informacion de la nota
     * @param Number id
     * @param Number idelem
     */
    updateNote: function(id, idelem) {
        myLecture.noteElementtId = idelem;
        var d = {};
        d.id = id;
        d.note = $('#note_text_edit' + idelem).val();
        util.cursorBusy();
        $.ajax({
            data: d,
            type: "GET",
            dataType: "json",
            url: global.url + "/mynotes/savenote",
            success: function(data) {
                util.cursorNormal();
                $("#highlight-button").hide();
                $("#float_note").hide();
                if (data.valid) {
                    $("#note_text" + myLecture.noteElementtId).empty();
                    $("#note_text" + myLecture.noteElementtId).append($('#note_text_edit' + myLecture.noteElementtId).val());
                    myLecture.editNoteShow(myLecture.noteElementtId, false);
                } else {
                    alert('Error: ' + data.error);
                }
            }, error: function(data) {
                util.cursorNormal();
            }
        });
    },
    /**
     *
     * @param Number id del elemento a intervenir
     * @param Bool s, show / hide=0
     */
    editNoteShow: function(id, s) {
        if (s) {
            $("#note_text" + id).hide();
            $("#btn_note_edit" + id).hide();
            $("#btn_note_cancel" + id).show();
            $("#note_text_edit" + id).show();
            $("#btn_note_save" + id).show();
        } else {
            $("#note_text" + id).show();
            $("#btn_note_edit" + id).show();
            $("#btn_note_cancel" + id).hide();
            $("#note_text_edit" + id).hide();
            $("#btn_note_save" + id).hide();
            $("#note_text_edit" + id).val($("#note_text" + id).html());
        }

    },
    /**
     * Metodo para eliminar una nota de usuario
     * @param String id del la nota a eliminar
     * @param String idelem id del elemento a remover de la lista de notas tomadas
     */
    deleteNote: function(id, idelem) {
        var d = {};
        d.id = id;
        util.cursorBusy();
        $.ajax({
            data: d,
            type: "POST",
            dataType: "json",
            url: global.url + "/mynotes/delete",
            success: function(data) {
                util.cursorNormal();
                $("#highlight-button").hide();
                $("#float_note").hide();
                if (data.valid) {
                    $("#rn" + idelem).remove();
                } else {
                    alert('Error: ' + data.error);
                }
            }, error: function(data) {
                util.cursorNormal();
            }
        });
    },
    hideTooltip: function(event){
      $('#general_tooltip').hide();
    },
    showTooltip: function(event){
        var relatedTargetId = event && event.getAttribute && event.getAttribute("data-original-title");
        var top = event.offsetTop + 10;
        var left = event.offsetLeft + 70;
        var general_tooltip = $('#general_tooltip');
        general_tooltip.html(relatedTargetId);
        general_tooltip.css({top: top+'px', left:left+'px'});
        general_tooltip.show();
    }

};

var setTimer = function(cb, options) {
    options = options || Object.prototype;
    options.timeout = options.timeout || 0;
    options.interval = options.interval || 0;
    options.limit = options.limit || 1;
    options.onClear = options.onClear || Function.prototype;
    options.cb = cb || Function.prototype;

    var timer = {
        calls: 0,
        options: options,
        timeout: null,
        interval: null,
        clear: function() {
            if (this.timeout)
                clearTimeout(this.timeout);
            if (this.interval)
                clearInterval(this.interval);
            options.onClear.call(this);
        }
    };

    timer.timeout = setTimeout(function() {
        timer.interval = setInterval(function() {
            timer.calls++;
            options.cb.call(timer);
            if (timer.calls >= options.limit) {
                timer.clear();
            }
        }, options.interval);
    }, options.timeout);

    return timer;
};
