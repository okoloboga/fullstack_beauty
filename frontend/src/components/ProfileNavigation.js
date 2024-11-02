import React from 'react';
import { Link } from 'react-router-dom';

const ProfileNavigation = ({ active }) => {
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
      </div>
    </div>
  );
};

export default ProfileNavigation;
