

let allTracks = []; 

async function loadCatalog() {
    try {
        const response = await fetch('../php/get_tracks.php');
        allTracks = await response.json();
        
        if (allTracks.error) {
            catalogList.innerText = "Ошибка: " + allTracks.error;
            return;
        }

        // В каталоге мы РЕНДЕРИМ ВСЁ СРАЗУ при загрузке страницы
        renderCatalog(allTracks);

    } catch (e) {
        catalogList.innerText = "Ошибка подключения к серверу.";
    }
}

function renderCatalog(tracksToDisplay) {
    catalogList.innerHTML = ''; 

    if (tracksToDisplay.length === 0) {
        catalogList.innerHTML = '<div style="color: #a8a8b3;">В каталоге ничего не найдено</div>';
        return;
    }

    tracksToDisplay.forEach(track => {
        const div = document.createElement('div');
        div.className = 'track-item';
        div.innerHTML = `<b>${track.artist}</b> - ${track.title}`;
        
        div.addEventListener('click', () => {
            playTrack(track);
        });

        catalogList.appendChild(div);
    });
}

// // Поиск внутри каталога просто фильтрует изначальный массив
// catalogSearch.addEventListener('input', (event) => {
//     const query = event.target.value.toLowerCase().trim();

//     const filtered = allTracks.filter(track => 
//         track.artist.toLowerCase().includes(query) || 
//         track.title.toLowerCase().includes(query)
//     );

//     renderCatalog(filtered);
// });

// loadCatalog();