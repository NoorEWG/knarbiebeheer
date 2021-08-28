<?php

	include("../../includes/constants.php");
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS"); 
    header('Content-type:application/json;charset=utf-8');
    header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
	$bdd = new PDO("mysql:dbname=" . DATABASE . ";host=" . SERVER, USERNAME, PASSWORD);
  
    //Receive the RAW post data.
    $content = trim(file_get_contents("php://input"));

    //Attempt to decode the incoming RAW post data from JSON.
    $decoded = json_decode($content, true);

    $array['errorCode'] = 0;
    $array['message'] = "";

    $sql = "UPDATE `randmeren_botter_bezoek` SET werkelijke_personen = :werkelijke_personen WHERE id = :botter_bezoek_id;";
    $res=$bdd->prepare($sql);
    $res->bindParam(':werkelijke_personen', $decoded['werkelijkePersonen'], PDO::PARAM_INT); 
    $res->bindParam(':botter_bezoek_id', $decoded['botterBezoekId'], PDO::PARAM_INT);
    $res->execute();   

    $sql = "SELECT werkelijke_personen, 
    DATE_FORMAT(visit_date, '%d-%m-%Y') AS datum 
    FROM `randmeren_botter_bezoek` 
    WHERE id = :botter_bezoek_id;";
    $res=$bdd->prepare($sql);
    $res->bindParam(':botter_bezoek_id', $decoded['botterBezoekId'], PDO::PARAM_INT);
    $res->execute();   
    $gewijzigd=$res->fetch(PDO::FETCH_ASSOC);
 
    if ($gewijzigd['werkelijke_personen'] == $decoded['werkelijkePersonen']) {
        $array['message'] = "Het definitieve aantal personen van " . $gewijzigd['datum'] . " is gewijzigd in " . $decoded['werkelijkePersonen'];
    } else {
        $array['errorcode'] = 0;
        $array['message'] = "Het is niet mogelijk om het botter bezoek te wijzigen. Probeer het later nog een keer.";
    }
    
    print json_encode($array);  
   
	$bdd = null;
	
?>