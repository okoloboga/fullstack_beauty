import axios, { AxiosError } from "axios";
import { toast } from 'react-toastify';

const apiUrl = process.env.REACT_APP_API_URL || '';

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

// Interceptor для обработки ошибок
axiosInstance.interceptors.response.use(
  response => response,
  (error) => {
    if (axios.isAxiosError(error)) { // Используем axios.isAxiosError для проверки типа ошибки
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // Очистка токена и перенаправление на страницу логина
        localStorage.removeItem('token');
        toast.error("Ваша сессия истекла. Пожалуйста, войдите снова.");
        window.location.href = "/login"; // Перенаправляем пользователя на страницу входа
      }
    } else {
      console.error('Произошла неизвестная ошибка', error); // Логируем неизвестные ошибки
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
