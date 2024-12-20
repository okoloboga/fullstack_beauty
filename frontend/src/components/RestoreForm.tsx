import React, { useState, ChangeEvent, FormEvent } from 'react';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RestoreFormData } from '../types';
import { requestPasswordReset } from '../utils/apiService';

const RestoreForm: React.FC = () => {
  // Состояние для данных формы восстановления пароля
  const [formData, setFormData] = useState<RestoreFormData>({
    email: '',
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
      // Отправляем запрос на backend для восстановления пароля
      await requestPasswordReset(formData.email);
      toast.success('Ссылка для восстановления пароля отправлена на ваш email');
      navigate('/login'); // Перенаправление на страницу входа
    } catch (error) {
      // Обрабатываем ошибки
      const err = error as AxiosError;
      if (err.response && err.response.data) {
        toast.error((err.response.data as { message: string }).message); // Уведомление об ошибке от сервера
      } else {
        toast.error('Ошибка при запросе на восстановление пароля, попробуйте еще раз');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Поле для email */}
      <div className="form__field centered-input-wrapper">
        <div className="form__input centered-input">
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            className="default__input form__post"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Кнопка для отправки формы */}
      <button className="button__with__bg form__post" type="submit">
        Отправить
      </button>
    </form>
  );
};

export default RestoreForm;
