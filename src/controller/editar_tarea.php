<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir la configuración de la base de datos (debe definir $mysqli)
require_once 'config.php';

// Recibir datos JSON
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id']) || !isset($data['titulo']) || !isset($data['descripcion'])) {
    echo json_encode(['success' => false, 'error' => 'Datos incompletos']);
    exit();
}

$id = intval($data['id']);
$titulo = $data['titulo'];
$descripcion = $data['descripcion'];

// Usar la variable $mysqli definida en config.php
$conexion = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conexion->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Conexión fallida']);
    exit;
}


$stmt = $conexion->prepare("UPDATE tareas SET titulo = ?, descripcion = ? WHERE id = ?");
$stmt->bind_param("ssi", $titulo, $descripcion, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'No se pudo actualizar la tarea']);
}

$stmt->close();
$mysqli->close();
?>