import React from "react";
import "./Article.css";

const Image = ({ src, alt }) => {
  return <img className="article-image" src={src} alt={alt} />;
};

const Article = ({ title, url, bullets, display_pic }) => {
  const bulletPoints = bullets.split("\n");

  return (
    <div className="article-container">
      <div className="article-content">
        <h2 className="article-title">
          <a href={url}>{title}</a>
        </h2>
        <ul className="article-bullets">
          {bulletPoints.map((bullet, index) => (
            <li key={index}>{bullet}</li>
          ))}
        </ul>
      </div>
      {display_pic && <Image src={display_pic} alt={title} />}
    </div>
  );
};

export default Article;
