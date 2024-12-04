import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchArticle } from '../utils/apiService'; // Импортируем функцию
import { Article } from '../types';
import './styles/ArticleDetailPage.css';

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
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
      <div className="article-detail-page container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>{article.title}</h1>
        <img 
          src={`${process.env.REACT_APP_API_URL}/${article.coverImage}`} 
          alt={article.title} 
          className="article-detail-image"
        />
        <p style={{ lineHeight: '1.6', color: '#333' }}>{article.content}</p>
      </div>
    </main>
  );
};

export default ArticleDetailPage;
