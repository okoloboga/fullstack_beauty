import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Определение типа для статьи
interface Article {
  id: number;
  title: string;
  image: string;
  content: string;
}

const apiUrl = process.env.REACT_APP_API_URL;

// Основной компонент страницы детализации статьи
const ArticleDetailPage: React.FC = () => {
  // Получаем параметр id из URL. TypeScript знает, что useParams возвращает Record<string, string | undefined>
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get<Article>(`${apiUrl}/api/articles/${id}`);
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

  // Если статья загружается, отображаем сообщение о загрузке
  if (loading) {
    return <div>Загрузка статьи...</div>;
  }

  // Если произошла ошибка, отображаем сообщение об ошибке
  if (error) {
    return <div>{error}</div>;
  }

  // Если статья не найдена, отображаем сообщение об ошибке
  if (!article) {
    return <div>Статья не найдена</div>;
  }

  // Основной рендер компонента статьи
  return (
    <main>
      <div className="article-detail-page container">
        <h1>{article.title}</h1>
        <img src={article.image} alt={article.title} className="article-detail-image" />
        <p>{article.content}</p>
        {/* Здесь можно добавить другие элементы, такие как автор, дата публикации, комментарии и т.д. */}
      </div>
    </main>
  );
};

export default ArticleDetailPage;
