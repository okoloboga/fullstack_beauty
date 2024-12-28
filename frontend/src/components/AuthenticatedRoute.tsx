import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { base64UrlDecode } from '../utils/base64UrlDecode';

// Функция для проверки срока действия токена
const isTokenExpired = (token: string): boolean => {
  try {
    console.log('before Decoding token:', token);
    const payload = token.split('.')[1];
    const decodedPayload = base64UrlDecode(payload);
    const decodedToken = JSON.parse(decodedPayload);
    console.log('decodedToken:', decodedToken);
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error('Ошибка проверки токена:', error);
    return true;
  }
};

// Компонент защищенного маршрута, который проверяет наличие токена и его срок действия
const AuthenticatedRoute: React.FC = () => {
  console.log('localStorage', localStorage);
  console.log('token:', localStorage.getItem('token'));
  const token = localStorage.getItem('token');
  console.log('token:', token);

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token'); // Удаляем токен из localStorage
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default AuthenticatedRoute;
