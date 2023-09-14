import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Article from './Article';

function Home() {
  const bottomRef = useRef(null);
  const [data, setData] = useState([]);
  const [nextData, setNextData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

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
        setPage((prevPage) => prevPage + 1); // Increment the page to trigger the next data fetch
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (page > 1 && initialDataLoaded) { 
      fetch(`http://127.0.0.1:8080/api/data?page=${page}`, {
        method: 'GET',
        credentials: 'include', 
      })
        .then((response) => response.json())
        .then((newData) => {
          setNextData(newData);
          setIsLoading(false);
        })
        .catch((error) => console.log(error));
    }
  }, [page, initialDataLoaded]); 

  const handleDisplayNextData = () => {
    if (nextData.length > 0) {
      setData((prevData) => [...prevData, ...nextData]);
      setNextData([]);
      setPage((prevPage) => prevPage + 1); // Trigger fetch for new next data
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
        setIsLoading(false); // Set to false as we're immediately handling the data
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
      {isLoading && <p>Loading more articles...</p>}
    </div>
  );
}

export default Home;






