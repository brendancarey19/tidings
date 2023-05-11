import React from 'react';
import './Toolbar.css';

function Toolbar({onLoadData}) {
  return (
    <div className="toolbar">
      <button className="toolbar-btn-large">Home</button>
      <button className="toolbar-btn-large" onClick={onLoadData}>Load</button>

    </div>
  );
}

export default Toolbar;