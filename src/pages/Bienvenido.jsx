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
  const [editandoId, setEditandoId] = useState(null);

  const cargarTareas = async () => {
    try {
      const res = await fetch("http://localhost/gestordetareas/src/controller/tareas.php");
      const data = await res.json();
      setTareas(data);
    } catch (error) {
      setMensaje("Error al obtener las tareas.");
    }
  };

  const handleInsertarClick = () => {
    setMostrarFormulario(true);
    setMostrarTareas(false);
    setMensaje("");
    setEditandoId(null);
    setTitulo("");
    setDescripcion("");
  };

  const handleVerTareasClick = async () => {
    setMostrarFormulario(false);
    setMostrarTareas(true);
    setMensaje("");
    await cargarTareas();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim() || !descripcion.trim()) {
      setMensaje("Todos los campos son obligatorios.");
      return;
    }

    const datos = { titulo, descripcion };
    const url = editandoId
      ? "http://localhost/gestordetareas/src/controller/editar_tarea.php"
      : "http://localhost/gestordetareas/src/controller/insertar_tarea.php";
    const payload = editandoId ? { id: editandoId, ...datos } : datos;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.success) {
      setMensaje(editandoId ? "Tarea editada correctamente." : "Tarea insertada correctamente.");
      setEditandoId(null);
      setTitulo("");
      setDescripcion("");
      setMostrarFormulario(false);
      setMostrarTareas(true);
      await cargarTareas();
    } else {
      setMensaje(data.error || "Error al guardar la tarea.");
    }
  };

  const handleEditar = (id) => {
    const tarea = tareas.find((t) => t.id === id);
    if (tarea && !tarea.completada) {
      const confirmar = window.confirm(`¿Quieres editar la tarea "${tarea.titulo}"?`);
      if (!confirmar) return;

      setTitulo(tarea.titulo);
      setDescripcion(tarea.descripcion);
      setEditandoId(id);
      setMostrarFormulario(true);
      setMostrarTareas(false);
      setMensaje("");
    }
  };

  const handleBorrar = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de que quieres borrar esta tarea?");
    if (!confirmar) return;

    try {
      const res = await fetch("http://localhost/gestordetareas/src/controller/borrar_tarea.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setMensaje("Tarea borrada correctamente.");
        await cargarTareas();
      } else {
        setMensaje(data.error || "Error al borrar la tarea.");
      }
    } catch (error) {
      setMensaje("Error de conexión al borrar la tarea.");
    }
  };

  const handleCompletar = async (id, completada) => {
    const mensajeConfirmacion = completada
      ? "¿Marcar esta tarea como NO completada?"
      : "¿Marcar esta tarea como COMPLETADA? Una vez completada no podrás modificarla.";
    const confirmar = window.confirm(mensajeConfirmacion);
    if (!confirmar) return;

    try {
      const res = await fetch("http://localhost/gestordetareas/src/controller/completar_tarea.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completada: !completada }),
      });
      const data = await res.json();
      if (data.success) {
        setMensaje("Tarea actualizada.");
        await cargarTareas();
      } else {
        setMensaje(data.error || "Error al actualizar la tarea.");
      }
    } catch (error) {
      setMensaje("Error de conexión al completar la tarea.");
    }
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
            <h2>{editandoId ? "Editar tarea" : "Insertar nueva tarea"}</h2>
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
            <button className="boton-3d" type="submit">
              {editandoId ? "Guardar cambios" : "Guardar"}
            </button>
            <button className="boton-3d" type="button" onClick={handleVerTareasClick}>
              Lista de Tareas
            </button>
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
                    className={`btn-tarea editar ${tarea.completada ? "deshabilitado" : ""}`}
                    title={tarea.completada ? "Tarea completada. No se puede editar." : "Modificar"}
                    onClick={() => handleEditar(tarea.id)}
                    disabled={tarea.completada}
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