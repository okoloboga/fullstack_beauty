import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import rightArrow from '../../assets/images/right-arrow.svg';
import articlesImage1 from '../../assets/images/articles1.png';
import articlesImage2 from '../../assets/images/articles2.png';
import articlesImage3 from '../../assets/images/articles3.png';
import likeIcon from '../../assets/images/like.svg';
import dislikeIcon from '../../assets/images/dislike.svg';
import starIcon from '../../assets/images/star.svg';
import commentsIcon from '../../assets/images/comments.svg';

const ArticlesSection = () => {
  const sliderRef = useRef(null);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(true);

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
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', updateButtonVisibility);
      // Проверяем видимость кнопок при загрузке
      updateButtonVisibility();
      // Очистка слушателя при размонтировании
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
            <h1 className="title">
              популярные <br />
              статьи
            </h1>
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

              {/* Карточка статьи 1 */}
              <div className="articles__block__card">
                <div>
                  <img
                    src={articlesImage1}
                    alt=""
                    className="articles__block__card__img"
                  />
                  <h4>Анастасия Гринько</h4>
                  <div className="articles__block__card__activities flex">
                    <div className="flex">
                      <img src={likeIcon} alt="Лайк" />
                      <p>114</p>
                    </div>
                    <div className="flex">
                      <img src={dislikeIcon} alt="Дизлайк" />
                      <p>11</p>
                    </div>
                    <div className="flex">
                      <img src={starIcon} alt="Звезда" />
                      <p>23</p>
                    </div>
                    <div className="flex">
                      <img src={commentsIcon} alt="Комментарии" />
                      <p>5</p>
                    </div>
                  </div>
                  <p>
                    Культовый в своем роде: Dior Addict Lip Maximizer в оттенке
                    001 Pink
                  </p>
                </div>
                <Link className="button__without__bg" to="/articles">
                  Читать далее
                </Link>
              </div>

              {/* Карточка статьи 2 */}
              <div className="articles__block__card">
                <div>
                  <img
                    src={articlesImage2}
                    alt=""
                    className="articles__block__card__img"
                  />
                  <h4>Ольга Лопаткина</h4>
                  <div className="articles__block__card__activities flex">
                    <div className="flex">
                      <img src={likeIcon} alt="Лайк" />
                      <p>114</p>
                    </div>
                    <div className="flex">
                      <img src={dislikeIcon} alt="Дизлайк" />
                      <p>11</p>
                    </div>
                    <div className="flex">
                      <img src={starIcon} alt="Звезда" />
                      <p>23</p>
                    </div>
                    <div className="flex">
                      <img src={commentsIcon} alt="Комментарии" />
                      <p>5</p>
                    </div>
                  </div>
                  <p>Dasique Melting Candy Balm 09 Lychee Cream</p>
                </div>
                <Link className="button__without__bg" to="/articles">
                  Читать далее
                </Link>
              </div>

              {/* Карточка статьи 3 */}
              <div className="articles__block__card">
                <div>
                  <img
                    src={articlesImage3}
                    alt=""
                    className="articles__block__card__img"
                  />
                  <h4>Людмила Молчан</h4>
                  <div className="articles__block__card__activities flex">
                    <div className="flex">
                      <img src={likeIcon} alt="Лайк" />
                      <p>114</p>
                    </div>
                    <div className="flex">
                      <img src={dislikeIcon} alt="Дизлайк" />
                      <p>11</p>
                    </div>
                    <div className="flex">
                      <img src={starIcon} alt="Звезда" />
                      <p>23</p>
                    </div>
                    <div className="flex">
                      <img src={commentsIcon} alt="Комментарии" />
                      <p>5</p>
                    </div>
                  </div>
                  <p>
                    Likato Professional: Salicylic Acid Serum / Niacinamide +
                    Zinc Serum. Сравнение с культовыми аналогами The Ordinary
                  </p>
                </div>
                <Link className="button__without__bg" to="/articles">
                  Читать далее
                </Link>
              </div>

              {/* Повторение карточек при необходимости */}

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
              Все новости
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;
