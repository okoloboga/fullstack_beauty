// src/components/CreateNewForm.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createNews } from '../utils/apiService'; // Импортируем функцию из нового сервиса
import { ArticleFormData } from '../types'; // Импортируем тип FormData
import 'react-toastify/dist/ReactToastify.css';
import './CreateNewForm.css';

const CreateNewForm: React.FC = () => {
  const emptyFile = new File([], '');
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    content: '',
    coverImage: emptyFile,
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
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
        toast.error('Разрешены только файлы формата JPG и PNG.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Файл слишком большой. Пожалуйста, загрузите изображение размером не более 5MB.');
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width > 1920 || img.height > 1080) {
          toast.error('Разрешение изображения слишком велико. Пожалуйста, загрузите изображение с разрешением не более 1920x1080.');
          return;
        } 
        
        setCoverImage(file);
      };
    }
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Пожалуйста, войдите в систему, чтобы создать новость.');
      return;
    }

    if (formData.title.length < 5) {
      toast.error('Заголовок должен содержать не менее 5 символов.');
      return;
    }

    if (formData.content.length < 50) { 
      toast.error('Текст статьи должен содержать не менее 50 символов.'); 
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    if (formData.coverImage instanceof File && formData.coverImage.name) {
      data.append('coverImage', formData.coverImage);
    }

    try {
      // Используем функцию createNews из newsService
      const response = await createNews(data, token);

      console.log('Новость успешно создана:', response);
      toast.success('Новость успешно создана!');
      setTimeout(() => {
        navigate('/news'); // Перенаправление на страницу с новостями
      }, 2000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Ошибка при создании новости:', error.response?.data?.message || error.message);
        toast.error(error.response?.data?.message || 'Ошибка при создании новости. Пожалуйста, попробуйте еще раз.');
      } else if (error instanceof Error) {
        // Обрабатываем общие ошибки, которые не связаны с axios
        console.error('Ошибка при создании новости:', error.message);
        toast.error(error.message);
      } else {
        // Обработка случаев, когда ошибка не является объектом типа Error или AxiosError
        console.error('Неизвестная ошибка', error);
        toast.error('Произошла неизвестная ошибка. Пожалуйста, попробуйте еще раз.');
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

        <button
          className="button__without__bg navigation__link logout__button"
          type="submit"
        >
          Создать новость
        </button>
      </form>
    </section>
  );
};

export default CreateNewForm;
