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
                $q = "INSERT INTO " . $db->getTable('misnotas') . " (dtcreate, sel_text, notes) VALUES ( " . Util::date_now_server() . ", '$sel_text', '$notes')";
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

/**
 * 
CREATE TABLE IF NOT EXISTS `misnotas` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `sel_text` text,
  `notes` text,
  `dtcreate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
 * 
 */

?>
