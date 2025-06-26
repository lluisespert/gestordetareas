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

require_once 'config.php';

// Obtener los datos JSON enviados desde el frontend
$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['titulo']) || !isset($input['descripcion'])) {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
    exit;
}

$titulo = $input['titulo'];
$descripcion = $input['descripcion'];

$conexion = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conexion->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Conexión fallida']);
    exit;
}

$stmt = $conexion->prepare("INSERT INTO tareas (titulo, descripcion) VALUES (?, ?)");
$stmt->bind_param("ss", $titulo, $descripcion);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al insertar']);
}

$stmt->close();
$conexion->close();
?>