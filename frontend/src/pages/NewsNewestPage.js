import React from 'react';
import NewsList from '../components/NewsList';
import ConnectSection from '../components/sections/ConnectSection';
import { Link } from 'react-router-dom';


const NewsNewestPage = () => {
  return (
    <main>
      <section className="news container">
        <div className="news__title text-center">
          <h2 className="title">НОВОСТИ</h2>
          <div className="news__title__btns flex">
            <Link to="/news-newest">
              <button className="button__with__bg">СВЕЖЕЕ</button>
            </Link>
            <Link to="/news-best">
              <button className="button__without__bg">ЛУЧШЕЕ</button>
            </Link>
          </div>
        </div>
        <NewsList type="newest" />
      </section>
      <ConnectSection />
    </main>
  );
};

export default NewsNewestPage;
