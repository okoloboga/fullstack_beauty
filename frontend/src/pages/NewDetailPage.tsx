import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NewsItem } from '../types';
import { fetchNews } from '../utils/apiService';
import './styles/NewDetailPage.css';

const apiUrl = process.env.REACT_APP_API_URL;

// Основной компонент страницы детального просмотра новости
const NewsDetailPage: React.FC = () => {
  // Получаем параметр id из URL
  const { id } = useParams<{ id: string }>();

  // Состояние для хранения данных новости, загрузки и ошибки
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect для получения данных новости при изменении параметра id
  useEffect(() => {
    const getNews = async () => {
      try {
        if (id) {
          const data = await fetchNews(id);
          setNews(data);
        } else {
          setError('Невалидный идентификатор новости');
        }
      } catch (err) {
        setError('Ошибка при загрузке новости');
      } finally {
        setLoading(false);
      }
    };

    getNews(); // Вызов функции получения данных
  }, [id]);

  // Отображение состояния загрузки
  if (loading) {
    return <div>Загрузка новости...</div>;
  }

  // Отображение ошибки, если она произошла
  if (error) {
    return <div>{error}</div>;
  }

  // Отображение, если новость не найдена
  if (!news) {
    return <div>Новость не найдена</div>;
  }

  // Основной рендер компонента детальной новости
  return (
    <main>
      <div className="news-detail-page container">
        <h1 className="news-detail-page__title">{news.title}</h1>
        {news.coverImage && (
          <img
            src={`${apiUrl}/${news.coverImage}`}
            alt={news.title}
            className="news-detail-page__image"
          />
        )}
        <p className="news-detail-page__content">{news.content}</p>
      </div>
    </main>
  );
};

export default NewsDetailPage;
