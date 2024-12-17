import React from 'react';
import { Link } from 'react-router-dom';
import { NewCardProps } from '../../types';

const apiUrl = process.env.REACT_APP_API_URL;

// Компонент карточки статьи
const ArticleCard: React.FC<NewCardProps> = ({ newContent }) => {
  return (
    <div className="news__block__card">
      <div>
        <p>{newContent.title}</p>
        {/* Изображение статьи или изображение по умолчанию */}
        <img
          src={`${apiUrl}/${newContent.coverImage}`} // Используем apiUrl, чтобы собрать полный URL
          alt={newContent.title}
          className="news__block__card__img"
        />
        {/* Короткое содержание статьи */}
      </div>
      {/* Ссылка для перехода к полной версии статьи */}
      <Link className="button__without__bg" to={`/news/${newContent.id}`}>
        Читать
      </Link>
    </div>
  );
};

export default ArticleCard;
