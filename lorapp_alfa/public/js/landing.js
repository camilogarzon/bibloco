/**
 * Modulo Landing
 * @namespace Landing
 * @author Camilo Garzon
 * @description Modulo para operaciones sobre la landingpage
 * @requires jquery
 * @requires util
 */
var landing = {
    emailCorrect: function(id_input) {
        if (util.isEmail($("#" + id_input).val())) {
            $("#" + id_input).addClass('alert-success').removeClass('alert-danger');
            $('#btn_reminder').removeAttr('disabled');
        } else {
            $("#" + id_input).addClass('alert-danger').removeClass('alert-success');
            $('#btn_reminder').attr('disabled', 'true');
        }
    },
    emailExist: function(id_input) {
        if ($("#" + id_input).val() === '')
            return false;
        d = {};
        d.email = $("#" + id_input).val();
        $.ajax({
            data: d,
            type: "POST",
            dataType: "json",
            url: global.url + "emailexist",
            success: function(data) {
                $('#btn_registro_1').removeAttr('disabled');
                if (data.valid) {
                    $("#" + id_input).addClass('alert-success').removeClass('alert-danger');
                    $("#message_alert").hide();
                    $("#message_reg").empty();
                } else {
                    $("#" + id_input).addClass('alert-danger').removeClass('alert-success');
                    $("#message_alert").show();
                    $("#message_reg").empty();
                    $("#message_reg").append(data.message);
                    $('#btn_registro_1').attr('disabled', 'true');
                }

            }
        });
    },
    emailRemember: function(id_input) {
        if ($("#" + id_input).val() === '')
            return false;
        d = {};
        d.email = $("#" + id_input).val();
        util.cursorBusy();
        $.ajax({
            data: d,
            type: "POST",
            dataType: "json",
            url: global.url + "emailexist",
            success: function(data) {
                util.cursorNormal();
                $('#btn_registro_1').removeAttr('disabled');
                if (data.valid) {
                    $("#" + id_input).addClass('alert-success').removeClass('alert-danger');
                    $("#message_alert").hide();
                    $("#message_reg").empty();
                } else {
                    $("#" + id_input).addClass('alert-danger').removeClass('alert-success');
                    $("#message_alert").show();
                    $("#message_reg").empty();
                    $("#message_reg").append(data.message);
                    $('#btn_registro_1').attr('disabled', 'true');
                }

            }
        });
    },
    /**
     * Fucion para autocompletar campos de un formulario
     * @param String id tetinput que recibe el dato
     * @param String url donde se hace el request AJAX
     */
    loadAutocomplete: function(id, url) {
        var cache = {};
        $("#" + id).autocomplete({
            minLength: 2,
            source: function(request, response) {
                var term = request.term;
                if (term in cache) {
                    response(cache[ term ]);
                    return;
                }
                $.getJSON(url, request, function(data, status, xhr) {
                    cache[ term ] = data;
                    response(data);
                });
            }
        });
    },
    /**
     * Verificacion de registro de usuarios / crear cuenta por ajax
     * @param String id formulario
     */
    registrationValidate: function(id_btn, step) {
        var edu = $('input[name=education]:checked', '#form_register').val();
        var d = {};
        var f = $("#firstname").val();
        var e = $("#email_register").val();
        var p = $("#password_register").val();
        var co = $("#school_name").val();
        var ed = $("#school_age").val();
        var u = $("#univ0").val();
        var c = $("#career0").val();
        var s = $("#semester").val();
        $('#' + id_btn).removeAttr('data-dismiss');
        $('#' + id_btn).removeAttr('data-target');
        if (step === 1) {
            if (f == '' || e == '' || p == '') {
                alert('Todos los campos son obligatorios');
                return;
            }
            if (!util.isEmail(e)) {
                alert('El email ingresado no es correcto');
                return;
            }
            landing.loadAutocomplete();
            $('#' + id_btn).attr('data-dismiss', 'modal');
            $('#' + id_btn).attr('data-target', '#modal-registration-2');
        } else if (step === 2) {
            if (edu === undefined || edu === '') {
                alert('Primero selecciona donde estudias.');
                return;
            }
            $('#' + id_btn).attr('data-dismiss', 'modal');
            $('#' + id_btn).attr('data-target', '#modal-registration-3');
        } else if (step === 3) {
            if (edu === 'school') {
                $("#univ0").val('');
                $("#career0").val('');
                $("#semester").val('');
                if (co == '' || ed == '') {
                    alert('Todos los campos son obligatorios');
                    return;
                }
            } else if (edu === 'university') {
                $("#school_name").val('');
                $("#school_age").val('');
                if (u === '0' || c === '0' || s === '0') {
                    alert('Todos los campos son obligatorios');
                    return;
                }
            }
            d = $("#form_register").serialize();
            util.cursorBusy();
            $.ajax({
                data: d,
                type: "POST",
                dataType: "json",
                url: global.url + "registration",
                success: function(data) {
                    util.cursorNormal();
                    console.log(data);
                    if (data.valid) {
                        window.location = data.redirect;
                    } else {
                        alert('Error: ' + data.error);
                    }

                }
            });
        }
    },
    /**
     * Resgistro de usuarios / crear cuenta por ajax
     * @param String id formulario
     */
    registrationCreate: function(id) {
        d = $('#' + id).serialize();
        util.cursorBusy();
        $.ajax({
            data: d,
            type: "POST",
            dataType: "json",
            url: global.url + "registration",
            success: function(data) {
                util.cursorNormal();
                console.log(data);
                if (data.valid) {
                    window.location = data.redirect;
                } else {
                    alert('Error: ' + data.error);
                }

            }
        });
    },
    registrationUpdate: function(id) {
        d = $('#' + id).serialize();
        util.cursorBusy();
        $.ajax({
            data: d,
            type: "POST",
            dataType: "json",
            url: global.url + "registrationupdate",
            success: function(data) {
                util.cursorNormal();
                console.log(data);
                if (data.valid) {
                    window.location = data.redirect;
                } else {
                    alert('Error: ' + data.error);
                }

            }
        });
    },
    login: function(id) {
        $('#error_login').hide();
        if ($('#email').val() === '' || $('#password').val() === '') {
            $('#message_login').empty();
            $('#message_login').append('Datos incorrectos');
            $('#error_login').show();
            return false;
        }
        d = $('#' + id).serialize();
        util.cursorBusy();
        $.ajax({
            data: d,
            type: "POST",
            dataType: "json",
            url: global.url + "login",
            success: function(data) {
                util.cursorNormal();
                console.log(data);
                if (data.valid) {
                    window.location = data.redirect;
                } else {
                    $('#message_login').empty();
                    $('#message_login').append(data.error);
                    $('#error_login').show();
                    return false;
                }
            }
        });
        return false;
    },
    educationSelected: function(id) {
        var education = $('input[name=education]:checked', '#' + id).val();
        var time = 500;
        $('.university-fields').hide(time);
        $('.school-fields').hide(time);
        if (education === 'school') {
            $('.school-fields').show(time);
        } else if (education === 'university') {
            $('.university-fields').show(time);
        } else if (education === 'egresado') {
            $('#semester').val('Egresado');
            $('.university-fields').show(time);
        }
    },
    fancyBoxFormBinding: function(trigger_id, form_id) {
        $("#" + trigger_id).click(function() {
            $.fancybox({
                href: "#" + form_id,
                afterClose: function() { // it was onClosed for v1.3.4
                    //$("#university_error").hide();
                    //location.reload();
                    //return;
                }
            }); // fancybox
        }); //click



    }

}