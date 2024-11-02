import React from 'react';
import { Link } from 'react-router-dom';
import likeIcon from '../assets/images/like.svg';
import dislikeIcon from '../assets/images/dislike.svg';
import starIcon from '../assets/images/star.svg';
import commentsIcon from '../assets/images/comments.svg';

const ArticleCard = ({ article }) => {
  return (
    <div className="articles__block__card">
      <div>
        <img
          src={article.coverImage ? `/${article.coverImage}` : require('../assets/images/default.jpg').default}
          alt=""
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
        <p>{article.content.slice(0, 100)}...</p>
      </div>
      <Link className="button__without__bg" to={`/articles/${article.id}`}>
        Читать далее
      </Link>
    </div>
  );
};

export default ArticleCard;