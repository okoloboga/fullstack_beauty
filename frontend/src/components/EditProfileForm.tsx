import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import noPhoto from '../assets/images/no-image.png';
import addFile from '../assets/images/add-file.svg';
import deleteFile from '../assets/images/delete.png';
import { ProfileData, PortfolioImage, DecodedToken } from '../types';
import { fetchUserProfile, updateUserProfile } from '../utils/apiService';
import { base64UrlDecode } from '../utils/base64UrlDecode';
import star0Icon from '../assets/images/star0.svg';
import star1Icon from '../assets/images/star1.svg';
import star2Icon from '../assets/images/star2.svg';
import star3Icon from '../assets/images/star3.svg';
import star4Icon from '../assets/images/star4.svg';
import star5Icon from '../assets/images/star5.svg';
import './EditProfileForm.css';

const apiUrl = process.env.REACT_APP_API_URL;

const EditProfileForm: React.FC = () => {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [portfolioImagesPreviews, setPortfolioImagesPreviews] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [formData, setFormData] = useState<ProfileData>({
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
    rating: 4,
    reviews: 0,
    profileImage: null as File | null,
    portfolioImages: [],
  });
  const [existingPortfolioImages, setExistingPortfolioImages] = useState<string[]>([]);
  const starIcons = [star0Icon, star1Icon, star2Icon, star3Icon, star4Icon, star5Icon];

  // Функция для получения ID пользователя из токена
  const getUserIdFromToken = (): string | null => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = token.split('.')[1];
        const decodedPayload = base64UrlDecode(payload);
        console.log('decodedPayload:', decodedPayload);
        const parsedPayload: DecodedToken = JSON.parse(decodedPayload);
        console.log('parsedPayload:', parsedPayload);
        return parsedPayload.name; // Убедись, что тип соответствует
      } catch (error) {
        console.error('Ошибка при декодировании токена:', error);
        return null;
      }
    }
    return null;
  };

  const user = getUserIdFromToken();

  // Загрузка данных профиля при загрузке компонента
  useEffect(() => {
    if (!user) {
      toast.error('Ошибка: ID пользователя не найден');
      return;
    }

    const loadProfile = async () => {
      try {
        const profileData = await fetchUserProfile(user); // Используем функцию из сервиса
        console.log('Данные профиля:', profileData);
        setFormData(profileData);
        setExistingPortfolioImages(profileData.portfolioImages || []);
        toast.success('Данные профиля успешно загружены');
      } catch (error) {
        console.error('Ошибка при загрузке данных профиля:', error);
        toast.error(error instanceof Error ? error.message : 'Не удалось загрузить данные профиля');
      }
    };

    loadProfile();
  }, [user]);

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

  // Загрузка фотографий портфолио
  const handlePortfolioImagesChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const validTypes = ['image/jpeg', 'image/png'];
      const validPortfolioImages: PortfolioImage[] = []; // Храним файл и URL
      const portfolioPreviews: string[] = [];
  
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
            if (img.width > 1920 || img.height > 1920) {
              toast.error('Разрешение изображения слишком велико. Пожалуйста, загрузите изображение с разрешением не более 1920x1920.');
              console.log('Разрешение изображения слишком велико');
              return;
            }
  
            // Сохраняем файл и его URL
            validPortfolioImages.push({ file, previewUrl: fileUrl });
            portfolioPreviews.push(fileUrl);
            resolve();
          };
        });
      });
  
      await Promise.all(promises);

      // Обновляем состояние с новым контентом
      setFormData((prev) => ({
        ...prev,
        portfolioImages: [
          ...prev.portfolioImages.filter(
            (img): img is PortfolioImage => typeof img === 'object' && img !== null && 'previewUrl' in img
          ),
          ...validPortfolioImages,
        ],
      }));
  
      // Обновляем превью
      setPortfolioImagesPreviews((prev) => {
        const newPreviews = portfolioPreviews.filter((preview) => !prev.includes(preview));
        return [...prev, ...newPreviews];
      });

    }
  };
  
  // Обработчик удаления изображения
  const handleImageRemove = (image: string, e: React.MouseEvent<HTMLButtonElement>) => {
    // Останавливаем стандартное поведение кнопки
    e.preventDefault();
    e.stopPropagation();

    console.log('Попытка удалить изображение:', image);

    // Получаем индекс удаляемого превью
    const indexToRemove = portfolioImagesPreviews.findIndex((preview) => preview === image);
    console.log('Индекс изображения в portfolioImagesPreviews:', indexToRemove);

    if (indexToRemove !== -1) {
      // Удаляем изображение из списка превью
      const updatedPreviews = [...portfolioImagesPreviews];
      updatedPreviews.splice(indexToRemove, 1);
      setPortfolioImagesPreviews(updatedPreviews);
      console.log('Обновленные превью после удаления:', updatedPreviews);

      // Освобождаем память, удаляя Object URL
      URL.revokeObjectURL(image);
    } else {
      console.log('Не удалось найти изображение в portfolioImagesPreviews для удаления.');
    }

    // Находим файл для удаления по сохраненной ссылке
    const imageFileToRemove = formData.portfolioImages.find(
      (portfolioImage) => portfolioImage.previewUrl === image
    );

    console.log('Ищем файл для удаления в formData.portfolioImages...');
    if (imageFileToRemove) {
      console.log('Найден файл для удаления:', imageFileToRemove.file.name);

      // Удаляем файл из массива portfolioImages по previewUrl
      const updatedPortfolioImages = formData.portfolioImages.filter(
        (portfolioImage) => portfolioImage.previewUrl !== image
      );

      setFormData((prev) => ({
        ...prev,
        portfolioImages: updatedPortfolioImages,
      }));
      console.log('Обновленные portfolioImages после удаления:', updatedPortfolioImages);
    } else {
      console.log('Файл не найден в formData.portfolioImages.');
    }
  };

  // Обработчик обновления профиля
  const handleProfileUpdate = async () => {
    if (!user) {
      toast.error('Ошибка: ID пользователя не найден');
      return;
    }

    try {
      const portfolioImages = (formData.portfolioImages || []).map(image => image.file);

      console.log('portfolioImages:', formData.portfolioImages);

      const response = await updateUserProfile(user, formData, profileImage, portfolioImages);
      console.log('Профиль успешно обновлен:', response);
      setFormData((prev) => ({
        ...prev,
        ...response, // Обновляем данные профиля в компоненте
      }));
      toast.success('Профиль успешно обновлен');
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      toast.error(error instanceof Error ? error.message : 'Ошибка при обновлении профиля');
    }
  };

  // Обработчик отправки формы
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleProfileUpdate();
  };

  const prevImage = () => {
    if (formData && formData.portfolioImages.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? formData.portfolioImages.length - 1 : prevIndex - 1
      );
    }
  };

  const nextImage = () => {
    if (formData && formData.portfolioImages.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === formData.portfolioImages.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  return (
    <section className="edit-profile-container edit__profile-form">
      <form onSubmit={handleSubmit}>
        <div className="user-photo-wrap">
          <img
            className="user-photo"
            src={
              profileImage
                ? URL.createObjectURL(profileImage)
                : formData.profileImage
                ? `${apiUrl}/${formData.profileImage}?timestamp=${new Date().getTime()}`
                : noPhoto
            }
            alt="Profile"
          />

          <button
            className="button__without__bg"
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
        <div className="container">
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
              className='default_input' 
              value={formData.about ?? ''}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Слайдер с изображениями портфолио */}
          {formData?.portfolioImages && formData.portfolioImages.length > 0 && (
          <div className="portfolio-images">
            {existingPortfolioImages.map((image, index) => (
              <div key={index} className="portfolio-image">
                <img
                  src={`${process.env.REACT_APP_API_URL}/${image}`}
                  alt={`portfolio-${index}`}
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/path/to/fallback-image.jpg'; }}
                />
              </div>
            ))}
          </div>
        )}

          {/* Поле для портфолио */}
          <form>
            {/* Загрузка изображений */}
            <p>Портфолио</p>
            <div className="field">
              <input
                id="imagesInput"
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handlePortfolioImagesChange}
                style={{ display: 'none' }}
              />
              <button className="article-upload article-upload-md" type="button">
                <label htmlFor="imagesInput">
                  <img src={addFile} alt="Добавить изображения" />
                </label>
              </button>

              {/* Превью изображений */}
              {portfolioImagesPreviews.length > 0 && (
                <div className="images-preview" style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {portfolioImagesPreviews.map((imagePreview, index) => {
                    const portfolioImage = formData.portfolioImages?.[index];  // Получаем сам объект ContentImage
                    const imageFile = portfolioImage?.file;  // Извлекаем сам файл из объекта ContentImage
                    const isCover = portfolioImage?.previewUrl === imagePreview;   // Сравниваем только имя файла

                    return (
                      <div
                        key={index}
                        style={{
                          margin: '10px',
                          display: 'inline-block',
                          background: 'transparent',
                          cursor: 'pointer',
                          position: 'relative',
                        }}
                      >
                        <img
                          src={imagePreview}
                          alt={`Preview ${index}`}
                          style={{
                            maxWidth: '200px',
                            maxHeight: '200px',
                            filter: 'opacity(0.5)',
                          }}
                        />
                        {/* Кнопка удаления */}
                        <button
                          onClick={(e) => handleImageRemove(imagePreview, e)}
                          style={{
                            position: 'absolute',
                            background: 'transparent',
                            borderRadius: '50%',
                            padding: '5px',
                            cursor: 'pointer',
                            transform: 'translate(-45px, -45px) scale(0.5)',
                          }}
                        >
                          <img src={deleteFile} alt="Удалить" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </form>

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
        {/* Рейтинг */}
        <div className="card__rating">
          <p>Рейтинг: {formData.rating.toFixed(1)}</p>
          <div className="stars">
            <img
            src={starIcons[Math.round(formData.rating)]}
            alt={`Рейтинг: ${formData.rating}`}
            className="rating-icon"
            />
          </div>
        </div>
      </form>
    </section>
  );
};

export default EditProfileForm;
