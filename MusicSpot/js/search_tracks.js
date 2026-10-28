const tracksList = document.getElementById('tracks-list');
const searchInput = document.getElementById('search-input');

let allTracks = []; 


async function initSearch() {
    try {
        const response = await fetch('../php/get_tracks.php');
        allTracks = await response.json();
    } catch (e) {
        console.error("Ошибка загрузки базы для поиска:", e);
    }
}

function renderSearchResults(tracksToDisplay) {
    tracksList.innerHTML = ''; 

    // Если поле поиска пустое — скрываем окошко и выходим
    if (searchInput.value.trim() === '') {
        tracksList.classList.remove('show');
        return;
    }

    // Если ничего не нашли
    if (tracksToDisplay.length === 0) {
        tracksList.innerHTML = '<div style="padding: 15px; color: #a8a8b3;">Ничего не найдено</div>';
        tracksList.classList.add('show');
        return;
    }

    // Если треки есть — добавляем класс show, чтобы открыть окошко
    tracksList.classList.add('show');

    tracksToDisplay.forEach(track => {
        const div = document.createElement('div');
        div.className = 'track-item';
        div.innerHTML = `<b>${track.artist}</b> - ${track.title}`;
        
        div.addEventListener('click', () => {
            playTrack(track); // Функция вызвана из player-core.js
        });

        tracksList.appendChild(div);
    });
}


// Скрытие/Показывание списка поиска

    document.addEventListener('click', (e) => {
        // Если кликнули МИМО инпута и МИМО самого списка — закрываем его
        if (e.target !== searchInput && e.target !== tracksList) {
        tracksList.style.display = 'none';
        }
    });

    searchInput.addEventListener('input', (event) => {
        const query = event.target.value.toLowerCase().trim();

        if (query === '') {
            tracksList.innerHTML = '';
            tracksList.style.display = 'none'; // Скрываем, если инпут стерли
            return;
        }

        const filtered = allTracks.filter(track => 
            track.artist.toLowerCase().includes(query) || 
            track.title.toLowerCase().includes(query)
        );

        renderSearchResults(filtered);
    });
    searchInput.addEventListener('click', (e) =>
        {
            tracksList.style.display = 'block';
        })


initSearch();

