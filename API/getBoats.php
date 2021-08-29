<?php

	include("../../includes/constants.php");
    header("Access-Control-Allow-Origin: *");
	$bdd = new PDO("mysql:dbname=" . DATABASE . ";host=" . SERVER, USERNAME, PASSWORD);
  
    $sql = "SELECT b.id,
    b.naam_boot As naamBoot, 
    b.lengte_boot AS lengteBoot,
    b.type_boot AS typeBoot,
    CONCAT(b.naam_boot, ' (', b.lengte_boot, 'm - ', t.type, ')') AS bootCompleet
    FROM `randmeren_boten` b
    LEFT JOIN `randmeren_type_boot` t ON b.type_boot = t.id 
    ORDER BY naam_boot";
    $res=$bdd->prepare($sql);
    $res->execute();   
    $data=$res->fetchAll(PDO::FETCH_ASSOC);   
    print json_encode($data);
	$bdd = null;
	
?>