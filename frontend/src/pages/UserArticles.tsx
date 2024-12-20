import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchUserArticles } from '../utils/apiService'; // Импортируем функцию для получения статей пользователя
import ArticleCard from '../components/ArticlesPage/ArticleCard'; // Импортируем компонент карточки статьи
import ConnectSection from '../components/MainContent/ConnectSection';

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
    <main>
      <section className="container">
        <h1 className="title text-center main__title">Мои статьи</h1>
      </section>
      {articles.length === 0 ? (
        <div className="text-center" style={{ marginTop: '20px' }}>
          <a className="text-dark" href="/edit-profile" style={{ marginTop: '20px' }}>
            У Вас нет статей! Вернуться
          </a>
        </div>
      ) : (
        <div className="articles__block__cards__div">
          <div className="articles__block__cards flex">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
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

export default UserArticles;
