<?php 

$host = "mysql:host=localhost;dbname=musicspot;charset=utf8";
$user = "root";
$pass = "";
$dbErrMode = [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION];

try
{
    $conn = new PDO($host, $user, $pass, $dbErrMode);
} catch(PDOException $e)
{
    echo "Ошибка подключения к базе данных. ".$e->getMessage();
}
