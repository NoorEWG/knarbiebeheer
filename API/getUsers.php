<?php

	include("../../includes/constants.php");
    header("Access-Control-Allow-Origin: *");
	$bdd = new PDO("mysql:dbname=" . DATABASE . ";host=" . SERVER, USERNAME, PASSWORD);
  
    $year = $_GET["year"];

    $sql = "SELECT 
    id,
	voorletters, 
    tussenvoegsel, 
    naam,
    telefoon_nummer AS telefoon,
    email, 
    thuishaven,
    opmerking,
    CASE
    	WHEN tussenvoegsel IS NULL AND voorletters IS NOT NULL THEN
    		CONCAT(voorletters, ' ', naam) 
    	WHEN tussenvoegsel IS NULL AND voorletters IS NULL THEN 
    	    naam
    	ELSE
    	    CONCAT(voorletters, ' ', tussenvoegsel, ' ', naam)
    END AS naamCompleet
    FROM `randmeren_users`   
    ORDER BY naam";
    $res=$bdd->prepare($sql);
    $res->execute();   
    $data=$res->fetchAll(PDO::FETCH_ASSOC);   
    print json_encode($data);
	$bdd = null;
	
?>