import React, { Component, createContext, useEffect, useMemo, useState } from "react";
import { ToastContainer } from 'react-toastify';
import {
  Routes,
  Route
} from 'react-router-dom';
import Home from "./routes/Home";
import "./styles/Test.css";
import 'react-toastify/dist/ReactToastify.css';
import Login from "./routes/Login";
import { CredentialsContext } from './contexts/CredentialsContext';
import Signup from "./routes/Signup";
import Signout from "./routes/Signout";
import Test from "./routes/Test";


const SAMPLE_REVIEWS = [
  {id:1, description: 'Test 1'},
  {id:2, description: 'Test 2'},
  {id:3, description: 'Test 3'}
];


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
          <Route exact path='/test' element={<Test reviews={SAMPLE_REVIEWS}/>} />
        </Routes>
      </CredentialsContext.Provider>
      <ToastContainer />
    </div>
  )
}

export default App;