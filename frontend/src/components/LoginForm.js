import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Импортируем toast

const apiUrl = process.env.REACT_APP_API_URL;

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
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

    try {
      // Отправляем запрос на backend для авторизации
      const response = await axios.post(`${apiUrl}/api/users/login`, formData);
      console.log('Успешная авторизация:', response.data);

      // Сохраняем токен в localStorage
      localStorage.setItem('token', response.data.token);
      toast.success('Авторизация успешна!'); // Успешное уведомление
      navigate('/edit-profile');
      
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message); // Уведомление об ошибке
      } else {
        toast.error('Ошибка при авторизации, попробуйте еще раз');
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

      <button className="button__with__bg form__post" type="submit">
        Войти
      </button>
    </form>
  );
};

export default LoginForm;
