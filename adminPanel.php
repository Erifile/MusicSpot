<?php session_start();


// if ($_SERVER['REQUEST_METHOD'] !== 'POST')
//     {
//         http_response_code(405);
//         exit();
//     } 
require_once 'database/dbconnect.php';


$sqlCategories = 'SELECT * FROM categories';
$categories = $conn->prepare($sqlCategories);
$categories->execute();

?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MusicSpot | Админ-панель</title>
    <link rel="stylesheet" href="css/adminPanel.css">
    <link rel="stylesheet" href="css/colors.css">
    <script src="js/adminPanel.js" defer></script>
</head>
<body>

  <div class="errors"></div>

  <header>
      <h2>Админ-панель</h2>
      <a href="index.php">На главную</a>
  </header>

  <main>
    <button id="sync-btn">Синхронизировать медиатеку</button>
    <div id="status-output"></div>

    <script>
        const syncBtn = document.getElementById('sync-btn');
        const output = document.getElementById('status-output');

        syncBtn.addEventListener('click', async () => {
            // 1. Меняем состояние кнопки и интерфейса
            syncBtn.disabled = true;
            syncBtn.innerText = 'Идет сканирование...';
            output.style.display = 'block';
            output.innerHTML = '<em>Пожалуйста, подождите, отправка запроса...</em><br>';

            try {
                // 2. Делаем скрытый фоновый запрос к нашему PHP скрипту
                const response = await fetch('php/sync.php');
                
                if (!response.ok) {
                    throw new Error(`Ошибка сервера: ${response.status}`);
                }

                // 3. Получаем текстовый ответ от PHP (тот HTML, что генерирует sync.php)
                const resultText = await response.text();
                
                // 4. Выводим результат в блок логов
                output.innerHTML = resultText;

            } catch (error) {
                output.innerHTML += `<span style="color: #f75a68;">Произошла ошибка: ${error.message}</span>`;
            } finally {
                // 5. Возвращаем кнопку в рабочее состояние
                syncBtn.disabled = false;
                syncBtn.innerText = 'Синхронизировать медиатеку';
            }
        });
    </script>
  </main>
</body>
</html>