document.write('<script src="js/player-core.js"></script>');

const catalogList = document.getElementById('catalog-list');

// Базовая папка, которую нужно отрезать от путей, чтобы дерево начиналось красиво
const rootPath = 'C:/Users/Админ/Desktop/Music/'; 

async function loadFolderCatalog() {
    try {
        const response = await fetch('../php/get_tracks.php');
        const tracks = await response.json();
        
        if (tracks.error) {
            catalogList.innerText = "Ошибка: " + tracks.error;
            return;
        }

        // 1. Строим древовидную структуру из плоского списка путей
        // const fileTree = {};

        // tracks.forEach(track => {
        //     // Отрезаем корневой путь: "C:/Users/.../Music/Rock/Song.mp3" -> "Rock/Song.mp3"
        //     let relativePath = track.file_path.replace(rootPath, '');
        //     // Разбиваем путь на массив папок и имя файла
        //     const parts = relativePath.split('/'); 
            
        //     let currentLevel = fileTree;

        //     // Идем по всем элементам пути, кроме последнего (самого файла)
        //     for (let i = 0; i < parts.length - 1; i++) {
        //         const folderName = parts[i];
        //         if (!currentLevel[folderName]) {
        //             currentLevel[folderName] = { _dirs: {}, _files: [] };
        //         }
        //         currentLevel = currentLevel[folderName]._dirs;
        //     }

        //     // В конечную точку записываем сам трек со всеми данными из БД
        //     const fileName = parts[parts.length - 1];
            
        //     // Если трек лежал прямо в корне музыкальной папки
        //     if (parts.length === 1) {
        //         if (!fileTree._files) fileTree._files = [];
        //         fileTree._files.push({ name: fileName, data: track });
        //     } else {
        //         // Если лежал внутри подпапок, то currentLevel указывает на родительскую папку
        //         // Но нам нужно подняться на уровень выше объекта _dirs, чтобы положить файл в родителя
        //         // Для простоты найдем родителя в дереве заново или запишем в массив файлов текущей папки:
        //     }
        // });

        // Альтернативный чистый способ сборки дерева папок и файлов:
        const tree = { dirs: {}, files: [] };
        
        tracks.forEach(track => {
            let rel = track.file_path.replace(rootPath, '');
            let parts = rel.split('/');
            let current = tree;

            for (let i = 0; i < parts.length - 1; i++) {
                let d = parts[i];
                if (!current.dirs[d]) {
                    current.dirs[d] = { dirs: {}, files: [] };
                }
                current = current.dirs[d];
            }
            current.files.push({ name: parts[parts.length - 1], data: track });
        });

        catalogList.innerHTML = ''; 
        
        // 2. Рендерим получившееся дерево на экран
        renderTree(tree, catalogList);

    } catch (e) {
        catalogList.innerText = "Ошибка генерации проводника.";
        console.error(e);
    }
}

// Рекурсивная функция для отрисовки дерева в HTML
function renderTree(node, container) {
    // Сначала отрисовываем все папки на текущем уровне
    for (const folderName in node.dirs) {
        const folderWrapper = document.createElement('div');
        folderWrapper.className = 'folder-wrapper';

        const folderTitle = document.createElement('div');
        folderTitle.className = 'folder-title';
        folderTitle.innerText = folderName;

        const folderContent = document.createElement('div');
        folderContent.className = 'folder-content';

        // Клик по папке раскрывает/скрывает её содержимое
        folderTitle.addEventListener('click', (e) => {
            e.stopPropagation(); // Чтобы клик не улетал к родительским папкам
            folderTitle.classList.toggle('open');
            folderContent.classList.toggle('open');
        });

        // Рекурсивно уходим вглубь этой папки
        renderTree(node.dirs[folderName], folderContent);

        folderWrapper.appendChild(folderTitle);
        folderWrapper.appendChild(folderContent);
        container.appendChild(folderWrapper);
    }

    // Затем отрисовываем все файлы на текущем уровне
    node.files.forEach(file => {
        const trackDiv = document.createElement('div');
        trackDiv.className = 'track-item';
        
        // Если теги нормальные — пишем Артист - Название, иначе — просто имя файла
        if (file.data.artist !== 'Неизвестный исполнитель') {
            trackDiv.innerHTML = `<b>${file.data.artist}</b> - ${file.data.title}`;
        } else {
            trackDiv.innerText = file.name;
        }

        // Клик по файлу запускает музыку через player-core.js
        trackDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            playTrack(file.data);
        });

        container.appendChild(trackDiv);
    });
}

loadFolderCatalog();
