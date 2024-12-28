import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchNews } from '../../utils/apiService';
import { ContentDetail } from '../../types';
import NewCard from '../NewsPage/NewCard';
import './NewsSection.css';

const NewsSection: React.FC = () => {
  // Состояние для хранения новостей
  const [news, setNews] = useState<ContentDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Хук useEffect для получения новостей при монтировании компонента
  useEffect(() => {
    const loadNews = async () => {
      try {
        const latestNews = await fetchNews(); // Задаём лимит 6 новостей
        setNews(latestNews); // Сохраняем новости в состояние
      } catch (error) {
        console.error('Ошибка при загрузке новостей:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNews(); // Вызываем функцию загрузки новостей
  }, []);

  if (loading) {
    return <div>Загрузка новостей...</div>;
  }

  return (
    <section className="news__section">
      <div className="news__block container">
        {/* Заголовок блока новостей */}
        <div className="news__block__title flex">
          <div></div>
          <h1 className="title">новости</h1>
        </div>
        <div>
          {/* Первый ряд новостей (показываем первые 3 новости) */}
          <div className="news__block__cards flex">
            {loading ? (
              <p>Загрузка новостей...</p>
                ) : (
                  news.map((newsContent) => (
                    <NewCard key={newsContent.id} content={newsContent} />
                  ))
                )}
          </div>
        </div>
        {/* Кнопка для перехода ко всем новостям */}
        <div className="news__block__card__btn">
          <Link className="button__with__bg" to="/news">
            Все новости
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
