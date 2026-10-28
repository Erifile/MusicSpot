<?php
session_start();

require_once 'database/dbconnect.php';

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MusicSpot | Каталог</title>
    <link rel="stylesheet" href="css/catalog.css">
    <link rel="stylesheet" href="css/colors.css">
    <script src="js/player-core.js" defer></script>
    <script src="js/catalog.js" defer></script>
    <script src="js/theme-switcher.js" defer></script>
</head>
<body>

<header>
    <div class="logo"><h1>Каталог</h1></div>
</header>
    <a href="index.php" class="nav-link">🡨 Главная</a>


    <div class="player-container">
        <div class="now-playing" id="current-title">. . .</div>
        <audio id="audio-player" controls></audio>
    </div>

    

    <!-- Здесь по умолчанию крутится надпись загрузки, а затем весь список -->
    <div id="catalog-list">Загрузка всей медиатеки...</div>

    
    
</body>
</html>