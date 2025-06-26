import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../estilos/estilos.css";

function Bienvenido() {
  const location = useLocation();
  const usuario = location.state?.usuario || "Usuario";
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarTareas, setMostrarTareas] = useState(false);
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleInsertarClick = () => {
    setMostrarFormulario(true);
    setMostrarTareas(false);
    setMensaje("");
  };

  const handleVerTareasClick = async () => {
    setMostrarFormulario(false);
    setMostrarTareas(true);
    setMensaje("");
    try {
      const res = await fetch("http://localhost/gestordetareas/src/controller/tareas.php");
      const data = await res.json();
      setTareas(data);
    } catch (error) {
      setMensaje("Error al obtener las tareas.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const datos = { titulo, descripcion };
    const res = await fetch("http://localhost/gestordetareas/src/controller/insertar_tarea.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    const data = await res.json();
    if (data.success) {
      setMensaje("Tarea insertada correctamente.");
      setTitulo("");
      setDescripcion("");
      setMostrarFormulario(false);
    } else {
      setMensaje("Error al insertar la tarea.");
    }
  };

  // Funciones placeholder para los botones de cada tarea
  const handleEditar = (id) => {
    alert(`Editar tarea ${id} (lógica pendiente)`);
  };

  const handleBorrar = (id) => {
    alert(`Borrar tarea ${id} (lógica pendiente)`);
  };

  const handleCompletar = (id, completada) => {
    alert(
      completada
        ? `Marcar como NO completada la tarea ${id} (lógica pendiente)`
        : `Marcar como completada la tarea ${id} (lógica pendiente)`
    );
  };

  return (
    <div className="bienvenido-center">
      <h1 className="bienvenido-h1">¡Bienvenido, {usuario} al Gestor de Tareas!</h1>
      <div className="botones-contenedor">
        <button className="boton-3d" onClick={handleInsertarClick}>Insertar tarea</button>
        <button className="boton-3d" onClick={handleVerTareasClick}>Ver tareas</button>
      </div>
      {mostrarFormulario && (
        <div className="card-formulario">
          <form onSubmit={handleSubmit}>
            <h2>Insertar nueva tarea</h2>
            <input
              type="text"
              placeholder="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
            <textarea
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
            <button className="boton-3d" type="submit">Guardar</button>
            <button className="boton-3d" type="button" onClick={() => setMostrarFormulario(false)}>Cancelar</button>
          </form>
        </div>
      )}
      {mostrarTareas && (
        <div className="tareas-lista">
          {tareas.length === 0 ? (
            <p>No hay tareas registradas.</p>
          ) : (
            tareas.map((tarea) => (
              <div className="card-tarea" key={tarea.id}>
                <h3>{tarea.titulo}</h3>
                <p>{tarea.descripcion}</p>
                <div className="botones-tarea">
                  <button
                    className="btn-tarea editar"
                    title="Modificar"
                    onClick={() => handleEditar(tarea.id)}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-tarea borrar"
                    title="Borrar"
                    onClick={() => handleBorrar(tarea.id)}
                  >
                    🗑️
                  </button>
                  <button
                    className={`btn-tarea completar${tarea.completada ? " completada" : ""}`}
                    title="Marcar como completada"
                    onClick={() => handleCompletar(tarea.id, tarea.completada)}
                  >
                    {tarea.completada ? "✅" : "☐"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default Bienvenido;