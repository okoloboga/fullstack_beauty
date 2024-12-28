import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// utils/base64UrlDecode.ts
export const base64UrlDecode = (str: string): string => {
  // Заменяем '-' на '+' и '_' на '/'
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');

  // Добавляем символы заполнения '=' для корректного декодирования
  while (base64.length % 4) {
    base64 += '=';
  }

  return atob(base64);
};

// Функция для проверки срока действия токена
const isTokenExpired = (token: string): boolean => {
  try {
    console.log('before Decoding token:', token);
    const payload = token.split('.')[1];
    console.log('payload:', payload);
    const decodedPayload = base64UrlDecode(payload);
    console.log('decodedPayload:', decodedPayload);
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
