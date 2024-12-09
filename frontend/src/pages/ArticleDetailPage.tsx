import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchArticle } from '../utils/apiService'; // Импортируем функцию
import { ArticleDetail } from '../types';
import './styles/ArticleDetailPage.css';
import eyeIcon from '../assets/images/eye-icon.svg';
import rightArrow from '../assets/images/right-arrow.svg';
import likes from '../assets/images/like.svg';
import dislikes from '../assets/images/dislike.svg';
import star from '../assets/images/star.svg';
import comments from '../assets/images/comments.svg';

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getArticle = async () => {
      try {
        if (id) {
          const data = await fetchArticle(id); // Вызов функции из articleService
          setArticle(data);
        } else {
          setError('Невалидный идентификатор статьи');
        }
      } catch (err) {
        setError('Ошибка при загрузке статьи');
      } finally {
        setLoading(false);
      }
    };

    getArticle(); // Вызываем getArticle без проверки id в зависимости
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
            <h4>{article.author?.name}</h4>
            <p>{article.createdAt}</p>
            <div className="flex item-center">
              <img src={eyeIcon} alt="Просмотры" />
              <p>{article.views}</p>
            </div>  
          </div>
          <div>
            <p style={{ lineHeight: '1.6', color: '#333' }}>{article.content}</p>
          </div>
        </div>

        {/* Активности статьи: лайки, дизлайки, звезды, комментарии */} 
        <div className="product__activities">
          <div className="flex text-center">
            <div className="product__activity">
              <div>
                <img src={likes} alt="Нравится" />
              </div>
              <p>{article.likes}</p>
            </div>
            <div className="product__activity">
              <div>
                <img src={dislikes} alt="Не нравится" />
              </div>
              <p>{article.dislikes}</p>
            </div>
            <div className="product__activity">
              <div>
                <img src={star} alt="Звезды" />
              </div>
              <p>{article.favoriteCount}</p>
            </div>
            <div className="product__activity">
              <div>
                <img src={comments} alt="Комментарии" />
              </div>
              <p>{article.comments && article.comments.length === 0 ? (
                '0'
                ) : (
                  article.comments?.length
                  )}</p>
            </div>
          </div>
        </div>

        {/* Комментарии */}
        <div className="product__comments">
          {article.comments && article.comments.length === 0 ? (
            <p>Нет комментариев</p>
          ) : (
            article.comments?.map((comment) => (
              <div className="product__comment" key={comment.id}>
                <h3>{comment.user?.name}</h3>
                <p>{new Date(comment.createdAt).toLocaleString()}</p>
                <p>{comment.contentText}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default ArticleDetailPage;
