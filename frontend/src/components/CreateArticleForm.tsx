import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { createArticle } from '../utils/apiService'; // Импортируем функцию
import { ArticleFormData, ContentImage } from '../types'; // Импортируем тип FormData из types.ts
import addFile from '../assets/images/add-file.svg';
import deleteFile from '../assets/images/delete.png';
import 'react-toastify/dist/ReactToastify.css';
import './CreateArticleForm.css';

const CreateArticleForm: React.FC = () => {
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    content: '',
    coverImage: null as File | null,
    contentImages: [] as ContentImage[],
    contentType: 'article'
  });
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [contentImagesPreviews, setContentImagesPreviews] = useState<string[]>([]);  
  const navigate = useNavigate();

  // useEffect будет отслеживать изменения в formData
  useEffect(() => {
    if (formData.contentImages.length > 0) {
      // Когда contentImages обновляется, можно отправить данные на сервер
      const formDataToSend = new FormData();
      formData.contentImages.forEach((contentImages) => {
        formDataToSend.append("files", contentImages.file);
      });

      // Например, отправка запроса на сервер
      fetch('/upload', {
        method: 'POST',
        body: formDataToSend,
      })
        .then(response => response.json())
        .then(data => console.log('Файлы успешно загружены', data))
        .catch(error => console.error('Ошибка при загрузке файлов', error));
    }
  }, [formData.contentImages]); // Этот эффект будет срабатывать при изменении contentImages


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
            if (img.width > 1920 || img.height > 1920) {
              toast.error('Разрешение изображения слишком велико. Пожалуйста, загрузите изображение с разрешением не более 1920x1920.');
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
  
  
  // Обработчик выбора обложки
  const handleCoverImageSelect = (imageFile: File) => {
    console.log('Выбрано изображение: ', imageFile);  // Логирование выбранного файла
    setCoverImagePreview(URL.createObjectURL(imageFile));  // Сохраняем превью
    setFormData((prev) => ({
      ...prev,
      coverImage: imageFile,  // Обновляем coverImage в состоянии
    }));
  };
  
  // Обработчик удаления изображения
  const handleImageRemove = (image: string, e: React.MouseEvent<HTMLButtonElement>) => {
    // Останавливаем стандартное поведение кнопки
    e.preventDefault();
    e.stopPropagation();
  
    console.log('Попытка удалить изображение:', image);
  
    // Получаем индекс удаляемого превью
    const indexToRemove = contentImagesPreviews.findIndex((preview) => preview === image);
    console.log('Индекс изображения в contentImagesPreviews:', indexToRemove);
  
    if (indexToRemove !== -1) {
      // Удаляем изображение из списка превью
      const updatedPreviews = [...contentImagesPreviews];
      updatedPreviews.splice(indexToRemove, 1);
      setContentImagesPreviews(updatedPreviews);
      console.log('Обновленные превью после удаления:', updatedPreviews);
    } else {
      console.log('Не удалось найти изображение в contentImagesPreviews для удаления.');
    }
  
    // Находим файл для удаления по сохраненной ссылке
    const imageFileToRemove = formData.contentImages.find(
      (contentImage) => contentImage.previewUrl === image // Сравниваем по URL
    );
  
    console.log('Ищем файл для удаления в formData.contentImages...');
    if (imageFileToRemove) {
      console.log('Найден файл для удаления:', imageFileToRemove.file.name);
  
      // Удаляем файл из массива contentImages
      const updatedContentImages = formData.contentImages.filter(
        (contentImage) => contentImage !== imageFileToRemove
      );
  
      setFormData((prev) => ({
        ...prev,
        contentImages: updatedContentImages,
      }));
      console.log('Обновленные contentImages после удаления:', updatedContentImages);
    } else {
      console.log('Файл не найден в formData.contentImages.');
    }
  
    // Если удалили выбранную обложку, сбрасываем обложку
    if (coverImagePreview === image) {
      setCoverImagePreview(null);
      setFormData((prev) => ({
        ...prev,
        coverImage: null,
      }));
      console.log('Обложка удалена');
    } else {
      console.log('Удаление обложки не требуется');
    }
  };
  
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Пользователь не авторизован');
      return;
    }
  
    if (formData.title.length < 5 || formData.title.length > 100) {
      toast.error('Заголовок должен содержать не менее 5 символов и не более 100.');
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
      formData.contentImages.forEach((contentImages) => {
        data.append('contentImages', contentImages.file);
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
  
        <form>
          {/* Загрузка изображений */}
          <div className="field">
            <input
              id="imagesInput"
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              style={{ display: 'none' }}
            />
            <button className="article-upload article-upload-md" type="button">
              <label htmlFor="imagesInput">
                <img src={addFile} alt="Добавить изображения" />
              </label>
            </button>

            {/* Превью изображений */}
            {contentImagesPreviews.length > 0 && (
              <div className="images-preview" style={{ display: 'flex', flexWrap: 'wrap' }}>
                {contentImagesPreviews.map((imagePreview, index) => {
                  const contentImage = formData.contentImages[index];  // Получаем сам объект ContentImage
                  const imageFile = contentImage.file;  // Извлекаем сам файл из объекта ContentImage
                  const isCover = formData.coverImage?.name === imageFile.name;  // Сравниваем только имя файла

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
                        onClick={() => handleCoverImageSelect(imageFile)} // Передаем сам файл для обложки
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

                      {/* Отображаем метку для выбранной обложки */}
                      {isCover && (
                        <div style={{
                          textAlign: 'center',
                          marginTop: '5px',
                          color: '#000000',
                        }}>
                          <span>Главное и превью</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </form>
  
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
