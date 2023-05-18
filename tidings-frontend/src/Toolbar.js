import React from 'react';
import './Toolbar.css';

function Toolbar({onLoadData}) {
  return (
    <div className="toolbar">
      <button className="toolbar-btn-large" onClick={onLoadData}>load</button>
      <button className="toolbar-btn-large">currents</button>
      <button className="toolbar-btn-large">saved</button>
      <button className="toolbar-btn-large">login</button>
    </div>
  );
}

export default Toolbar;