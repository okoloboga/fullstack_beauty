import React from 'react';
import ArticlesList from '../components/ArticlesList';
import ConnectSection from '../components/sections/ConnectSection';

const ArticlesPage = () => {
  return (
    <main>
      <section className="articles-page container">
        <div className="articles__title text-center">
          <h1 className="title">СТАТЬИ</h1>
        </div>
        <ArticlesList />
      </section>
      <ConnectSection />
    </main>
  );
};

export default ArticlesPage;
