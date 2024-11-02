import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ArticleCard from './ArticleCard';
import filterIcon from '../assets/images/filter-icon.svg';
import topArrowIcon from '../assets/images/top-arrow.svg';
import jwt_decode from 'jwt-decode'; // Импортируем jwt-decode для декодирования токена

const apiUrl = process.env.REACT_APP_API_URL;

const ArticlesList = () => {
  // Состояния для управления поиском, фильтрами и popup
  const [searchQuery, setSearchQuery] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // Для хранения роли пользователя

  // Получаем роль пользователя из токена
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        setUserRole(decodedToken.role); // Сохраняем роль пользователя в состоянии
      } catch (error) {
        console.error('Ошибка декодирования токена:', error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/articles`); // Запрос на сервер для получения всех статей
        setArticles(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке статей:', error);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Фильтрация статей на основе поиска
  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Обработчики для поиска и popup
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  // Обработчик для кнопки "наверх"
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="articles__div">
      <div className="articles__div__search">
        <div className="articles__controls justify-between">
          {/* Условно рендерим кнопку "Написать статью" */}
          {(userRole === 'partner' || userRole === 'admin') && (
            <button className="write-article-btn button__with__bg">
              <Link to="/create-article">Написать статью</Link>
            </button>
          )}
          <div className="articles__controls__child flex item-center justify-between relative">
            <input
              type="text"
              className="search-input default__input"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button className="filter-btn" onClick={handleOpenPopup}>
              <img src={filterIcon} alt="Фильтр" />
            </button>
          </div>
          {isPopupOpen && (
            <div className="popup">
              <div className="popup-content text-left flex justify-center item-center flex-column">
                <button className="close-btn" onClick={handleClosePopup}>
                  &times;
                </button>
                <div className="flex flex-column">
                  <h2>Сортировать:</h2>
                  {/* Добавьте фильтры */}
                  <label>
                    <input type="checkbox" name="category1" /> По количеству просмотров
                  </label>
                  {/* Другие фильтры */}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="articles__types">
          {/* Добавьте категории */}
          <button className="button__without__bg">
            <Link to="">Косметика</Link>
          </button>
          {/* Другие категории */}
        </div>
        <div className="articles__block__cards__div">
          <div className="articles__block__cards flex">
            {loading ? (
              <p>Загрузка статей...</p>
            ) : (
              filteredArticles.map((article) => <ArticleCard key={article.id} article={article} />)
            )}
          </div>
          <button className="articles__top__button" onClick={handleScrollToTop}>
            <img src={topArrowIcon} alt="Top Arrow Icon" />
          </button>
        </div>
        <button className="button__with__bg" style={{ marginTop: '50px' }}>
          Показать ещё
        </button>
      </div>
    </div>
  );
};

export default ArticlesList;
