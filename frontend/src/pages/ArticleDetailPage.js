import React from 'react';
import { useParams } from 'react-router-dom';
import { articles } from '../data/articles'; // Предположим, что вы храните данные статей в отдельном файле

const ArticleDetailPage = () => {
  const { id } = useParams();
  const article = articles.find((a) => a.id === parseInt(id));

  if (!article) {
    return <div>Статья не найдена</div>;
  }

  return (
    <main>
      <div className="article-detail-page container">
        <h1>{article.title}</h1>
        <img src={article.image} alt="" className="article-detail-image" />
        <p>{article.content}</p>
        {/* Добавьте остальные элементы, такие как автор, дата, комментарии и т.д. */}
      </div>
    </main>
  );
};

export default ArticleDetailPage;
