import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchUserArticles } from '../utils/apiService'; // Импортируем функцию для получения статей пользователя
import ArticleCard from '../components/ArticlesPage/ArticleCard'; // Импортируем компонент карточки статьи

const UserArticles: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]); // Состояние для статей
  const [loading, setLoading] = useState<boolean>(true); // Состояние загрузки

  // Загружаем статьи пользователя при монтировании компонента
  useEffect(() => {
    const loadArticles = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Необходимо авторизоваться');
        return;
      }

      try {
        const articlesData = await fetchUserArticles(); // Получаем статьи пользователя
        console.log('Статьи пользователя:', articlesData);
        setArticles(articlesData); // Сохраняем их в состояние
      } catch (error) {
        toast.error('Не удалось загрузить статьи');
      } finally {
        setLoading(false); // Завершаем загрузку
      }
    };

    loadArticles(); // Загружаем статьи
  }, []);

  // Если идет загрузка
  if (loading) {
    return <p>Загрузка статей...</p>;
  }

  return (
    <div className="articles__div">
      <h1>Мои статьи</h1>

      {articles.length === 0 ? (
        <p>У вас нет статей.</p>
      ) : (
        <div className="articles__block__cards__div">
          <div className="articles__block__cards flex">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
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

export default UserArticles;
