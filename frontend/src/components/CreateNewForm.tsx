import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

const apiUrl = process.env.REACT_APP_API_URL;

// Интерфейс для данных формы новости
interface FormData {
  title: string;
  content: string;
}

// Компонент формы для создания новости
const CreateNewForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>(''); // Новое состояние для успеха
  const navigate = useNavigate();

  // Обработчик изменения полей формы
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Обработчик изменения обложки
  const handleCoverImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setErrorMessage('Разрешены только файлы формата JPG и PNG.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Файл слишком большой. Пожалуйста, загрузите изображение размером не более 5MB.');
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width > 1920 || img.height > 1080) {
          setErrorMessage('Разрешение изображения слишком велико. Пожалуйста, загрузите изображение с разрешением не более 1920x1080.');
        } else {
          setCoverImage(file);
          setErrorMessage('');
        }
      };
    }
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Пользователь не авторизован');
      setErrorMessage('Пожалуйста, войдите в систему, чтобы создать новость.');
      return;
    }

    if (formData.title.length < 5) {
      setErrorMessage('Заголовок должен содержать не менее 5 символов.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('content', formData.content);
    if (coverImage) {
      formDataToSend.append('coverImage', coverImage);
    }

    try {
      const response = await axios.post(`${apiUrl}/api/news`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Новость успешно создана:', response.data);
      setSuccessMessage('Новость успешно создана!');
      setTimeout(() => {
        navigate('/news'); // Перенаправление на страницу с новостями
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Ошибка при создании новости:', error.response?.data?.message || error.message);
        setErrorMessage(error.response?.data?.message || 'Ошибка при создании новости. Пожалуйста, попробуйте еще раз.');
      } else if (error instanceof Error) {
        console.error('Ошибка при создании новости:', error.message);
        setErrorMessage(error.message);
      } else {
        console.error('Неизвестная ошибка', error);
        setErrorMessage('Произошла неизвестная ошибка. Пожалуйста, попробуйте еще раз.');
      }
    }
  };

  return (
    <section className="container create-new-form">
      <h1 className="title text-center">Создать новость</h1>
      <form onSubmit={handleSubmit}>
        <div className="form__field">
          <p>Заголовок</p>
          <input
            type="text"
            name="title"
            placeholder="Заголовок новости"
            className="default__input"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form__field">
          <p>Содержание</p>
          <textarea
            name="content"
            rows={10}
            placeholder="Содержание новости"
            value={formData.content}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="form__field">
          <p>Обложка</p>
          <input
            type="file"
            name="coverImage"
            accept="image/*"
            onChange={handleCoverImageChange}
            required
          />
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <button className="button__with__bg form__post" type="submit">
          Создать новость
        </button>
      </form>
    </section>
  );
};

export default CreateNewForm;
