import React from 'react';
import { useParams } from 'react-router-dom';
import { articles } from '../data/articles'; // Предположим, что вы храните данные статей в отдельном файле

// Определение типа для статьи
interface Article {
  id: number;
  title: string;
  image: string;
  content: string;
}

// Основной компонент страницы детализации статьи
const ArticleDetailPage: React.FC = () => {
  // Получаем параметр id из URL. TypeScript знает, что useParams возвращает Record<string, string | undefined>
  const { id } = useParams<{ id: string }>();

  // Находим статью по id (преобразуем id в число для сравнения)
  const article = articles.find((a: Article) => a.id === parseInt(id || '', 10));

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
