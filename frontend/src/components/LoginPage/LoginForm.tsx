import React, { useState, ChangeEvent, FormEvent } from 'react';
import { AxiosError } from 'axios';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoginFormData } from '../../types';
import { loginUser } from '../../utils/apiService';
import './LoginForm.css';

const apiUrl = process.env.REACT_APP_API_URL;

// Компонент LoginForm представляет собой форму для авторизации пользователей
const LoginForm: React.FC = () => {
  // Состояние для данных формы авторизации
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });

  // Хук для навигации между страницами
  const navigate = useNavigate();

  // Обработчик изменения полей формы
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Отправляем запрос на backend для авторизации
      const response = await axiosInstance.post(`${apiUrl}/api/users/login`, formData);
      console.log('Успешная авторизация:', response.data);
      const token = await loginUser(formData);

      // Сохраняем токен в localStorage
      localStorage.setItem('token', response.data.token);
      toast.success('Авторизация успешна!'); // Успешное уведомление
      navigate('/edit-profile');
    } catch (error) {
      // Обрабатываем ошибки авторизации
      const err = error as AxiosError;
      if (err.response && err.response.data) {
        toast.error((err.response.data as { message: string }).message); // Уведомление об ошибке от сервера
      } else {
        toast.error('Ошибка при авторизации, попробуйте еще раз');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Поле для имени пользователя */}
      <div className="form__field centered-input-wrapper">
        <div className="form__input centered-input">
          <input
            type="text"
            name="username"
            placeholder="Имя пользователя"
            className="default__input form__post"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Поле для пароля */}
      <div className="form__field centered-input-wrapper">
        <div className="form__input centered-input">
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            className="default__input form__post"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Кнопка для отправки формы */}
      <button className="button__with__bg form__post" type="submit">
        Войти
      </button>
    </form>
  );
};

export default LoginForm;
