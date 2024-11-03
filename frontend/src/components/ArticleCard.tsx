import React from 'react';
import { Link } from 'react-router-dom';
import likeIcon from '../assets/images/like.svg';
import dislikeIcon from '../assets/images/dislike.svg';
import starIcon from '../assets/images/star.svg';
import commentsIcon from '../assets/images/comments.svg';

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

// Интерфейс для пропсов компонента ArticleCard
interface ArticleCardProps {
  article: Article;
}

// Компонент карточки статьи
const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className="articles__block__card">
      <div>
        {/* Изображение статьи или изображение по умолчанию */}
        <img
          src={article.coverImage ? `/${article.coverImage}` : require('../assets/images/default.jpg').default}
          alt={article.title}
          className="articles__block__card__img"
        />
        <h4>{article.author.name}</h4>
        {/* Активности статьи: лайки, дизлайки, звезды, комментарии */}
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
        {/* Короткое содержание статьи */}
        <p>{article.content.slice(0, 100)}...</p>
      </div>
      {/* Ссылка для перехода к полной версии статьи */}
      <Link className="button__without__bg" to={`/articles/${article.id}`}>
        Читать далее
      </Link>
    </div>
  );
};

export default ArticleCard;
