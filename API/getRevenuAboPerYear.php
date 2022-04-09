<?php

	include("../../includes/constants.php");
    header("Access-Control-Allow-Origin: *");
	$bdd = new PDO("mysql:dbname=" . DATABASE . ";host=" . SERVER, USERNAME, PASSWORD);
  
    $year = $_GET["year"];

    $sql = "SELECT * FROM `randmeren_abo_jaar_calc`  
    WHERE jaar =:jaar;";
    $res=$bdd->prepare($sql);
    $res->bindParam(':jaar', $year, PDO::PARAM_INT);
    $res->execute();   
    $calc_data=$res->fetchAll(PDO::FETCH_ASSOC);   

    $sql = "SELECT b.id, b.naam_boot AS bootNaam, 
    b.lengte_boot AS lengteBoot, 
    ROUND(b.lengte_boot * :price_per_meter * :visits,2) AS abonnement
    FROM `randmeren_boten` b 
    LEFT JOIN `randmeren_abo_jaar` a ON  b.id = a.boot_id
    WHERE a.jaar =:jaar;";
    $res=$bdd->prepare($sql);
    $res->bindParam(':jaar', $year, PDO::PARAM_INT);
    $res->bindParam(':price_per_meter', $calc_data[0]['price_per_meter'], PDO::PARAM_INT);
    $res->bindParam(':visits', $calc_data[0]['visits'], PDO::PARAM_INT);
    $res->execute();   
    $array['aboPerBoat']=$res->fetchAll(PDO::FETCH_ASSOC); 

    $sql = "SELECT ROUND(SUM(b.lengte_boot),2) AS totalMeters, ROUND(SUM(b.lengte_boot) * :price_per_meter * :visits,2) AS totalPrice 
    FROM `randmeren_boten` b 
    LEFT JOIN `randmeren_abo_jaar` a ON  b.id = a.boot_id
    WHERE a.jaar =:jaar;";
    $res=$bdd->prepare($sql);
    $res->bindParam(':jaar', $year, PDO::PARAM_INT);
    $res->bindParam(':price_per_meter', $calc_data[0]['price_per_meter'], PDO::PARAM_INT);
    $res->bindParam(':visits', $calc_data[0]['visits'], PDO::PARAM_INT);
    $res->execute();   
    $array['totalAbo']=$res->fetchAll(PDO::FETCH_ASSOC); 

    $sql = "SELECT ROUND(COUNT(*) * b.lengte_boot * :price_per_meter, 2) AS revenuPerBoat, 
    ab.boot_id AS boatId, 
    b.naam_boot AS boatName 
    FROM `randmeren_abo_bezoek` ab
    LEFT JOIN `randmeren_boten` b ON ab.boot_id = b.id
    WHERE YEAR(ab.visit_date) = :jaar
    GROUP BY boot_id;";
    $res=$bdd->prepare($sql);
    $res->bindParam(':jaar', $year, PDO::PARAM_INT);
    $res->bindParam(':price_per_meter', $calc_data[0]['price_per_meter'], PDO::PARAM_INT);
    $res->execute();   
    $array['revenuPerBoat']=$res->fetchAll(PDO::FETCH_ASSOC); 

    $sql = "SELECT ROUND(b.lengte_boot * :price_per_meter,2) AS revenu, 
    ab.boot_id AS boatId, 
    b.naam_boot AS boatName, 
    ab.island,
    DATE_FORMAT(ab.visit_date, '%d-%m-%Y') AS datum
    FROM `randmeren_abo_bezoek` ab
    LEFT JOIN `randmeren_boten` b ON ab.boot_id = b.id
    WHERE YEAR(ab.visit_date) = :jaar
    ORDER BY b.naam_boot, ab.visit_date";
    $res=$bdd->prepare($sql);
    $res->bindParam(':jaar', $year, PDO::PARAM_INT);
    $res->bindParam(':price_per_meter', $calc_data[0]['price_per_meter'], PDO::PARAM_INT);
    $res->execute();   
    $array['revenuPerBoatPerDate']=$res->fetchAll(PDO::FETCH_ASSOC); 
    
    $sql = "SELECT ROUND(COUNT(*) * b.lengte_boot * :price_per_meter, 2) AS revenuPerIsland, ab.island 
    FROM `randmeren_abo_bezoek` ab
    LEFT JOIN `randmeren_boten` b ON ab.boot_id = b.id
    WHERE YEAR(ab.visit_date) = :jaar
    GROUP BY ab.island;";
    $res=$bdd->prepare($sql);
    $res->bindParam(':jaar', $year, PDO::PARAM_INT);
    $res->bindParam(':price_per_meter', $calc_data[0]['price_per_meter'], PDO::PARAM_INT);
    $res->execute();   
    $array['revenuPerIsland']=$res->fetchAll(PDO::FETCH_ASSOC); 

    $sql = "SELECT ROUND(COUNT(*) * b.lengte_boot * :price_per_meter, 2) AS revenuTotal 
    FROM `randmeren_abo_bezoek` ab
    LEFT JOIN `randmeren_boten` b ON ab.boot_id = b.id
    WHERE YEAR(ab.visit_date) = :jaar;";
    $res=$bdd->prepare($sql);
    $res->bindParam(':jaar', $year, PDO::PARAM_INT);
    $res->bindParam(':price_per_meter', $calc_data[0]['price_per_meter'], PDO::PARAM_INT);
    $res->execute();   
    $array['revenuTotal']=$res->fetchAll(PDO::FETCH_ASSOC); 
      
    print json_encode($array);
	$bdd = null;
	
?>