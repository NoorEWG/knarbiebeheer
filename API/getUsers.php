<?php

	include("../../includes/constants.php");
    header("Access-Control-Allow-Origin: *");
	$bdd = new PDO("mysql:dbname=" . DATABASE . ";host=" . SERVER, USERNAME, PASSWORD);
  
    $year = $_GET["year"];

    $sql = "SELECT 
    ra.id,
	voorletters, 
    tussenvoegsel, 
    naam,
    telefoon_nummer AS telefoon,
    email, 
    thuishaven,
    opmerking,
    ra.boot_id AS bootId,
    CASE
    	WHEN tussenvoegsel IS NULL AND voorletters IS NOT NULL THEN
    		CONCAT(voorletters, ' ', naam) 
    	WHEN tussenvoegsel IS NULL AND voorletters IS NULL THEN 
    	    naam
    	ELSE
    	    CONCAT(voorletters, ' ', tussenvoegsel, ' ', naam)
    END AS naamCompleet,
    CASE 
        WHEN raj.id IS NULL THEN 
            false
        ELSE
            true
    END AS hasAboCurrentYear              
    FROM `randmeren_users` ra
    LEFT JOIN `randmeren_abo_jaar` raj ON ra.id = raj.abo AND raj.jaar = :jaar  
    ORDER BY naam";
    $res=$bdd->prepare($sql);
    $res->bindParam(':jaar', $year);  
    $res->execute();   
    $data=$res->fetchAll(PDO::FETCH_ASSOC);   
    print json_encode($data);
	$bdd = null;
	
?>