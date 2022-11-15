import React, { Component, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import {
  Routes,
  Route
} from 'react-router-dom';
import Home from "./routes/Home";
import "./styles/App.css";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
      {/* Notice how the components here are located in the 'routes' folder */}
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App;