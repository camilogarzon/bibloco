var savedText = null; // Variable to save the text
var actualNoteId = 0;

function showHideLabel(id, show) {
    if (show) {
        $('#' + id).show();
    } else {
        $('#' + id).hide();
    }
}

function printLecture() {
    var prtContent = document.getElementById('lecture');
    var printDivCSS = new String('<link href="css/print.css" rel="stylesheet" type="text/css"><div align="center" style="cursor: pointer; width:100%;"><div onclick="window.print();" style="background-color: #D6D6D6;width: 200px;margin: 40px;padding-bottom: 10px;padding-top: 10px;border-radius: 10px;cursor: pointer;"><span style="color: blue; ">CLIC PARA IMPRIMIR</span></div></div>');
    var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    WinPrint.document.write(printDivCSS + prtContent.innerHTML);
    WinPrint.document.close();
    WinPrint.focus();
//WinPrint.print();
//WinPrint.close();    
}

function printThis() {
    window.print();
}

function fontSizeChange(e, c) {
    var f = parseInt($(e).css("font-size"));
    if (c === '+') {
        f = f + 1;
    } else if (c === '-') {
        f = f - 1;
    }
    $(e).css({'font-size': f});
}

function imageFancyBox(src) {
    $.fancybox.open(src);
}

function selectText() {
    var element = $(this)[0];
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
    return this;
}

function saveSelection() {
    if (window.getSelection) {
        var sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            return sel.getRangeAt(0);
        }
    } else if (document.selection && document.selection.createRange) {
        return document.selection.createRange();
    }
    return null;
}

function restoreSelection(range) {
    if (range) {
        if (window.getSelection) {
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (document.selection && range.select) {
            range.select();
        }
    }
}

function floatMenu(e) {
    savedText = saveSelection();
    setTimeout(function() {
        var isEmpty = savedText.toString().length === 0;
        if (!isEmpty) {
            $("#highlight-button").css({position: 'absolute', top: e.pageY, left: e.pageX});
            //$("#float_note").css({top: e.pageY + 40});
            $("#highlight-button").show();
        } else {
            $("#highlight-button").hide();
            $("#float_note").hide();
        }
    }, 10);
}

function unhighlight() {
    $("body p").unhighlight();
}

function highlighter() {
    if (!savedText)
        return;
    var texto = savedText + '';
    $("#my_notes").val('');
    $("#selected_text").empty();
    $("#selected_text").append(texto);
    $("body p").highlight(texto);
    restoreSelection(savedText);
    return false;
}

function addNote(e) {
    if (!savedText)
        return;
    var texto = savedText + '';
    $("#my_notes").val('');
    $("#selected_text").empty();
    $("#selected_text").append(texto);
    $("#sel_text").val(texto);
    $("#highlight-button").hide();
    $("#highlight-button").css({position: 'fixed', top: -9999});
    restoreSelection(savedText);
    $("#float_note").show();
    return false;
}

function closeNote() {
    $("#highlight-button").hide();
    $("#float_note").hide();
}

function getNote() {
    var d = {};
    d.op = 'getnote';
    UTIL.callAjaxRqst(d, getNoteHandler);
}

function getNoteHandler(data) {
    UTIL.cursorNormal();
    if (data.output.valid) {
        var res = data.output.response;
        var notes = '';
        for (var i in res){
            notes += '<div id=rn'+i+'>';
            notes += '<hr>';
            notes += '<div class="notes_container notes_expandable" onmousemove="changeHeight(this, 400)" onmouseout="changeHeight(this, 100)">';
            notes += '<p><q class="notes_fromtext">'+res[i].sel_text+'</q></p>';
            notes += '<p class="notes_title_nota">NOTA:</p>';
            notes += '<p class="notes_title_nota_txt" id="note_text'+i+'">'+res[i].notes+'</p>';
            notes += '<p><textarea id="note_text_edit'+i+'" rows="5" style="width: 96%; display: none">'+res[i].notes+'</textarea></p>';
            notes += '<div align="right" class="note_option">';
            notes += '<span id="btn_note_edit'+i+'" onclick="editNoteShow('+i+', 1)">Editar</span>';
            notes += '<span id="btn_note_save'+i+'" onclick="saveNote2('+res[i].id+', '+i+')" style="display: none">Guardar</span>';
            notes += '<span id="btn_note_cancel'+i+'" onclick="editNoteShow('+i+', 0)" style="display: none">Cancelar</span>';
            notes += '<span id="btn_note_delete'+i+'" onclick="deleteNote('+res[i].id+','+i+')">Eliminar</span>';
            notes += '</div>';
            notes += '</div>';
            notes += '</div>';
        }
        $("#note_loader").empty();
        $("#note_loader").append(notes);
    } else {
        alert('Error: ' + data.output.response.content);
    }
}

function saveNote() {
    var d = {};
    d.op = 'savenote';
    d.sel_text = $('#sel_text').val();
    d.notes = $('#my_notes').val();
    UTIL.callAjaxRqst(d, saveNoteHandler);
}

function saveNoteHandler(data) {
    UTIL.cursorNormal();
    $("#highlight-button").hide();
    $("#float_note").hide();
    if (data.output.valid) {
        alert('Información guardada correctamente');
    } else {
        alert('Error: ' + data.output.response.content);
    }
}

function saveNote2(id, idnote) {
    var d = {};
    actualNoteId = idnote;
    d.op = 'savenote';
    d.id = id;
    d.notes = $('#note_text_edit'+idnote).val();
    UTIL.callAjaxRqst(d, saveNote2Handler);
}

function saveNote2Handler(data) {
    UTIL.cursorNormal();
    if (data.output.valid) {
        $("#note_text"+actualNoteId).empty();
        $("#note_text"+actualNoteId).append($('#note_text_edit'+actualNoteId).val());
        editNoteShow(actualNoteId, 0);
    } else {
        alert('Error: ' + data.output.response.content);
    }
}

function editNoteShow(id, s){
    if(s == 1){
        $("#note_text"+id).hide();
        $("#btn_note_edit"+id).hide();
        $("#btn_note_cancel"+id).show();
        $("#note_text_edit"+id).show();
        $("#btn_note_save"+id).show();
        //window.location='#note_text_edit'+id;
    } else {
        $("#note_text"+id).show();
        $("#btn_note_edit"+id).show();
        $("#btn_note_cancel"+id).hide();
        $("#note_text_edit"+id).hide();
        $("#btn_note_save"+id).hide();
        $("#note_text_edit"+id).val($("#note_text"+id).html());
    }
    
}

function deleteNote(id, idnote){
    var d = {};
    d.op = 'deletenote';
    d.id = id;
    $("#rn"+idnote).remove();
    UTIL.callAjaxRqst(d, deleteNoteHandler);
}

function deleteNoteHandler(data) {
    UTIL.cursorNormal();
    if (data.output.valid) {
        //window.location = 'index.html';
    } else {
        alert('Error: ' + data.output.response.content);
    }
}


function toggleHeight(e, minHeight, maxHeight) {
//    var a = parseInt($(e).css("height"));
////    console.log('asdasd  ' + a);
//    if (a != minHeight) {
//        //$(id + '').css({height: maxHeight});
//        $(e).css({height: minHeight + 'px'});
//    } else {
//        $(e).css({height: maxHeight + 'px'});
//    }
}

function changeHeight(e, changeHeight) {
//    var a = parseInt($(e).css("height"));
////    console.log('asdasd  ' + b);
//    if (a != changeHeight) {
//        $(e).css({height: changeHeight + 'px'});
//    }
}

function preregistro(){
    var d = {};
    var e =$("#email").val();
    var u =$("#universidad").val();
    var c =$("#carrera").val();
    var s =$("#semestre").val();
    if ( e=='' || u=='' || c=='' || s==''){
        alert('Todos los campos son obligatorios'); return;
    }
    if(!UTIL.isEmail(e)){
        alert('El email ingresado no es correcto'); return;
    }
    d = $("#form_register").serialize();
    UTIL.callAjaxRqst(d, registerHandler);
}

function register(){
    var d = {};
    var e =$("#email").val();
    var p =$("#pass").val();
    var p2 =$("#pass2").val();
    if ( p=='' || p2=='' || e==''){
        alert('Todos los campos son obligatorios'); return;
    }
    if ( p != p2){
        alert('Las contraseñas no coinciden.'); 
        $("#pass2").val('');
        return;
    }
    if(!UTIL.isEmail(e)){
        alert('El email ingresado no es correcto'); return;
    }
    d = $("#form_register").serialize();
    UTIL.callAjaxRqst(d, registerHandler);
}

function registerHandler(data) {
    UTIL.cursorNormal();
    if (data.output.valid) {
        $("#form_register").hide();
        $("#message_register").show();
    } else {
        alert('Error: ' + data.output.response.content);
    }
}

function login(){
    if ($("#usu").val() == 'demo' && $("#cot").val() == 'demo' ){
        window.location = 'main.html';
    } else {
        $("#errormsg").show();
        setTimeout(function(){
            $("#errormsg").hide();
        }, 3000);
    }
}

$(document).ready(function() {
    $(".fancybox").fancybox();
    getNote();
});
//            $(document).mouseup(floatMenu);
//            $('.lecture').mouseup(floatMenu);
$('.lecture').mouseup(floatMenu);
$('#add_note').mousedown(addNote);
$('#highlighter').click(highlighter);
$('#unhighlight').click(unhighlight);

