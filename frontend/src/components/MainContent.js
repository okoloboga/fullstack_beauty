import React from 'react';
import FirstSection from './sections/FirstSection';
import SecondSection from './sections/SecondSection';
import NewsSection from './sections/NewsSection';
import ArticlesSection from './sections/ArticlesSection';
import ConnectSection from './sections/ConnectSection';

const MainContent = () => {
  return (
    <main>
      <FirstSection />
      <SecondSection />
      <NewsSection />
      <ArticlesSection />
      <ConnectSection />
    </main>
  );
};

export default MainContent;
