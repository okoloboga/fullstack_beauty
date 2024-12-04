import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchLatestNews } from '../../utils/apiService';
import { NewsItem } from '../../types';
import './NewsSection.css';

const NewsSection: React.FC = () => {
  // Состояние для хранения новостей
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Хук useEffect для получения новостей при монтировании компонента
  useEffect(() => {
    const loadNews = async () => {
      try {
        const latestNews = await fetchLatestNews(6); // Задаём лимит 6 новостей
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
            {news.slice(0, 3).map((item) => (
              <div key={item.id}>
                <div className="news__block__card">
                  <div>
                    <img src={item.coverImage} alt={item.title} />
                    <p>{item.description}</p>
                  </div>
                  <Link className="button__without__bg" to={`/news/${item.id}`}>
                    Читать далее
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Второй ряд новостей (остальные новости после первых трех) */}
          <div className="news__block__cards2 flex">
            {news.slice(3).map((item) => (
              <div key={item.id} className="news__block__card">
                <div>
                  <img src={item.coverImage} alt={item.title} />
                  <p>{item.description}</p>
                </div>
                <Link className="button__without__bg" to={`/news/${item.id}`}>
                  Читать далее
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Кнопка для перехода ко всем новостям */}
        <div className="news__block__card__btn">
          <Link className="button__with__bg" to="/news-best">
            Все новости
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
