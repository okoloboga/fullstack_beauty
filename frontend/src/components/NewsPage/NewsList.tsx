import React, { useEffect, useState, useMemo } from 'react';
import { fetchNews } from '../../utils/apiService';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import NewCard from './NewCard';
import { ContentDetail, DecodedToken, NewFilters } from '../../types';
import { toast } from 'react-toastify';

const NewsList: React.FC = () => {
  const [newsItems, setNewsItems] = useState<ContentDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [filters, setFilters] = useState<NewFilters>({
    sortBy: 'new', // По умолчанию сортировка по новым
  });

  // Получаем роль пользователя из токена
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        console.log('Роль пользователя:', decodedToken.role);
        setUserRole(decodedToken.role);
      } catch (error) {
        console.error('Ошибка декодирования токена:', error);
      }
    }
  }, []);

  // Получаем новости с сервера
  useEffect(() => {
    const loadNews = async () => {
      try {
        const newsData = await fetchNews(); // Предполагается, что fetchNews возвращает массив ContentDetail
        setNewsItems(newsData);
      } catch (error) {
        setError('Ошибка при загрузке новостей');
        console.error('Ошибка при загрузке новостей:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  // Обработчик изменения фильтров
  const handleCategorySelect = (category: 'new' | 'best') => {
    setFilters({
      sortBy: category,
    });
  };

  // Мемоизируем отсортированные новости
  const sortedNewsItems = useMemo(() => {
    const sorted = [...newsItems];
    if (filters.sortBy === 'best') {
      // Сортировка по количеству просмотров (views) в порядке убывания
      sorted.sort((a, b) => Number(b.views) - Number(a.views));
    } else if (filters.sortBy === 'new') {
      // Сортировка по дате создания (createdAt) в порядке убывания
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return sorted;
  }, [newsItems, filters.sortBy]);

  if (loading) {
    return <p>Загрузка новостей...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="news__div">
      <div className="news__div__controls">
        {userRole === 'admin' && (
          <button className="create-news-btn button__with__bg">
            <Link to="/create-news">Создать Новость</Link>
          </button>
        )}
      </div>
      <div className="news__title__btns flex">
        <button
          className={`${filters.sortBy === 'new' ? 'button__with__bg' : 'button__without__bg'}`}
          onClick={() => handleCategorySelect('new')}
        >
          СВЕЖЕЕ
        </button>
        <button
          className={`${filters.sortBy === 'best' ? 'button__with__bg' : 'button__without__bg'}`}
          onClick={() => handleCategorySelect('best')}
        >
          ЛУЧШЕЕ
        </button>
      </div>
      <div className="news__cards flex flex-column">
        {/* Отображаем карточки новостей */}
        {sortedNewsItems.map((newContent) => (
          <NewCard key={newContent.id} content={newContent} />
        ))}
      </div>
    </div>
  );
};

export default NewsList;
