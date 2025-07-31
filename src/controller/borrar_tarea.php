<?php
// ✅ Encabezados para permitir CORS (durante desarrollo)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// ✅ Manejo de solicitud preliminar (preflight request)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

// ✅ Obtener los datos enviados desde React
$data = json_decode(file_get_contents("php://input"), true);
$id = isset($data['id']) ? intval($data['id']) : 0;

$response = [];

if ($id > 0) {
  // ⚙️ Conexión con la base de datos
  require_once 'config.php';
  $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
  if ($conn->connect_error) {
    $response['success'] = false;
    $response['error'] = "Error de conexión con la base de datos.";
  } else {
    // ✅ Sentencia preparada para evitar inyección SQL
    $sql = "DELETE FROM tareas WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
      $response['success'] = true;
    } else {
      $response['success'] = false;
      $response['error'] = "No se pudo borrar la tarea.";
    }
    $stmt->close();
    $conn->close();
  }
} else {
  $response['success'] = false;
  $response['error'] = "ID inválido o no proporcionado.";
}

echo json_encode($response);
?>
