import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const NewsDetailPage = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/news/${id}`);
        setNews(response.data);
      } catch (err) {
        setError('Ошибка при загрузке новости');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) {
    return <div>Загрузка новости...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!news) {
    return <div>Новость не найдена</div>;
  }

  return (
    <main>
      <div className="news-detail-page container">
        <h1>{news.title}</h1>
        {news.coverImage && <img src={`/${news.coverImage}`} alt={news.title} className="news-detail-page__image" />}
        <p>{news.content}</p>
        {/* Добавьте дополнительные элементы, такие как дата, автор, лайки и комментарии */}
      </div>
    </main>
  );
};

export default NewsDetailPage;
