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
            f = f + 1;
        } else if (c === '-') {
            f = f - 1;
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
        $("#note").val('');
        $("#selected_text").empty();
        $("#selected_text").append(texto);
        $("body p").highlight(texto);
        myLecture.restoreSelection(myLecture.savedText);
        return false;
    },
    /**
     * Limpia texto resaltado
     */
    unHighlight: function() {
        $("body p").unhighlight();
    },
    /**
     * Abre ventana flotante para crear una nota sobre un texto seleccionado
     * @param Event e
     */
    addNote: function(e) {
        if (!myLecture.savedText)
            return;
        var texto = myLecture.savedText + '';
        $("#note").val('');
        $("#selected_text").empty();
        $("#selected_text").append(texto);
        $("#selectedtext").val(texto);
        $("#highlight-button").hide();
        $("#highlight-button").css({position: 'fixed', top: -9999});
        myLecture.restoreSelection(myLecture.savedText);
        $("#float_note").show();
        return false;
    },
    /**
     * Cierra ventana flotante para crear una nota
     */
    closeNote: function() {
        $("#highlight-button").hide();
        $("#float_note").hide();
    },
    /**
     * Guarda la informacion de la nota
     */
    saveNote: function() {
        var d = $('#form_note_create').serialize();
        util.cursorBusy();
        $.ajax({
            data: d,
            type: "POST",
            dataType: "json",
            url: global.url + "/mynotes/savenote",
            success: function(data) {
                util.cursorNormal();
                $("#highlight-button").hide();
                $("#float_note").hide();
                if (data.valid) {
                    alert('Información guardada correctamente');
                } else {
                    alert('Error: ' + data.error);
                }
            }
        });
    },
    openNoteLoader: function() {
        myLecture.getNote();
        $('#note_loader_container').show();
    },
    closeNoteLoader: function() {
        $('#note_loader_container').hide();
        $('#note_loader').empty();
    },
    /**
     * Carga las notas de un usuario
     */
    getNote: function() {
        var d = {};
        d.id = 0;
        util.cursorBusy();
        $.ajax({
            data: d,
            type: "POST",
            dataType: "json",
            url: global.url + "/mynotes",
            success: function(data) {
                util.cursorNormal();
                if (data.valid) {
                    var res = data.response;
                    var notes = '';
                    for (var i in res) {
                        notes += '<div id=rn' + i + '>';
                        notes += '<div class="notes_container notes_expandable">';
                        notes += '<p><q class="notes_fromtext">' + res[i].selectedtext + '</q></p>';
                        notes += '<p class="notes_title_nota">NOTA:</p>';
                        notes += '<p class="notes_title_nota_txt" id="note_text' + i + '">' + res[i].note + '</p>';
                        notes += '<p><textarea id="note_text_edit' + i + '" rows="5" style="width: 96%; display: none">' + res[i].note + '</textarea></p>';
                        notes += '<div align="right" class="note_option">';
                        notes += '<span id="btn_note_edit' + i + '" onclick="myLecture.editNoteShow(' + i + ', true)">Editar</span>';
                        notes += '<span id="btn_note_save' + i + '" onclick="myLecture.updateNote(' + res[i].id + ', ' + i + ')" style="display: none">Guardar</span>';
                        notes += '<span id="btn_note_cancel' + i + '" onclick="myLecture.editNoteShow(' + i + ', false)" style="display: none">Cancelar</span>';
                        notes += '<span id="btn_note_delete' + i + '" onclick="myLecture.deleteNote(' + res[i].id + ',' + i + ')">Eliminar</span>';
                        notes += '</div>';
                        notes += '</div>';
                        notes += '<hr>';
                        notes += '</div>';
                    }
                    $("#note_loader").empty();
                    $("#note_loader").append(notes);
                } else {
                    alert('Error: ' + data.error);
                }
            }
        });
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
            }
        });
    },
    /**
     * Metodo para almacenar un Objeto en localStorage
     * @param String key
     * @param Object value
     */
    setLSO: function(key, value) {
        window.localStorage.setItem(key, JSON.stringify(value));
    },
    /**
     * Metodo para recuperar un Objeto de localStorage
     * @param String key
     * @returns Object 
     */
    getLSO: function(key) {
        return JSON.parse(window.localStorage.getItem(key));
    },
    /**
     * Metodo para almacenar un string en localStorage
     * @param String key
     * @param String value
     */
    setLS: function(key, value) {
        window.localStorage.setItem(key, value);
    },
    /**
     * Metodo para recuperar un string de localStorage
     * @param String key
     * @returns Object 
     */
    getLS: function(key) {
        return window.localStorage.getItem(key);
    },
    /**
     * Limpia localStorage
     */
    cleanLS: function() {
        localStorage.clear();
    },
    /**
     * Metodo para consrvar los valores de local storage
     * @param StorageEvent e 
     */
    storageValue: function(e) {
        myLecture.setLS(e.key, e.oldValue);
    },
    /**
     * Verifica se localStorage est habilitado
     * @returns Boolean 
     */
    checkLS: function() {
        try {
            localStorage.setItem('test', 'success');
            localStorage.removeItem('test');
            if (window.addEventListener) {
                window.addEventListener('storage', myLecture.storageValue, false);
            } else {
                window.attachEvent('onstorage', myLecture.storageValue);
            }
            return true;
        } catch (e) {
            console.log(e);
            alert('El navegador no es compatible con esta aplicación. \nPor favor habilite LocalStorage.\n\n' + e);
            return false;
        }
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






