/**
 * Modulo Operation
 * @namespace Operation
 * @author Camilo Garzon
 * @description Modulo para operaciones sobre las transacciones de las lecturas
 * @requires jquery
 * @requires util
 */
var operation = {
    /**
     * Metodo para adquirir una lectura
     * @param String id del formulario que contiene la informacion de la adquisicion
     */
    addLectureSection: function(id) {
        var d = $("#" + id).serialize();
        util.cursorBusy();
        $.ajax({
            data: d,
            type: "POST",
            dataType: "json",
            url: global.url + "/useraddlecturesection",
            success: function(data) {
                util.cursorNormal();
                if (data.valid) {
                    $("#user_credit_actual").empty();
                    $("#user_credit_actual").append(data.credit);
                    
                    alert('Agregado correctamente!');
                } else {
                    alert('Error: ' + data.error);
                }
            }
        });
    }

}