import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ContentCardProps } from '../../types';

const apiUrl = process.env.REACT_APP_API_URL;

// Компонент карточки статьи
const ArticleCard: React.FC<ContentCardProps> = ({ content }) => {
  const navigate = useNavigate(); // Вызываем useNavigate внутри компонента

  return (
    <div className="news__block__card">
      <div>
        <p>{content.title}</p>
        {/* Изображение статьи или изображение по умолчанию */}
        <img
          src={`${apiUrl}/${content.coverImage}`} // Используем apiUrl, чтобы собрать полный URL
          alt={content.title}
          className="news__block__card__img"
        />
        {/* Короткое содержание статьи */}
        {/* Кнопка для перехода к полной версии статьи */}
        <button
          className="button__without__bg"
          onClick={() => navigate(`/news/${content.id}`)} // Навигация при клике
        >
          Читать
        </button>
      </div>
    </div>
  );
};

export default ArticleCard;
