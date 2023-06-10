import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Link, Route, Redirect, Routes, Switch } from 'react-router-dom';
import './App.css';
import Home from './Home';
import Toolbar from './Toolbar';
import TidesPage from './TidesPage';
import SavedPage from './SavedPage';
import logo from "./static/logo.png";

function App() {
  const bottomRef = useRef(null);
  const resetApp = () => {
    window.location.reload();
  };

  return (
    <Router>
      <div className="container">
        <div className="toolbar-container">
          <Toolbar />
        </div>
        <div className="content-container">
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tides" element={<TidesPage />} />
            <Route path="/saved" element={<SavedPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;