/**
 * Modulo Landing
 * @namespace Landing
 * @author Camilo Garzon
 * @description Modulo para operaciones sobre la landingpage
 * @requires jquery
 * @requires util
 */
var landing = {
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
            url: "registration",
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
            url: "registrationupdate",
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
        d = $('#' + id).serialize();
        util.cursorBusy();
        $.ajax({
            data: d,
            type: "POST",
            dataType: "json",
            url: "login",
            success: function(data) {
                util.cursorNormal();
                console.log(data);
                if (data.valid) {
                    window.location = data.redirect;
                } else {
                    $('#errormsg').empty();
                    $('#errormsg').append(data.error);
                    $('#errormsg').show();
                    //alert('Error: ' + data.error);
                }

            }
        });


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