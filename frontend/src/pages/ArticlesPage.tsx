import React from 'react';
import ArticlesList from '../components/ArticlesList';
import ConnectSection from '../components/sections/ConnectSection';

// Компонент страницы со статьями
const ArticlesPage: React.FC = () => {
  return (
    <main>
      {/* Основная секция страницы с заголовком и списком статей */}
      <section className="articles-page container">
        <div className="articles__title text-center">
          <h1 className="title">СТАТЬИ</h1>
        </div>
        {/* Компонент, отображающий список статей */}
        <ArticlesList />
      </section>
      {/* Секция для связи с пользователями */}
      <ConnectSection />
    </main>
  );
};

export default ArticlesPage;
