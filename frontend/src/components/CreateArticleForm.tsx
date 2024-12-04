import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { createArticle } from '../utils/apiService'; // Импортируем функцию
import type { FormData } from '../types'; // Импортируем тип FormData из types.ts
import 'react-toastify/dist/ReactToastify.css';
import './CreateArticleForm.css';

const CreateArticleForm: React.FC = () => {
  const emptyFile = new File([], '');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    coverImage: emptyFile,
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Пользователь не авторизован');
      return;
    }

    try {
      const response = await createArticle(
        { 
          title: formData.title, 
          content: formData.content, 
          coverImage: formData.coverImage 
        }, 
          token);
          
      console.log('Статья успешно создана:', response);
      toast.success('Статья успешно создана!');
      setTimeout(() => {
        navigate('/articles');
      }, 2000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Ошибка при создании статьи:', error.response?.data?.message || error.message);
        toast.error(error.response?.data?.message || 'Ошибка при создании статьи. Пожалуйста, попробуйте еще раз.');
      } else if (error instanceof Error) {
        // Обрабатываем общие ошибки, которые не связаны с axios
        console.error('Ошибка при создании статьи:', error.message);
        toast.error(error.message);
      } else {
        // Обработка случаев, когда ошибка не является объектом типа Error или AxiosError
        console.error('Неизвестная ошибка', error);
        toast.error('Произошла неизвестная ошибка. Пожалуйста, попробуйте еще раз.');
      }
    }
  };

  return (
    <section className="container create-article-form">
      <h1 className="title text-center">Создать статью</h1>
      <form onSubmit={handleSubmit}>
        <div className="form__field">
          <p>Заголовок</p>
          <input
            type="text"
            name="title"
            placeholder="Заголовок статьи"
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
            placeholder="Содержание статьи"
            value={formData.content}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <input
          id="coverImageInput"
          type="file"
          name="coverImage"
          accept="image/*"
          onChange={handleCoverImageChange}
          style={{ display: 'none' }} // Скрываем input
        />
        <button
          className="button__without__bg"
          onClick={() => document.getElementById('coverImageInput')?.click()}
        >
          Загрузить обложку
        </button>

        <button
          className="button__with__bg"
          type="submit"
        >
          Создать статью
        </button>
      </form>
    </section>
  );
};

export default CreateArticleForm;
