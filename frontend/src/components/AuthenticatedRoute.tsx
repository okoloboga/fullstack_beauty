import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Функция для проверки срока действия токена
const isTokenExpired = (token: string): boolean => {
  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error('Ошибка проверки токена:', error);
    return true;
  }
};

// Компонент защищенного маршрута, который проверяет наличие токена и его срок действия
const AuthenticatedRoute: React.FC = () => {
  // Получаем токен из localStorage
  console.log('localStorage', localStorage);
  console.log('token:', localStorage.getItem('token'));
  const token = localStorage.getItem('token');

  // Если токена нет или срок истек, перенаправляем пользователя на страницу логина
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token'); // Удаляем токен из localStorage
    return <Navigate to="/login" />;
  }

  // Если токен есть и не истек, рендерим дочерние компоненты
  return <Outlet />;
};

export default AuthenticatedRoute;
