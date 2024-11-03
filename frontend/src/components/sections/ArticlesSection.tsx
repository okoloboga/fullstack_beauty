import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import rightArrow from '../../assets/images/right-arrow.svg';
import likeIcon from '../../assets/images/like.svg';
import dislikeIcon from '../../assets/images/dislike.svg';
import starIcon from '../../assets/images/star.svg';
import commentsIcon from '../../assets/images/comments.svg';

// Тип данных статьи, чтобы TypeScript понимал структуру каждого объекта статьи
interface Article {
  id: number;
  coverImage: string;
  title: string;
  description: string;
  author: {
    name: string;
  };
  likes?: number;
  dislikes?: number;
  stars?: number;
  comments?: number;
}

const apiUrl = process.env.REACT_APP_API_URL; // URL API, который используется для получения данных

const ArticlesSection: React.FC = () => {
  // Используем useRef для доступа к слайдеру
  const sliderRef = useRef<HTMLDivElement | null>(null);
  // Управление видимостью кнопок предыдущего и следующего слайдов
  const [showPrev, setShowPrev] = useState<boolean>(false);
  const [showNext, setShowNext] = useState<boolean>(true);
  // Состояние для хранения списка статей
  const [articles, setArticles] = useState<Article[]>([]);

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
    const fetchArticles = async () => {
      try {
        const response = await axios.get<Article[]>(`${apiUrl}/api/articles?sort=popular&limit=3`); // Получаем популярные статьи, максимум 3
        setArticles(response.data); // Сохраняем статьи в состояние
      } catch (error) {
        console.error('Ошибка при загрузке статей:', error);
      }
    };

    fetchArticles(); // Вызов функции получения статей
  }, []);

  // useEffect для добавления слушателя события скроллинга на слайдер
  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', updateButtonVisibility); // Добавляем слушателя события скроллинга для обновления видимости кнопок
      updateButtonVisibility(); // Инициализация видимости кнопок при загрузке
      return () => {
        slider.removeEventListener('scroll', updateButtonVisibility); // Убираем слушателя при размонтировании компонента
      };
    }
  }, []);

  return (
    <section className="articles__section">
      <div className="container">
        <div className="articles__block">
          <div className="articles__block__title flex">
            <div></div>
            <h1 className="title">популярные <br /> статьи</h1>
          </div>
          <div className="slider-container">
            <div className="articles__block__cards flex" ref={sliderRef}>
              {/* Кнопка для прокрутки влево */}
              <button
                className="slider-button prev"
                onClick={handlePrevClick}
                style={{ display: showPrev ? 'block' : 'none' }}
              >
                <img src={rightArrow} alt="Предыдущий" />
              </button>

              {/* Карточки статей */}
              {articles.map((article) => (
                <div className="articles__block__card" key={article.id}>
                  <div>
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="articles__block__card__img"
                    />
                    <h4>{article.author.name}</h4>
                    <div className="articles__block__card__activities flex">
                      <div className="flex">
                        <img src={likeIcon} alt="Лайк" />
                        <p>{article.likes || 0}</p> {/* Если likes нет, показываем 0 */}
                      </div>
                      <div className="flex">
                        <img src={dislikeIcon} alt="Дизлайк" />
                        <p>{article.dislikes || 0}</p> {/* Если dislikes нет, показываем 0 */}
                      </div>
                      <div className="flex">
                        <img src={starIcon} alt="Звезда" />
                        <p>{article.stars || 0}</p> {/* Если stars нет, показываем 0 */}
                      </div>
                      <div className="flex">
                        <img src={commentsIcon} alt="Комментарии" />
                        <p>{article.comments || 0}</p> {/* Если comments нет, показываем 0 */}
                      </div>
                    </div>
                    <p>{article.description}</p>
                  </div>
                  <Link className="button__without__bg" to={`/articles/${article.id}`}>
                    Читать далее
                  </Link>
                </div>
              ))}

              {/* Кнопка для прокрутки вправо */}
              <button
                className="slider-button next"
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
