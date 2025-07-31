<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Content-Type: application/json');
require_once 'config.php';

$conexion = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conexion->connect_error) {
    die(json_encode(["error" => "Conexión fallida: " . $conexion->connect_error]));
}

$tareas = [];

$sql = "SELECT id, titulo, descripcion, fecha_vencimiento, completada FROM tareas";
$resultado = $conexion->query($sql);

if ($resultado) {
    while ($fila = $resultado->fetch_assoc()) {
        // Formato ISO para compatibilidad JS
        $fecha_iso = date("Y-m-d\TH:i:s", strtotime($fila["fecha_vencimiento"]));

        $tareas[] = [
            "id" => intval($fila["id"]),
            "titulo" => $fila["titulo"],
            "descripcion" => $fila["descripcion"],
            "fecha_vencimiento" => $fecha_iso,
            "completada" => boolval($fila["completada"])
        ];
    }
    echo json_encode($tareas, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} else {
    echo json_encode(["error" => "Error en la consulta"]);
}

$conexion->close();
?>