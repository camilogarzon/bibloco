var UTIL = {
    /**
     * Carga datepicker de jQueryUI
     * @param {String} id, id del campo
     */
    applyDatepicker: function(id) {
        $("#" + id).datepicker($.datepicker.regional[ "es" ]);
        $("#" + id).datepicker({changeMonth: true, changeYear: true});
        $("#" + id).datepicker("option", "dateFormat", "yy-mm-dd");
    },
    /**
     * Hace request por AJAX
     * @param {JSON} ladata, paramétros del request
     * @param {function} successCallBackFn, función que captura la respuesta onSuccess
     */
    callAjaxRqst: function(data, successCallBackFn) {
        this.cursorBusy();
        $.ajax({
            data: data,
            type: "GET",
            dataType: "json",
            url: "api.php",
            success: successCallBackFn
        });
    },
    /**
     * Hace request por AJAX
     * @param {JSON} ladata, paramétros del request
     * @param {function} successCallBackFn, función que captura la respuesta onSuccess
     */
    callAjaxRqstPOST: function(data, successCallBackFn) {
        this.cursorBusy();
        $.ajax({
            data: data,
            type: "POST",
            dataType: "json",
            url: "ajax/rqst.php",
            success: successCallBackFn
        });
    },
    /**
     * Limppia un formulario
     * @param {String} id, id del formulario
     */
    clearForm: function(id) {
        $("#" + id + " :input").each(function() {
            if ('button' != $(this).attr('type')) {
                $(this).val('');
            }
        });
        $('select').val('seleccione');
    },
    clearForm2: function(id) {
        $("#" + id + " :input").each(function() {
            if ('button' != $(this).attr('type')) {
                $(this).val('');
            }
        });
    },
    /**
     * Pone el cursor ocupado
     */
    cursorBusy: function() {
        $('body').css('cursor', 'wait');
    },
    /**
     * Pone el cursor normal
     */
    cursorNormal: function() {
        $('body').css('cursor', '');
    },
    /**
     * Verifica que un correo esta bien escrito
     * @param {String} email
     * @returns {bool}, 
     */
    isEmail: function(email) {
        var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    },
    parcejson: function() {
        var str = '{\"registro_fecha\":\"2013-02-10\",\"registro_sistema\":\"nombre sistema\",\"registro_actividad\":\"4\",\"undefined\":\"CARGAR\",\"registro_campo01\":\"2 horas\",\"registro_campo02\":\"0\",\"registro_campo03\":\"2013-02-12\",\"registro_campo04\":\"1\",\"registro_campo05\":\"0\",\"registro_campo06\":\"cerrado autom","nota":"las notas van aqu","fecha":"2013-02-10","tsfecha":"2013-02-10 08:23:13"}';
        var obj = JSON.parse(str);
        alert('registro_fecha1 = ' + obj.registro_fecha);
        alert('registro_fecha2 = ' + obj["registro_fecha"]);
        $("#registro :input").each(function() {
            var idprop = $(this).attr('id');
            if (obj.hasOwnProperty(idprop)) {
                $(this).val(obj[idprop]);
            }
        });
    },
    /**
     * Llena un formulario con un objeto JSON
     * @param {String} id
     * @param {JSON} jo
     */
    populateForm: function(id, jo) {
        $("#" + id + " :input").each(function() {
            var p = $(this).attr('id');
            if (jo.hasOwnProperty(p)) {
                $(this).val(jo[p]);
            }
        });
    },
    /**
     * Carga un estilo a un campo
     * @param {type} id
     */
    setrequirefield: function(id) {
        $("#" + id).addClass("requirefield");
    },
    /**
     * convierte los campos de un formulario en StringJSON
     * @param {type} id, id del formulario
     * @returns {String}, JSON en forma de String
     */
    stringifyFormJson: function(id) {
        var jo = {};
        $("#" + id + " :input").each(function() {
            jo[$(this).attr('id')] = $(this).val();
        });
        return JSON.stringify(jo);
    }
}

// funciones para usar con jQueryUI

function updateTips(t) {
    tips.text(t).addClass("ui-state-highlight");
    setTimeout(function() {
        tips.removeClass("ui-state-highlight", 1500);
    }, 500);
}

function checkLength(o, n, min, max) {
    if (o.val().length > max || o.val().length < min) {
        o.addClass("ui-state-error");
        updateTips("Length of " + n + " must be between " +
                min + " and " + max + ".");
        return false;
    } else {
        return true;
    }
}

function checkRegexp(o, regexp, n) {
    if (!(regexp.test(o.val()))) {
        o.addClass("ui-state-error");
        updateTips(n);
        return false;
    } else {
        return true;
    }
}
