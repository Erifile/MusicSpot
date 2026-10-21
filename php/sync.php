<?php
// Выставляем настройки, чтобы скрипт не упал, если музыки ОЧЕНЬ много
ini_set('max_execution_time', 300); // 5 минут на сканирование
ini_set('memory_limit', '512M');

// Подключаем библиотеку getID3 для чтения тегов из MP3
// Скачайте её и положите папку getid3 в корень проекта
require_once('../getID3-master/getid3/getid3.php');
$getID3 = new getID3;

// --- 1. НАСТРОЙКА ПУТЕЙ ---
// Укажите абсолютный путь к вашей папке с музыкой (где папки в папках)
$musicDirectory = 'C:\Users\Админ\Desktop\Music'; 

// Имя файла базы данных SQLite (создастся само в папке со скриптом)
$dbFile = 'media_library.sqlite';


// --- 2. ПОДКЛЮЧЕНИЕ И НАСТРОЙКА БД ---
try {
    // Подключаемся к SQLite. Если файла нет, PHP создаст его автоматически
    $db = new PDO("sqlite:" . $dbFile);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Создаем таблицу треков с потенциалом на будущее (текст, лайки, счетчик)
    $db->exec("CREATE TABLE IF NOT EXISTS tracks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_path TEXT UNIQUE,       -- Уникальный путь к файлу (чтобы не было дублей)
        title TEXT,                  -- Название песни
        artist TEXT,                 -- Исполнитель
        album TEXT,                  -- Альбом
        duration_sec INTEGER,        -- Длительность в секундах
        lyrics TEXT DEFAULT '',      -- Текст песни
        plays_count INTEGER DEFAULT 0 -- Счетчик прослушиваний
    )");
} catch (PDOException $e) {
    die("Ошибка базы данных: " . $e->getMessage());
}


// --- 3. РЕКУРСИВНЫЙ ОБХОД ПАПОК ---
echo "<h2>Синхронизация медиатеки запущена...</h2>";
flush(); // Выводим текст в браузер сразу, не дожидаясь конца скрипта

if (!is_dir($musicDirectory)) {
    die("Ошибка: Указанная папка с музыкой не найдена!");
}

// Создаем "умный" итератор, который будет ходить по всем вложенным папкам
$directoryIterator = new RecursiveDirectoryIterator($musicDirectory, RecursiveDirectoryIterator::SKIP_DOTS);
$iterator = new RecursiveIteratorIterator($directoryIterator);

$addedCount = 0;
$skippedCount = 0;

// Готовим SQL-запросы заранее для высокой скорости работы
$checkStmt = $db->prepare("SELECT id FROM tracks WHERE file_path = :file_path");
$insertStmt = $db->prepare("INSERT INTO tracks (file_path, title, artist, album, duration_sec) 
                            VALUES (:file_path, :title, :artist, :album, :duration_sec)");

// Начинаем перебор всех найденных файлов
foreach ($iterator as $fileInfo) {
    // Нас интересуют только файлы с расширением mp3
    if (strtolower($fileInfo->getExtension()) === 'mp3') {
        
        // Получаем чистый полный путь к файлу на компьютере
        $filePath = str_replace('\\', '/', $fileInfo->getRealPath());

        // Проверяем: может этот файл уже занесен в базу данных?
        $checkStmt->execute([':file_path' => $filePath]);
        if ($checkStmt->fetch()) {
            $skippedCount++;
            continue; // Файл уже есть, пропускаем его и идем к следующему
        }

        // --- 4. ЧТЕНИЕ ID3 ТЕГОВ ИЗ ФАЙЛА ---
        $fileInfoData = $getID3->analyze($filePath);
        getid3_lib::CopyTagsToComments($fileInfoData); // Нормализуем теги

        // Вытаскиваем название (если тега нет, берем просто имя файла без .mp3)
        $title = !empty($fileInfoData['comments_html']['title'][0]) 
            ? $fileInfoData['comments_html']['title'][0] 
            : $fileInfo->getBasename('.mp3');

        // Вытаскиваем артиста (если нет тега, пишем "Неизвестный исполнитель")
        $artist = !empty($fileInfoData['comments_html']['artist'][0]) 
            ? $fileInfoData['comments_html']['artist'][0] 
            : 'Неизвестный исполнитель';

        // Вытаскиваем альбом
        $album = !empty($fileInfoData['comments_html']['album'][0]) 
            ? $fileInfoData['comments_html']['album'][0] 
            : '';

        // Вытаскиваем длительность трека в секундах (округляем до целого)
        $duration = !empty($fileInfoData['playtime_seconds']) 
            ? round($fileInfoData['playtime_seconds']) 
            : 0;

        // --- 5. ЗАПИСЬ В БАЗУ ДАННЫХ ---
        try {
            $insertStmt->execute([
                ':file_path'    => $filePath,
                ':title'        => htmlspecialchars_decode($title),
                ':artist'       => htmlspecialchars_decode($artist),
                ':album'        => htmlspecialchars_decode($album),
                ':duration_sec' => $duration
            ]);
            $addedCount++;
            
            // Выводим в реальном времени, что нашли (для красоты в админке)
            echo "Добавлено: <b>{$artist}</b> — {$title}<br>";
            flush();
        } catch (PDOException $e) {
            echo "Ошибка добавления файла {$filePath}: " . $e->getMessage() . "<br>";
        }
    }
}

// --- 6. ИТОГ РАБОТЫ ---
echo "<h3>Синхронизация успешно завершена!</h3>";
echo "Добавлено новых песен: <b>{$addedCount}</b><br>";
echo "Пропущено (уже были в базе): <b>{$skippedCount}</b><br>";
?>
