import React from 'react';
import FirstSection from './sections/FirstSection';
import SecondSection from './sections/SecondSection';
import NewsSection from './sections/NewsSection';
import ArticlesSection from './sections/ArticlesSection';
import ConnectSection from './sections/ConnectSection';

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
