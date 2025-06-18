<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json');

// Manejar preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

$usuario = $data['usuario'] ?? '';
$contrasena = $data['contrasena'] ?? '';

$conn = new mysqli("localhost", "root", "", "gestor_tareas");
if ($conn->connect_error) {
    echo json_encode(['existe' => false]);
    exit;
}

$stmt = $conn->prepare("SELECT contraseña FROM usuarios WHERE usuario = ?");
$stmt->bind_param("s", $usuario);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->bind_result($hash);
    $stmt->fetch();
    if (password_verify($contrasena, $hash)) {
        echo json_encode(['existe' => true]);
    } else {
        echo json_encode(['existe' => false]);
    }
} else {
    echo json_encode(['existe' => false]);
}

$stmt->close();
$conn->close();
?>