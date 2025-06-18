import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import ScrollToTop from "../components/ScrollToTop.jsx";
import "../estilos/estilos.css";
import Home from '../pages/Home';
function App () {

  return (
    
      <BrowserRouter>

          <ScrollToTop>
            
            <Routes>

              <Route element={<Home />} path="/" />

            </Routes>

          </ScrollToTop>

      </BrowserRouter>
    
  )
}

export default App