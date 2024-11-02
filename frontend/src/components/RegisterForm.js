import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Импортируем toast

const apiUrl = process.env.REACT_APP_API_URL;

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '', // Добавляем поле подтверждения пароля
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверяем, совпадают ли пароли
    if (formData.password !== formData.confirmPassword) {
      toast.error('Пароли не совпадают'); // Уведомление об ошибке
      return;
    }

    try {
      // Отправляем запрос на backend для регистрации
      const response = await axios.post(`${apiUrl}/api/users/register`, {
        username: formData.username,
        password: formData.password,
      });
      console.log('Успешная регистрация:', response.data);
      toast.success('Регистрация прошла успешно! Пожалуйста, войдите.'); // Успешное уведомление
      navigate('/login');
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message); // Уведомление об ошибке
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
