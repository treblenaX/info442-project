import React, { Component, useEffect } from "react";
import {
  Routes,
  Route
} from 'react-router-dom';
import Home from "./routes/Home";
import "./styles/App.css";


function App() {
  useEffect(() => {
      // This is where you should load the data
  }, []);

  return (
    <Routes>
      <Route path='/' element={<Home />} />
    </Routes>
  )
}

export default App;