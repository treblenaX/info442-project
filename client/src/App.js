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
  useEffect(() => {
      // This is where you should load the data
  }, []);

  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App;