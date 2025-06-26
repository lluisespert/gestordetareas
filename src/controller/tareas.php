<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Content-Type: application/json');
require_once 'config.php';

$conexion = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conexion->connect_error) {
    die(json_encode(["error" => "Conexión fallida: " . $conexion->connect_error]));
}

$tareas = [];
$sql = "SELECT id, titulo, descripcion FROM tareas";
$resultado = $conexion->query($sql);

if ($resultado) {
    while ($fila = $resultado->fetch_assoc()) {
        $tareas[] = $fila;
    }
    echo json_encode($tareas);
} else {
    echo json_encode(["error" => "Error en la consulta"]);
}

$conexion->close();
?>