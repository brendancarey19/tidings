import React, { useState, useEffect, useRef } from 'react';
import Article from './Article';
import "./Home.css"
import { NewtonsCradle } from '@uiball/loaders'

function Home() {
  const bottomRef = useRef(null);
  const [data, setData] = useState([]);
  const [nextData, setNextData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [isNextDataLoading, setIsNextDataLoading] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/load_on_start", {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setInitialDataLoaded(true);
      })
      .then(() => {
        setPage((prevPage) => prevPage + 1);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (page > 1 && initialDataLoaded) { 
      setIsNextDataLoading(true);
      fetch(`http://127.0.0.1:8080/api/data?page=${page}`, {
        method: 'GET',
        credentials: 'include', 
      })
        .then((response) => response.json())
        .then((newData) => {
          setNextData(newData);
          setIsNextDataLoading(false);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsNextDataLoading(false);
        });
    }
  }, [page, initialDataLoaded]); 

  const handleDisplayNextData = () => {
    if (nextData.length > 0) {
      setData((prevData) => [...prevData, ...nextData]);
      setNextData([]);
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading && data.length > 0) {
      handleDisplayNextData();
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
  }, [initialDataLoaded, nextData, data]); 

  useEffect(() => {
    let observer;

    const handleIntersect = (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        handleDisplayNextData();
        setIsLoading(false);
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
  }, [nextData, data]);

  return (
    <div className="main-container">
      {data.map((article, index) => (
        <Article
          key={index}
          title={article.title}
          url={article.url}
          bullets={article.bullets}
          display_pic={article.image}
        />
      ))}
      <div ref={bottomRef} style={{ visibility: 'hidden' }}></div>
      {isNextDataLoading && (
      <div className="loader-container">
        <NewtonsCradle size={65} speed={1.8} color="#0069d9" />
      </div>
      )}
    </div>
  );
}

export default Home;