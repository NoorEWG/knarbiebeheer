<?php

	include("../../includes/constants.php");
    header("Access-Control-Allow-Origin: *");
	$bdd = new PDO("mysql:dbname=" . DATABASE . ";host=" . SERVER, USERNAME, PASSWORD);
  
    $year = $_GET["year"];

    $sql = "SELECT b.id AS bootId,
    b.naam_boot AS naamBoot, 
    t.type AS typeBoot
    FROM `randmeren_botters_jaar` bb  
    LEFT JOIN `randmeren_boten` b ON bb.boot_id = b.id
    LEFT JOIN `randmeren_type_boot` t ON b.type_boot = t.id
    WHERE bb.jaar =:jaar
    ORDER BY b.naam_boot";
    $res=$bdd->prepare($sql);
    $res->bindParam(':jaar', $year, PDO::PARAM_INT);
    $res->execute();   
    $all_abo_data=$res->fetchAll(PDO::FETCH_ASSOC);   
    print json_encode($all_abo_data);
	$bdd = null;
	
?>