import React from "react";
import "./Article.css"; // Import the CSS file with the styles

const Article = ({ title, url, bullets }) => {
    const bulletPoints = bullets.split("\n");
  
    return (
      <div className="article-container">
        <h2 className="article-title">
          <a href={url}>{title}</a>
        </h2>
        <ul className="article-bullets">
          {bulletPoints.map((bullet, index) => (
            <li key={index}>{bullet}</li>
          ))}
        </ul>
      </div>
    );
  };

export default Article;