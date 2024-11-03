import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Определение интерфейса для props
interface ProtectedRouteProps {
  allowedRoles: string[]; // Список разрешенных ролей
}

// Функция декодирования токена, чтобы получить информацию о пользователе
const decodeToken = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error('Ошибка декодирования токена:', error);
    return null;
  }
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');

  // Если токена нет, перенаправляем на страницу входа
  if (!token) {
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
