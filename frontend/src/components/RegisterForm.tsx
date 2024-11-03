import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Импортируем toast

const apiUrl = process.env.REACT_APP_API_URL;

// Определение интерфейса для данных формы регистрации
interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    password: '',
    confirmPassword: '', // Добавляем поле подтверждения пароля
  });

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

    // Проверяем, совпадают ли пароли
    if (formData.password !== formData.confirmPassword) {
      toast.error('Пароли не совпадают'); // Уведомление об ошибке
      return;
    }

    try {
      // Отправляем запрос на backend для регистрации
      const response = await axiosInstance.post(`${apiUrl}/api/users/register`, {
        username: formData.username,
        password: formData.password,
      });
      console.log('Успешная регистрация:', response.data);
      toast.success('Регистрация прошла успешно! Пожалуйста, войдите.'); // Успешное уведомление
      navigate('/login');
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      if (err.response) {
        toast.error(err.response.data?.message || 'Ошибка при регистрации, попробуйте еще раз'); // Уведомление об ошибке
      } else {
        toast.error('Ошибка при регистрации, попробуйте еще раз');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form__field">
        <p>Имя пользователя</p>
        <div className="form__input">
          <input
            type="text"
            name="username"
            placeholder="Имя пользователя"
            className="default__input"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form__field">
        <p>Пароль</p>
        <div className="form__input">
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            className="default__input"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form__field">
        <p>Подтвердите пароль</p>
        <div className="form__input">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Подтвердите пароль"
            className="default__input"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <button className="button__with__bg form__post" type="submit">
        Зарегистрироваться
      </button>
    </form>
  );
};

export default RegisterForm;
