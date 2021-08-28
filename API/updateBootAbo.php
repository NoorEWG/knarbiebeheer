<?php

	include("../../includes/constants.php");
    header("Access-Control-Allow-Origin: *");
	$bdd = new PDO("mysql:dbname=" . DATABASE . ";host=" . SERVER, USERNAME, PASSWORD);
  
    $year = $_GET["year"];

    $sql = "SELECT id,boot_id FROM `randmeren_users`;";
    $res=$bdd->prepare($sql);
    $res->execute();   
    $userboot=$res->fetchAll(PDO::FETCH_ASSOC);   
   
    foreach ($userboot as $value) {
        print $value['boot_id'] . ' / ';
        print $value['id'] . ' ';
        $sql = "UPDATE `randmeren_abo_jaar` SET boot_id =:boot_id WHERE abo =:usr_id AND jaar = 2021;";
        $res=$bdd->prepare($sql);
        $res->bindParam('boot_id', $value['boot_id']);
        $res->bindParam('usr_id', $value['id']);
        $res->execute();   
     }
	$bdd = null;
	
?>