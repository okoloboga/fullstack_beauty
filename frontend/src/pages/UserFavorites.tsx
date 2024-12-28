import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ArticleCard from '../components/ArticlesPage/ArticleCard';
import ConnectSection from '../components/MainContent/ConnectSection';
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
        const favoritesData = await fetchUserFavorites(); // Получаем избранные статьи
        console.log('Статьи пользователя:', favoritesData);
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
    <main>

      <section className="container">
        <h1 className="title text-center main__title">Избранные</h1>
      </section>
      {favorites.length === 0 ? (
        <div className="text-center" style={{ marginTop: '20px' }}>
          <a className="text-dark" href="/edit-profile" style={{ marginTop: '20px' }}>
            У вас нет избранных статей! Вернуться
          </a>
        </div>
      ) : (
        <div className="articles__block__cards__div">
          <div className="articles__block__cards flex">
            {favorites.map((favorite) => (
              <ArticleCard key={favorite.id} content={favorite} />
            ))}
          </div>
          <button className="button__with__bg" style={{ marginTop: '50px' }}>
            Показать ещё
          </button>
        </div>
      )}

      {/* Секция для связи с пользователями */}
      <ConnectSection />
    </main>
  );
};

export default UserFavorites;
