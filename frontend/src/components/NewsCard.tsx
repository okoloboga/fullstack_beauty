import React from 'react';
import { Link } from 'react-router-dom';
import likeIcon from '../assets/images/like.svg';

// Интерфейс для props компонента NewsCard
interface NewsProps {
  news: {
    id: number;
    title: string;
    description: string;
    coverImage: string;
    likes: number;
  };
}

// Компонент NewsCard представляет карточку с новостью
// Отображает изображение, заголовок, описание и количество лайков новости
const NewsCard: React.FC<NewsProps> = ({ news }) => {
  return (
    <div className="news__card">
      {/* Изображение обложки новости */}
      <img src={news.coverImage} alt={news.title} className="news__card__image" />
      <div className="news__card__content">
        {/* Заголовок новости */}
        <h3 className="news__card__title">{news.title}</h3>
        {/* Описание новости */}
        <p className="news__card__description">{news.description}</p>
        <div className="news__card__actions flex item-center">
          {/* Лайки для новости */}
          <div className="news__card__likes flex">
            <img src={likeIcon} alt="Лайки" />
            <p>{news.likes}</p>
          </div>
          {/* Ссылка на детальный просмотр новости */}
          <Link to={`/news/${news.id}`}>
            <button className="button__without__bg">Читать</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
