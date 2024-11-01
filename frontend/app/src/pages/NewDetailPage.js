import React from 'react';
import { useParams } from 'react-router-dom';
import { newsItems } from '../data/news';

const NewsDetailPage = () => {
  const { id } = useParams();
  const news = newsItems.find((n) => n.id === parseInt(id));

  if (!news) {
    return <div>Новость не найдена</div>;
  }

  return (
    <main>
      <div className="news-detail-page container">
        <h1>{news.title}</h1>
        <img src={news.image} alt={news.title} />
        <p>{news.content}</p>
        {/* Добавьте дополнительные элементы, если необходимо */}
      </div>
    </main>
  );
};

export default NewsDetailPage;
