<?php

	include("../../includes/constants.php");
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS"); 
    header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
  
	$bdd = new PDO("mysql:dbname=" . DATABASE . ";host=" . SERVER, USERNAME, PASSWORD);
    
    $boatId = $_GET["boatId"];
    $userId = $_GET["userId"];
    $jaar = date('Y');

    echo $boatId;
    echo $userId;
    echo $jaar;

    $sql = "INSERT INTO randmeren_abo_jaar (`abo`, `boot_id`, `jaar`)
    VALUES (:abo,:boot_id,:jaar)";
    $res=$bdd->prepare($sql);
    $res->bindParam(':abo', $userId, PDO::PARAM_INT);
    $res->bindParam(':boot_id', $boatId,  PDO::PARAM_INT);
    $res->bindParam(':jaar', $jaar,  PDO::PARAM_INT);
    $success = $res->execute();  

    echo $success;

    $bdd = null;
 
?>