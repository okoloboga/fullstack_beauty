import React from 'react';
import { Link } from 'react-router-dom';
import likeIcon from '../assets/images/like.svg';

const NewsCard = ({ news }) => {
  return (
    <div className="news__card">
      <img src={news.coverImage} alt={news.title} className="news__card__image" />
      <div className="news__card__content">
        <h3 className="news__card__title">{news.title}</h3>
        <p className="news__card__description">{news.description}</p>
        <div className="news__card__actions flex item-center">
          <div className="news__card__likes flex">
            <img src={likeIcon} alt="Лайки" />
            <p>{news.likes}</p>
          </div>
          <Link to={`/news/${news.id}`}>
            <button className="button__without__bg">Читать</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
