import React, { useState } from 'react';

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

  // Обработчики изменения полей формы
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
    setProfileImage(URL.createObjectURL(file));
  };

  // Обработчик изменения портфолио
  const handlePortfolioImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setPortfolioImages(files.map((file) => URL.createObjectURL(file)));
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    // Логика отправки данных на сервер
    console.log('Данные формы:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="user-photo-wrap">
        <img
          className="user-photo"
          src={profileImage || '/images/default-profile.png'}
          alt="Profile"
        />

        <button className="change__image" type="button">
          <label htmlFor="profile-image">
            {/* Иконка загрузки */}
            <svg
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* SVG path */}
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
        {/* Поля формы */}
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
            {/* Иконка редактирования */}
            <svg
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* SVG path */}
            </svg>
          </div>
        </div>
        {/* Повторите для остальных полей */}
        {/* ... */}
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
            {/* Иконка редактирования */}
            {/* ... */}
          </div>
        </div>
        {/* Повторите для остальных полей */}
        {/* ... */}

        <div className="form__field">
          <p>О СЕБЕ</p>
          <textarea
            name="about"
            rows="3"
            value={formData.about}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form__field form-portfolio">
          <div className="flex item-center gap-2">
            <p>ПОРТФОЛИО</p>
            <button className="article-upload article-upload-md" type="button">
              <label htmlFor="portfolio-files">
                {/* Иконка загрузки */}
                {/* ... */}
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

        <button className="button__with__bg form__post" type="submit">
          Сохранить
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;
