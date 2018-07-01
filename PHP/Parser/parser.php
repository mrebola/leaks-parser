<?php
/* By mr.ebola - hackwise@mrebola.com */
include 'file_list.php';
$len=count($files);
	for ($i=0;$i<$len;$i++){
		   echo $files[$i];
		$handle = fopen($files[$i], "r");
		if ($handle) {
		    while (($line = fgets($handle)) !== false) {
		        $pieces = explode(":", $line);
					    $servername = "localhost";
						$dbname = "leaks";
						$username = "root";
						$psw = "root";
						$port= "3306";

						$mail = $pieces[0];
						$leak = "NA";
						$password = $pieces[1];

					try {
					    $conn = new PDO("mysql:host=$servername;dbname=$dbname;port=$port;", $username, $psw);
					    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
					    $sql = "INSERT INTO emails (mail, leak, password) VALUES ('$mail', '$leak', '$password')";
					    $conn->exec($sql);
					    echo "Agregado -> Correo: ".$pieces[0]." Password: ".$pieces[1];
					    }
					catch(PDOException $e)
					    {
					    echo $sql . "<br>" . $e->getMessage();
					    }
					$conn = null;
		    }
		    fclose($handle);
		} else {
		    echo "<h1>Error</h1> ";
		} 
	}

?>