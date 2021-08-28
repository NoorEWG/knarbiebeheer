<?php

	include("../../includes/constants.php");
    header("Access-Control-Allow-Origin: *");
	$bdd = new PDO("mysql:dbname=" . DATABASE . ";host=" . SERVER, USERNAME, PASSWORD);
  
    $year = $_GET["year"];

    $sql = "SELECT GROUP_CONCAT(b.naam_boot) AS naamBoot, 
    DATE_FORMAT(bb.visit_date, '%d-%m-%Y') AS datum,
    MONTH(bb.visit_date) AS maand,
    bb.verwachte_personen AS verwachtePersonen,
    bb.werkelijke_personen AS werkelijkePersonen,
    bb.island AS eiland,
    bb.id AS botterBezoekId
    FROM `randmeren_botter_bezoek` bb
    LEFT JOIN `randmeren_botter_bezoek_ass` a ON bb.id = a.bezoek_id
    LEFT JOIN `randmeren_boten` b ON b.id = a.boot_id
    WHERE YEAR(bb.visit_date) = :jaar
    GROUP By bb.id
    ORDER BY bb.visit_date DESC";
    $res=$bdd->prepare($sql);
    $res->bindParam(':jaar', $year, PDO::PARAM_INT);
    $res->execute();   
    $all_botter_data=$res->fetchAll(PDO::FETCH_ASSOC); 
    $array["botterData"] = $all_botter_data;

    $sql = "SELECT SUM(werkelijke_personen) AS werkelijkePersonenPerMaand, 
    SUM(verwachte_personen) AS verwachtePersonenPerMaand, 
    MONTH(visit_date) AS maand
    FROM `randmeren_botter_bezoek` 
    WHERE YEAR(visit_date) = :jaar
    GROUP By MONTH(visit_date)
    ORDER BY MONTH(visit_date) DESC";
    $res=$bdd->prepare($sql);
    $res->bindParam(':jaar', $year, PDO::PARAM_INT);
    $res->execute();   
    $persons_per_month=$res->fetchAll(PDO::FETCH_ASSOC); 
    $array["personenBottersPerMaand"] = $persons_per_month;

    $sql = "SELECT SUM(werkelijke_personen) AS werkelijkePersonenPerJaar,
    SUM(verwachte_personen) AS verwachtePersonenPerJaar
    FROM `randmeren_botter_bezoek` 
    WHERE YEAR(visit_date) = :jaar";
    $res=$bdd->prepare($sql);
    $res->bindParam(':jaar', $year, PDO::PARAM_INT);
    $res->execute();   
    $persons_per_year=$res->fetchAll(PDO::FETCH_ASSOC); 
    $array["personenBottersPerJaar"] = $persons_per_year;

    print json_encode($array);
	$bdd = null;
	
?>