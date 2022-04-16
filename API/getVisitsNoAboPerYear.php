<?php

	include("../../includes/constants.php");
    header("Access-Control-Allow-Origin: *");
	$bdd = new PDO("mysql:dbname=" . DATABASE . ";host=" . SERVER, USERNAME, PASSWORD);
  
    $year = $_GET["year"];

    $sql = "SELECT * FROM `randmeren_abo_jaar_calc` WHERE jaar =:jaar";
    $res=$bdd->prepare($sql);
    $res->bindParam(':jaar', $year, PDO::PARAM_INT);
    $res->execute();   
    $year_prices=$res->fetchAll(PDO::FETCH_ASSOC);   

    $sql = "SELECT 
    id,
	personen AS persons, 
    ROUND(personen * :person_price, 2) AS visitorsPrice, 
    lengte_boot AS lengthBoat,
    ROUND(lengte_boot * :boat_price, 2) AS boatPrice, 
    tenten AS tents,
    ROUND(tenten * :tent_price, 2) AS tentPrice,
    hout AS wood,
    ROUND(hout * :wood_price, 2) AS woodPrice,
    ROUND(personen * :person_price + lengte_boot * :boat_price + tenten * :tent_price + hout * :wood_price, 2) AS totalPrice,
    eiland AS island,
    cash_payment AS cashPayment,
    naam_boot AS nameBoat, 
    opmerking,
    datum
    FROM `randmeren_visits`   
    WHERE YEAR(datum) =:jaar
    ORDER BY datum DESC";
    $res=$bdd->prepare($sql);
    $res->bindParam(':jaar', $year, PDO::PARAM_INT);
    $res->bindParam(':person_price', $year_prices[0]['price_per_person']);
    $res->bindParam(':boat_price', $year_prices[0]['price_per_meter']);
    $res->bindParam(':tent_price', $year_prices[0]['price_per_tent_normal']);
    $res->bindParam(':wood_price', $year_prices[0]['price_wood']);
    $res->execute();   
    $data=$res->fetchAll(PDO::FETCH_ASSOC);   
    print json_encode($data);
	$bdd = null;
	
?>