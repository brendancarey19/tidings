import React, { useState, useEffect } from 'react';
import './App.css';
import Article from './Article';
import Toolbar from './Toolbar';

function App() {
  const [data, setData] = useState([]);
  const [loadData, setLoadData] = useState(false);

  useEffect(() => {
    if (loadData) {
      fetch("http://127.0.0.1:8080/api/data")
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => console.log(error));
    }
  }, [loadData]);

  return (
    <div className="container">
      <div className="toolbar-container">
        <Toolbar onLoadData={() => setLoadData(true)} />
      </div>
      <div className="main-container">
        {data.map((article) => (
          <Article
            key={article.url}
            title={article.title}
            url={article.url}
            bullets={article.bullets}
          />
        ))}
      </div>
    </div>
  );
}

export default App;