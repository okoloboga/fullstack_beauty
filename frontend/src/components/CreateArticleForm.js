import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiUrl = process.env.REACT_APP_API_URL;

const CreateArticleForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [coverImage, setCoverImage] = useState(null);
  const navigate = useNavigate();

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Обработчик изменения обложки
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
    }
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Пользователь не авторизован');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('content', formData.content);
    formDataToSend.append('coverImage', coverImage);

    try {
      const response = await axios.post(`${apiUrl}/api/articles`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Статья успешно создана:', response.data);
      navigate.push('/articles'); // Перенаправление на страницу со статьями
    } catch (error) {
      console.error('Ошибка при создании статьи:', error.response?.data?.message || error.message);
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
            rows="10"
            placeholder="Содержание статьи"
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

        <button className="button__with__bg form__post" type="submit">
          Создать статью
        </button>
      </form>
    </section>
  );
};

export default CreateArticleForm;
