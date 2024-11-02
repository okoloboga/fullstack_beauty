import React, { useState } from 'react';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

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
      // Отправляем запрос на backend для регистрации
      const response = await axios.post(`${apiUrl}/api/users/register`, formData);
      console.log('Успешная регистрация:', response.data);
      history.push('/login');
      
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Ошибка при регистрации, попробуйте еще раз');
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
          />
        </div>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <button className="button__with__bg form__post" type="submit">
        Зарегистрироваться
      </button>
    </form>
  );
};

export default RegisterForm;
