function showHideLabel(id, show) {
    if (show) {
        $('#' + id).show();
    } else {
        $('#' + id).hide();
    }
}

function printLecture() {
var prtContent = document.getElementById('lecture');
var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
WinPrint.document.write(prtContent.innerHTML);
WinPrint.document.close();
WinPrint.focus();
WinPrint.print();
WinPrint.close();    
}

function fontSizeChange(e,c) {
    var f = parseInt($(e).css("font-size"));
    if (c === '+'){
        f = f + 1;
    } else if (c === '-'){
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
$(document).ready(function() {
    $(".fancybox").fancybox();
});
//            $(document).mouseup(floatMenu);
//            $('.lecture').mouseup(floatMenu);
$('.lecture').mouseup(floatMenu);
$('#add_note').mousedown(addNote);
$('#highlighter').click(highlighter);
$('#unhighlight').click(unhighlight);

var savedText = null; // Variable to save the text

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
