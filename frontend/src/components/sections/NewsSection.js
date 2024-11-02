import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const NewsSection = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/news?sort=newest&limit=6`); // например, чтобы получить самые новые новости
        setNews(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке новостей:', error);
      }
    };

    fetchNews();
  }, []);

  return (
    <section className="news__section">
      <div className="news__block container">
        <div className="news__block__title flex">
          <div></div>
          <h1 className="title">новости</h1>
        </div>
        <div>
          <div className="news__block__cards flex">
            {news.slice(0, 3).map((item, index) => (
              <div key={index}>
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
          <div className="news__block__cards2 flex">
            {news.slice(3).map((item, index) => (
              <div key={index} className="news__block__card">
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
