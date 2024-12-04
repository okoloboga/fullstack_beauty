import React from 'react';
import FirstSection from '../components/MainContent/FirstSection';
import SecondSection from '../components/MainContent/SecondSection';
import NewsSection from '../components/MainContent/NewsSection';
import ArticlesSection from '../components/MainContent/ArticlesSection';
import ConnectSection from '../components/MainContent/ConnectSection';
import './styles/MainContent.css';

// Компонент MainContent представляет главную содержимую часть страницы
// Содержит разные секции, такие как новости, статьи и контактную информацию
const MainContent: React.FC = () => {
  return (
    <main>
      {/* Первая секция, представляющая общее введение и название сайта */}
      <FirstSection />
      {/* Вторая секция, содержащая информацию о проекте */}
      <SecondSection />
      {/* Секция новостей */}
      <NewsSection />
      {/* Секция популярных статей */}
      <ArticlesSection />
      {/* Секция с формой для связи с проектом */}
      <ConnectSection />
    </main>
  );
};

export default MainContent;
