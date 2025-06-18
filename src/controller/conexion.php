<?php
$host = "localhost";
$usuario = "lluisespert";
$contrasena = "Andillaa1b2c3d4!"; 
$base_de_datos = "gestor_tareas";

$conn = new mysqli($host, $usuario, $contrasena, $base_de_datos);

// Obtener todos los usuarios y contraseñas
$result = $conn->query("SELECT id, contraseña FROM usuarios");

while ($row = $result->fetch_assoc()) {
    $id = $row['id'];
    $contrasena_plana = $row['contraseña'];
    // Encriptar la contraseña
    $contrasena_hash = password_hash($contrasena_plana, PASSWORD_DEFAULT);
    // Actualizar la contraseña en la base de datos
    $stmt = $conn->prepare("UPDATE usuarios SET contraseña = ? WHERE id = ?");
    $stmt->bind_param("si", $contrasena_hash, $id);
    $stmt->execute();
}

echo "Contraseñas actualizadas correctamente.";
$conn->close();
?>