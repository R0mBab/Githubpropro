<?php
header('Content-Type: application/json');

try {
    // Получаем данные из POST-запроса
    $inputData = json_decode(file_get_contents('php://input'), true);

    if ($inputData === null) {
        throw new Exception('Invalid JSON data');
    }

    // Путь к файлу users.json
    $filePath = 'users.json';

    // Сохраняем данные в файл
    $success = file_put_contents($filePath, json_encode($inputData, JSON_PRETTY_PRINT));

    if ($success === false) {
        throw new Exception('Failed to write to file');
    }

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>