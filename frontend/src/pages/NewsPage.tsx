import React from 'react';
import NewsList from '../components/NewsPage/NewsList';
import ConnectSection from '../components/MainContent/ConnectSection';
import { Link } from 'react-router-dom';
import './styles/NewsPage.css';

// Компонент страницы с самыми свежими новостями
const NewsPage: React.FC = () => {
  return (
    <main>
      {/* Основная секция с заголовком и кнопками навигации */}
      <section className="news container">
        <div className="news__title text-center">
          <h2 className="title">НОВОСТИ</h2>
        </div>
        {/* Компонент, отображающий список самых свежих новостей */}
        <NewsList />
      </section>

      {/* Секция для связи с пользователями */}
      <ConnectSection />
    </main>
  );
};

export default NewsPage;
