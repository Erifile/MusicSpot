<?php

session_start();

require_once '../database/dbconnect.php';

// Защита от перехода к этому обработчику через Адрс. строку
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit();
}



// name СЕЛЕКТА, но хранит значение value из выбранной ОПЦИИ
$categoryName = $_POST['delCategory'];

$stmt = $conn -> prepare("DELETE FROM categories WHERE title = :categoryName");
$stmt -> execute
(
  [
  ":categoryName" => $categoryName
  ]
);

//сложно в реализации, не имеет смысла.. т.к id уникальны должны быть:
//$returnAutoIncrement = $conn -> ("ALTER TABLE categories AUTO_INCREMENT = ")

$_SESSION['adminMessage'] = "Категория ".$categoryName." удалена.";
header("Location:../adminPanel.php");
exit();