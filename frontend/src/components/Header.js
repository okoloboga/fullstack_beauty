import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.svg';
import userIcon from '../assets/images/user.svg';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <li><Link to="/news-best">Новости</Link></li>
            <li><Link to="/partners">Партнёры</Link></li>
          </ul>
        </nav>
        <div className="header__actions flex item-center">
          <Link to="/edit-profile" className="user-icon">
            <img src="/images/user.svg" alt="User Logo" />
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
              <Link to="/edit-profile" className="user-icon">
                <img src="/images/user.svg" alt="User Logo" />
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
