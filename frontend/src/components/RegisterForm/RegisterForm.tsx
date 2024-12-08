import React, { useState, ChangeEvent, FormEvent } from 'react';
import { registerUser } from '../../utils/apiService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Импортируем toast
import { RegisterFormData } from '../../types';
import './RegisterForm.css';

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
      toast.error('Пароли не совпадают');
      return;
    }

    try {
      // Отправляем запрос на сервер для регистрации
      await registerUser(formData.username, formData.password);
      toast.success('Регистрация прошла успешно! Пожалуйста, войдите.');
      navigate('/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка при регистрации');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form__field centered-input-wrapper">
        <div className="form__input centered-input">
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

      <div className="form__field centered-input-wrapper">
        <div className="form__input centered-input">
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

      <div className="form__field centered-input-wrapper">
        <div className="form__input centered-input">
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