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

    // Comprobar si el usuario ya existe
    $stmt = $conn->prepare("SELECT COUNT(*) FROM usuarios WHERE usuario = :usuario");
    $stmt->bindParam(':usuario', $usuario, PDO::PARAM_STR);
    $stmt->execute();
    if ($stmt->fetchColumn() > 0) {
        echo json_encode(['error' => 'El usuario ya existe']);
        exit();
    }

    // Insertar el nuevo usuario con la contraseña hasheada
    $hash = password_hash($contrasena, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO usuarios (usuario, contrasena) VALUES (:usuario, :contrasena)");
    $stmt->bindParam(':usuario', $usuario, PDO::PARAM_STR);
    $stmt->bindParam(':contrasena', $hash, PDO::PARAM_STR);
    $stmt->execute();

    echo json_encode(['registrado' => true]);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Error al conectar con la base de datos']);
}
?>