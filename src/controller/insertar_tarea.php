<?php
// Encabezados CORS
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once 'config.php';

// Obtener los datos enviados por JSON desde el frontend
$input = json_decode(file_get_contents("php://input"), true);

// Validar existencia de claves
$titulo = $input["titulo"] ?? '';
$descripcion = $input["descripcion"] ?? '';
$fecha_vencimiento = $input["fecha_vencimiento"] ?? '';

if (empty($titulo) || empty($descripcion) || empty($fecha_vencimiento)) {
    echo json_encode([
        "success" => false,
        "message" => "Todos los campos son obligatorios."
    ]);
    exit;
}

// Crear conexión
$conexion = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conexion->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Conexión fallida: " . $conexion->connect_error
    ]);
    exit;
}

// Convertir fecha ISO a formato MySQL (Y-m-d H:i:s)
$fecha_mysql = date("Y-m-d H:i:s", strtotime($fecha_vencimiento));

// Preparar consulta segura
$stmt = $conexion->prepare("
    INSERT INTO tareas (titulo, descripcion, fecha_vencimiento, completada)
    VALUES (?, ?, ?, 0)
");
$stmt->bind_param("sss", $titulo, $descripcion, $fecha_mysql);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Error al insertar la tarea."
    ]);
}

$stmt->close();
$conexion->close();