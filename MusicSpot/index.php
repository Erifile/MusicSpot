<?php
session_start(); 
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MusicSpot | Главная</title>
    <link rel="stylesheet" href="css/indexStyle.css">
    <link rel="stylesheet" href="css/colors.css">
    <script src="js/player-core.js" defer></script>
    <script src="js/search_tracks.js" defer></script>
    <script src="js/theme-switcher.js" defer></script>
</head>
<body>
<div class="links">
    <a href="adminPanel.php">🡪 Админ-панель</a>
    <a href="catalog.php">🡪 Каталог</a>
</div>

    
    <div class="search-wrapper">
        <input type="text" id="search-input" class="search-box">
        <div id="tracks-list" class="dropdown-list"></div>
    </div>
       

    <div class="player-container">
        
        <!-- Блок визуализатора (70vh) -->
        <div class="visualizer-container">
            <!-- Фоновое видео/фото (пока скрыто) -->
            <video id="bg-video" autoplay loop muted></video>
            <img id="bg-image" src="" alt="">
            
            <!-- Сам холст визуализации -->
            <canvas id="visualizer"></canvas>
        </div>

        <!-- Управление плеером -->
        <div class="player-controls">
            <div class="now-playing" id="current-title">. . .</div>
            <audio id="audio-player" controls crossorigin="anonymous"></audio>
        </div>

    </div>
    

    

    
</body>
</html>