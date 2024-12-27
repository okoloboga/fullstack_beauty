import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from './ArticleCard';
import filterIcon from '../../assets/images/filter-icon.svg';
import topArrowIcon from '../../assets/images/top-arrow.svg';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { ContentDetail, DecodedToken, ArticleFilters } from '../../types'
import { fetchArticles } from '../../utils/apiService';

// Компонент списка статей
const ArticlesList: React.FC = () => {
  // Состояния для управления поиском, фильтрами и popup
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [articles, setArticles] = useState<ContentDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string | null>(null); // Для хранения роли пользователя
  const [filters, setFilters] = useState<ArticleFilters>({
    sortBy: null,
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
    const loadArticles = async () => {
      try {
        const articlesData = await fetchArticles(); // Используем вынесенную функцию
        setArticles(articlesData);
      } catch (error) {
        toast.error('Не удалось загрузить статьи');
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  // Обработчик изменения фильтров
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setFilters({
      sortBy: name as ArticleFilters['sortBy'],
    });
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory((prevCategory) => (prevCategory === category ? null : category));
  };

  // Фильтрация статей на основе поиска и выбранных фильтров
  const filteredArticles = useMemo(() => {
    const result = articles
      .filter((article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter((article) => (selectedCategory ? article.category === selectedCategory : true))
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'views':
            return Number(b.views) - Number(a.views);
          case 'likes':
            return b.likes - a.likes;
          case 'author':
            return a.author.name.localeCompare(b.author.name);
          case 'new':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'old':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          default:
            return 0;
        }
      });

    console.log('Selected Category:', selectedCategory);
    console.log('Filtered Articles:', result);
    return result;
  }, [articles, searchQuery, selectedCategory, filters.sortBy]);

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
          {/* Фильтр в popup */}
          {isPopupOpen && (
            <div className="popup">
              <div className="popup-content text-left flex justify-center item-center flex-column">
                <button className="close-btn" onClick={handleClosePopup}>
                  &times;
                </button>
                <div className="flex flex-column">
                  <h2>Сортировать:</h2>
                  <label>
                    <input
                      type="radio"
                      name="views"
                      checked={filters.sortBy === 'views'}
                      onChange={handleFilterChange}
                    />{' '}
                    По количеству просмотров
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="likes"
                      checked={filters.sortBy === 'likes'}
                      onChange={handleFilterChange}
                    />{' '}
                    По количеству лайков
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="author"
                      checked={filters.sortBy === 'author'}
                      onChange={handleFilterChange}
                    />{' '}
                    По автору
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="new"
                      checked={filters.sortBy === 'new'}
                      onChange={handleFilterChange}
                    />{' '}
                    От новых к старым
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="old"
                      checked={filters.sortBy === 'old'}
                      onChange={handleFilterChange}
                    />{' '}
                    От старых к новым
                  </label>
                  {/* Другие фильтры */}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="articles__types">
          {['Косметика', 'Одежда', 'Украшения', 'Причёски', 'Питание', 'Спорт'].map((category) => (
            <button
              key={category}
              type="button" // Указываем тип кнопки
              className={`${selectedCategory === category ? 'button__with__bg' : 'button__without__bg'}`}
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </button>
          ))}
          {/* Другие категории */}
        </div>
        <div className="articles__block__cards__div">
          <div className="articles__block__cards flex">
            {loading ? (
              <p>Загрузка статей...</p>
            ) : (
              filteredArticles.map((article) => (
                <ArticleCard key={article.id} content={article} />
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
