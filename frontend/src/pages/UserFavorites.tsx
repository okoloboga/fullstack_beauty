import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/ArticlesPage/ArticleCard';
import { toast } from 'react-toastify';
import { fetchUserFavorites } from '../utils/apiService'; // Импортируем функцию для получения избранных

const UserFavorites: React.FC = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadFavorites = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Необходимо авторизоваться');
        return;
      }

      try {
        const favoritesData = await fetchUserFavorites(token); // Получаем избранные статьи
        setFavorites(favoritesData); // Сохраняем в состояние
      } catch (error) {
        toast.error('Не удалось загрузить избранные записи');
      } finally {
        setLoading(false); // Завершаем загрузку
      }
    };

    loadFavorites(); // Загружаем избранные статьи
  }, []);

  if (loading) {
    return <p>Загрузка избранных статей...</p>;
  }

  return (
    <div className="articles__div">
      <h1>Мои Избранные</h1>

      {favorites.length === 0 ? (
        <p>У вас нет избранных статей.</p>
      ) : (
        <div className="articles__block__cards__div">
          <div className="articles__block__cards flex">
            {favorites.map((favorite) => (
              <ArticleCard key={favorite.id} article={favorite} />
            ))}
          </div>
        </div>
      )}

      <button className="button__with__bg" style={{ marginTop: '50px' }}>
        Показать ещё
      </button>
    </div>
  );
};

export default UserFavorites;
