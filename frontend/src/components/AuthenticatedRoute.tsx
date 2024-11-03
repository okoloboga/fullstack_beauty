import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Компонент защищенного маршрута, который проверяет наличие токена
const AuthenticatedRoute: React.FC = () => {
  // Получаем токен из localStorage
  const token = localStorage.getItem('token');

  // Если токена нет, перенаправляем пользователя на страницу логина
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Если токен есть, рендерим дочерние компоненты
  return <Outlet />;
};

export default AuthenticatedRoute;
