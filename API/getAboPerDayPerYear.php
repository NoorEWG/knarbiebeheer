<?php

	include("../../includes/constants.php");
    header("Access-Control-Allow-Origin: *");
	$bdd = new PDO("mysql:dbname=" . DATABASE . ";host=" . SERVER, USERNAME, PASSWORD);
  
    $year = $_GET["year"];

    $sql = "SELECT b.id, 
    b.naam_boot AS bootNaam, 
    b.lengte_boot AS lengteBoot,
    IF (a.island = 'Knarland', a.island, null) AS knarland,
    IF (a.island = 'De Biezen', a.island, null) AS deBiezen,
    IF (a.island = 'Leydam', a.island, null) AS leyDam,
    DATE_FORMAT(a.visit_date, '%d-%m-%Y') AS datum
    FROM `randmeren_abo_bezoek` a 
    LEFT JOIN `randmeren_boten` b ON a.boot_id = b.id
    WHERE YEAR(a.visit_date) = :jaar
    ORDER BY a.visit_date, b.naam_boot DESC";
    $res=$bdd->prepare($sql);
    $res->bindParam(':jaar', $year, PDO::PARAM_INT);
    $res->execute();   
    $abo_per_day=$res->fetchAll(PDO::FETCH_ASSOC); 

    print json_encode($abo_per_day);
	$bdd = null;
	
?>