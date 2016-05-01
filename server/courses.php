<?php
header("Access-Control-Allow-Origin: *");

$user = 'root';
$password = 'root';
$db = 'inventory';
$host = 'localhost';
$port = 8889;

$link = mysqli_init();
$success = mysqli_real_connect(
   $link, 
   $host, 
   $user, 
   $password, 
   $db,
   $port
);

echo '[{"id": 0, "name": "cs101"}, {"id": 1, "name": "cs102"}]';
?>
