<?php

	include("../../includes/constants.php");
    header("Access-Control-Allow-Origin: *");
	$bdd = new PDO("mysql:dbname=" . DATABASE . ";host=" . SERVER, USERNAME, PASSWORD);
  
    $year = $_GET["year"];

    $sql = "SELECT 
    u.id,
	u.voorletters, 
    u.tussenvoegsel, 
    u.naam,
    u.telefoon_nummer AS telefoon,
    u.email, 
    b.id AS bootId,
    b.naam_boot AS boot, 
    b.lengte_boot AS lengte, 
    t.type,
    u.thuishaven,
    u.opmerking
    FROM `randmeren_abo_jaar`a  
    LEFT JOIN `randmeren_users` u ON a.abo = u.id
    LEFT JOIN `randmeren_boten` b ON u.boot_id = b.id
    LEFT JOIN `randmeren_type_boot` t ON b.type_boot = t.id
    WHERE a.jaar =:jaar
    AND u.id IS NOT NULL
    ORDER BY b.naam_boot";
    $res=$bdd->prepare($sql);
    $res->bindParam(':jaar', $year, PDO::PARAM_INT);
    $res->execute();   
    $all_abo_data=$res->fetchAll(PDO::FETCH_ASSOC);   
    print_r($all_abo_data);
    print json_encode($all_abo_data);
	$bdd = null;
	
?>