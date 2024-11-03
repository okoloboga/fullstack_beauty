import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// URL API, используемый для получения данных
const apiUrl = process.env.REACT_APP_API_URL;

// Определение интерфейса для новостей
interface NewsItem {
  id: number;
  title: string;
  description: string;
  coverImage: string;
}

const NewsSection: React.FC = () => {
  // Состояние для хранения новостей
  const [news, setNews] = useState<NewsItem[]>([]);

  // Хук useEffect для получения новостей при монтировании компонента
  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Получаем новости с сервера
        const response = await axios.get<NewsItem[]>(`${apiUrl}/api/news?sort=newest&limit=6`); // Получаем самые свежие новости, максимум 6
        setNews(response.data); // Устанавливаем полученные данные в состояние
      } catch (error) {
        console.error('Ошибка при загрузке новостей:', error);
      }
    };

    fetchNews(); // Вызов функции получения новостей
  }, []);

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
