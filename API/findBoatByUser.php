<?php

	include("../../includes/constants.php");
    header("Access-Control-Allow-Origin: *");
	$bdd = new PDO("mysql:dbname=" . DATABASE . ";host=" . SERVER, USERNAME, PASSWORD);
  
    $boatId = $_GET["boatid"];

    $sql = "SELECT b.id,
    b.naam_boot As naamBoot, 
    b.lengte_boot AS lengteBoot,
    b.type_boot AS bootType
    FROM `randmeren_boten` b
    LEFT JOIN `randmeren_type_boot` t ON b.type_boot = t.id 
    WHERE b.id = $boatId";
    $res=$bdd->prepare($sql);
    $res->execute();   
    $data=$res->fetchAll(PDO::FETCH_ASSOC);   

    $boat = $data[0];

    $sql = "SELECT *
    FROM `randmeren_type_boot`
    WHERE id = :id";
    $res=$bdd->prepare($sql);
    $res->bindParam(':id', $boat['bootType']);
    $res->execute();   
    $bootType=$res->fetchAll(PDO::FETCH_ASSOC); 
    $boat['typeBoot'] = $bootType[0];
    unset($boat['bootType']);

    print json_encode($boat);
	$bdd = null;
	
?>