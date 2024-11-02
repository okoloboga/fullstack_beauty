import React, { useState } from 'react';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const EditProfileForm = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    city: '',
    activity: '',
    phone: '',
    instagram: '',
    vk: '',
    telegram: '',
    facebook: '',
    about: '',
    receiveNewsletter: false,
  });

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Обработчик изменения изображения профиля
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  // Обработчик изменения портфолио
  const handlePortfolioImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setPortfolioImages(files.map((file) => URL.createObjectURL(file)));
  };

  // Функция для получения ID пользователя из токена (простой пример)
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId; // Предполагается, что `userId` закодирован в токене
    }
    return null;
  };

  // Обработчик обновления профиля
  const handleProfileUpdate = async () => {
    const token = localStorage.getItem('token');
    const userId = getUserIdFromToken();

    if (!userId) {
      console.error('Ошибка: ID пользователя не найден');
      return;
    }

    try {
      const response = await axios.put(`${apiUrl}/api/users/profile/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Профиль успешно обновлен:', response.data);
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error.response?.data?.message || error.message);
    }
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    handleProfileUpdate(); // Вызываем функцию обновления профиля
  };

  return (
    <section className="container edit__profile-form">
      <form onSubmit={handleSubmit}>
        <div className="user-photo-wrap">
          <img
            className="user-photo"
            src={profileImage || 'images/edit-profile.png'}
            alt="Profile"
          />

          <button className="change__image" type="button">
            <label htmlFor="profile-image">
              <svg
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* SVG path here */}
              </svg>
            </label>
          </button>
          <input
            id="profile-image"
            type="file"
            accept="image/*"
            hidden
            onChange={handleProfileImageChange}
          />
        </div>

        <div>
          <div className="form__field">
            <p>E-Mail</p>
            <div className="form__input">
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                className="default__input"
                value={formData.email}
                onChange={handleChange}
              />
              <svg
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* SVG path here */}
              </svg>
            </div>
          </div>

          {/* Поле для пароля */}
          <div className="form__field">
            <p>ПАРОЛЬ</p>
            <div className="form__input">
              <input
                type="password"
                name="password"
                placeholder="Пароль"
                className="default__input"
                value={formData.password}
                onChange={handleChange}
              />
              <svg
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* SVG path here */}
              </svg>
            </div>
          </div>

          {/* Поле для имени */}
          <div className="form__field">
            <p>ИМЯ</p>
            <div className="form__input">
              <input
                type="text"
                name="name"
                placeholder="ФИО"
                className="default__input"
                value={formData.name}
                onChange={handleChange}
              />
              <svg
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* SVG path here */}
              </svg>
            </div>
          </div>

          {/* Поле для города */}
          <div className="form__field">
            <p>ГОРОД</p>
            <div className="form__input">
              <input
                type="text"
                name="city"
                placeholder="Город"
                className="default__input"
                value={formData.city}
                onChange={handleChange}
              />
              <svg
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* SVG path here */}
              </svg>
            </div>
          </div>

          {/* Поле для описания */}
          <div className="form__field">
            <p>О СЕБЕ</p>
            <textarea
              name="about"
              rows="3"
              placeholder="Расскажите о себе"
              value={formData.about}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Поле для портфолио */}
          <div className="form__field form-portfolio">
            <div className="flex item-center gap-2">
              <p>ПОРТФОЛИО</p>
              <button className="article-upload article-upload-md" type="button">
                <label htmlFor="portfolio-files">
                  <svg
                    width="22"
                    height="24"
                    viewBox="0 0 22 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* SVG path here */}
                  </svg>
                </label>
              </button>
              <input
                id="portfolio-files"
                type="file"
                multiple
                accept="image/*"
                hidden
                onChange={handlePortfolioImagesChange}
              />
            </div>
            <div className="images">
              {portfolioImages.map((image, index) => (
                <img key={index} src={image} alt={`Portfolio ${index}`} />
              ))}
            </div>
          </div>

          {/* Поле для подписки на рассылку */}
          <div className="form__field">
            <input
              type="checkbox"
              name="receiveNewsletter"
              id="receive__message"
              checked={formData.receiveNewsletter}
              onChange={handleChange}
            />
            <label htmlFor="receive__message">Получать емейл-рассылку</label>
          </div>

          {/* Кнопка для сохранения */}
          <button className="button__with__bg form__post" type="submit">
            Сохранить
          </button>
        </div>
      </form>

      {/* Рейтинг пользователя */}
      <div className="user__stars">
        <div className="flex item-center gap-2">
          {[...Array(5)].map((_, index) => (
            <svg key={index} width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* SVG path for star here */}
            </svg>
          ))}
        </div>
        <p>4.0</p>
      </div>
    </section>
  );
};

export default EditProfileForm;
