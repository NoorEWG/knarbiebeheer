<?php

	include("../../includes/constants.php");
    header("Access-Control-Allow-Origin: *");
	$bdd = new PDO("mysql:dbname=" . DATABASE . ";host=" . SERVER, USERNAME, PASSWORD);
  
    $sql = "SELECT naam_boot As naamBoot, 
    lengte_boot AS lengteBoot,
    type_boot AS typeBoot
    FROM `randmeren_boten` 
    ORDER BY naam_boot";
    $res=$bdd->prepare($sql);
    $res->execute();   
    $data=$res->fetchAll(PDO::FETCH_ASSOC);   
    print json_encode($data);
	$bdd = null;
	
?>