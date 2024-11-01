import React from 'react';
import NewsCard from './NewsCard';
import { newsItems } from '../data/news';

// Импортируйте необходимые данные и изображения
import newsImage1 from '../assets/images/news__card3.png';
import newsImage2 from '../assets/images/news__card4.png';
import newsImage3 from '../assets/images/news__card5.png';

const newsItems = [
  {
    id: 1,
    title: 'Осенняя коллекция Dior Map of Paris Makeup Collection Fall 2024',
    image: newsImage1,
    link: '/news/1',
  },
  {
    id: 2,
    title: 'Новые коллекции от Givenchy и Byredo',
    image: newsImage2,
    link: '/news/2',
  },
  {
    id: 3,
    title: 'Летняя сказка от Flowerknows',
    image: newsImage3,
    link: '/news/3',
  },
  // Добавьте другие новости
];

const NewsList = ({ type }) => {
  // Фильтруйте новости в зависимости от типа
  const filteredNews = newsItems.filter((news) => {
    if (type === 'newest') {
      // Логика фильтрации для "СВЕЖЕЕ"
    } else if (type === 'best') {
      // Логика фильтрации для "ЛУЧШЕЕ"
    }
    return true; // По умолчанию возвращаем все новости
  });

  return (
    <div className="news__cards flex flex-column">
      {filteredNews.map((news) => (
        <NewsCard key={news.id} news={news} />
      ))}
    </div>
  );
};

export default NewsList;
