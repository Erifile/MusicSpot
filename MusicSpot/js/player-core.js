// js/player-core.js
const audioPlayer = document.getElementById('audio-player');
const currentTitle = document.getElementById('current-title');

// Настройки путей к вашей музыке
const baseMusicPath = 'C:/Users/Админ/Desktop/Music/'; 
const webMusicPath = 'tracks_media/';

// Общая функция для запуска трека
function playTrack(track) {
    let webUrl = track.file_path.replace(baseMusicPath, webMusicPath);
    audioPlayer.src = webUrl;
    audioPlayer.play();
    currentTitle.innerText = `${track.artist} - ${track.title}`;
}
