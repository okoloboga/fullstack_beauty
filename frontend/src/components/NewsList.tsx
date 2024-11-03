import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import NewsCard from './NewsCard';

const apiUrl = process.env.REACT_APP_API_URL;

// Интерфейс для описания объекта новости
interface NewsItem {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  likes: number;
  date: string;
}

// Интерфейс для props компонента NewsList
interface NewsListProps {
  type: 'newest' | 'best'; // Тип новостей: самые новые или лучшие
}

// Интерфейс для токена авторизации
interface DecodedToken {
  role: string;
}

const NewsList: React.FC<NewsListProps> = ({ type }) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Получаем роль пользователя из токена
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token) as DecodedToken;
        setUserRole(decodedToken.role);
      } catch (error) {
        console.error('Ошибка декодирования токена:', error);
      }
    }
  }, []);
  
  // Получаем новости с сервера и фильтруем их в зависимости от типа
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get<NewsItem[]>(`${apiUrl}/api/news`);
        let newsData = response.data;

        // Фильтруем новости в зависимости от типа
        if (type === 'newest') {
          newsData = newsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else if (type === 'best') {
          newsData = newsData.sort((a, b) => b.likes - a.likes);
        }

        setNewsItems(newsData);
      } catch (error) {
        const err = error as AxiosError;
        console.error('Ошибка при загрузке новостей:', err.message);
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
    <div className="news__div">
      <div className="news__div__controls">
        {/* Условно рендерим кнопку "Создать Новость" для админа */}
        {userRole === 'admin' && (
          <button className="create-news-btn button__with__bg">
            <Link to="/create-news">Создать Новость</Link>
          </button>
        )}
      </div>
      <div className="news__cards flex flex-column">
        {/* Отображаем карточки новостей */}
        {newsItems.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>
    </div>
  );
};

export default NewsList;
