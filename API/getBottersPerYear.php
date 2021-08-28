<?php

	include("../../includes/constants.php");
    header("Access-Control-Allow-Origin: *");
	$bdd = new PDO("mysql:dbname=" . DATABASE . ";host=" . SERVER, USERNAME, PASSWORD);
  
    $year = $_GET["year"];

    $sql = "SELECT GROUP_CONCAT(b.naam_boot) As naamBoot, 
    DATE_FORMAT(bb.visit_date, '%d-%m-%Y') AS datum,
    bb.verwachte_personen AS verwachtePersonen,
    bb.werkelijke_personen AS werkelijkePersonen, 
    bb.island AS eiland
    FROM `randmeren_botter_bezoek_ass` a
    LEFT JOIN `randmeren_boten` b ON b.id = a.boot_id
    LEFT JOIN  `randmeren_botter_bezoek` bb ON a.bezoek_id = bb.id
    WHERE YEAR(bb.visit_date) = :jaar
    ORDER BY bb.visit_date";
    $res=$bdd->prepare($sql);
    $res->bindParam(':jaar', $year, PDO::PARAM_INT);
    $res->execute();   
    $all_botter_data=$res->fetchAll(PDO::FETCH_ASSOC);   
    print json_encode($all_botter_data);
	$bdd = null;
	
?>