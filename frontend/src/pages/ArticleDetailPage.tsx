import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

// Определение типа для статьи
interface Article {
  id: number;
  title: string;
  coverImage: string; // Изменено на coverImage
  content: string;
}

const apiUrl = process.env.REACT_APP_API_URL;

// Основной компонент страницы детализации статьи
const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axiosInstance.get<Article>(`${apiUrl}/api/articles/${id}`);
        setArticle(response.data);
      } catch (err) {
        setError('Ошибка при загрузке статьи');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
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
      <div className="article-detail-page container">
        <h1>{article.title}</h1>
        {/* Изменено: корректный путь к изображению */}
        <img src={`${apiUrl}/${article.coverImage}`} alt={article.title} className="article-detail-image" />
        <p>{article.content}</p>
      </div>
    </main>
  );
};

export default ArticleDetailPage;
