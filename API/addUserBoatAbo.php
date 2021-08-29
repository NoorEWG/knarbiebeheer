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
    $user        = $decoded['user'];
    $boat        = $decoded['boat'];
    $abo         = $decoded['abo'];
    $jaar        = $decoded['year'];
    $save_user   = $decoded['saveUser'];
    $save_boat   = $decoded['saveBoat'];
    $save_abo    = $decoded['saveAbo'];
    $update_user = $decoded['updateUser'];
    $update_boat = $decoded['updateBoat'];
    $update_abo  = $decoded['updateAbo'];
   
    $user_id = null;
    $boat_id = null;

    $array['errorCode'] = 0;
    $array['message'] = "";

    if ($user != null && ($save_user || $update_user)) {
        // Check if there is already person with the same name
        $sql = "SELECT id FROM randmeren_users WHERE voorletters = :voorletters AND naam = :naam";
        $res=$bdd->prepare($sql);
        $res->bindValue(':voorletters', $user['voorletters']);
        $res->bindValue(':naam', $user['naam']);
        $res->execute();   
        $user_id=$res->fetch(PDO::FETCH_ASSOC);
      
        if($user_id && $save_user) {
          $array['errorCode'] = 1;
          $array['message'] = "Er bestaat al een persoon met exact dezelfde voorletters en naam";
        } 
        if (!$user_id && $save_user) {
            $sql = "INSERT INTO randmeren_users (`voorletters`, `tussenvoegsel`, `naam`, `telefoon`, `email`, `thuishaven`, `opmerking`)
            VALUES (:voorletters,:tussenvoegsel,:naam,:telefoon,:email,:thuishaven,:opmerking)";
            $res=$bdd->prepare($sql);
            $res->bindParam(':voorletters', $user['voorletters']);
            $res->bindParam(':tussenvoegsel', $user['tussenvoegsel']);
            $res->bindParam(':naam', $user['naam']); 
            $res->bindParam(':telefoon', $user['telefoon']); 
            $res->bindParam(':email', $user['email']);   
            $res->bindParam(':thuishaven', $user['thuishaven']);    
            $res->bindParam(':opmerking', $user['opmerking']);    
            $success = $res->execute();  
            $user_id = $bdd->lastInsertId();

            if($success == true) {
                $array['message'] = "De persoonsgegevens van " . $decoded['voorletters'] . " " . $decoded['naam'] ." zijn opgeslagen.";
            } else {
                $array['errorCode'] = 2;
                $array['message'] = "Het is nu niet mogelijk om de persoonsgegevens te registreren, probeer het later nogmaals.";
            }
        }
        if ($user_id && $update_user) {
            $sql = "UPDATE randmeren_users (`voorletters`, `tussenvoegsel`, `naam`, `telefoon`, `email`, `thuishaven`)
            SET (:voorletters,:tussenvoegsel,:naam,:telefoon,:email,:thuishaven) WHERE id = :id";
            $res=$bdd->prepare($sql);
            $res->bindParam(':voorletters', $user['voorletters']);
            $res->bindParam(':tussenvoegsel', $user['tussenvoegsel']);
            $res->bindParam(':naam', $user['naam']); 
            $res->bindParam(':email', $user['email']);   
            $res->bindParam(':thuishaven', $user['thuishaven']);    
            $res->bindParam(':id', $user_id['id']);
            $success = $res->execute();  
            if($success == true) {
                $voorletters = $user['voorletters'] == null ?  "" : $user['voorletters'] . " ";
                $tussenvoegsel = $user['tussenvoegsel'] == null ?  "" : $user['tussenvoegsel'] . " ";
                $array['message'] = "De persoonsgegevens van " . $voorletters . $tussenvoegsel . $user['naam'] ." zijn bijgewerkt.";
            } else {
                $array['errorCode'] = 3;
                $array['message'] = "Het is nu niet mogelijk om de persoonsgegevens bij te werken, probeer het later nogmaals.";
            }
        } 
    }    
     
    if ($boat != null && ($save_boat || $update_boat)) {

        // Check if there is already person with the same name
        $sql = "SELECT id FROM randmeren_boten WHERE naam_boot = :naam_boot AND lengte_boot = :lengte_boot";
        $res=$bdd->prepare($sql);
        $res->bindValue(':naam_boot', $boat['naamBoot']);
        $res->bindValue(':lengte_boot', $boat['lengteBoot']);
        $res->execute();   
        $boat_id=$res->fetch(PDO::FETCH_ASSOC);

        if ($boat_id && $save_boat) {
            $array['errorCode'] = 4;
            $array['message'] = "Er bestaat al een boot met exact dezelfde lengte en naam";

        } 
        
        if (!$boat_id && $save_boat) {

            $sql = "INSERT INTO randmeren_boten (`naam_boot`, `lengte_boot`, `type_boot`)
            VALUES (:naam_boot,:lengte_boot,:type_boot)";
            $res=$bdd->prepare($sql);
            $res->bindParam(':naam_boot', $boat['naamBoot']);
            $res->bindParam(':lengte_boot', $boat['lengteBoot']);
            $res->bindParam(':type_boot', $boat['typeBoot']);   
            $success = $res->execute();  
            $boat_id = $bdd->lastInsertId(); 
            if ($success == true) {
                $array['message'] += "\nDe bootgegevens van de boot " . $boat['naamBoot'] . " zijn opgeslagen.";
                $sql = "UPDATE randmeren_users SET boot_id = :boot_id WHERE id = :id";
                $res=$bdd->prepare($sql);
                $res->bindParam(':boot_id', $boat_id['id']);
                $res->bindParam(':id', $user_id['id']);
                $res->execute();
            } else {
                $array['errorCode'] = 5;
                $array['message'] = "Het is nu niet mogelijk om de bootgegevens te registreren, probeer het later nogmaals.";
            }
        }    

        if ($boat_id && $update_boat) {
            $type_boat = $boat['typeBoot'];
            var_dump($type_boat);
            $sql = "UPDATE randmeren_boten SET `naam_boot` = :naam_boot, `lengte_boot` = :lengte_boot, 
            `type_boot` = :type_boot)";
            $res=$bdd->prepare($sql);
            $res->bindParam(':naam_boot', $boat['naamBoot']);
            $res->bindParam(':lengte_boot', $boat['lengteBoot']);
            $res->bindParam(':type_boot', $boat['typeBoot']['id']);   
            $success = $res->execute();  
            $boat_id = $bdd->lastInsertId(); 
            if ($success == true) {
                $array['message'] .= "De bootgegevens van de boot " . $boat['naamBoot'] . " zijn bijgewerkt.";
                $sql = "UPDATE randmeren_users SET boot_id = :boot_id WHERE id = :id";
                $res=$bdd->prepare($sql);
                $res->bindParam(':boot_id', $boat_id);
                $res->bindParam(':id', $user_id);
                $res->execute();
            } else {
                $array['errorCode'] = 6;
                $array['message'] = "Het is nu niet mogelijk om de bootgegevens bij te werken, probeer het later nogmaals.";
            }
        }    
    }    

    if ($save_abo == true && $boat_id != null && $user_id != null) {
        $sql =  "INSERT INTO randmeren_abo_jaar (`abo`, `jaar`, `boot_id`)
        VALUES (:abo,:jaar,:boot_id)";
        $res->bindParam(':abo', $user_id);
        $res->bindParam(':jaar', $jaar);
        $res->bindParam(':boot_id', $boat_id);   
        $success = $res->execute();  
    }

    if ($update_abo == true && $boat_id != null && $user_id != null) {
        // TODO 
    }
    
    print json_encode($array);  
    $bdd = null;
 
?>