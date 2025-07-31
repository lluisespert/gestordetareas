<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once 'config.php';

$input = json_decode(file_get_contents("php://input"), true);

$id = intval($input["id"] ?? 0);
$titulo = $input["titulo"] ?? '';
$descripcion = $input["descripcion"] ?? '';
$fecha_vencimiento = $input["fecha_vencimiento"] ?? '';

if ($id === 0 || empty($titulo) || empty($descripcion) || empty($fecha_vencimiento)) {
    echo json_encode(["success" => false, "message" => "Datos incompletos para editar."]);
    exit;
}

$conexion = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conexion->connect_error) {
    echo json_encode(["success" => false, "message" => "Conexión fallida: " . $conexion->connect_error]);
    exit;
}

$fecha_mysql = date("Y-m-d H:i:s", strtotime($fecha_vencimiento));

$stmt = $conexion->prepare("UPDATE tareas SET titulo = ?, descripcion = ?, fecha_vencimiento = ? WHERE id = ?");
$stmt->bind_param("sssi", $titulo, $descripcion, $fecha_mysql, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Error al editar tarea."]);
}

$stmt->close();
$conexion->close();
?>