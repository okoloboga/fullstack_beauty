// src/components/CreateNewForm.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createNews } from '../utils/apiService'; // Импортируем функцию из нового сервиса
import { ArticleFormData, ContentImage } from '../types'; // Импортируем тип FormData
import addFile from '../assets/images/add-file.svg';
import 'react-toastify/dist/ReactToastify.css';
import './CreateNewForm.css';

const CreateNewForm: React.FC = () => {
  const emptyFile = new File([], '');
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    content: '',
    coverImage: null,
    contentImages: [] as ContentImage[]
  });
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [contentImagesPreviews, setContentImagesPreviews] = useState<string[]>([]);  
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
  
        // Обновляем coverImage в formData
        setFormData((prev) => ({
          ...prev,
          coverImage: file,  // Одно изображение для обложки
        }));
        setCoverImagePreview(URL.createObjectURL(file));
      };
    }
  };

  const handleImagesChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const validTypes = ['image/jpeg', 'image/png'];
      const validContentImages: { file: File; previewUrl: string }[] = []; // Храним файл и URL
      const contentPreviews: string[] = [];
  
      const promises = Array.from(files).map(async (file) => {
        console.log('Загружается файл:', file);
  
        // Проверяем тип файла
        if (!validTypes.includes(file.type)) {
          toast.error('Разрешены только файлы формата JPG и PNG.');
          console.log('Неверный формат файла:', file.type);
          return;
        }
  
        // Проверяем размер файла
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Файл слишком большой. Пожалуйста, загрузите изображение размером не более 5MB.');
          console.log('Файл слишком большой:', file.size);
          return;
        }
  
        const img = new Image();
        const fileUrl = URL.createObjectURL(file);
  
        // Ожидаем загрузки изображения
        await new Promise<void>((resolve) => {
          img.src = fileUrl;
          img.onload = () => {
            console.log('Размер изображения:', img.width, img.height);
            if (img.width > 1920 || img.height > 1080) {
              toast.error('Разрешение изображения слишком велико. Пожалуйста, загрузите изображение с разрешением не более 1920x1080.');
              console.log('Разрешение изображения слишком велико');
              return;
            }
  
            // Сохраняем файл и его URL
            validContentImages.push({ file, previewUrl: fileUrl });
            contentPreviews.push(fileUrl);
            resolve();
          };
        });
      });
  
      await Promise.all(promises);
  
      // Обновляем состояние с новым контентом
      setFormData((prev) => ({
        ...prev,
        contentImages: [...prev.contentImages, ...validContentImages],
      }));
  
      // Обновляем превью
      setContentImagesPreviews((prev) => {
        const newPreviews = contentPreviews.filter((preview) => !prev.includes(preview));
        return [...prev, ...newPreviews];
      });
  
      // Если обложка не выбрана, выбираем первое изображение
      if (!coverImagePreview && contentPreviews.length > 0) {
        setCoverImagePreview(contentPreviews[0]);
        setFormData((prev) => ({
          ...prev,
          coverImage: validContentImages[0].file,
        }));
      }
    }
  };

  // Обработчик отправки формы
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
      toast.error('Текст новости должен содержать не менее 50 символов.');
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
      formData.contentImages.forEach((contentImages) => {
        data.append('contentImages', contentImages.file);
      });
    }
  
    try {
      const response = await createNews(data, token);
      console.log('Новость успешно написана:', response);
      toast.success('Новость успешно сохранена!');
      setTimeout(() => {
        navigate('/articles');
      }, 2000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Ошибка при создании новости:', error.response?.data?.message || error.message);
        toast.error(error.response?.data?.message || 'Ошибка при сохранении новости. Пожалуйста, попробуйте еще раз.');
      } else if (error instanceof Error) {
        console.error('Ошибка при создании новости:', error.message);
        toast.error(error.message);
      } else {
        console.error('Неизвестная ошибка', error);
        toast.error('Произошла неизвестная ошибка. Пожалуйста, попробуйте еще раз.');
      }
    }
  };
  return (
    <section className="container">
      <div className="create__new flex justify-center container">
        <div className="create__new__title">
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
            className="default__input new-input"
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
            className="default__input new-input"
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
          <button className="new-upload new-upload-md" type="button">
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
            onChange={handleImagesChange}
            style={{ display: 'none' }}
          />
          <button className="new-upload new-upload-md" type="button">
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
            className="button__with__bg new-btn"
            type="submit"
          >
            Опубликовать
          </button>
        </div>
      </form>
    </section>
  );  
};


export default CreateNewForm;
