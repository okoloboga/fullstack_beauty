import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ArticleCard from './ArticleCard';
import filterIcon from '../assets/images/filter-icon.svg';
import topArrowIcon from '../assets/images/top-arrow.svg';
import { jwtDecode } from 'jwt-decode'; // Правильный импорт без фигурных скобок

// URL API для получения данных
const apiUrl = process.env.REACT_APP_API_URL;

// Интерфейс для типа статьи
interface Article {
  id: number;
  title: string;
  coverImage?: string;
  author: {
    name: string;
  };
  likes?: number;
  dislikes?: number;
  stars?: number;
  comments?: number;
  content: string;
}

// Интерфейс для типа токена
interface DecodedToken {
  role: string;
}

// Компонент списка статей
const ArticlesList: React.FC = () => {
  // Состояния для управления поиском, фильтрами и popup
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string | null>(null); // Для хранения роли пользователя

  // Получаем роль пользователя из токена
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        setUserRole(decodedToken.role);
      } catch (error) {
        console.error('Ошибка декодирования токена:', error);
      }
    }
  }, []);

  // Запрос на сервер для получения всех статей
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get<Article[]>(`${apiUrl}/api/articles`);
        setArticles(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке статей:', error);
      } finally {
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
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
              filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
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
