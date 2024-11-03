import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Определяем типы для props компонента
interface ProfileNavigationProps {
  active: string; // Активная вкладка, например: 'edit-profile', 'my-articles', и т.д.
}

const ProfileNavigation: React.FC<ProfileNavigationProps> = ({ active }) => {
  const navigate = useNavigate();

  // Обработчик выхода из профиля
  const handleLogout = () => {
    // Удаляем токен из localStorage
    localStorage.removeItem('token');
    // Перенаправляем пользователя на страницу входа
    navigate('/login');
  };

  return (
    <div className="navigation">
      <button 
        className={`button__without__bg edit__profile ${active === 'edit-profile' ? 'active' : ''}`}
      >
        <Link to="/edit-profile">РЕДАКТИРОВАТЬ ПРОФИЛЬ</Link>
      </button>
      <div className="navigation__list">
        <button 
          className={`button__without__bg navigation__link ${active === 'my-articles' ? 'active' : ''}`}
        >
          <Link to="/my-articles">МОИ СТАТЬИ</Link>
        </button>
        <button 
          className={`button__without__bg navigation__link ${active === 'my-reviews' ? 'active' : ''}`}
        >
          <Link to="/my-reviews">ОТЗЫВЫ ОБО МНЕ</Link>
        </button>
        <button 
          className={`button__without__bg navigation__link ${active === 'my-favorites' ? 'active' : ''}`}
        >
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
