// Функция для сохранения данных из localStorage в JSON файл
function saveLocalStorageToJson() {
    // Получаем данные из localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

    // Создаем Blob с данными
    const jsonData = JSON.stringify(registeredUsers, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });

    // Создаем ссылку для скачивания
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'users.json';

    // Добавляем ссылку в документ и эмулируем клик
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Удаляем ссылку
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(downloadLink.href);
}

// Функция для автоматического сохранения при изменении данных
function setupAutoSave() {
    const originalSetItem = localStorage.setItem;

    localStorage.setItem = function(key, value) {
        originalSetItem.apply(this, arguments);

        // Если изменяются данные пользователей, сохраняем в JSON
        if (key === 'registeredUsers') {
            saveLocalStorageToJson();
        }
    };
}

// Инициализация автосохранения
setupAutoSave();