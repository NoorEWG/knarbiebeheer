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
    $user = $decoded['user'];
    $boat = $decoded['boat'];
    $abo  = $decoded['abo'];
    $jaar = $decoded['jaar'];
    $actionUser = $decoded['actionUser'];
    $actionBoat = $decoded['actionBoat'];
   
    $user_id = null;
    $boat_id = null;

    $array['errorCode'] = 0;
    $array['message'] = "";

    if ($user != null  && $actionUser != null ) {
        // Check if there is already person with the same name
        $sql = "SELECT id FROM randmeren_users WHERE voorletters = :voorletters AND naam = :naam";
        $res=$bdd->prepare($sql);
        $res->bindValue(':voorletters', $user['voorletters']);
        $res->bindValue(':naam', $user['naam']);
        $res->execute();   
        $user_id=$res->fetch(PDO::FETCH_ASSOC);

        if($user_id && $action == "create") {
          $array['errorCode'] = 1;
          $array['message'] = "Er bestaat al een persoon met exact dezelfde voorletters en naam";
        }

        if (!$user_id && $actionUser == "create") { 
            $sql = "INSERT INTO randmeren_users (`voorletters`, `tussenvoegsel`, `naam`, `telefoon`, `email`, `thuishaven`)
            VALUES (:voorletters,:tussenvoegsel,:naam,:telefoon,:email,:thuishaven)";
            $res=$bdd->prepare($sql);
            $res->bindParam(':voorletters', $user['voorletters']);
            $res->bindParam(':tussenvoegsel', $user['tussenvoegsel']);
            $res->bindParam(':naam', $user['naam']); 
            $res->bindParam(':email', $user['email']);   
            $res->bindParam(':thuishaven', $user['thuishaven']);    
            $success = $res->execute();  
            $user_id = $bdd->lastInsertId();

            if($success == true) {
                $array['message'] = "De persoonsgegevens van " . $decoded['voorletters'] . " " . $decoded['naam'] ." zijn opgeslagen.";
            } else {
                $array['errorCode'] = 2;
                $array['message'] = "Het is nu niet mogelijk om de persoonsgegevens te registreren, probeer het later nogmaals.";
            }
        }
        if (!$bezoek_exists && $actionUser == "update") {
            $sql = "UPDATE randmeren_users (`voorletters`, `tussenvoegsel`, `naam`, `telefoon`, `email`, `thuishaven`)
            SET (:voorletters,:tussenvoegsel,:naam,:telefoon,:email,:thuishaven) WHERE id = :id";
            $res=$bdd->prepare($sql);
            $res->bindParam(':voorletters', $user['voorletters']);
            $res->bindParam(':tussenvoegsel', $user['tussenvoegsel']);
            $res->bindParam(':naam', $user['naam']); 
            $res->bindParam(':email', $user['email']);   
            $res->bindParam(':thuishaven', $user['thuishaven']);    
            $res->bindParam(':id', $bezoek_exists['id');
            $success = $res->execute();  
            if($success == true) {
                $array['message'] = "De persoonsgegevens van " . $decoded['voorletters'] . " " . $decoded['naam'] ." zijn bijgewerkt.";
            } else {
                $array['errorCode'] = 2;
                $array['message'] = "Het is nu niet mogelijk om de persoonsgegevens te registreren, probeer het later nogmaals.";
            }
        } 

    }    
     
    if ($boat != null && $actionBoat != null) {

        // Check if there is already person with the same name
        $sql = "SELECT id FROM randmeren_boten WHERE naam_boot = :naam_boot AND lengte_boot = :lengte_boot";
        $res=$bdd->prepare($sql);
        $res->bindValue(':naam_boot', $boat['naamBoot']);
        $res->bindValue(':lengte_boot', $boat['lengteBoot']);
        $res->execute();   
        $boat_id=$res->fetch(PDO::FETCH_ASSOC);

        if ($boat_id && $actionBoat == 'create') {
            $array['errorCode'] = 4;
            $array['message'] = "Er bestaat al een boot met exact dezelfde lengte en naam";

        } 
        
        if (!$boat_id && $actionBoat == 'create') {

            $sql = "INSERT INTO randmeren_boten (`naam_boot`, `lengte_boot`, `type_boot`)
            VALUES (:naam_boot,:lengte_boot,:type_boot)";
            $res=$bdd->prepare($sql);
            $res->bindParam(':naam_boot', $user['naamBoot']);
            $res->bindParam(':lengte_boot', $user['lengteBoot']);
            $res->bindParam(':type_boot', $user['typeBoot']);   
            $success = $res->execute();  
            $boat_id = $bdd->lastInsertId();
            if ($success == true) {
                $array['message'] += "\nDe bootgegevens van de boot " . $decoded['naamBoot'] . " zijn opgeslagen.";
                $sql "UPDATE randmeren_users SET boot_id = :boot_id WHERE id = :id";
                $res=$bdd->prepare($sql);
                $res->bindParam(':boot_id', $boat_id);
                $res->bindParam(':id', $user_id);
                $res->execute();
            } else {
                $array['errorCode'] = 3;
                $array['message'] = "Het is nu niet mogelijk om de bootgegevens te registreren, probeer het later nogmaals.";
            }
        }    
    }    

    if ($abo == true && $boat_id != null && $user_id != null) {
        $sql =  "INSERT INTO randmeren_abo_jaar (`abo`, `jaar`, `boot_id`)
        VALUES (:abo,:jaar,:boot_id)";
        $res->bindParam(':abo', $user_id);
        $res->bindParam(':jaar', $jaar);
        $res->bindParam(':boot_id', $boat_id);   
        $success = $res->execute();  
    }
    
    print json_encode($array);  
    $bdd = null;
 
?>