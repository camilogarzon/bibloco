/** Modulo que contiene varias funciones utiles para usar en la aplicacion
 * @author Camilo Garzon
 * @since 2015-06-10
 */
var Util = {};

/**
 * Funcion que define variables y funciones
 */
(function() {

    /**
     * Hace request por AJAX
     * @param {JSON} ladata, paramétros del request
     * @param {function} successCallBackFn, función que captura la respuesta onSuccess
     */
    Util.callAjax = function(data, url, method, successCallBackFn, errorCallBackFn) {
        Util.cursorBusy();
        successCallBackFn = (successCallBackFn) ? successCallBackFn : Util.successDefaultAjaxRequest;
        errorCallBackFn = (errorCallBackFn) ? errorCallBackFn : Util.errorDefaultAjaxRequest;
        $.ajax({
            data: data,
            type: method,
            dataType: "json",
            url: url,
            success: function(data, textStatus, jqXHR) {
                Util.cursorNormal();
                successCallBackFn(data, textStatus, jqXHR);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                Util.cursorNormal();
                errorCallBackFn(jqXHR, textStatus, errorThrown);
            }
        });
    };

    /*
     * Metodo por defecto para capturar peticiones ajax exitosas
     */
    Util.successDefaultAjaxRequest = function(data, textStatus, jqXHR) {
        console.log(data);
        console.log(textStatus);
        console.log(jqXHR);
    };

    /*
     * Metodo por defecto para capturar peticiones ajax con errores
     */
    Util.errorDefaultAjaxRequest = function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
        alert('ocurrio un error: ' + textStatus + '. \n\n' + errorThrown);
    };

    /**
     * Limppia un formulario
     * @param {String} id, id del formulario
     */
    Util.clearForm = function(id) {
        $("#" + id + " :input").each(function() {
            if ('button' != $(this).attr('type')) {
                $(this).val('');
            }
        });
        $('select').val('seleccione');
    };

    Util.clearForm2 = function(id) {
        $("#" + id + " :input").each(function() {
            if ('button' != $(this).attr('type')) {
                $(this).val('');
            }
        });
    };

    /**
     * Pone el cursor ocupado
     */
    Util.cursorBusy = function() {
        $('body').css('cursor', 'wait');
    };

    /**
     * Pone el cursor normal
     */
    Util.cursorNormal = function() {
        $('body').css('cursor', '');
    };

    /**
     * Verifica que un correo esta bien escrito
     * @param {String} email
     * @returns {bool},
     */
    Util.isEmail = function(email) {
        var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    };

    Util.parcejson = function() {
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
    };

    /**
     * Oculta o muestra un elemento
     * @param String id
     * @param Bool show
     */
    Util.byIdShowHide = function(id, show) {
        if (show) {
            $('#' + id).show();
        } else {
            $('#' + id).hide();
        }
    };
    Util.confirmDelete = function(e) {
        return window.confirm('\n\nVa a eliminar información de forma permanente. \n\n\n\n¿Desea continuar?\n\n');
    };

    Util.alertBootstrap = function(message, type) {
        $('#alert_general').removeClass();
        $('#alert_general').addClass('alert alert-dismissible');
        switch (type) {
            case 'info':
                $('#alert_general').addClass('alert-info');
                break;
            case 'success':
                $('#alert_general').addClass('alert-success');
                break;
            case 'error':
                $('#alert_general').addClass('alert-danger');
                break;
        }
        $('#alert_content').html(message);
        $('#alert_container').fadeIn(500);
        setTimeout(function() {
            $('#alert_container').fadeOut(500);
        }, 5000);
    };

    /**
     * Metodo que inicializa el modulo
     */
    Util.initialize = function() {
    };

})();

/**
 * Funcion de inicializacion en el momento en que se completa el DOM llamada
 * desde jquery Esta funcion realiza los procesos de inicializacion de la
 * aplicacion
 */
$(function() {
    Util.initialize();
});
