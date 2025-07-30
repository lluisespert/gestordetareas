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
    // Validar campos antes de enviar
    if (!titulo.trim() || !descripcion.trim()) {
      setMensaje("Todos los campos son obligatorios.");
      return;
    }
    const datos = { titulo, descripcion };
    if (editandoId) {
      // Editar tarea existente
      const res = await fetch("http://localhost/gestordetareas/src/controller/editar_tarea.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editandoId, ...datos }),
      });
      const data = await res.json();
      if (data.success) {
        setMensaje("Tarea editada correctamente.");
        await handleVerTareasClick();
        setEditandoId(null);
        setTitulo("");
        setDescripcion("");
        setMostrarFormulario(false);
        setMostrarTareas(true);
      } else {
        setMensaje(data.error || "Error al editar la tarea.");
      }
    } else {
      // Insertar nueva tarea
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
        setMostrarTareas(true);
        handleVerTareasClick();
      } else {
        setMensaje(data.error || "Error al insertar la tarea.");
      }
    }
  };

  const handleEditar = (id) => {
    const tarea = tareas.find((t) => t.id === id);
    if (tarea) {
      setTitulo(tarea.titulo);
      setDescripcion(tarea.descripcion);
      setEditandoId(id);
      setMostrarFormulario(true);
      setMostrarTareas(false);
      setMensaje("");
    }
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

  const handleCancelar = () => {
    setMostrarFormulario(false);
    setEditandoId(null);
    setTitulo("");
    setDescripcion("");
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
            <button className="boton-3d" type="submit">{editandoId ? "Guardar cambios" : "Guardar"}</button>
            <button className="boton-3d" type="button" onClick={handleCancelar}>Cancelar</button>
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