<?php

/**
 * Clase que contiene todas las operaciones utilizadas sobre la base de datos
 * @author Camilo Garzon Calle
 */
class Note {

    public function __construct() {
        
    }

    /**
     * Metodo para recuperar todos los registros
     * @return array de faq
     */
    public static function getAll($rqst) {
        $id = isset($rqst['id']) ? intval($rqst['id']) : 0;
        $db = new DbConection();
        $pdo = $db->openConect();
        $q = "SELECT * FROM " . $db->getTable('misnotas');
        if ($id > 0) {
            $q = "SELECT * FROM " . $db->getTable('misnotas') . " WHERE id = " . $id;
        }
        $result = $pdo->query($q);
        $arr = array();
        if ($result) {
            foreach ($result as $val) {
                $arr[] = $val;
            }
            $arrjson = array('output' => array('valid' => true, 'response' => $arr));
        } else {
            $arrjson = Util::error_no_result();
        }
        $db->closeConect();
        return $arrjson;
    }

    /**
     * Metodo para guardar o actualizar un registro
     * @param REQUEST $rqst
     * @return array de faq
     */
    public static function save($rqst) {
        $id = isset($rqst['id']) ? intval($rqst['id']) : 0;
        $sel_text = isset($rqst['sel_text']) ? ($rqst['sel_text']) : '';
        $notes = isset($rqst['notes']) ? ($rqst['notes']) : '';
        $agent = $_SERVER["HTTP_USER_AGENT"];
        $ip = Util::get_real_ipaddress();
        $db = new DbConection();
        $pdo = $db->openConect();
        if ($id > 0) {
            //actualiza la informacion
            $q = "SELECT id FROM " . $db->getTable('misnotas') . " WHERE id = " . $id;
            $result = $pdo->query($q);
            if ($result) {
                foreach ($result as $val) {
                    $table = $db->getTable('misnotas');
                    $arrfieldscomma = array(
                        'sel_text' => $sel_text,
                        'notes' => $notes);
                    $arrfieldsnocomma = array('dtcreate' => Util::date_now_server());
                    $q = Util::make_query_update($table, "id = '$id'", $arrfieldscomma, $arrfieldsnocomma);
                    $pdo->query($q);
                    $arrjson = array('output' => array('valid' => true, 'id' => $id, '' => $val, 'q' => $q));
                }
            } else {
                $arrjson = Util::error_general();
            }
        } else {
            if ($sel_text != "") {
                $q = "INSERT INTO " . $db->getTable('misnotas') . " (dtcreate, sel_text, notes, agent, ip) VALUES ( " . Util::date_now_server() . ", '$sel_text', '$notes', '$agent', '$ip')";
                $result = $pdo->query($q);
                if ($result) {
                    $arrjson = array('output' => array('valid' => true, 'response' => $pdo->lastInsertId()));
                } else {
                    $arrjson = Util::error_general(implode('-', $pdo->errorInfo()));
                }
            } else {
                $arrjson = Util::error_missing_data();
            }
        }
        $db->closeConect();
        return $arrjson;
    }

    public static function register($rqst) {
        $email = isset($rqst['email']) ? ($rqst['email']) : '';
        $pass = isset($rqst['pass']) ? ($rqst['pass']) : '';
        $agent = $_SERVER["HTTP_USER_AGENT"];
        $ip = Util::get_real_ipaddress();
        $db = new DbConection();
        $pdo = $db->openConect();
        if ($email != "") {
            $q = "INSERT INTO " . $db->getTable('registro') . " (dtcreate, email, pass, agent, ip) VALUES ( " . Util::date_now_server() . ", '$email', '$pass', '$agent', '$ip')";
            $result = $pdo->query($q);
            if ($result) {
                $arrjson = array('output' => array('valid' => true, 'response' => $pdo->lastInsertId()));
            } else {
                $arrjson = Util::error_general(implode('-', $pdo->errorInfo()));
            }
        } else {
            $arrjson = Util::error_missing_data();
        }
        $db->closeConect();
        return $arrjson;
    }

    public static function preregistro($rqst) {
        $email = isset($rqst['email']) ? ($rqst['email']) : '';
        $universidad = isset($rqst['universidad']) ? ($rqst['universidad']) : '';
        $carrera = isset($rqst['carrera']) ? ($rqst['carrera']) : '';
        $semestre = isset($rqst['semestre']) ? ($rqst['semestre']) : '';
        $agent = $_SERVER["HTTP_USER_AGENT"];
        $ip = Util::get_real_ipaddress();
        $db = new DbConection();
        $pdo = $db->openConect();
        if ($email != "") {
            $q = "INSERT INTO " . $db->getTable('preregistro') . " (dtcreate, email, universidad, carrera, semestre, agent, ip) VALUES ( " . Util::date_now_server() . ", '$email', '$universidad', '$carrera', '$semestre', '$agent', '$ip')";
            $result = $pdo->query($q);
            if ($result) {
                $arrjson = array('output' => array('valid' => true, 'response' => $pdo->lastInsertId()));
            } else {
                $arrjson = Util::error_general(implode('-', $pdo->errorInfo()));
            }
        } else {
            $arrjson = Util::error_missing_data();
        }
        $db->closeConect();
        return $arrjson;
    }

    /**
     * Metodo para eliminar un registro por Id
     * @param REQUEST $rqst
     * @return array de faq
     */
    public static function delete($rqst) {
        $id = isset($rqst['id']) ? intval($rqst['id']) : 0;
        $db = new DbConection();
        $pdo = $db->openConect();
        $q = "DELETE FROM " . $db->getTable('misnotas') . " WHERE id = " . $id;
        //echo $q;die();
        $result = $pdo->query($q);
        $arr = array();
        if ($result) {
            $arrjson = array('output' => array('valid' => true, 'response' => $arr));
        } else {
            $arrjson = Util::error_general($pdo->errorInfo());
        }
        $db->closeConect();
        return $arrjson;
    }

}

?>
