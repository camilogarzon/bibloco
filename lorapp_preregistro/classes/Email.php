<?php

class Email {

    public function __construct() {
        
    }
    
    public static function send($rqst) {
        $subject = isset($rqst['subject']) ? ($rqst['subject']) : '';
        $message = isset($rqst['message']) ? ($rqst['message']) : '';
        $email_address = isset($rqst['email_address']) ? ($rqst['email_address']) : '';
        $email_name = isset($rqst['email_name']) ? utf8_decode($rqst['email_name']) : '';
        $godaddy = true;
        if (!Util::validate_email($email_address)) {
            return Util::error_wrong_email();
        }
        if ($subject != '' && $message != '' && $email_address != '' && $email_name != '') {
            $mail = new PHPMailer();
            $mail->IsSMTP(); // telling the class to use SMTP
            $mail->SMTPDebug = 1;                     // enables SMTP debug information (for testing)
            // 1 = errors and messages
            // 2 = messages only										   
            //configuracion normal
            if ($godaddy){
//                $mail->SMTPAuth = true;                  // enable SMTP authentication
//                $mail->SMTPSecure = "ssl";                 // sets the prefix to the servier
                $mail->Host = "localhost"; // sets the SMTP server
//                $mail->Port = 465;                    // set the SMTP port for the GMAIL server
//                $mail->Username = "email@gmail.com"; // SMTP account username
//                $mail->Password = "pass";        // SMTP account password
            } else {
                $mail->SMTPAuth = true;                  // enable SMTP authentication
                $mail->SMTPSecure = "ssl";                 // sets the prefix to the servier
                $mail->Host = "smtp.gmail.com"; // sets the SMTP server
                $mail->Port = 465;                    // set the SMTP port for the GMAIL server
                $mail->Username = "email@gmail.com"; // SMTP account username
                $mail->Password = "pass";        // SMTP account password
            }
            
            $mail->SetFrom('inscrito@lorapp.com', 'Inscrito Lorapp');
            $mail->Subject = $subject;
            $mail->AltBody = "To view the message, please use an HTML compatible email viewer!"; // optional, comment out and test
            $mail->MsgHTML($message);
            $mail->AddBCC($email_address, $email_name);
            //$mail->AddBCC('edgarcastaneda@grupo613.com', 'Edgar');
            $mail->AddBCC('camiloluceroe@gmail.com', 'Milo');
            $mail->AddBCC('camilogc2@gmail.com', 'CG');
            if (!$mail->Send()) {
                $arrjson = array('output' => array('valid' => false, 'response' => $mail->ErrorInfo));
            } else {
                $arrjson = array('output' => array('valid' => true, 'response' => 'ok'));
            }
        } else {
            $arrjson = Util::error_missing_data();
        }
        return $arrjson;
    }
    
    public static function emailPlantilla($rqst) {
        $subject = isset($rqst['subject']) ? utf8_decode($rqst['subject']) : '';
        $message_content = isset($rqst['message_content']) ? utf8_decode($rqst['message_content']) : '';
        $email_address = isset($rqst['email_address']) ? ($rqst['email_address']) : '';
        $email_name = isset($rqst['email_name']) ? utf8_decode($rqst['email_name']) : '';
        //este es el HTML que va en el email
        $message = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>Email</title>
        <style type="text/css">
            body {
                margin-left: 0px;
                margin-top: 0px;
                margin-right: 0px;
                margin-bottom: 0px;
                font-family: Trebuchet MS, Arial, Helvetica, sans-serif;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div style="vertical-align: top;">
            <table width="538" height="auto"  border="0" cellpadding="0" cellspacing="0">
                <tr>
                    <td>
                        <div style="vertical-align: top;">' . $message_content . '</div>
                    </td>
                </tr>
            </table>
        </div>
    </body>
</html>';
        $datos = array('subject' => $subject,
            'message' => $message,
            'email_address' => $email_address,
            'email_name' => $email_name);
        $arrjson = Email::send($datos);
        return $arrjson;
    }

    //Funcion para probar los envios
    public static function emailTest() {
        $subject = 'prueba evento 2';
        $message_content = 'el mensaje de pepito perez';
        $email_address = 'camilogc2@gmail.com';
        $email_name = 'Camilo';

        $datos = array('subject' => $subject,
            'message_content' => $message_content,
            'email_address' => $email_address,
            'email_name' => $email_name);
        $arrjson = Email::emailPlantilla($datos);
        return $arrjson;
    }
    
}

?>