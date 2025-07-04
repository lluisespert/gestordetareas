<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);
$usuario = trim($data['usuario'] ?? '');
$contrasena = trim($data['contrasena'] ?? '');

if (empty($usuario) || empty($contrasena)) {
    echo json_encode(['error' => 'Datos incompletos']);
    exit();
}

try {
    $conn = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    $stmt = $conn->prepare("SELECT contrasena FROM usuarios WHERE usuario = :usuario");
    $stmt->bindParam(':usuario', $usuario, PDO::PARAM_STR);
    $stmt->execute();

    $hash = $stmt->fetchColumn();

    // Comprobar si el hash tiene el formato de password_hash (60 caracteres y empieza por $2y$)
    if ($hash && strlen($hash) === 60 && strpos($hash, '$2y$') === 0) {
        if (password_verify($contrasena, $hash)) {
            echo json_encode(['existe' => true]);
        } else {
            echo json_encode(['existe' => false]);
        }
    } else {
        // El campo contraseña no es un hash válido
        echo json_encode(['error' => 'La contraseña almacenada no es un hash válido.']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Error al conectar con la base de datos']);
}
?>