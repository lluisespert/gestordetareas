<?php
// ✅ Encabezados CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// ✅ Manejo de preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

// ✅ Recibir datos
$data = json_decode(file_get_contents("php://input"), true);
$id = isset($data['id']) ? intval($data['id']) : 0;
$completada = isset($data['completada']) ? (bool)$data['completada'] : false;

$response = [];

if ($id > 0) {
  require_once 'config.php';
  $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
  if ($conn->connect_error) {
    $response['success'] = false;
    $response['error'] = "Error de conexión.";
  } else {
    // 🔍 Consultamos el estado anterior
    $sql_select = "SELECT titulo, descripcion, completada FROM tareas WHERE id = ?";
    $stmt_select = $conn->prepare($sql_select);
    $stmt_select->bind_param("i", $id);
    $stmt_select->execute();
    $resultado = $stmt_select->get_result();
    $tarea = $resultado->fetch_assoc();
    $stmt_select->close();

    if (!$tarea) {
      $response['success'] = false;
      $response['error'] = "Tarea no encontrada.";
    } else {
      // ✅ Si pasa de incompleta a completada, enviamos correo
      $estado_anterior = boolval($tarea['completada']);
      $estado_nuevo = $completada;

      if (!$estado_anterior && $estado_nuevo) {
        $to = "espertcuquerellalluis@gmail.com"; 
        $subject = "Tarea completada";
        $message = "La tarea '{$tarea["titulo"]}' ha sido marcada como completada.\nDescripción: {$tarea["descripcion"]}";
        $headers = "From: notificaciones@tuservidor.com";
        mail($to, $subject, $message, $headers);
      }

      // 🔄 Actualizamos el estado
      $sql_update = "UPDATE tareas SET completada = ? WHERE id = ?";
      $stmt_update = $conn->prepare($sql_update);
      $estado = $completada ? 1 : 0;
      $stmt_update->bind_param("ii", $estado, $id);
      if ($stmt_update->execute()) {
        $response['success'] = true;
        $response['completada'] = $estado;
      } else {
        $response['success'] = false;
        $response['error'] = "Error al actualizar la tarea.";
      }
      $stmt_update->close();
    }

    $conn->close();
  }
} else {
  $response['success'] = false;
  $response['error'] = "ID inválido.";
}

// ✅ Respuesta JSON
echo json_encode($response);