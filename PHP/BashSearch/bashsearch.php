<?php
/* By mr.ebola - hackwise@mrebola.com */

$ip = $_SERVER["HTTP_CF_CONNECTING_IP"];
$email = $_GET["mail"];

if($_GET["key"]=="hwise" && $ip=="187.162.x.x" && $email){
    if($email == "x@hotmail.com" || $email == "xx@hotmail.com" $email == "xx"){
        echo "¡Puerco, cochino, marrano, cerdo!";   
        }else{
            $email = $_GET["mail"];
            $remove = array($email,":");
            $tosearch = "/home/mrebola/BreachCompilation/query.sh ".$email;
            $output = shell_exec($tosearch);
            $piece = str_replace($remove, " ", $output);
            $pieces = explode(" ",$piece);
                foreach($pieces as $result) {
                    echo "<h1>$result</h1>";
                }
    }
}
?>
