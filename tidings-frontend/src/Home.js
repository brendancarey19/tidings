import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Link, Route, Redirect, Routes } from 'react-router-dom';
import './App.css';
import Article from './Article';
import Toolbar from './Toolbar';
import TidesPage from './TidesPage';
import logo from "./static/logo.png";

function Home() {
  const bottomRef = useRef(null);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);


  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/load_on_start",{
      method: 'GET',
      credentials: 'include', 
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setInitialDataLoaded(true); // Set initial data loaded flag to true
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (page > 2 && initialDataLoaded) { // Make sure original data request has been completed
      fetch(`http://127.0.0.1:8080/api/data?page=${page}`,{
        method: 'GET',
        credentials: 'include', 
      })
        .then((response) => response.json())
        .then((newData) => {
          setData((prevData) => [...prevData, ...newData]);
          setIsLoading(false); // Reset isLoading state
        })
        .catch((error) => console.log(error));
    }
  }, [page, initialDataLoaded]); 

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading && data.length > 0) {
      setIsLoading(true);
    }
  };

  useEffect(() => {
    if (initialDataLoaded) {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [initialDataLoaded]);

  useEffect(() => {
    if (isLoading) {
      fetch(`http://127.0.0.1:8080/api/data?page=${page}`)
        .then((response) => response.json())
        .then((newData) => {
          setData((prevData) => [...prevData, ...newData]);
          setIsLoading(false);
        })
        .catch((error) => console.log(error));
    }
  }, [page, isLoading]);

  useEffect(() => {
    let observer;
  
    const handleIntersect = (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    };
  
    if (bottomRef.current) {
      observer = new IntersectionObserver(handleIntersect, {
        threshold: 0.1,
      });
  
      observer.observe(bottomRef.current);
    }
  
    return () => {
      if (observer && bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, []);

  return (
    <div className="main-container">
        {data.map((article) => (
            <Article
            key={article.url}
            title={article.title}
            url={article.url}
            bullets={article.bullets}
            display_pic={article.image}
            />
        ))}
        <div ref={bottomRef} style={{ visibility: 'hidden' }}></div>
        {isLoading && <p>Loading more articles...</p>}
    </div>
  );
}

export default Home;