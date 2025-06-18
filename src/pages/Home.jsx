import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../estilos/estilos.css"; // Import styles

function Home() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errores, setErrores] = useState({});
  const [flipped, setFlipped] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    if (validar()) {
      setFlipped(true);
      try {
        const response = await fetch('http://localhost/gestordetareas/src/controller/comprobar_usuario.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usuario, contrasena })
        });
        const data = await response.json();
        setTimeout(() => {
          setFlipped(false);
          if (data.existe) {
            navigate("/bienvenido", { state: { usuario } });
          } else if (data.error) {
            setMensaje(data.error);
          } else {
            setMensaje('Usuario o contraseña incorrectos');
          }
        }, 1200);
      } catch (error) {
        setFlipped(false);
        setMensaje('Error al conectar con el servidor');
      }
    }
  };

  return (
    <div className="login-3d-container">
      <div className={`login-3d-card${flipped ? " flipped" : ""}`}>
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Iniciar Sesión</h2>
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
          {mensaje && <div className="mensaje">{mensaje}</div>}
        </form>
        <div className="login-3d-back">
          <h2>Verificando...</h2>
        </div>
      </div>
    </div>
  );
}

export default Home;