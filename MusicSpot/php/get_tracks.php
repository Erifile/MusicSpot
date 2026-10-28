<?php
// Указываем браузеру, что этот скрипт отдает данные в формате JSON
header('Content-Type: application/json');

$dbFile = __DIR__ . '/media_library.sqlite';

try {
    // Подключаемся к нашей созданной SQLite базе
    $db = new PDO("sqlite:" . $dbFile);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Достаем все треки из базы
    $stmt = $db->query("SELECT id, title, artist, album, duration_sec, file_path FROM tracks");
    $tracks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Превращаем массив PHP в JSON-строку и выводим её
    echo json_encode($tracks, JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    // Если что-то пошло не так, отдаем ошибку
    echo json_encode(['error' => $e->getMessage()]);
}
