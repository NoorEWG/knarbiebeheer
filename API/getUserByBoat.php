<?php

	include("../../includes/constants.php");
    header("Access-Control-Allow-Origin: *");
	$bdd = new PDO("mysql:dbname=" . DATABASE . ";host=" . SERVER, USERNAME, PASSWORD);
  
    $boatId = $_GET["boatId"];

    $sql = "SELECT 
    id,
	voorletters, 
    tussenvoegsel, 
    naam,
    telefoon_nummer AS telefoon,
    email, 
    thuishaven
    FROM `randmeren_users`   
    WHERE boot_id=" . $boatId;
    $res=$bdd->prepare($sql);
    $res->execute();   
    $data=$res->fetchAll(PDO::FETCH_ASSOC);
    print json_encode($data);
	$bdd = null;
	
?>