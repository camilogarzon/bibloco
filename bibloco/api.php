<?php

session_start();
/**
 * en este archivo se atienden todas las peticiones AJAX
 */
$rqst = $_REQUEST;
$op = isset($rqst['op']) ? $rqst['op'] : '';
header("Content-type: application/javascript; charset=utf-8");
header("Cache-Control: max-age=15, must-revalidate");
header('Access-Control-Allow-Origin: *');

include 'classes/DbConection.php';
include 'classes/Util.php';

switch ($op) {
    case 'getnote':
        include 'classes/Note.php';
        echo json_encode(Note::getAll($rqst));
        break;

    case 'savenote':
        include 'classes/Note.php';
        echo json_encode(Note::save($rqst));
        break;

    case 'deletenote':
        include 'classes/Note.php';
        echo json_encode(Note::delete($rqst));
        break;

    default:
        echo 'OPERACION NO DISPONIBLE';
        break;
}
?>
