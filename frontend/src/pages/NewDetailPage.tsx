import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

// URL API для получения данных
const apiUrl = process.env.REACT_APP_API_URL;

// Интерфейс для описания типа данных новости
interface NewsItem {
  id: number;
  title: string;
  content: string;
  coverImage?: string;
}

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
    const fetchNews = async () => {
      try {
        const response = await axiosInstance.get<NewsItem>(`${apiUrl}/api/news/${id}`);
        setNews(response.data);
      } catch (err) {
        setError('Ошибка при загрузке новости');
      } finally {
        setLoading(false);
      }
    };

    fetchNews(); // Вызов функции получения данных
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
        <h1>{news.title}</h1>
        {news.coverImage && (
          <img
            src={`${apiUrl}/${news.coverImage}`}
            alt={news.title}
            className="news-detail-page__image"
          />
        )}
        <p>{news.content}</p>
        {/* Здесь можно добавить дополнительные элементы, такие как дата, автор, лайки и комментарии */}
      </div>
    </main>
  );
};

export default NewsDetailPage;
