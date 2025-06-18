import React, { useState } from "react";
import "../estilos/estilos.css"; // Import styles

function Home() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errores, setErrores] = useState({});

  const validar = () => {
    const nuevosErrores = {};
    if (!usuario.trim()) {
      nuevosErrores.usuario = 'El usuario no puede estar vacío';
    }
    if (contrasena.length < 8) {
      nuevosErrores.contrasena = 'La contraseña debe tener al menos 8 caracteres';
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validar()) {
      alert('Formulario válido');
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Usuario:</label>
        <input
          className="input"
          type="text"
          value={usuario}
          onChange={e => setUsuario(e.target.value)}
        />
        {errores.usuario && <span className="error">{errores.usuario}</span>}
      </div>
      <div className="form-group">
        <label>Contraseña:</label>
        <input
          className="input"
          type="password"
          value={contrasena}
          onChange={e => setContrasena(e.target.value)}
        />
        {errores.contrasena && <span className="error">{errores.contrasena}</span>}
      </div>
      <button className="btn" type="submit">Iniciar sesión</button>
    </form>
  );
}

export default Home;