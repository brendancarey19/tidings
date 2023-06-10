import React from 'react';
import { BrowserRouter as Router, Link, Route, Redirect } from 'react-router-dom';
import './Toolbar.css';


function Toolbar() {
  return (
    <div className="toolbar">
      <Link to="/">
        <button className="toolbar-btn-large">Home</button>
      </Link>
      <Link to="/tides">
        <button className="toolbar-btn-large">Tides</button>
      </Link>
      <Link to="/saved">
        <button className="toolbar-btn-large">Saved</button>
      </Link>
      
    </div>
  );
}

export default Toolbar;