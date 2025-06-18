import React from "react";
import { useLocation } from "react-router-dom";

function Bienvenido() {
  const location = useLocation();
  const usuario = location.state?.usuario || "Usuario";

  return (
    <div className="bienvenido">
      <h1>¡Bienvenido, {usuario}!</h1>
    </div>
  );
}

export default Bienvenido;