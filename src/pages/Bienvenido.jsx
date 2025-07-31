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
  const [fecha_vencimiento, setFechaVencimiento] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  const cargarTareas = async () => {
    try {
      const res = await fetch("http://localhost/gestordetareas/src/controller/tareas.php");
      const data = await res.json();
      setTareas(data);
    } catch {
      setMensaje("Error al obtener las tareas.");
    }
  };

  const horaValida = (valor) => {
    const hora = new Date(valor).getHours();
    return hora >= 8 && hora <= 20;
  };

  const handleInsertarClick = () => {
    setMostrarFormulario(true);
    setMostrarTareas(false);
    setMensaje("");
    setEditandoId(null);
    setTitulo("");
    setDescripcion("");
    setFechaVencimiento("");
  };

  const handleVerTareasClick = async () => {
    setMostrarFormulario(false);
    setMostrarTareas(true);
    setMensaje("");
    await cargarTareas();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim() || !descripcion.trim() || !fecha_vencimiento.trim()) {
      setMensaje("Todos los campos son obligatorios.");
      return;
    }

    if (!horaValida(fecha_vencimiento)) {
      setMensaje("La hora debe estar entre las 08:00 y las 20:00.");
      return;
    }

    const datos = { titulo, descripcion, fecha_vencimiento };
    const url = editandoId
      ? "http://localhost/gestordetareas/src/controller/editar_tarea.php"
      : "http://localhost/gestordetareas/src/controller/insertar_tarea.php";
    const payload = editandoId ? { id: editandoId, ...datos } : datos;

    try {
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
        setFechaVencimiento("");
        setMostrarFormulario(false);
        setMostrarTareas(true);
        await cargarTareas();
      } else {
        setMensaje(data.message || "Error al guardar la tarea.");
      }
    } catch {
      setMensaje("Error al conectar con el servidor.");
    }
  };

  const handleEditar = (id) => {
    const tarea = tareas.find((t) => t.id === id);
    if (tarea && !tarea.completada) {
      if (window.confirm(`¿Quieres editar la tarea "${tarea.titulo}"?`)) {
        setTitulo(tarea.titulo);
        setDescripcion(tarea.descripcion);
        setFechaVencimiento(tarea.fecha_vencimiento || "");
        setEditandoId(id);
        setMostrarFormulario(true);
        setMostrarTareas(false);
        setMensaje("");
      }
    }
  };

  const handleBorrar = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres borrar esta tarea?")) return;

    try {
      const res = await fetch("http://localhost/gestordetareas/src/controller/borrar_tarea.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      setMensaje(data.success ? "Tarea borrada correctamente." : data.message || "Error al borrar la tarea.");
      await cargarTareas();
    } catch {
      setMensaje("Error de conexión al borrar la tarea.");
    }
  };

  const handleCompletar = async (id, completada) => {
    const confirmar = completada
      ? "¿Marcar esta tarea como NO completada?"
      : "¿Marcar esta tarea como COMPLETADA? Una vez completada no podrás modificarla.";
    if (!window.confirm(confirmar)) return;

    try {
      const res = await fetch("http://localhost/gestordetareas/src/controller/completar_tarea.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completada: !completada }),
      });
      const data = await res.json();
      setMensaje(data.success ? "Tarea actualizada." : data.message || "Error al actualizar la tarea.");
      await cargarTareas();
    } catch {
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
            <input
              type="datetime-local"
              value={fecha_vencimiento}
              onChange={(e) => setFechaVencimiento(e.target.value)}
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
                <p>
                  <strong>Fecha de vencimiento:</strong>{" "}
                  {new Date(tarea.fecha_vencimiento).toLocaleString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <div className="botones-tarea">
                  <button
                    className={`btn-tarea editar ${tarea.completada ? "deshabilitado" : ""}`}
                    onClick={() => handleEditar(tarea.id)}
                    disabled={tarea.completada}
                  >
                    ✏️
                  </button>
                  <button className="btn-tarea borrar" onClick={() => handleBorrar(tarea.id)}>🗑️</button>
                  <button className={`btn-tarea completar${tarea.completada ? " completada" : ""}`}
                    onClick={() => handleCompletar(tarea.id, tarea.completada)}>
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
