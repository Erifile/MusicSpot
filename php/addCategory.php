<?php

session_start();

require_once '../database/dbconnect.php';


// Защита от перехода к этому обработчику через Адрс. строку
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit();
}


$categoryName = trim($_POST['addCategoryName']); 

$stmt = $conn -> prepare("INSERT INTO categories (title) VALUES (:categoryName)");
$stmt -> execute
(
  [
  ":categoryName" => $categoryName
  ]
);

$_SESSION['adminMessage'] = "Категория ".$categoryName." добавлена.";
header("Location:../adminPanel.php");
exit();

