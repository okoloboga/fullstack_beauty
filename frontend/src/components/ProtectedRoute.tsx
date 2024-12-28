import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ProtectedRouteProps } from '../types';
import { base64UrlDecode } from '../utils/base64UrlDecode';
import './ProtectedRoute.css';

// Функция декодирования токена, чтобы получить информацию о пользователе
const decodeToken = (token: string) => {
  try {
    console.log('before Decoding token:', token);
    const payload = token.split('.')[1];
    const decodedPayload = base64UrlDecode(payload);
    const decodedToken = JSON.parse(decodedPayload);
    console.log('decodedToken:', decodedToken);
    return decodedToken;
  } catch (error) {
    console.error('Ошибка декодирования токена:', error);
    return null;
  }
};

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

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');

  // Если токена нет или срок истек, перенаправляем пользователя на страницу входа
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  // Декодируем токен, чтобы получить роль пользователя
  const decodedToken = decodeToken(token);
  if (!decodedToken) {
    return <Navigate to="/login" replace />;
  }

  const userRole = decodedToken.role;

  // Проверяем, разрешена ли роль пользователя
  if (allowedRoles.includes(userRole)) {
    return <Outlet />;
  } else {
    // Если роль не разрешена, перенаправляем на страницу со статьями
    return <Navigate to="/articles" replace />;
  }
};

export default ProtectedRoute;
