import React from 'react';

// Компонент Footer представляет футер сайта
// Отображает копирайт и информацию о правах
const Footer: React.FC = () => {
  return (
    <footer className="container">
      <p>
        © 2024 <br />
        Все права защищены. Полное или частичное копирование материалов сайта без согласования с редакцией запрещено.
      </p>
    </footer>
  );
};

export default Footer;