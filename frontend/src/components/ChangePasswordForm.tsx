import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { toast } from 'react-toastify'; // Импортируем toast
import { resetPassword } from '../utils/apiService'; // Функция для отправки запроса на смену пароля
import { useNavigate, useLocation } from 'react-router-dom';

const ChangePasswordForm: React.FC = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '', // Добавляем поле подтверждения пароля
  });

  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Добавляем состояние для загрузки

  const navigate = useNavigate();
  const location = useLocation();

  // Извлекаем токен из URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const resetToken = urlParams.get('token');
    if (resetToken) {
      setToken(resetToken);
    } else {
      toast.error('Ошибка: Токен не найден');
    }
  }, [location]);

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

    if (!token) {
      toast.error('Токен отсутствует');
      return;
    }

    try {
      setIsLoading(true); // Устанавливаем состояние загрузки
      // Отправляем запрос на сервер для смены пароля
      await resetPassword(token, formData.password);
      toast.success('Пароль успешно изменен');
      navigate('/login'); // Перенаправляем на страницу входа
    } catch (error) {
      toast.error('Ошибка при изменении пароля');
    } finally {
      setIsLoading(false); // Сбрасываем состояние загрузки
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form__field centered-input-wrapper">
        <div className="form__input centered-input">
          <input
            type="password"
            name="password"
            placeholder="Новый пароль"
            className="default__input form__post"
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
            placeholder="Подтвердите новый пароль"
            className="default__input form__post"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <button 
        className="button__with__bg form__post" 
        type="submit" 
        disabled={isLoading} // Отключаем кнопку во время отправки
      >
        {isLoading ? 'Смена пароля...' : 'Сменить пароль'}
      </button>
    </form>
  );
};

export default ChangePasswordForm;
