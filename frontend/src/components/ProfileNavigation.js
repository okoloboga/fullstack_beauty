import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ProfileNavigation = ({ active }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Удаляем токен из localStorage
    localStorage.removeItem('token');
    // Перенаправляем пользователя на страницу входа
    navigate('/login');
  };

  return (
    <div className="navigation">
      <button className="button__without__bg edit__profile">
        РЕДАКТИРОВАТЬ ПРОФИЛЬ
      </button>
      <div className="navigation__list">
        <button className="button__without__bg navigation__link">
          <Link to="/my-articles">МОИ СТАТЬИ</Link>
        </button>
        <button className="button__without__bg navigation__link">
          <Link to="/my-reviews">ОТЗЫВЫ ОБО МНЕ</Link>
        </button>
        <button className="button__without__bg navigation__link">
          <Link to="/my-favorites">ИЗБРАННОЕ</Link>
        </button>
        {/* Добавляем кнопку выхода */}
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
