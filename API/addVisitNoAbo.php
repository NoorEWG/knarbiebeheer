<?php

	include("../../includes/constants.php");
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS"); 
    header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
  
	$bdd = new PDO("mysql:dbname=" . DATABASE . ";host=" . SERVER, USERNAME, PASSWORD);
    
    //Receive the RAW post data.
    $content = trim(file_get_contents("php://input"));

    //Attempt to decode the incoming RAW post data from JSON.
    $decoded = json_decode($content, true);
     
    $array['errorCode'] = 0;
    $array['message'] = "";

    if ($decoded['persons'] + $decoded['tents'] + $decoded['lengthBoat'] + $decoded['wood'] > 0) {

        $sql = "INSERT INTO randmeren_visits (`personen`, `lengte_boot`, `hout`, `tenten`, `eiland`, `datum`, `naam_boot`, `opmerking`, `cash_payment`)
        VALUES (:personen,:lengte_boot,:wood,:tenten,:eiland,:datum,:naam_boot,:opmerking,:cash_payment)";
        $res=$bdd->prepare($sql);
        $res->bindParam(':personen', $decoded['persons']);
        $res->bindParam(':lengte_boot', $decoded['lengthBoat']);
        $res->bindParam(':wood', $decoded['wood']);
        $res->bindParam(':tenten', $decoded['tents']);
        $res->bindParam(':eiland', $decoded['island']);
        $res->bindParam(':cash_payment', $decoded['cashPayment']);
        $res->bindParam(':datum', $decoded['datum']);
        $res->bindParam(':naam_boot', $decoded['naamBoot']);
        $res->bindParam(':opmerking', $decoded['opmerking']);
        $success = $res->execute();  

        if ($success == true) {
            $array['message'] = "Het bezoek op " . $decoded['datum'] . " is opgeslagen";
        } else {
            $array['errorCode'] = 2;
            $array['message'] = "Het is op dit moment niet mogelijk het bezoek op " . $decoded['datum'] . " op te slaan.";

        }
    } else {
        $array['errorCode'] = 1;
        $array['message'] = "Het is niet mogelijk het bezoek op te slaan want noch het aantal personen, noch de lengte van de boot, noch de verkoop van hout, noch het aantal tenten is ingevuld.";
    }
    print json_encode($array);  

    $bdd = null;
 
?>