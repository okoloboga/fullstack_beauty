import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Импорт useNavigate
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { 
    fetchContent, toggleDislike, toggleLike, createComment, fetchComments, toggleFavorite, incrementViews, deleteContent
  } from '../utils/apiService'; // Импортируем функцию
import { ContentDetail, ContentComment, DecodedToken } from '../types';
import './styles/ArticleDetailPage.css';
import eyeIcon from '../assets/images/eye-icon.svg';
import rightArrow from '../assets/images/right-arrow.svg';
import likes from '../assets/images/like.svg';
import dislikes from '../assets/images/dislike.svg';
import star from '../assets/images/star.svg';
import commentsIcon from '../assets/images/comments.svg';
import ConnectSection from '../components/MainContent/ConnectSection';

const ArticleDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<ContentDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [comments, setComments] = useState<ContentComment[]>([]);
  const [liked, setLiked] = useState<boolean>(false); // Состояние для лайка
  const [disliked, setDisliked] = useState<boolean>(false); // Состояние для дизлайка
  const [isFavorite, setIsFavorite] = useState(false);
  const [newComment, setNewComment] = useState<string>('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);


  // Функция для получения данных о статье
  const getArticle = async () => {
    try {
      if (id) {
        const viewedArticles = JSON.parse(localStorage.getItem('viewedArticles') || '[]');
  
        if (!viewedArticles.includes(id)) {
          await incrementViews(id);
          viewedArticles.push(id);
          localStorage.setItem('viewedArticles', JSON.stringify(viewedArticles));
        }
  
        const data = await fetchContent(id); // Вызов функции из articleService
        setArticle(data);
        setLiked(data.likes > 0); // Устанавливаем состояние лайка
        setDisliked(data.dislikes > 0); // Устанавливаем состояние дизлайка
      } else {
        setError('Невалидный идентификатор статьи');
      }
    } catch (err) {
      setError('Ошибка при загрузке статьи');
      console.error('Ошибка при загрузке статьи:', err);
    } finally {
      setLoading(false);
    }
  };

    // Получаем роль и имя пользователя из токена
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode<DecodedToken>(token);
          console.log('Роль пользователя:', decodedToken.role);
          console.log('Имя пользователя:', decodedToken.name);
          setUserRole(decodedToken.role);
          setCurrentUsername(decodedToken.name);
        } catch (error) {
          console.error('Ошибка декодирования токена:', error);
        }
      }
    }, []);

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

  const isAuthor = !!currentUsername && !!article.author && (currentUsername === article.author.name);
  const isAdmin = userRole === 'admin';

  // Функция для удаления статьи
  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить эту статью?')) {
      setIsDeleting(true);
      try {
        await deleteContent(article.id);
        // После успешного удаления, обновляем состояние новостей
        navigate('/articles');
        toast.success('Статья успешно удалена');
      } catch (error) {
        // Ошибка уже обработана в функции deleteArticle
      }
    };
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
           <h4>{article.author.name}</h4>
           {(isAuthor || isAdmin) && (
              <button
                className="button__without__bg"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Удаление...' : 'УДАЛИТЬ СТАТЬЮ'}
              </button>
            )}
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
                    <h3>{comment.author}</h3>
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
