import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NewsCard from './NewsCard';

const apiUrl = process.env.REACT_APP_API_URL;

const NewsList = ({ type }) => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/news`);
        let newsData = response.data;

        // Фильтруем новости в зависимости от типа
        if (type === 'newest') {
          newsData = newsData.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (type === 'best') {
          newsData = newsData.sort((a, b) => b.likes - a.likes);
        }

        setNewsItems(newsData);
      } catch (error) {
        setError('Ошибка при загрузке новостей');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [type]);

  if (loading) {
    return <p>Загрузка новостей...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="news__cards flex flex-column">
      {newsItems.map((news) => (
        <NewsCard key={news.id} news={news} />
      ))}
    </div>
  );
};

export default NewsList;
