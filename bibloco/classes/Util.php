<?php

/**
 * Clase que contiene varios métodos útiles
 * @author Camilo Garzon Calle
 * @version 1.0
 */
class Util {

    public $THE_KEY = 'b03f1cb2cc06ed37da0fe507cf7a9926';

    /**
     * Valor de un KB = 1024 bytes
     * @var int 
     */
    public $KB_BYTE = 1024;

    /**
     * Valor de un MB = 1024 KB
     * @var int 
     */
    public $MB_BYTE = 1048576;

    public function __construct() {
        //contructor que no tiene ninguna funcion, por ahora
    }
    
    public static function get_app_id(){
        return 'b03f1cb2cc06ed37da0fe507cf7a9926';
    }

    /**
     * Método para capturar la Ip del cliente
     * @return string Ip del cliente
     */
    public static function get_real_ipaddress() {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP']; //check ip from share internet
        } else if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR']; //to check ip is pass from proxy
        } else {
            $ip = $_SERVER['REMOTE_ADDR'];
        }
        return $ip;
    }

    /**
     * Método para hacer POST desde PHP
     * @param string $url
     * @param array $data
     * @param string $referer
     * @return array ['status', 'header', 'content']
     */
    public static function post_request($url, $data, $referer = '') {
        // Convert the data array into URL Parameters like a=b&foo=bar etc.
        $data = http_build_query($data);
        // parse the given URL
        $url = parse_url($url);
        if ($url['scheme'] != 'http') {
            die('Error: Only HTTP request are supported !');
        }
        // extract host and path:
        $host = $url['host'];
        $path = $url['path'];
//		echo '<br/>';
//		echo '<br/>'.$host;
//		echo '<br/>'.$path;
//		echo '<br/>';
        if (function_exists('fsockopen')) {
            //echo 'open a socket connection on port 80 - timeout: 30 sec';
            $fp = fsockopen($host, 80, $errno, $errstr, 30);
            if ($fp) {
                // send the request headers:
                fputs($fp, "POST $path HTTP/1.1\r\n");
                fputs($fp, "Host: $host\r\n");

                if ($referer != '') {
                    fputs($fp, "Referer: $referer\r\n");
                }

                fputs($fp, "Content-type: application/x-www-form-urlencoded\r\n");
                fputs($fp, "Content-length: " . strlen($data) . "\r\n");
                fputs($fp, "Connection: close\r\n\r\n");
                fputs($fp, $data);

                $result = '';
                while (!feof($fp)) {
                    // receive the results of the request
                    $result .= fgets($fp, 128);
                }
            } else {
                return array(
                    'status' => 'err',
                    'error' => '$errstr ($errno)'
                );
            }
        } else {
            echo "No fsockopen, please config php.ini <br />\n";
        }

        // close the socket connection:
        fclose($fp);

        // split the result header from the content
        $result = explode("\r\n\r\n", $result, 2);

        $header = isset($result[0]) ? $result[0] : '';
        $content = isset($result[1]) ? $result[1] : '';

        // return as structured array:
        return array(
            'status' => 'ok',
            'header' => $header,
            'content' => $content
        );
    }

    /**
     * Metodo que implementa la funcion <i>post_request</i> cuando se utiliza de la siguiente manera:
     * <code>
      $post_data = array('param1' => 'some1','param2' => $some2 );
      $result = $util->post_request($util->URL_BLAST24WS, $post_data);
      if ($result['status'] == 'ok'){
      ___$json_decoded = json_decode($result['content']);
      ___if ($json_decoded->output->valid) {
      ______$_SESSION['okSessionVarName'] = $json_decoded->output->response;
      ______$_SESSION['location'] = 'okLocation';
      ___} else {
      ______$_SESSION['json_error'] = $json_decoded->output->response;
      ______$_SESSION['location'] = 'errorLocation';
      ______}
      ___} else {echo 'A error occured: ' . $result['error']; }
      </code>
     * @param array $post_data datos para hacer post
     * @param string $okLocation ubicacion a setear en $_SESSION['location'] si la peticion es la esperada
     * @param string $errorLocation ubicacion a setear en $_SESSION['location'] si la peticion devuelve error
     * @param string $okSessionVarName nombre de la variable de sesion que se inicia
     * @return array resultado del post
     */
    public function post_request_common($post_data, $okLocation = "", $errorLocation = "", $okSessionVarName = "") {
        $result = $this->post_request($this->URL_BLAST24WS, $post_data);
        if ($result['status'] == 'ok') {
            $json_decoded = json_decode($result['content']);
            if ($json_decoded->output->valid) {
                if ($okLocation != "") {
                    $_SESSION['location'] = $okLocation;
                }
                if ($okSessionVarName != "") {
                    $_SESSION[$okSessionVarName] = $json_decoded->output->response;
                }
            } else {
                if ($errorLocation != "") {
                    $_SESSION['location'] = $errorLocation;
                }
                $_SESSION['json_error'] = $json_decoded->output->response;
            }
        } else {
            echo 'A error occured: ' . $result['error'];
        }
        return $result;
    }

    /**
     * Mètodo para eliminar caracteres especiales que puedan modificar las consultas SQL.
     * Una función para evitar SQL Injection.
     * @param string $str
     * @return string Cadena de carateres segura
     */
    public static function remove_special_char($str) {
        if ($str == null || count($str) <= 0) {
            return $str;
        }
        $realstr = str_replace("'", "", $str);
        $realstr = str_replace("&", "", $realstr);
        //$realstr = str_replace("\n","",$realstr);
        //$realstr = str_replace("\r","",$realstr);
        $realstr = str_replace("<", "", $realstr);
        $realstr = str_replace(">", "", $realstr);
        $realstr = str_replace("\"", "", $realstr);
        $realstr = str_replace("drop", "", $realstr);
        $realstr = str_replace("DROP", "", $realstr);
        $realstr = str_replace("delete", "", $realstr);
        $realstr = str_replace("DELETE", "", $realstr);
        // ESTOS SE INHABILITAN PARA PODER ALMACENAR DIRECCIONES EN LA BASE DE DATOS
        // $realstr = str_replace("/","",$realstr);
        // $realstr = str_replace("/\/","",$realstr);
        //$realstr = str_replace("|","",$realstr);
        return $realstr;
    }

    public static function remove_weird_char($str) {
        if ($str == null || count($str) <= 0) {
            return $str;
        }
        $realstr = str_replace("Ã¡", "a", $str);
        $realstr = str_replace("Ã©", "e", $realstr);
        $realstr = str_replace("Ã­", "i", $realstr);
        $realstr = str_replace("Ã³", "o", $realstr);
        $realstr = str_replace("Ãº", "u", $realstr);
        return $realstr;
    }

    public static function convert_special_char($str) {
        if ($str == null || count($str) <= 0) {
            return $str;
        }
        $realstr = htmlspecialchars($str, ENT_QUOTES);
        return $realstr;
    }

    public static function convert_pathtourl($str) {
        if ($str == null || count($str) <= 0) {
            return $str;
        }
        $realstr = str_replace(DIRECTORY_SEPARATOR, "/", $str);
        return $realstr;
    }

    public static function remove_repeatslash($str) {
        if ($str == null || count($str) <= 0) {
            return $str;
        }
        $realstr = str_replace(DIRECTORY_SEPARATOR . DIRECTORY_SEPARATOR, DIRECTORY_SEPARATOR, $str);
        for ($i = 0; $i < 2; $i++) {
            $realstr = str_replace(DIRECTORY_SEPARATOR . DIRECTORY_SEPARATOR, DIRECTORY_SEPARATOR, $realstr);
        }
        return $realstr;
    }

    /**
     * Metodo para generar el hash de un password en una serie de encriptaciones del Blast24
     * @param string $type
     * @param string $data1
     * @param string $data2
     * @return string hash del password
     */
    public static function create_passhash($type = "", $data1 = "", $data2 = "") {
        if ($type == 'send') {
            $hash = sha1($data1 . $data2);
//		echo '<br/>send '.$data1.' - '.$data2;
        } else if ($type == 'receive') {
            $hash = strtoupper(sha1($data1 . "unabobada"));
//		echo '<br/>receive '.$data1;
        } else if ($type == 'store') {
            $hash = strtoupper(sha1(sha1($data1 . $data2) . "unabobada"));
            //echo '<br/>store '.$data1.' - '.$data2;
        }
        return $hash;
    }

    /**
     * Metodo para escribir sobre archivos.
     * @param string $data El dato a escribir en el archivo.
     * @param string $pathFile La ubicacion fisica del archivo.
     * @param int $isNew 0 es para escribir sobre un archivo existente. 1 para crear uno nuevo.
     */
    public static function make_file($data, $pathFile, $isNew = 0) {
        $filesize = 0;
        if (file_exists($pathFile)) {
            if ($isNew) {
                unlink($pathFile);
            }
            $filesize = filesize($pathFile); //bytes
        }
        //$maxSize = 1 * 1024;//KB
        $maxSize = 1 * 1048576; //MB
        if ($filesize > $maxSize) {
            rename($pathFile, $pathFile . date("YmdHis"));
        }
        $fh = fopen($pathFile, 'a+') or die("Can't use file.<BR/>Need to apply read-write permissions.<BR/>$ sudo chmod 777 /var/www/s24/blast24/web/log/debug_file.txt or " . $pathFile);
        $arrStr = explode(";", $data);
        foreach ($arrStr as $str) {
            $str = date("Y-m-d H:i:s") . " # " . $str . "\n";
            fwrite($fh, $str);
        }
        fclose($fh);
    }

    /**
     * Metodo para escribir sobre archivos.
     * @param string $str El dato a escribir en el archivo.
     * @param int $isNew 0 es para escribir sobre un archivo existente. 1 para crear uno nuevo.
     * @param string $pathFile La ubicacion fisica del archivo.
     */
    public static function make_debug_file($str, $file, $line, $isNew = 0, $pathFile = "log/debug_file.txt") {
        $filesize = 0;
        if (file_exists($pathFile)) {
            if ($isNew) {
                unlink($pathFile);
            }
            $filesize = filesize($pathFile); //bytes
        }
        //$maxSize = 1 * 1024;//KB
        $maxSize = 1 * 1048576; //MB
        if ($filesize > $maxSize) {
            rename($pathFile, $pathFile . date("YmdHis"));
        }
        $fh = fopen($pathFile, 'a+') or die("Can't use file.<BR/>Need to apply read-write permissions.<BR/>$ sudo chmod 777 /var/www/s24/blast24/web/log/debug_file.txt or " . $pathFile);
//	    $str = date("Y-m-d H:i:s")." # ".__FILE__." Linea: ".__LINE__."\n".$str."\n";
        //$str = date("H:i:s.m")." # ".__FILE__." Linea: ".__LINE__."\n--->".$str."\n\n";
        $str = date("H:i:s.m") . " # Linea: " . $line . " # " . $file . "\n--->" . $str . "\n\n";
        fwrite($fh, $str);
        fclose($fh);
    }

    public static function session_chainstring($nameSessionVar, $str) {
        $_SESSION[$nameSessionVar].= $str . '*';
    }

    /**
     * Metodo para construir un UPDATE.
     * @param string $table nombre de la tabla a escribir
     * @param string $where condicion para actualizar
     * @param array $arrfieldscomma campos y valores tipo STRING, que requieren comma
     * @param array $arrfieldsnocomma campos y valores que no requieren comma
     * @return string consulta construida
      <code>
      include 'classes/Util.php';
      $table = "mi_tabla";
      $where = "(id = 0) and (tipo='cadena')";
      $arrfieldscomma = array('campo1' => 'valor1', 'campo2' => 'valor2', 'campo3' => 'valor3');
      $arrfieldsnocomma = array('campoA' => 'NOW()', 'campoB' => '2', 'campoC' => 'GET');
      echo Util::make_query_insert($table, $arrfieldscomma, $arrfieldsnocomma);
      </code>
     * 
     */
    public static function make_query_update($table, $where, $arrfieldscomma, $arrfieldsnocomma) {
        $query = "UPDATE ";
        if ($table == null || strlen($table) < 1) {
            return "***Falta nombre de la tabla***";
        }
        if ($where == null || strlen($where) < 1) {
            return "***Falta WHERE id=?? del registro***";
        }
        $query .= $table . " SET ";
        $fields = "";
        foreach ($arrfieldscomma as $f => $v) {
            if (strlen($v) > 1) {
                $fields .= " " . $f . " = '" . $v . "',";
            }
        }
        foreach ($arrfieldsnocomma as $f2 => $v2) {
            if ($v2 > 0) {
                $fields .= " " . $f2 . " = " . $v2 . ",";
            }
        }
        $fields = rtrim($fields, ",");
        $query .= $fields . " WHERE " . $where;
        return $query;
    }

    /**
     * Metodo para encriptar password
     */
    public static function make_hash_pass($pass) {
        $r = strtoupper(md5(md5($pass) . sha1($pass) . md5(sha1('secuenciacontr33bute'))));
        return $r;
    }

    public static function validate_key($key1, $random = '', $param = '') {
        $key2 = '';
        $response = false;
        if (strlen($param) > 0) {
            $key2 = sha1($param . $this->THE_KEY . $random);
            if ($key1 == $key2) {
                $response = true;
            }
        } else {
            $key2 = sha1($this->THE_KEY . $random);
            if ($key1 == $key2) {
                $response = true;
            }
        }
        return $response;
    }

    /** Checks is the provided email address is formally valid
     *  @param string $email email address to be checked
     *  @return true if the email is valid, false otherwise
     */
    public static function validate_email($email) {
        $regexp = "/^[a-z0-9]+([_\\.-][a-z0-9]+)*@([a-z0-9]+([\.-][a-z0-9]+)*)+\\.[a-z]{2,}$/i";
        if (preg_match($regexp, $email)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Metodo para generar un codigo aleatorio
     * @param int longitud del codigo
     * @return string Codigo generado
     */
    public static function generate_code($l) {
        $key = '';
        $pat = '1234567890abcdefghijklmnopqrstuvwxyz';
        $max = strlen($pat) - 1;
        for ($i = 0; $i < $l; $i++) {
            $key .= $pat{mt_rand(0, $max)};
        }
        return $key;
    }

    public static function rounding($numero, $decimales) {
        $factor = pow(10, $decimales);
        return (round($numero * $factor) / $factor);
    }

    public static function error_invalid_method_called() {
        return array('output' => array('valid' => false, 'response' => array('code' => '101', 'content' => ' Metodo no existe.')));
    }

    public static function error_invalid_authorization() {
        return array('output' => array('valid' => false, 'response' => array('code' => '102', 'content' => ' No se encuentra autorizado para ejecutar la operación.')));
    }

    public static function error_missing_data() {
        return array('output' => array('valid' => false, 'response' => array('code' => '103', 'content' => ' Faltan datos.')));
    }

    public static function error_general($description = '') {
        return array('output' => array('valid' => false, 'response' => array('code' => '000', 'content' => ' Ha ocurrido un error. ' . $description)));
    }

    public static function error_no_result() {
        return array('output' => array('valid' => false, 'response' => array('code' => '104', 'content' => ' Sin resultados.')));
    }

    public static function error_no_credits() {
        return array('output' => array('valid' => false, 'response' => array('code' => '105', 'content' => ' Creditos insuficientes.')));
    }

    public static function error_user_already_exist() {
        return array('output' => array('valid' => false, 'response' => array('code' => '106', 'content' => ' El correo ingresado ya lo utiliza otro usuario.')));
    }

    public static function error_wrong_data_login() {
        return array('output' => array('valid' => false, 'response' => array('code' => '107', 'content' => ' Usuario o Contraseña Incorrectos.')));
    }

    public static function error_wrong_email() {
        return array('output' => array('valid' => false, 'response' => array('code' => '108', 'content' => ' Email incorrecto.')));
    }

    public static function error_sending_email($content = NULL) {
        return array('output' => array('valid' => false, 'response' => array('code' => '109', 'content' => $content)));
    }

    public static function error_envioautoevalucion($description = '') {
        return array('output' => array('valid' => false, 'response' => array('code' => '110', 'content' => ' Ha ocurrido un error al enviar la autoevaluación, vuelvalo a intentar. ' . $description)));
    }
    
    public static function error_enviorevision($description = '') {
        return array('output' => array('valid' => false, 'response' => array('code' => '111', 'content' => ' Ha ocurrido un error al enviar la revisión, vuelvalo a intentar. ' . $description)));
    }
    public static function error_subirarchivo($description = '') {
        return array('output' => array('valid' => false, 'response' => array('code' => '112', 'content' => ' Ha ocurrido un error al subir el archivo soporte. ' . $description)));
    }
    public static function error_preguntarepetida($description = '') {
        return array('output' => array('valid' => false, 'response' => array('code' => '113', 'content' => ' La pregunta a ingresar ya ha sido registrada en el cuestionario seleccionado. ' . $description)));
    }
     public static function error_subirarchivoTam($description = '') {
        return array('output' => array('valid' => false, 'response' => array('code' => '114', 'content' => ' El peso del archivo exece al limite especifico. ' . $description)));
    }
     public static function error_cuestionariodiligencinado($description = '') {
        return array('output' => array('valid' => false, 'response' => array('code' => '115', 'content' => 'No se puede eliminar el registro, por que el cuestionario ya fue diligenciado. ' . $description)));
    }
    
     public static function error_criteriorepetido ($description = '') {
        return array('output' => array('valid' => false, 'response' => array('code' => '116', 'content' => ' El criterio a ingresar ya fue registrado en el cuestionario seleccionado. ' . $description)));
    }
     public static function error_dimensionrepetida ($description = '') {
        return array('output' => array('valid' => false, 'response' => array('code' => '117', 'content' => ' La dimensión a ingresar ya fue registrada en el cuestionario seleccionado. ' . $description)));
    }
     public static function error_sectorrepetido ($description = '') {
        return array('output' => array('valid' => false, 'response' => array('code' => '117', 'content' => ' El sector a ingresar ya fue registrado en el cuestionario seleccionado. ' . $description)));
    }
     public static function error_eliminar($description = '') {
        return array('output' => array('valid' => false, 'response' => array('code' => '118', 'content' => ' Ha ocurrido un error al eliminar el registro. ' . $description)));
    }


    public static function date_now_server() {
        return 'DATE_ADD(NOW(),INTERVAL 2 HOUR)';
    }
    
    public static function trace_log($rqst, $controlador ='') {
        $db = new DbConection();
        $pdo = $db->openConect();
        $op = isset($rqst['op']) ? $rqst['op'] : '';
        $usuario_id = 0;
        $administrador = '';
        $user_agent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '';
        $phpsessionid = isset($_REQUEST['PHPSESSID']) ? $_REQUEST['PHPSESSID'] : '';
        if (isset($_SESSION['usuario'])) {
            $usuario_id = $_SESSION['usuario']['id'];
            $administrador = $_SESSION['usuario']['administrador'];
        }
        $q = "INSERT INTO " . $db->getTable('asm_log_auditoria') . " (dtcreate, ip, usuario_id, administrador, op, controlador, rqst, user_agent, phpsessionid) VALUES (" . Util::date_now_server() . ", '" . Util::get_real_ipaddress() . "', '".$usuario_id."', '".$administrador."', '".$op."', '".$controlador."', '".  json_encode($rqst)."', '".$user_agent."', '".$phpsessionid."') ";
        $pdo->query($q);
        $db->closeConect();
    }    
    
    public static function verify_user_app_access(){
        //se valida que pueda utilizar este tipo de acceso
        //para una futura conversion en un API solo se nececida validar daots de usuario
        if (!isset($_SESSION['usuario'])) {
            echo 'OPERACION NO DISPONIBLE. CODIGO 001. USUARIO SIN PRIVILEGIOS';
            die();
        }
        //se pregunta si tiene acceso a esta aplicacion
        if (isset($_SESSION['usuario']['application'])) {
            if (!(in_array(Util::get_app_id(), $_SESSION['usuario']['application']))) {
                echo 'OPERACION NO DISPONIBLE. CODIGO 002. APLICACION NO ASIGNADA';
                die();
            }
        } else {
            echo 'OPERACION NO DISPONIBLE. CODIGO 003. APLICACION NO AUTORIZADA';
            die();
        }
    }

}

?>