import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.svg';
import userIcon from '../assets/images/user.svg';
import './Header.css';

// Компонент Header представляет собой верхнюю навигационную панель
// Содержит ссылки на страницы, кнопку для авторизации и меню бургер
const Header: React.FC = () => {
  // Состояние для управления открытием/закрытием мобильного меню
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Обработчик нажатия на бургер-меню
  const handleBurgerClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Функция для проверки, авторизован ли пользователь
  const isUserAuthenticated = (): boolean => {
    return localStorage.getItem('token') !== null;
  };

  return (
    <header className={`header ${isMenuOpen ? 'active' : ''}`}>
      <div className="container flex justify-between items-center">
        <div className="header__logo">
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </div>
        <nav className="header__nav flex item-center">
          <ul className="flex">
            <li><Link to="/">Главная</Link></li>
            <li><Link to="/articles">Статьи</Link></li>
            <li><Link to="/news-best">Новости</Link></li>
            <li><Link to="/partners">Партнёры</Link></li>
          </ul>
        </nav>
        <div className="header__actions flex item-center">
          <Link to={isUserAuthenticated() ? "/edit-profile" : "/login"} className="user-icon">
            <img src={userIcon} alt="User Logo" />
          </Link>
          <div
            className={`burger-menu ${isMenuOpen ? 'active' : ''}`}
            id="burgerMenu"
            onClick={handleBurgerClick}
          >
            <span className="burger-icon"></span>
          </div>
        </div>
      </div>
      {/* Мобильное меню */}
      <div
        className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}
        id="mobileMenu"
      >
        <nav className="mobile-nav">
          <ul>
            <li>
              <Link to={isUserAuthenticated() ? "/edit-profile" : "/login"} className="user-icon">
                <img src={userIcon} alt="User Logo" />
              </Link>
            </li>
            <li><Link to="/">Главная</Link></li>
            <li><Link to="/articles">Статьи</Link></li>
            <li><Link to="/news-best">Новости</Link></li>
            <li><Link to="/partners">Партнёры</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
