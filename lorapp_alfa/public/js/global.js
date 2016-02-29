var global = {
    /**
     * Root de la aplicacion
     * @type String
     */
    url : '',
    lecture_id : '',
    lecturesection_id : '',
    session : '',
    userEnable : function(){
        return (global.ul == '') ? false : true;
    }
};