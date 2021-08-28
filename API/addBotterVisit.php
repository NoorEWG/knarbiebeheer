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

    // Check if there is already a boter visit registered for the requested day
    $sql = "SELECT id FROM randmeren_botter_bezoek WHERE visit_date=:visit_date";
    $res=$bdd->prepare($sql);
    $res->bindValue(':visit_date', $decoded['datum']);
    $res->execute();   
    $bezoek_exists=$res->fetch(PDO::FETCH_ASSOC);

    if($bezoek_exists) {
        $array['errorCode'] = 1;
        $array['message'] = "Voor de datum: " . $decoded['datum'] . " is er al een botterbezoek geregistreerd";
    }
    else {
        $sql = "INSERT INTO randmeren_botter_bezoek (`island`, `visit_date`, `verwachte_personen`, `werkelijke_personen`)
        VALUES (:island, :visit_date,:verwachte_personen,:werkelijke_personen)";
        $res=$bdd->prepare($sql);
        $res->bindParam(':island', $decoded['eiland'], PDO::PARAM_STR); 
        $res->bindParam(':visit_date', $decoded['datum'], PDO::PARAM_STR);    
        $res->bindParam(':verwachte_personen', $decoded['verwachtePersonen'], PDO::PARAM_INT);
        $res->bindParam(':werkelijke_personen', $decoded['werkelijkePersonen'], PDO::PARAM_INT);
        $res->execute();  
        $bezoek_id = $bdd->lastInsertId();
        $array['lastBotterVisitId'] = $bezoek_id;

        if ($bezoek_id > 0) {
            $botter_namen = array();
            foreach ($decoded['botters'] as $botter) {
                array_push($botter_namen, $botter['naamBoot']);
                $sql = "INSERT INTO randmeren_botter_bezoek_ass (`boot_id`, `bezoek_id`)
                VALUES (:boot_id, :bezoek_id);";
                $res=$bdd->prepare($sql);
                $res->bindParam(':boot_id', $botter['bootId'],  PDO::PARAM_INT); 
                $res->bindParam(':bezoek_id', $bezoek_id);  
                $success = $res->execute();
            }
            if($success == true) {
                $array['message'] = "Het bezoek van de botter(s) ". implode(", ", $botter_namen) . " op " . $decoded['datum'] ." is opgeslagen.";  
            }
            else {
                $array['errorCode'] = 2;
                $array['message'] = "Het is nu niet mogelijk om het botter bezoek te registreren, probeer het later nogmaals.";
            }
        }
        else {
            $array['errorCode'] = 3;
            $array['message'] = "Het is nu niet mogelijk om het botter bezoek te registreren, probeer het later nogmaals.";       
        }
    }
   
    print json_encode($array);  
   
	$bdd = null;
	
?>