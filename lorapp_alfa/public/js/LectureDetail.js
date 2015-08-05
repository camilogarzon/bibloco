/** Nombre para el empaquetamiento de todo lo concerniente a esta vista */
var LectureDetail = {};
/**
 * Funcion autoejecutable encargada de definir todas las variables y funciones que contiene el paquete
 */
(function() {
    //atributos para este modulo
    LectureDetail.lecture_id_val = '';
    LectureDetail.used_for_val = '';
    /**
     * Metodo para cargar la vista previa de una lectura
     */
    LectureDetail.loadPreview = function(id) {
        $('#load_lecturesection_preview').empty();
        console.log($('#preview' + id).val());
        $('#load_lecturesection_preview').html($('#preview' + id).val());
    };
    /**
     * Metodo que inicializa el modulo matriculando los diferentes eventos
     */
    LectureDetail.initialize = function() {
    };
})();
/**
 * Funcion de inicializacion en el momento en que se completa el DOM llamada
 * desde jquery Esta funcion realiza los procesos de inicializacion de la
 * aplicacion
 */
$(function() {
    LectureDetail.initialize();
});
