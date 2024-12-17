import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import rightArrow from '../../assets/images/right-arrow.svg';
import likeIcon from '../../assets/images/like.svg';
import dislikeIcon from '../../assets/images/dislike.svg';
import starIcon from '../../assets/images/star.svg';
import commentsIcon from '../../assets/images/comments.svg';
import { ArticleDetail } from '../../types';
import { fetchPopularArticles } from '../../utils/apiService';
import './ArticlesSection.css';
import ArticleCard from '../ArticlesPage/ArticleCard';

const ArticlesSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  // Используем useRef для доступа к слайдеру
  const sliderRef = useRef<HTMLDivElement | null>(null);
  // Управление видимостью кнопок предыдущего и следующего слайдов
  const [showPrev, setShowPrev] = useState<boolean>(false);
  const [showNext, setShowNext] = useState<boolean>(true);
  // Состояние для хранения списка статей
  const [articles, setArticles] = useState<ArticleDetail[]>([]);


  // Фильтрация статей на основе поиска
  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Функция для обновления видимости кнопок слайдера
  const updateButtonVisibility = () => {
    const slider = sliderRef.current;
    if (slider) {
      setShowPrev(slider.scrollLeft > 0); // Показываем кнопку "предыдущий", если есть место слева
      setShowNext(slider.scrollLeft + slider.clientWidth < slider.scrollWidth); // Показываем кнопку "следующий", если есть место справа
    }
  };

  // Обработчик клика для прокрутки слайдера вправо
  const handleNextClick = () => {
    const slider = sliderRef.current;
    if (slider) {
      slider.scrollBy({
        left: slider.clientWidth,
        behavior: 'smooth',
      });
    }
  };

  // Обработчик клика для прокрутки слайдера влево
  const handlePrevClick = () => {
    const slider = sliderRef.current;
    if (slider) {
      slider.scrollBy({
        left: -slider.clientWidth,
        behavior: 'smooth',
      });
    }
  };

  // useEffect для получения данных статей с сервера
  useEffect(() => {
    const loadArticles = async () => {
      try {
        const popularArticles = await fetchPopularArticles(3); // Задаём лимит
        setArticles(popularArticles); // Сохраняем статьи в состояние
      } catch (error) {
        console.error('Ошибка при загрузке популярных статей:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles(); // Вызываем функцию загрузки популярных статей
  }, []);

  // useEffect для добавления слушателя события скроллинга на слайдер
  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', updateButtonVisibility);
      updateButtonVisibility();  // Начальная проверка видимости кнопок
    }
    return () => {
      if (slider) {
        slider.removeEventListener('scroll', updateButtonVisibility);
      }
    };
  }, []);
  
  if (loading) {
    return <div>Загрузка популярных статей...</div>;
  }

  return (
    <section className="articles__section">
      <div className="container">
        <div className="articles__section__block">
          <div className="articles__section__block__title flex">
            <div></div>
            <h1 className="title">популярные <br /> статьи</h1>
          </div>
          <div className="slider-container">
            <div className="articles__section__block__cards flex" ref={sliderRef}>
              {/* Кнопка для прокрутки влево */}
              <button
                className={`slider-button prev ${showPrev ? 'show' : ''}`}
                onClick={handlePrevClick}
                style={{ display: showPrev ? 'block' : 'none' }}
              >
                <img src={rightArrow} alt="Предыдущий" />
              </button>

              <div className="articles__block__cards flex">
                {loading ? (
                  <p>Загрузка статей...</p>
                ) : (
                  filteredArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))
                )}
              </div>

              {/* Кнопка для прокрутки вправо */}
              <button
                className={`slider-button next ${showNext ? 'show' : ''}`}
                onClick={handleNextClick}
                style={{ display: showNext ? 'block' : 'none' }}
              >
                <img src={rightArrow} alt="Следующий" />
              </button>
            </div>
          </div>
          {/* Кнопка для перехода ко всем статьям */}
          <div className="articles__block__card__btn">
            <Link className="button__with__bg" to="/articles">
              Все статьи
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;
