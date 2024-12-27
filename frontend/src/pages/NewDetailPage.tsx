import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchContent, incrementViews } from '../utils/apiService'; // Импортируем функцию
import { ContentDetail } from '../types';
import './styles/ArticleDetailPage.css';
import rightArrow from '../assets/images/right-arrow.svg';
import ConnectSection from '../components/MainContent/ConnectSection';

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [newContent, setNew] = useState<ContentDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // Функция для получения данных о Новосте
  const getNew = async () => {
    try {
      if (id) {
        const viewdNews = JSON.parse(localStorage.getItem('viewedArticles') || '[]');
        
        if (!viewdNews.includes(id)) {
          await incrementViews(id);
          viewdNews.push(id);
          localStorage.setItem('viewedArticles', JSON.stringify(viewdNews));
        }
        
        const data = await fetchContent(id); // Вызов функции из articleService
        setNew(data);
      } else {
        setError('Невалидный идентификатор новости');
      }
    } catch (err) {
      setError('Ошибка при загрузке новости');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNew(); // Загружаем статью при монтировании компонента
  }, [id]);

  if (loading) {
    return <div>Загрузка новости...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!newContent) {
    return <div>Новость не найдена</div>;
  }

  // Логика для разбивки текста
  const contentLength = newContent.content.length;
  let contentPart1 = newContent.content;
  let contentPart2 = '';

  if (contentLength > 600) {
    const middleIndex = Math.floor(contentLength / 2); // Находим середину текста
    contentPart1 = newContent.content.slice(0, middleIndex); // Первая половина
    contentPart2 = newContent.content.slice(middleIndex); // Вторая половина
  }

  // Функции для переключения изображений в слайдере
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? newContent.contentImages.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === newContent.contentImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <main>
      <section className="product__section container">
        <div className="product__img relative">
          <p>{newContent.title}</p>
          <img 
            src={`${process.env.REACT_APP_API_URL}/${newContent.coverImage}`} 
            alt={newContent.title} 
            className="article-detail-image"
          />
        </div>

        {/* Описание статьи и основная информация - автор, просмотры, дата создания */}
        <div className="product__description flex">
          <div>
           <p>Добавлено {new Date(newContent.createdAt).toLocaleDateString('ru-RU')}</p>
          </div>
          {contentPart2 ? (
            <>
              <div className="content-column">
                <p style={{ lineHeight: '1.6', color: '#333' }}>{contentPart1}</p>
              </div>
              <div className="content-column">
                <p style={{ lineHeight: '1.6', color: '#333' }}>{contentPart2}</p>
              </div>
            </>
          ) : (
            <div>
              <p style={{ lineHeight: '1.6', color: '#333' }}>{newContent.content}</p>
            </div>
          )}
        </div>

        {/* Слайдер с изображениями из new.contentImages */}
        {newContent.contentImages && newContent.contentImages.length > 0 && (
          <div className="product__slider">
            <div className="product__slider__left">
              <button className="slider-button prev" onClick={prevImage}>
                <img src={rightArrow} alt="prev" />
              </button>
            </div>
            <div className="product__slider__right articles__section">
              <div className="articles__block">
                <div className="slider-container">
                  <div className="articles__block__cards flex">
                    {newContent.contentImages.map((image, index) => (
                      <div
                        key={index}
                        className={`articles__block__card ${
                          index === currentImageIndex ? 'active' : ''
                        }`}
                      >
                        <div>
                          <img
                            src={`${process.env.REACT_APP_API_URL}/${image}`}
                            alt={`article-image-${index}`}
                            className="articles__block__card__img"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="product__slider__right">
              <button className="slider-button next" onClick={nextImage}>
                <img src={rightArrow} alt="next" />
              </button>
            </div>
          </div>
        )}

      </section>
      <ConnectSection />
    </main>
  );
};

export default ArticleDetailPage;
