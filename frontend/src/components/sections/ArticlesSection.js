import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import rightArrow from '../../assets/images/right-arrow.svg';
import likeIcon from '../../assets/images/like.svg';
import dislikeIcon from '../../assets/images/dislike.svg';
import starIcon from '../../assets/images/star.svg';
import commentsIcon from '../../assets/images/comments.svg';

const apiUrl = process.env.REACT_APP_API_URL;

const ArticlesSection = () => {
  const sliderRef = useRef(null);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(true);
  const [articles, setArticles] = useState([]);

  const updateButtonVisibility = () => {
    const slider = sliderRef.current;
    if (slider) {
      setShowPrev(slider.scrollLeft > 0);
      setShowNext(slider.scrollLeft + slider.clientWidth < slider.scrollWidth);
    }
  };

  const handleNextClick = () => {
    const slider = sliderRef.current;
    if (slider) {
      slider.scrollBy({
        left: slider.clientWidth,
        behavior: 'smooth',
      });
    }
  };

  const handlePrevClick = () => {
    const slider = sliderRef.current;
    if (slider) {
      slider.scrollBy({
        left: -slider.clientWidth,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/articles?sort=popular&limit=3`); // например, для получения самых популярных статей
        setArticles(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке статей:', error);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', updateButtonVisibility);
      updateButtonVisibility();
      return () => {
        slider.removeEventListener('scroll', updateButtonVisibility);
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
              <button
                className="slider-button prev"
                onClick={handlePrevClick}
                style={{ display: showPrev ? 'block' : 'none' }}
              >
                <img src={rightArrow} alt="Предыдущий" />
              </button>

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
                        <p>{article.likes || 0}</p>
                      </div>
                      <div className="flex">
                        <img src={dislikeIcon} alt="Дизлайк" />
                        <p>{article.dislikes || 0}</p>
                      </div>
                      <div className="flex">
                        <img src={starIcon} alt="Звезда" />
                        <p>{article.stars || 0}</p>
                      </div>
                      <div className="flex">
                        <img src={commentsIcon} alt="Комментарии" />
                        <p>{article.comments || 0}</p>
                      </div>
                    </div>
                    <p>{article.description}</p>
                  </div>
                  <Link className="button__without__bg" to={`/articles/${article.id}`}>
                    Читать далее
                  </Link>
                </div>
              ))}

              <button
                className="slider-button next"
                onClick={handleNextClick}
                style={{ display: showNext ? 'block' : 'none' }}
              >
                <img src={rightArrow} alt="Следующий" />
              </button>
            </div>
          </div>
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
