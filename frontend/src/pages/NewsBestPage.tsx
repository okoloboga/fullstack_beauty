import React from 'react';
import NewsList from '../components/NewsPage/NewsList';
import ConnectSection from '../components/MainContent/ConnectSection';
import { Link } from 'react-router-dom';
import './styles/NewsPage.css';

// Компонент страницы с лучшими новостями
const NewsBestPage: React.FC = () => {
  return (
    <main>
      {/* Основная секция с заголовком и кнопками навигации */}
      <section className="news container">
        <div className="news__title text-center">
          <h2 className="title">НОВОСТИ</h2>
          {/* Кнопки для переключения между самыми новыми и лучшими новостями */}
          <div className="news__title__btns flex">
            <Link to="/news-newest">
              <button className="button__without__bg">СВЕЖЕЕ</button>
            </Link>
            <Link to="/news-best">
              <button className="button__with__bg">ЛУЧШЕЕ</button>
            </Link>
          </div>
        </div>
        {/* Компонент, отображающий список лучших новостей */}
        <NewsList type="best" />
      </section>

      {/* Секция для связи с пользователями */}
      <ConnectSection />
    </main>
  );
};

export default NewsBestPage;
