import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.svg';
import userIcon from '../assets/images/user.svg';
import './Header.css';

// Компонент Header представляет собой верхнюю навигационную панель
// Содержит ссылки на страницы, кнопку для авторизации и меню бургер
const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('localStorage.getItem("token"):', token);
    setIsAuthenticated(token !== null);
  }, []);

  const handleBurgerClick = () => {
    setIsMenuOpen(!isMenuOpen);
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
            <li><Link to="/news">Новости</Link></li>
            <li><Link to="/partners">Партнёры</Link></li>
          </ul>
        </nav>
        <div className="header__actions flex item-center">
          <Link to={isAuthenticated ? "/edit-profile" : "/login"} className="user-icon">
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
              <Link to={isAuthenticated ? "/edit-profile" : "/login"} className="user-icon">
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