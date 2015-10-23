/**
 * Modulo que gestiona las acciones de las notas del usuario en una lectura
 * @author Camilo Garzon
 * @version 1.0
 * @since 2015-07-11
 */

var NoteAction = {};

/**
 * Funcion autoejecutable encargada de definir todas las variables y funciones 
 */
(function() {

    //////////////////////////////////////////////////////////////////////
    // ATRIBUTOS /////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////

    /* ID de la nota visualizada */
    NoteAction.noteElementtId = 0;
    /* ID de la nota visualizada */
    NoteAction.idElem = '';
    /* Selector JQuery del elemento que carga las notas */
    NoteAction.noteLoader = '';
    /* Elementos para manipular cada una de las notas tomadas */
    NoteAction.noteText = '';
    NoteAction.noteTextEdit = '';
    NoteAction.btnNoteEdit = '';
    NoteAction.btnNoteCancel = '';
    NoteAction.btnNoteSave = '';
    /* Elementos utilizados al tomar una nota */

    //////////////////////////////////////////////////////////////////////
    // METODOS ///////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////

    /**
     * Carga las notas de un usuario
     */
    NoteAction.saveNote = function(e) {
        e.preventDefault();
        var d = $('#form_note_create').serialize();
        Util.callAjax(d, global.url + "mynotes/savenote", "POST", NoteAction.saveNoteSuccess, NoteAction.saveNoteError);
    };

    /**
     * Metodo que renderiza las notas con formato y estilos apropiados para la seccion de lectura
     */
    NoteAction.saveNoteSuccess = function(data) {
        if (data.valid) {
            Util.alertBootstrap('¡Nota guardada!', 'info');
        } else {
            Util.alertBootstrap('Ocurrió un error. No se guardó la nota. Error: ' + data.error, 'error');
        }
        Highlight.NoteContainer.openClose('close');
    };

    /** 
     * Metodo muestra el mensaje cuando no hay notas para mostrar
     */
    NoteAction.saveNoteError = function(jqXHR, textStatus) {
        Highlight.NoteContainer.openClose('close');
        Util.alertBootstrap('Ocurrió un error. No se guardó la nota.', 'error');
    };


    /**
     * Actualiza la informacion de la nota
     * @param Number id
     * @param Number idelem
     */
    NoteAction.loadNoteIntoReading = function(m) {
        var load_scroll_top = parseInt($("#load_scroll_top" + m).val());
        var load_font_size = parseInt($("#load_font_size" + m).val());
//        var load_selectedtext = $("#load_selectedtexthtml" + m).html();
        //load_selectedtext = load_selectedtext.replace(/["]/g, '\\"');
        //load_selectedtext = load_selectedtext.replace('<br>', ' ');
        //load_selectedtext = load_selectedtext.replace('<br>', '\r');
//        console.log(load_selectedtext);
//        load_selectedtext = load_selectedtext.replace(/<br>/gi, '\n');
//        console.log(load_selectedtext);
        $("#load_scroll_top").val(load_scroll_top);
        $("#load_font_size").val(load_font_size);
//        var _this = $('.icon-notes-reading');
//        var current = _this.attr("src");
//        var swap = _this.attr("data-swap");
//        _this.attr('src', swap).attr("data-swap", current);
//        if ($("#icon_note").hasClass("isDown")) {
//            $(".notesMainWrapper").animate({left: "100%"}, 1000);
//        } else {
//            $(".notesMainWrapper").animate({left: "0%"}, 1000);
//        }
//        $("#icon_note").toggleClass("isDown");
//        if (load_font_size > 0) {
//            $('.lecture').css({'font-size': load_font_size + 'px'});
//        }
        $('#scrollWrapper').scrollTop(load_scroll_top);
        //@TODO: no se puede resaltar una zona ya resaltada
        //pero que pertenece a otra nota,
        //por lo tanto debe eliminarse lo ya resaltado
//        $("body p").unhighlight();
//        $("body p").highlight(load_selectedtext);

///seccion de codigo para ocultar las notas
//        $(".my-readings-wrapper").animate({
//            left: "-450px"
//        }, 500);
//        $(".notesMainWrapper").animate({
//            right: "-650px"
//        }, 500);
//        // Se desbloquea el scroll del body
//        $("body").removeClass("stop-scrolling");
//        $('.closer-box').fadeOut(500);
//        $('.right-close-icon').fadeOut(500);
//        $('.left-close-icon').fadeOut(500);
    };
    /**
     * Carga las notas de un usuario
     */
    NoteAction.getNote = function(id) {
        var d = {};
        d.id = id;
        Util.callAjax(d, global.url + "/mynotes/lecturesection", "POST", NoteAction.getNoteRender, NoteAction.getNoteRenderEmpty);
    };

    /**
     * Metodo que renderiza las notas con formato y estilos apropiados para la seccion de lectura
     */
    NoteAction.getNoteRender = function(data) {
        if (data.valid) {
            global.preloadHighlights = [];
            var res = data.response;
            var notes = '';
            var m = 0;
            for (var i in res) {
                var lecturesections = res[i].lecturesections;
                for (var j in lecturesections) {
                    var notte = lecturesections[j].notes;
                    notes += '<h4 class="chapterTitle">' + lecturesections[j].name + '</h4>';
                    for (var k in notte) {
                        var selectedtext_display = '';
                        //se da prioridad a la visualizacion de HTML
                        selectedtext_display = notte[k].selectedtext_html;
                        //se limpian los elementos de busqueda
                        var p=notte[k].selectedtext.replace(/(\r\n|\n|\r)/gm,'#;#');
                        for (var i=0; i<10;i++){
                            p = p.replace('#;##;##;#','#;#').replace('#;##;#','#;#').replace('#;#','\n');
                        }
                        global.preloadHighlights.push(p);
                        if (selectedtext_display.length == 0) {
                            selectedtext_display = notte[k].selectedtext;
                        }
                        notes += '<div id=rn' + m + ' class="notesGroup">';
                        //Boton para borrar apunte
                        notes += '<a onclick="NoteAction.deleteNote(' + notte[k].id + ',' + m + ')" class="delete-note-icon" title="Borrar apunte"><img src="' + global.url + '/images/icons/svg/delete-icon.svg"></a>';
                        //Apunte subrayado
                        notes += '<div id="load_selectedtexthtml' + m + '" style="cursor:pointer" title="Clic para ver en la lectura..." onclick="Highlight.loadHighlights( global.preloadHighlights,' + m + ')"  class="notesHighlight">' + selectedtext_display + '</div>';
                        //Apunte tomado por el usuario
                        //notes += '<div class="notesNote" title="Editar nota" onclick="NoteAction.editNoteShow(' + m + ', true)">';
                        //notes += '<div id="note_text' + m + '" >' + notte[k].note + '</div>';
                        notes += '<div class="notesNote">';
                        notes += '<div id="note_text' + m + '"  title="Editar nota" onclick="NoteAction.editNoteShow(' + m + ', true)">' + notte[k].note + '</div>';
                        notes += '<input type="hidden" id="load_scroll_top' + m + '" value="' + notte[k].scroll_top + '"/>';
                        notes += '<input type="hidden" id="load_font_size' + m + '" value="' + notte[k].font_size + '"/>';
                        notes += '<textarea id="note_text_edit' + m + '" class="edit-note-textarea" style="display: none">' + notte[k].note + '</textarea>';
                        //Botones para cancelar o aplicar la edición de la nota
                        notes += '<div align="right" class="note_option not-antialiased">';
                        notes += '<a id="btn_note_cancel' + m + '" onclick="NoteAction.editNoteShow(' + m + ', false)" class="btn-discard-note unselectable" style="display: none">Cancelar</a>';
                        notes += '<button id="btn_note_save' + m + '" onclick="NoteAction.updateNote(' + notte[k].id + ', ' + m + ')" class="btn-save-note flat-btn unselectable" style="display: none">Guardar</button>';
                        notes += '</div>';
                        notes += '</div>';
                        notes += '</div>';
                        m++;
                    }
                }
            }
            if (m == 0) {
                notes = '<h4 class="chapterTitle">No has tomado ninguna nota de esta Lectura.</h4>';
            }
            Highlight.preloadHighlights(global.preloadHighlights);
            $(NoteAction.noteLoader).html(notes);
        } else {
            alert('Error: ' + data.error);
        }
    };

    /** 
     * Metodo muestra el mensaje cuando no hay notas para mostrar
     */
    NoteAction.getNoteRenderEmpty = function(jqXHR, textStatus) {
        var notes = '<h4 class="chapterTitle">No has tomado ninguna nota de esta Lectura.</h4>';
        $(NoteAction.noteLoader).html(notes);
    };

    /**
     * Actualiza la informacion de la nota
     * @param Number id
     * @param Number idelem
     */
    NoteAction.updateNote = function(id, idelem) {
        NoteAction.noteElementtId = idelem;
        var d = {};
        d.id = id;
        d.note = $(NoteAction.noteTextEdit + idelem).val();
        Util.callAjax(d, global.url + "/mynotes/savenote", "GET", NoteAction.updateNoteSuccess);
    };
    NoteAction.updateNoteSuccess = function(data) {
        if (data.valid) {
            $(NoteAction.noteText + NoteAction.noteElementtId).html($(NoteAction.noteTextEdit + NoteAction.noteElementtId).val());
            NoteAction.editNoteShow(NoteAction.noteElementtId, false);
        } else {
            alert('Error: ' + data.error);
        }
    };

    /**
     * Metodo para el manejo dinamico de la edicion de las notas tomadas
     * @param Number id del elemento a intervenir
     * @param Bool s, show / hide=0
     */
    NoteAction.editNoteShow = function(id, s) {
        if (s) {
            $(NoteAction.noteText + id).hide();
            $(NoteAction.btnNoteEdit + id).hide();
            $(NoteAction.btnNoteCancel + id).show();
            $(NoteAction.noteTextEdit + id).show();
            $(NoteAction.btnNoteSave + id).show();
        } else {
            $(NoteAction.noteText + id).show();
            $(NoteAction.btnNoteEdit + id).show();
            $(NoteAction.btnNoteCancel + id).hide();
            $(NoteAction.noteTextEdit + id).hide();
            $(NoteAction.btnNoteSave + id).hide();
            $(NoteAction.noteTextEdit + id).val($(NoteAction.noteText + id).html());
        }

    };

    /**
     * Metodo para eliminar una nota de usuario
     * @param String id del la nota a eliminar
     * @param String idelem id del elemento a remover de la lista de notas tomadas
     */
    NoteAction.deleteNote = function(id, idelem) {
        var d = {};
        d.id = id;
        NoteAction.idElem = idelem;
        Util.callAjax(d, global.url + "/mynotes/delete", "POST", NoteAction.deleteNoteSuccess);
    };
    NoteAction.deleteNoteSuccess = function(data) {
        if (data.valid) {
            $("#rn" + NoteAction.idElem).remove();
        } else {
            alert('Error: ' + data.error);
        }
    };



    /** 
     * Metodo que inicializa el modulo
     */
    NoteAction.initialize = function() {
        $('#btn_guardar').click(NoteAction.saveNote);
//        NoteAction.getNote(global.lecturesection_id);
    };

})();

/**
 * Funcion de inicializacion en el momento en que se completa el DOM llamada desde jquery
 * Esta funcion realiza los procesos de inicializacion de la aplicacion
 */
$(function() {
    NoteAction.initialize();
});
