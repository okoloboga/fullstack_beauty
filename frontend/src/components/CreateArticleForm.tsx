import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { createArticle } from '../utils/apiService'; // Импортируем функцию
import { ArticleFormData } from '../types'; // Импортируем тип FormData из types.ts
import addFile from '../assets/images/add-file.svg';
import 'react-toastify/dist/ReactToastify.css';
import './CreateArticleForm.css';

const CreateArticleForm: React.FC = () => {
  const emptyFile = new File([], '');
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    content: '',
    coverImage: null,
    contentImages: []
  });
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [contentImagesPreviews, setContentImagesPreviews] = useState<string[]>([]);  
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
  
        // Обновляем coverImage в formData
        setFormData((prev) => ({
          ...prev,
          coverImage: file,  // Одно изображение для обложки
        }));
        setCoverImagePreview(URL.createObjectURL(file));
      };
    }
  };

  const handleContentImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const validTypes = ['image/jpeg', 'image/png'];
      const validFiles: File[] = [];
      const previews: string[] = [];
  
      Array.from(files).forEach((file) => {
        // Проверяем тип файла
        if (!validTypes.includes(file.type)) {
          toast.error('Разрешены только файлы формата JPG и PNG.');
          return;
        }
  
        // Проверяем размер файла
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Файл слишком большой. Пожалуйста, загрузите изображение размером не более 5MB.');
          return;
        }
  
        // Проверяем разрешение изображения
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          if (img.width > 1920 || img.height > 1080) {
            toast.error('Разрешение изображения слишком велико. Пожалуйста, загрузите изображение с разрешением не более 1920x1080.');
            return;
          }
  
          // Добавляем файл в массив валидных файлов
          validFiles.push(file);
          // Добавляем превью
          previews.push(URL.createObjectURL(file));
  
          // Обновляем состояние с валидными файлами
          setFormData((prev) => ({
            ...prev,
            contentImages: [...prev.contentImages, ...validFiles],  // Добавляем новые файлы в массив
          }));
  
          // Обновляем состояние с превью для всех файлов
          setContentImagesPreviews((prev) => [...prev, ...previews]);
        };
      });
    }
  };  

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Пользователь не авторизован');
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
  
    // Добавляем одно изображение для обложки
    if (formData.coverImage) {
      data.append('coverImage', formData.coverImage);
    }
  
    // Добавляем несколько изображений для контента
    if (formData.contentImages && formData.contentImages.length > 0) {
      formData.contentImages.forEach((file) => {
        data.append('contentImages', file);
      });
    }
  
    try {
      const response = await createArticle(data, token);
      console.log('Статья успешно написана:', response);
      toast.success('Статья успешно сохранена!');
      setTimeout(() => {
        navigate('/articles');
      }, 2000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Ошибка при создании статьи:', error.response?.data?.message || error.message);
        toast.error(error.response?.data?.message || 'Ошибка при сохранении статьи. Пожалуйста, попробуйте еще раз.');
      } else if (error instanceof Error) {
        console.error('Ошибка при создании статьи:', error.message);
        toast.error(error.message);
      } else {
        console.error('Неизвестная ошибка', error);
        toast.error('Произошла неизвестная ошибка. Пожалуйста, попробуйте еще раз.');
      }
    }
  };
  
  return (
    <section className="container">
      <div className="create__article flex justify-center container">
        <div className="create__article__title">
          <h1 className="title main__title">НАПИСАТЬ СТАТЬЮ</h1>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        {/* Заголовок статьи */}
        <div className="flex pt-2 item-center myInput">
          <label className="label">Заголовок</label>
          <input
            id="title"
            type="text"
            name="title"
            className="default__input article-input"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
  
        {/* Содержание статьи */}
        <div className="pt-2 myInput">
          <div className="label desc__label">
            <label className="label">Содержание</label>
          </div>
          <textarea
            id="content"
            name="content"
            className="default__input article-input"
            rows={20}
            value={formData.content}
            onChange={handleChange}
            required
          ></textarea>
        </div>
  
        {/* Загрузка обложки */}
        <div className="field">
          <input
            id="coverImageInput"
            type="file"
            name="coverImage"
            accept="image/*"
            onChange={handleCoverImageChange}
            style={{ display: 'none' }}
          />
          <button className="article-upload article-upload-md" type="button">
            <label htmlFor="coverImageInput">
              <img src={addFile} alt="Добавить обложку" />
            </label>
          </button>
          {coverImagePreview && (
            <div className="cover-image-preview">
              <img src={coverImagePreview} alt="Preview Cover" style={{ maxWidth: '200px', maxHeight: '200px' }} />
            </div>
          )}
        </div>
  
        {/* Загрузка дополнительных изображений */}
        <div className="field">
          <input
            id="contentImagesInput"
            type="file"
            name="contentImages"
            accept="image/*"
            multiple
            onChange={handleContentImagesChange}
            style={{ display: 'none' }}
          />
          <button className="article-upload article-upload-md" type="button">
            <label htmlFor="contentImagesInput">
              <img src={addFile} alt="Добавить изображения" />
            </label>
          </button>
          {contentImagesPreviews.length > 0 && (
            <div className="content-images-preview">
              {contentImagesPreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview Content ${index}`}
                  style={{ maxWidth: '200px', maxHeight: '200px', margin: '5px' }}
                />
              ))}
            </div>
          )}
        </div>
  
        {/* Кнопка отправки формы */}
        <div className="flex pt-2 item-stretch myInput">  
          <div className="label"></div>
          <button
            className="button__with__bg article-btn"
            type="submit"
          >
            Опубликовать
          </button>
        </div>
      </form>
    </section>
  );  
};

export default CreateArticleForm;
