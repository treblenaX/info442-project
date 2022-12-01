import React, { Component, createContext, useEffect, useMemo, useState } from "react";
import { ToastContainer } from 'react-toastify';
import {
  Routes,
  Route
} from 'react-router-dom';
import Home from "./routes/Home";
import 'react-toastify/dist/ReactToastify.css';
import Login from "./routes/Login";
import { CredentialsContext } from './contexts/CredentialsContext';
import Signup from "./routes/Signup";
import Signout from "./routes/Signout";

function App() {
  const [credentials, setCredentials] = useState();
  const value = useMemo(() => ({ credentials, setCredentials }), [credentials]);

  return (
    <div>
      {/* Notice how the components here are located in the 'routes' folder */}
      <CredentialsContext.Provider value={value}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/signup' element={<Signup />} />
          <Route exact path='/signout' element={<Signout />} />
        </Routes>
      </CredentialsContext.Provider>
      <ToastContainer 
        position="bottom-right"
      />
    </div>
  )
}

export default App;