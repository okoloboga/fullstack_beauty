import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileNavigationProps } from '../types';
import './ProfileNavigation.css';

const ProfileNavigation: React.FC<ProfileNavigationProps> = ({ active }) => {
  const navigate = useNavigate();

  // Обработчик выхода из профиля
  const handleLogout = () => {
    // Удаляем токен из localStorage
    localStorage.removeItem('token');
    // Перенаправляем пользователя на страницу входа
    navigate('/login');
  };

  // Функции для обработки навигации по профилю
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="navigation">
      <div className="navigation__list">
        <button
          className={`button__without__bg navigation__link ${active === 'my-articles' ? 'active' : ''}`}
          onClick={() => handleNavigation('/my-articles')}
        >
          МОИ СТАТЬИ
        </button>
        <button
          className={`button__without__bg navigation__link ${active === 'my-reviews' ? 'active' : ''}`}
          onClick={() => handleNavigation('/my-reviews')}
        >
          ОТЗЫВЫ ОБО МНЕ
        </button>
        <button
          className={`button__without__bg navigation__link ${active === 'my-favorites' ? 'active' : ''}`}
          onClick={() => handleNavigation('/my-favorites')}
        >
          ИЗБРАННОЕ
        </button>
        {/* Кнопка выхода */}
        <button
          className="button__without__bg navigation__link logout__button"
          onClick={handleLogout}
        >
          ВЫЙТИ
        </button>
      </div>
    </div>
  );
};

export default ProfileNavigation;
