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
    $sql = "UPDATE tareas SET completada = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $estado = $completada ? 1 : 0;
    $stmt->bind_param("ii", $estado, $id);
    if ($stmt->execute()) {
      $response['success'] = true;
      $response['completada'] = $estado;
    } else {
      $response['success'] = false;
      $response['error'] = "Error al actualizar la tarea.";
    }
    $stmt->close();
    $conn->close();
  }
} else {
  $response['success'] = false;
  $response['error'] = "ID inválido.";
}

// ✅ Respuesta JSON
echo json_encode($response);
?>
