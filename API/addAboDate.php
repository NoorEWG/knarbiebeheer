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
   
    // Check if there is already a visit registered for the same user and boat on the same day
    $sql = "SELECT id FROM randmeren_abo_bezoek WHERE abo_id=:abo_id AND visit_date=:visit_date";
    $res=$bdd->prepare($sql);
    $res->bindValue(':abo_id', $decoded['aboId']);
    $res->bindValue(':visit_date', $decoded['chosenDate']);
    $res->execute();   
    $bezoek_exists=$res->fetch(PDO::FETCH_ASSOC);

    $array['errorCode'] = 0;
    $array['message'] = "";

    if($bezoek_exists) {
      $array['errorCode'] = 1;
      $array['message'] = "Voor de datum: " . $decoded['chosenDate'] . " is er al een bezoek geregistreerd voor de boot " . $decoded['boot'];
    }
    else { 
        $sql = "INSERT INTO randmeren_abo_bezoek (`abo_id`, `boot_id`, `island`, `visit_date`)
        VALUES (:abo_id,:boot_id,:island,:visit_date)";
        $res=$bdd->prepare($sql);
        $res->bindParam(':abo_id', $decoded['aboId'], PDO::PARAM_INT);
        $res->bindParam(':boot_id', $decoded['bootId'],  PDO::PARAM_INT);
        $res->bindParam(':island', $decoded['eiland']); 
        $res->bindParam(':visit_date', $decoded['chosenDate']);    
        $success = $res->execute();  
       

      
        if($success == true) {
            $array['message'] = "Het bezoek van de boot " . $decoded['boot'] . " op " . $decoded['date'] ." is opgeslagen.";  
        }
        else {
            $array['errorCode'] = 2;
            $array['message'] = "Het is nu niet mogelijk om het bezoek te registreren, probeer het later nogmaals.";
        }
       
    }
    
    print json_encode($array);  
    $bdd = null;
 
?>