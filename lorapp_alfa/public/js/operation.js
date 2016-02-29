/**
 * Modulo Operation
 * @namespace Operation
 * @author Camilo Garzon
 * @description Modulo para operaciones sobre las transacciones de las lecturas
 * @requires jquery
 * @requires util
 * @requires myLecture
 */
var operation = {
    lecturesection_type_id: '',
    lecturesection_id: '',
    lecturesection_leaf: '',
    /**
     * Metodo para adquirir una lectura
     * @param String id del formulario que contiene la informacion de la adquisicion
     */
    addLectureSection: function(id, id2) {
        var d = $("#" + id).serialize();
        operation.lecturesection_id = id2;
        Util.callAjax(d, global.url + "/useraddlecturesection", "POST", operation.addLectureSectionSuccess, operation.addLectureSectionError);
    },
    addLectureSectionRedirect: function(url) {
        window.location.href = url;
    },
    addLectureSectionSuccess: function(data) {
        Util.cursorNormal();
        if (data.valid) {
            $(".user_credit_actual").html(data.credit);
            //$("#lecture_adquisition" + operation.lecturesection_id).html('<a href="' + global.url + 'mylecture/' + operation.lecturesection_id + '" class="btn btn-info btn-purchase btn-horizontal">LEER</a>');
            window.location.href = global.url + 'mylecture/' + operation.lecturesection_id;
        } else {
            console.log('Error: ' + data.error);
        }
    },
    addLectureSectionError: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
    },
    addLectureSectionValues: function(lecturesection_type_id, lecturesection_id, lecturesection_leaf) {
        console.log('addLectureSectionValues');
        operation.lecturesection_id = lecturesection_id;
        operation.lecturesection_leaf = lecturesection_leaf;
        operation.lecturesection_type_id = lecturesection_type_id;
        $('.lecturesection_leaf_span').html(operation.lecturesection_leaf);

    },
    addLectureSectionConfirmation: function() {
        operation.addLectureSectionConfirmationClose();
        console.log(operation.lecturesection_type_id);
        console.log(operation.lecturesection_id);
        operation.addLectureSection(operation.lecturesection_type_id, operation.lecturesection_id);
    },
    addLectureSectionConfirmationClose: function() {
        $('#modal-confirm-lecture-adquisition').modal('hide');
        $('#modal-renew-reading').modal('hide');
    },
    /**
     * Metodo para almacenar un Objeto en localStorage
     * @param String key
     * @param Object value
     */
    setLSO: function(key, value) {
        window.localStorage.setItem(key, JSON.stringify(value));
    },
    /**
     * Metodo para recuperar un Objeto de localStorage
     * @param String key
     * @returns Object
     */
    getLSO: function(key) {
        var r = null;
        try {
            r = JSON.parse(window.localStorage.getItem(key));
        } catch (e) {
            window.localStorage.removeItem(key);
        }
        return r;
    },
    /**
     * Metodo para almacenar un string en localStorage
     * @param String key
     * @param String value
     */
    setLS: function(key, value) {
        window.localStorage.setItem(key, value);
    },
    /**
     * Metodo para recuperar un string de localStorage
     * @param String key
     * @returns Object
     */
    getLS: function(key) {
        return window.localStorage.getItem(key);
    },
    /**
     * Limpia localStorage
     */
    cleanLS: function() {
        window.localStorage.clear();
    },
    /**
     * Metodo para consrvar los valores de local storage
     * @param StorageEvent e
     */
    storageValue: function(e) {
        window.localStorage.setItem(e.key, e.oldValue);
    },
    /**
     * Verifica se localStorage est habilitado
     * @returns Boolean
     */
    checkLS: function() {
//        window.removeEventListener('storage', operation.storageValue);
//        if (window.addEventListener) {
//            window.removeEventListener('storage', operation.storageValue);
//        } else {
//            window.detachEvent('onstorage', operation.storageValue);
//        }
        try {
            window.localStorage.setItem('test', 'success');
            window.localStorage.removeItem('test');
            if (window.addEventListener) {
                window.addEventListener('storage', operation.storageValue, false);
            } else {
                window.attachEvent('onstorage', operation.storageValue);
            }
            return true;
        } catch (e) {
            //alert('El navegador no es compatible con esta aplicación. \nPor favor habilite LocalStorage.\n\n' + e);
            return false;
        }
    },
    j: "",
    k: "",
    s: "",
    lsid: "",
    lsoLeaf: "lf",
    /**
     * @returns Number UTC timestamp in seconds
     */
    getnow: function() {
        return Math.floor(Date.now() / 1000);
    },
    /*
     * Metodo para enviar al servidor la cantidad de tiempo que el usuario a estado en la lectura
     */
    track: function() {
        var leaf = operation.getLSO(operation.lsoLeaf);
        $.ajax({
            data: leaf[operation.k],
            type: "POST",
            dataType: "json",
            url: global.url + "leaf",
            success: function(data) {
                var leaf = operation.getLSO(operation.lsoLeaf);
                leaf[operation.k].t = leaf[operation.k].u;
                leaf[operation.k].u = operation.getnow();
                operation.setLSO(operation.lsoLeaf, leaf);
            },
            error: function(e, a, b) {
                var leaf = operation.getLSO(operation.lsoLeaf);
                leaf[operation.k].u = operation.getnow();
                operation.setLSO(operation.lsoLeaf, leaf);
                console.log(e);
                console.log(a);
                console.log(b);
            }
        });
    },
    /**
     * Metodo para iniciar el proceso de seguimiento de tiempo de la lectura
     * @param String lsid id de la lectura
     * @param String k key dentro del objeto de localstorage
     * @param String j llave de lectura
     */
    trackLecture: function(j, k, lsid, s) {
        this.j = j;
        this.k = k;
        this.lsid = lsid;
        this.s = s;
        //se verifica si ya se inicio proceso
        var leaf = operation.getLS(operation.lsoLeaf);
        if (leaf === undefined || leaf === null || leaf === "null" || leaf === "") {
            //como no existe se crea el primer objeto
            leaf = {};
        } else {
            leaf = operation.getLSO(operation.lsoLeaf);
            operation.track();
        }
        leaf[this.k] = {k: this.k, j: this.j, i: this.lsid, t: operation.getnow(), u: operation.getnow()};
        operation.setLSO(operation.lsoLeaf, leaf);
        setInterval(operation.track, (60000));
    }

}
