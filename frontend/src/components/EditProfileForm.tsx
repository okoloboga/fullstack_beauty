import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import axiosInstance from '../utils/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiUrl = process.env.REACT_APP_API_URL;

interface ProfileData {
  email: string | null;
  password: string | null;
  name: string | null;
  city: string | null;
  activity: string | null;
  phone: string | null;
  instagram: string | null;
  vk: string | null;
  telegram: string | null;
  facebook: string | null;
  about: string | null;
  receiveNewsletter: boolean;
  profileImage?: string | null;
  portfolioImages?: string | null;
}

const EditProfileForm: React.FC = () => {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [portfolioImages, setPortfolioImages] = useState<File[]>([]);
  const [formData, setFormData] = useState<ProfileData>({
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
    profileImage: '',
    portfolioImages: '',
  });

  // Функция для получения ID пользователя из токена
  const getUserIdFromToken = (): string | null => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId;
      } catch (error) {
        console.error('Ошибка при декодировании токена:', error);
        return null;
      }
    }
    return null;
  };

  const userId = getUserIdFromToken();

  // Загрузка данных профиля при загрузке компонента
  useEffect(() => {
    if (!userId) {
      toast.error('Ошибка: ID пользователя не найден');
      return;
    }

    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Ошибка: Токен авторизации отсутствует');
          return;
        }

        const response = await axiosInstance.get(`${apiUrl}/api/users/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Данные профиля:', response.data);
        setFormData(response.data);
        toast.success('Данные профиля успешно загружены');
      } catch (error) {
        console.error('Ошибка при загрузке данных профиля:', error);
        toast.error('Не удалось загрузить данные профиля');
      }
    };

    fetchProfileData();
  }, [userId]);

  // Обработчик изменения полей формы
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
      const { checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Обработчик изменения изображения профиля
  const handleProfileImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

        setProfileImage(file);
        toast.success('Изображение профиля успешно загружено');
      };
    }
  };

  // Обработчик изменения изображений портфолио
  const handlePortfolioImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const validFiles: File[] = [];
    files.forEach((file) => {
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

        validFiles.push(file);
        setPortfolioImages((prev) => [...prev, ...validFiles]);
        toast.success('Изображения портфолио успешно добавлены');
      };
    });
  };

  // Обработчик обновления профиля
  const handleProfileUpdate = async () => {
    const token = localStorage.getItem('token');

    if (!userId) {
      toast.error('Ошибка: ID пользователя не найден');
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        const value = formData[key as keyof ProfileData];
        if (value !== undefined && value !== null) {
          formDataToSend.append(key, typeof value === 'boolean' ? String(value) : value);
        }
      });

      if (profileImage) {
        formDataToSend.append('profileImage', profileImage);
      }

      portfolioImages.forEach((file) => {
        formDataToSend.append(`portfolioImage`, file);
      });

      const response = await axiosInstance.put(`${apiUrl}/api/users/profile/${userId}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Профиль успешно обновлен:', response.data);
      setFormData((prev) => ({
        ...prev,
        ...response.data,
      }));
      toast.success('Профиль успешно обновлен');
    } catch (error) {
      const err = error as AxiosError;
      console.error('Ошибка при обновлении профиля:', err.response?.data || err.message);
      toast.error('Ошибка при обновлении профиля');
    }
  };

  // Обработчик отправки формы
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleProfileUpdate(); 
  };

  return (
    <section className="container edit__profile-form">
      <form onSubmit={handleSubmit}>
        <div className="user-photo-wrap">
          <img
            className="user-photo"
            src={
              profileImage
                ? URL.createObjectURL(profileImage)
                : formData.profileImage
                ? `${apiUrl}/${formData.profileImage}?timestamp=${new Date().getTime()}`
                : 'assets/images/no-photo.png'
            }
            alt="Profile"
          />

          <button
            className="button__without__bg navigation__link logout__button"
            type="button"
          >
            <label htmlFor="profile-image">
              Загрузить Фото
            </label>
          </button>
          <input
            id="profile-image"
            type="file"
            accept="image/jpeg, image/png"
            hidden
            onChange={handleProfileImageChange}
          />
        </div>
        
        {/* Поле для E-mail */}
        <div>
          <div className="form__field">
            <p>E-Mail</p>
            <div className="form__input">
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                className="default__input"
                value={formData.email ?? ''}
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
            <p>Новый Пароль</p>
            <div className="form__input">
              <input
                type="password"
                name="password"
                placeholder="Пароль"
                className="default__input"
                value={formData.password ?? ''}
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
            <p>Имя</p>
            <div className="form__input">
              <input
                type="text"
                name="name"
                placeholder="ФИО"
                className="default__input"
                value={formData.name ?? ''}
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
            <p>Город</p>
            <div className="form__input">
              <input
                type="text"
                name="city"
                placeholder="Город"
                className="default__input"
                value={formData.city ?? ''}
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

          {/* Поле для Вида деятельности */}
          <div className="form__field">
            <p>Деятельность</p>
            <div className="form__input">
              <input
                type="text"
                name="activity"
                placeholder="Деятельность"
                className="default__input"
                value={formData.activity ?? ''}
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

          {/* Поле для телефона */}
          <div className="form__field">
            <p>Телефон</p>
            <div className="form__input">
              <input
                type="phone"
                name="phone"
                placeholder="Phone-number"
                className="default__input"
                value={formData.phone ?? ''}
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

          {/* Поле для Instagram */}
          <div className="form__field">
            <p>Instagram</p>
            <div className="form__input">
              <input
                type="text"
                name="instagram"
                placeholder="Instagram"
                className="default__input"
                value={formData.instagram ?? ''}
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

          {/* Поле для VK */}
          <div className="form__field">
            <p>VK</p>
            <div className="form__input">
              <input
                type="text"
                name="vk"
                placeholder="VK"
                className="default__input"
                value={formData.vk ?? ''}
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

          {/* Поле для Telegram */}
          <div className="form__field">
            <p>Telegram</p>
            <div className="form__input">
              <input
                type="text"
                name="telegram"
                placeholder="Telegram"
                className="default__input"
                value={formData.telegram ?? ''}
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

          {/* Поле для Facebook */}
          <div className="form__field">
            <p>Facebook</p>
            <div className="form__input">
              <input
                type="text"
                name="facebook"
                placeholder="Facebook"
                className="default__input"
                value={formData.facebook ?? ''}
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
              rows={3}
              placeholder="Расскажите о себе"
              value={formData.about ?? ''}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Поле для портфолио */}
          <div className="form__field form-portfolio">
            <div className="flex item-center gap-2">
              <p>Портфолио</p>
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
                <img key={index} src={URL.createObjectURL(image)} alt={`Portfolio ${index}`} />
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
            <label htmlFor="receive__message">Получать рассылку</label>
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
