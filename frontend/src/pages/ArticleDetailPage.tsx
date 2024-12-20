import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { fetchContent, toggleDislike, toggleLike, createComment, fetchComments, toggleFavorite } from '../utils/apiService'; // Импортируем функцию
import { ArticleDetail, ContentComment } from '../types';
import './styles/ArticleDetailPage.css';
import eyeIcon from '../assets/images/eye-icon.svg';
import rightArrow from '../assets/images/right-arrow.svg';
import likes from '../assets/images/like.svg';
import dislikes from '../assets/images/dislike.svg';
import star from '../assets/images/star.svg';
import commentsIcon from '../assets/images/comments.svg';
import ConnectSection from '../components/MainContent/ConnectSection';

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [comments, setComments] = useState<ContentComment[]>([]);
  const [liked, setLiked] = useState<boolean>(false); // Состояние для лайка
  const [disliked, setDisliked] = useState<boolean>(false); // Состояние для дизлайка
  const [isFavorite, setIsFavorite] = useState(false);
  const [newComment, setNewComment] = useState<string>('');

  // Функция для получения данных о статье
  const getArticle = async () => {
    try {
      if (id) {
        const data = await fetchContent(id); // Вызов функции из articleService
        setArticle(data);
        setLiked(data.likes > 0); // Устанавливаем состояние лайка
        setDisliked(data.dislikes > 0); // Устанавливаем состояние дизлайка
      } else {
        setError('Невалидный идентификатор статьи');
      }
    } catch (err) {
      setError('Ошибка при загрузке статьи');
    } finally {
      setLoading(false);
    }
  };

  // Функция для получения комментариев
  const getCommentsForArticle = async () => {
    try {
      if (id) {
        const data = await fetchComments(Number(id)); // Получаем комментарии для статьи
        setComments(data);
      }
    } catch (err) {
      toast.error("Ошибка при загрузке комментариев");
    }
  };

  useEffect(() => {
    getCommentsForArticle();  
    getArticle(); // Загружаем статью при монтировании компонента
  }, [id]);

  if (loading) {
    return <div>Загрузка статьи...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!article) {
    return <div>Статья не найдена</div>;
  }

  // Логика для разбивки текста
  const contentLength = article.content.length;
  let contentPart1 = article.content;
  let contentPart2 = '';

  if (contentLength > 600) {
    const middleIndex = Math.floor(contentLength / 2); // Находим середину текста
    contentPart1 = article.content.slice(0, middleIndex); // Первая половина
    contentPart2 = article.content.slice(middleIndex); // Вторая половина
  }

  // Функции для переключения изображений в слайдере
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? article.contentImages.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === article.contentImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Функции для обработки лайков и дизлайков
  const handleLikeClick = async () => {
    try {
      if (liked) {
        setLiked(false); // Если лайк уже поставлен, убираем его
        await toggleLike(article!.id, 'like'); // Вызов функции для убирания лайка
      } else {
        setLiked(true); // Если лайк не поставлен, ставим
        await toggleLike(article!.id, 'like'); // Вызов функции для добавления лайка
      }

      // Перезапрашиваем данные о статье после изменения лайка
      getArticle();
    } catch (err) {
      console.error('Ошибка при обработке лайка:', err);
    }
  };

  const handleDislikeClick = async () => {
    try {
      if (disliked) {
        setDisliked(false); // Если дизлайк уже поставлен, убираем его
        await toggleDislike(article!.id, 'dislike'); // Вызов функции для убирания дизлайка
      } else {
        setDisliked(true); // Если дизлайк не поставлен, ставим
        await toggleDislike(article!.id, 'dislike'); // Вызов функции для добавления дизлайка
      }

      // Перезапрашиваем данные о статье после изменения дизлайка
      getArticle();
    } catch (err) {
      console.error('Ошибка при обработке дизлайка:', err);
    }
  };

  // Обработчик клика для добавления/удаления из избранного
  const handleFavoriteClick = async () => {
    try {
      if (isFavorite) {
        setIsFavorite(false);  // Если контент уже в избранном, убираем его
        await toggleFavorite(article!.id);  // Убираем из избранного
      } else {
        setIsFavorite(true);  // Если контент не в избранном, добавляем его
        await toggleFavorite(article!.id);  // Добавляем в избранное
      }
    } catch (err) {
      console.error('Ошибка при обработке избранного:', err);
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value); // Обновляем состояние при изменении текста комментария
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (newComment.trim()) {
      try {
        // Попытка отправить комментарий
        await createComment(article!.id, newComment);
  
        // Если комментарий успешно добавлен
        console.log('Новый комментарий:', newComment);
  
        // Обновляем список комментариев с новым добавленным комментарием
        await getCommentsForArticle();
  
        // Обновляем счетчик комментариев в статье
        if (article) {
          setArticle({
            ...article,
            comments: (article.comments || 0) + 1, // Увеличиваем счетчик
          });
        }
  
        // Очистить поле ввода после отправки
        setNewComment('');
      } catch (error: unknown) {
        // Если возникает ошибка, мы её обрабатываем
        console.error('Ошибка при добавлении комментария:', error);
  
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || 'Ошибка при добавлении комментария');
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Произошла неизвестная ошибка');
        }
      }
    } else {
      // Если комментарий пустой
      toast.warning('Комментарий не может быть пустым');
    }
  };

  return (
    <main>
      <section className="product__section container">
        <div className="product__img relative">
          <p>{article.title}</p>
          <img 
            src={`${process.env.REACT_APP_API_URL}/${article.coverImage}`} 
            alt={article.title} 
            className="article-detail-image"
          />
        </div>

        {/* Описание статьи и основная информация - автор, просмотры, дата создания */}
        <div className="product__description flex">
          <div>
           <h4>{article.author?.name || article.author?.username}</h4>
           <p>Добавлено {new Date(article.createdAt).toLocaleDateString('ru-RU')}</p>
            <div className="flex item-center">
              <img src={eyeIcon} alt="Просмотры" />
              <p>{article.views}</p>
            </div>  
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
              <p style={{ lineHeight: '1.6', color: '#333' }}>{article.content}</p>
            </div>
          )}
        </div>

        {/* Слайдер с изображениями из article.contentImages */}
        {article.contentImages && article.contentImages.length > 0 && (
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
                    {article.contentImages.map((image, index) => (
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

        {/* Активности статьи: лайки, дизлайки, звезды, комментарии */}
        <div className="product__activities">
          <div></div>
          <div className="flex text-center" style={{ gap: '20px' }}>
            <div className="product__activity">
              <button onClick={handleLikeClick}>
                <img src={likes} alt="Нравится" />
              </button>
              <p>{article.likes || 0}</p>
            </div>
            <div className="product__activity">
              <button onClick={handleDislikeClick}>
                <img src={dislikes} alt="Не нравится" />
              </button>
              <p>{article.dislikes || 0}</p>
            </div>
            <div className="product__activity">
              <button onClick={handleFavoriteClick}>
                <img src={star} alt="Звезды" />
              </button>
              <p>{article.favoritesCount || 0}</p>
            </div>
            <div className="product__activity">
              <div>
                <img src={commentsIcon} alt="Комментарии" />
              </div>
              <p>{article.comments || 0}</p>
            </div>
          </div>
        </div>

        {/* Форма для нового комментария */}
        <div className="product__create__comment">
          <div></div>
          <div className="flex flex-column" style={{ gap: '20px' }}>
            <p>Комментарии</p>
            <input 
              type="text" 
              value={newComment} 
              onChange={handleCommentChange} 
              placeholder="Напишите ваш комментарий..."
            />
            <button 
              className="button__without__bg"
              onClick={handleCommentSubmit} 
              disabled={!newComment.trim()}
            >
              Отправить
            </button>
          </div>
        </div>

        {/* Список комментариев */}
        <div className="product__comments">
          <div></div>
          <div className="flex flex-column">
            {comments.length === 0 ? (
              <p>Нет комментариев</p>
            ) : (
              comments.map((comment) => (
                <div className="product__comment" key={comment.id}>
                  <div className="flex flex-column">
                    <h3>{comment.user?.name || comment.user?.username}</h3>
                    <p>{new Date(comment.createdAt).toLocaleString('ru-RU')}</p>
                  </div>
                  <div>
                    <p>{comment.contentText}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </section>
      <ConnectSection />
    </main>
  );
};

export default ArticleDetailPage;
