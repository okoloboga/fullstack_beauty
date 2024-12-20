import React, { useState, ChangeEvent, FormEvent } from 'react';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoginFormData } from '../../types';
import { loginUser } from '../../utils/apiService';

// Компонент LoginForm представляет собой форму для авторизации пользователей
const LoginForm: React.FC = () => {
  // Состояние для данных формы авторизации
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
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
      const token = await loginUser(formData);

      // Сохраняем токен в localStorage
      localStorage.setItem('token', token);
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
            name="email"
            placeholder="E-mail"
            className="default__input form__post"
            value={formData.email}
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

      <div className="text-center" style={{ marginTop: '5px' }}>
        <a className="text-dark" href="/restore">
          Забыли пароль?
        </a>
      </div>

      {/* Кнопка для отправки формы */}
      <button className="button__with__bg form__post" type="submit">
        Войти
      </button>
    </form>
  );
};

export default LoginForm;
