import React, { useEffect, useState } from 'react';
import { fetchFilteredNews } from '../../utils/apiService';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import NewsCard from '../NewsCard';
import { NewsItem, NewsListProps, DecodedToken } from '../../types';

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
    const loadNews = async () => {
      try {
        const filteredNews = await fetchFilteredNews(type); // Получаем новости с учётом типа
        setNewsItems(filteredNews); // Устанавливаем новости в состояние
      } catch (error) {
        setError('Ошибка при загрузке новостей');
      } finally {
        setLoading(false);
      }
    };

    loadNews(); // Вызываем функцию загрузки новостей
  }, [type]); // Перезагружаем новости при изменении типа

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
        {newsItems.map((newContent) => (
          <NewsCard key={newContent.id} news={newContent} />
        ))}
      </div>
    </div>
  );
};

export default NewsList;
