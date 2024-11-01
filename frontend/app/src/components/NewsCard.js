import React from 'react';
import { Link } from 'react-router-dom';

const NewsCard = ({ news }) => {
  return (
    <div className="news__card">
      <p>{news.title}</p>
      <img src={news.image} alt={news.title} />
      <Link to={news.link}>
        <button className="button__without__bg">Читать</button>
      </Link>
    </div>
  );
};

export default NewsCard;
