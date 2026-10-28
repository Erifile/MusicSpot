// Установка темы
function setTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if (document.getElementById('themeToggle')) {
            document.getElementById('themeToggle').checked = true;
        }
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        if (document.getElementById('themeToggle')) {
            document.getElementById('themeToggle').checked = false;
        }
    }
}

// Функция для переключения темы
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Проверка сохранённой темы при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('themeToggle');
    
    if (savedTheme === 'dark') {
        setTheme('dark');
    } else {
        setTheme('light');
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('change', toggleTheme);
    }
});

// Следим за системными настройками
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkModeMediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});