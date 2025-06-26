import React, { useState } from "react";

function Registro() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    if (!usuario.trim() || contrasena.length < 8) {
      setMensaje("Usuario requerido y contraseña mínimo 8 caracteres.");
      return;
    }

    try {
      const response = await fetch('http://localhost/gestordetareas/src/controller/registrar_usuario.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contrasena })
      });
      const data = await response.json();
      if (data.registrado) {
        setMensaje("Usuario registrado correctamente.");
        setUsuario('');
        setContrasena('');
      } else {
        setMensaje(data.error || "Error al registrar usuario.");
      }
    } catch (error) {
      setMensaje("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="registro-container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Usuario:</label>
          <input
            className="input"
            type="text"
            value={usuario}
            onChange={e => setUsuario(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input
            className="input"
            type="password"
            value={contrasena}
            onChange={e => setContrasena(e.target.value)}
          />
        </div>
        <button className="btn" type="submit">Registrar</button>
      </form>
      {mensaje && <div className="mensaje">{mensaje}</div>}
    </div>
  );
}

export default Registro;