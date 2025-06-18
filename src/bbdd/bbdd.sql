-- Crea la base de datos (opcional)
CREATE DATABASE gestor_tareas;

-- Usa la base de datos
USE gestor_tareas;

-- Crea la tabla usuarios
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario VARCHAR(50) NOT NULL,
    contrasena VARCHAR(100) NOT NULL
);