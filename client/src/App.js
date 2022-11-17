import React, { Component, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import {
  Routes,
  Route
} from 'react-router-dom';
import Home from "./routes/Home";
import "./styles/App.css";
import 'react-toastify/dist/ReactToastify.css';
import LoginForm from "./routes/Login";

function App() {
  return (
    <div>
      {/* Notice how the components here are located in the 'routes' folder */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginForm />} />
      </Routes> 
      <ToastContainer />
    </div>
  )
}

export default App;