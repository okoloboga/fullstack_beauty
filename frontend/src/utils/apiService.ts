import axiosInstance from './axiosInstance'; // Импортируем экземпляр axios
import axios from 'axios';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { ContentDetail, LoginFormData, ContactFormData } from '../types';
const apiUrl = process.env.REACT_APP_API_URL || ''; // Получаем URL из переменных окружения

export const testConnect = async () => {
  try {
    console.log('Проверяем соединение...');
    const response = await axiosInstance.get(`${apiUrl}/api/test/test`);
    console.log('Проверка соединения:', response.data);
    return response.data; // Возвращаем ответ от сервера
  } catch (error) {
    console.error('Ошибка при проверке соединения:', error);
    throw error; // Прокидываем ошибку
  }
}

// Функция для получения статьи
export const fetchContent = async (id: string): Promise<ContentDetail> => {
  try {
    const response = await axiosInstance.get<ContentDetail>(`${apiUrl}/api/content/${id}`);
    console.log('Данные статьи:', response.data);
    return response.data; // Возвращаем данные статьи
  } catch (error) {
    throw new Error('Ошибка при загрузке статьи');
  }
};

// Функция для получения статей
export const fetchArticles = async (): Promise<ContentDetail[]> => {
    try {
      const response = await axiosInstance.get<ContentDetail[]>(`${apiUrl}/api/content/articles`);
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Ошибка при загрузке статей:', error);
      throw error; // Прокидываем ошибку, чтобы её можно было обработать в компоненте
    }
  };

  // Функция для увеличения количества просмотров статьи
export const incrementViews = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Ошибка: Токен авторизации отсутствует');
      throw new Error('Токен авторизации отсутствует');
    }

    await axiosInstance.post(`${apiUrl}/api/content/${id}/views`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Ошибка при увеличении просмотров:', error);
  }
};

// Функция для получения новости
export const fetchNews = async (): Promise<ContentDetail[]> => {
  try {
    const response = await axiosInstance.get<ContentDetail[]>(`${apiUrl}/api/content/news`);
    return response.data;
  } catch (err) {
    throw new Error('Ошибка при загрузке новости');
  }
}

// Функция для создания статьи
export const createArticle = async (formData: FormData, token: string) => {
  console.log('Публикуем статью:', formData)

  try {
    const response = await axiosInstance.post(`${apiUrl}/api/content`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Возвращаем данные ответа
  } catch (error) {
    console.log('Ошибка при создании статьи:', error)
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Ошибка при создании статьи');
    } else {
      throw new Error('Произошла неизвестная ошибка при создании статьи.');
    }
  }
};


// Функция для получения новостей с фильтрацией по типу
// export const fetchFilteredNews = async (type: string): Promise<NewsItem[]> => {
//     try {
//       const response = await axiosInstance.get<NewsItem[]>(`${apiUrl}/api/content`);
  
//       let newsData = response.data;
  
//       // Фильтруем новости в зависимости от типа
//       if (type === 'newest') {
//         newsData = newsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//       } else if (type === 'best') {
//         newsData = newsData.sort((a, b) => b.likes - a.likes);
//       }
  
//       return newsData;
//     } catch (error) {
//       console.error('Ошибка при загрузке новостей:', error);
//       throw error; // Прокидываем ошибку для обработки в вызывающем коде
//     }
//   };

// Функция для получения свежих новостей
// export const fetchLatestNews = async (limit: number = 6): Promise<NewsItem[]> => {
//     try {
//       const response = await axiosInstance.get<NewsItem[]>(`${apiUrl}/api/content`, {
//         params: { sort: 'newest', limit },
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Ошибка при загрузке новостей:', error);
//       throw error; // Прокидываем ошибку для обработки в вызывающем коде
//     }
//   };

// // Функция для получения популярных статей
// export const fetchPopularArticles = async (limit: number = 3): Promise<ArticleDetail[]> => {
//     try {
//       const response = await axiosInstance.get<ArticleDetail[]>(`${apiUrl}/api/content`, {
//         params: { limit },
//       });
//       console.log(`Получение популярных статей:`, response.data);
//       return response.data;
//     } catch (error) {
//       console.error('Ошибка при загрузке популярных статей:', error);
//       throw error; // Прокидываем ошибку для обработки в вызывающем коде
//     }
//   };

// Функция для создания новости
export const createNew = async (formData: FormData, token: string) => {
    console.log('Публикуем новость:', formData)
  
    try {
      const response = await axiosInstance.post(`${apiUrl}/api/content`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Возвращаем ответ от сервера
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Ошибка при создании новости');
      } else {
        throw new Error('Произошла неизвестная ошибка при создании новости.');
      }
    }
  };

// Функция для удаления статьи
export const deleteContent = async (contentId: number): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Ошибка: Токен авторизации отсутствует');
      throw new Error('Токен авторизации отсутствует');
    }

    const response = await axiosInstance.delete(
      `/api/content/${contentId}`, // Путь к эндпоинту удаления статьи
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(response.data.message); // Выводим сообщение об успехе
  } catch (error) {
    console.error('Ошибка при удалении статьи:', error);
    toast.error('Ошибка при удалении статьи');
    throw error; // Пробрасываем ошибку для дальнейшей обработки, если необходимо
  }
};

// Функция для загрузки данных профиля
export const fetchUserProfile = async (user: number): Promise<any> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Ошибка: Токен авторизации отсутствует');
        throw new Error('Токен авторизации отсутствует');
      }
  
      const response = await axiosInstance.get(`${apiUrl}/api/users/profile/${user}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.data; // Возвращаем данные профиля
    } catch (error) {
      console.error('Ошибка при загрузке данных профиля:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Не удалось загрузить данные профиля');
      } else {
        throw new Error('Неизвестная ошибка при загрузке данных профиля');
      }
    }
  };

// Функция загрузки профиля партнера
export const fetchPartner = async (user: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`${apiUrl}/api/users/partners/${user}`);
    return response.data; // Возвращаем данные профиля
  } catch (error) {
    console.error('Ошибка при загрузке данных профиля:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Не удалось загрузить данные профиля');
    } else {
      throw new Error('Неизвестная ошибка при загрузке данных профиля');
    }
  }
}

// Функция для загрузки пользователей с ролью partner или admin
export const fetchUsersByRole = async (): Promise<any[]> => {
  try {
      const response = await axiosInstance.get(`${apiUrl}/api/users/roles`);
      console.log('Список пользователей:', response.data);
      return response.data; // Возвращаем список пользователей
  } catch (error) {
      console.error('Ошибка при загрузке списка пользователей:', error);
      if (axios.isAxiosError(error)) {
          throw new Error(error.response?.data?.message || 'Не удалось загрузить список пользователей');
      } else {
          throw new Error('Неизвестная ошибка при загрузке списка пользователей');
      }
  }
};

// Функция для получения избранных статей и новостей пользователя
export const fetchUserFavorites = async (user: string): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Ошибка: Токен авторизации отсутствует');
      throw new Error('Токен авторизации отсутствует');
    }

    const response = await axiosInstance.get(`${apiUrl}/api/favorite`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Полученные избранные статьи:', response.data)
    
    return response.data; // Возвращаем список избранных
  } catch (error) {
    console.error('Ошибка при загрузке списка избранных:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Не удалось загрузить избранные');
    } else {
      throw new Error('Неизвестная ошибка при загрузке избранных');
    }
  }
};

// Функция для получения избранных статей и новостей пользователя
export const fetchUserArticles = async (): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Ошибка: Токен авторизации отсутствует');
      throw new Error('Токен авторизации отсутствует');
    }

    // Отправляем GET-запрос на сервер
    const response = await axiosInstance.get(`${apiUrl}/api/content/my-articles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Возвращаем список статей
  } catch (error) {
    console.error('Ошибка при загрузке статей пользователя:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Не удалось загрузить статьи');
    } else {
      throw new Error('Неизвестная ошибка при загрузке статей');
    }
  }
};

// Функция для обновления профиля пользователя
export const updateUserProfile = async (
  user: number,
  formData: any,
  profileImage: File | null,
  portfolioImages: File[] | null
): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Ошибка: Токен авторизации отсутствует');
      throw new Error('Токен авторизации отсутствует');
    }

    const formDataToSend = new FormData();
    // Добавляем данные профиля, исключая 'portfolioImages'
    Object.keys(formData).forEach((key) => {
      if (key !== 'portfolioImages') { // Исключаем 'portfolioImages'
        const value = formData[key as keyof typeof formData];
        if (value !== undefined && value !== null) {
          formDataToSend.append(key, typeof value === 'boolean' ? String(value) : value);
        }
      }
    });

    // Добавляем изображение профиля, если есть
    if (profileImage) {
      formDataToSend.append('profileImage', profileImage);
    }

    // Добавляем портфолио изображения, если есть
    if (portfolioImages) {
      portfolioImages.forEach((image) => {
        formDataToSend.append('portfolioImages', image); // Добавляем каждый файл с ключом 'portfolioImages'
      });
    }

    // Логирование содержимого FormData для проверки
    for (let pair of formDataToSend.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    // Отправляем запрос на обновление данных профиля
    const response = await axiosInstance.put(`${apiUrl}/api/users/profile/${user}`, formDataToSend, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data; // Возвращаем обновленные данные профиля
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Ошибка при обновлении профиля');
    } else {
      throw new Error('Неизвестная ошибка при обновлении профиля');
    }
  }
};


export const loginUser = async (formData: LoginFormData): Promise<string> => {
  try {
    const response = await axiosInstance.post(`${apiUrl}/api/users/login`, formData);
    return response.data.token; // Возвращаем токен
  } catch (error) {
    console.error('Ошибка при авторизации:', error);
    throw error; // Прокидываем ошибку
  }
};

// Функция для регистрации пользователя
export const registerUser = async (email: string, name: string, password: string): Promise<void> => {
    try {
      const response = await axiosInstance.post(`${apiUrl}/api/users/register`, {
        email,
        name,
        password,
      });
      console.log('Успешная регистрация:', response.data);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      if (err.response) {
        throw new Error(err.response.data?.message || 'Ошибка при регистрации');
      } else {
        throw new Error('Ошибка при регистрации, попробуйте еще раз');
      }
    }
  };

  export const confirmEmail = async (token: string): Promise<any> => {
    try {
      const response = await axiosInstance.get(`${apiUrl}/api/users/confirm-email?token=${token}`);

      return response.data; // Возвращаем ответ от сервера
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      if (err.response) {
        return err.response.data?.message || 'Ошибка при подтверждении почты'; // Возвращаем сообщение об ошибке
      } else {
        return 'Ошибка при подтверждении почты, попробуйте еще раз'; // Если нет ответа от сервера
      }
    }
  };

// Функция для запроса на восстановление пароля
export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    console.log('Форма для восстановления пароля:', email);
    const response = await axios.post(`${apiUrl}/api/users/request-password-reset`, {
      email,
    });
    console.log('Запрос на восстановление пароля:', response);
  } catch (error) {
    console.error('Ошибка при запросе на восстановление пароля:', error);

    // Преобразуем ошибку для передачи в вызывающий код
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || 'Не удалось отправить запрос на восстановление пароля'
      );
    } else {
      throw new Error('Произошла ошибка при запросе на восстановление пароля');
    }
  }
};

// Функция для обновления пароля
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  try {
    console.log('Обновление пароля:', newPassword);
    const response = await axios.post(`${apiUrl}/api/users/password-reset`, {
      token,
      newPassword,
    });
    console.log('Ответ от сервера:', response.data.message);
  } catch (error) {
    console.error('Ошибка при обновлении пароля:', error);

    // Преобразуем ошибку для передачи в вызывающий код
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || 'Не удалось обновить пароль'
      );
    } else {
      throw new Error('Произошла ошибка при обновлении пароля');
    }
  }
};

  // Функция отправки контактных данных на сервер
export const sendContactMessage = async (formData: ContactFormData): Promise<void> => {
    try {
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Произошла ошибка при отправке сообщения.');
      }
  
      console.log('Сообщение отправлено успешно');
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
      throw new Error('Произошла ошибка при отправке сообщения.');
    }
  };

// Функция для добавления лайка
export const toggleLike = async (contentId: number, type: string ): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Ошибка: Токен авторизации отсутствует');
      throw new Error('Токен авторизации отсутствует');
    }

    const response = await axiosInstance.post(
      `${apiUrl}/api/likedislike`,
      { contentId, type },  // Отправляем в теле запроса
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(response.data.message);
  } catch (error) {
    console.error('Ошибка при добавлении лайка:', error);
    toast.error('Ошибка при добавлении лайка');
  }
};

// Функция для добавления дизлайка
export const toggleDislike = async (contentId: number, type: string ): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Ошибка: Токен авторизации отсутствует');
      throw new Error('Токен авторизации отсутствует');
    }

    const response = await axiosInstance.post(
      `${apiUrl}/api/likedislike`,
      { contentId, type },  // Отправляем в теле запроса
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(response.data.message);
  } catch (error) {
    console.error('Ошибка при добавлении дизлайка:', error);
    toast.error('Ошибка при добавлении дизлайка');
  }
};

// Функция для добавления комментария
export const createComment = async (articleId: number, commentContent: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Ошибка: Токен авторизации отсутствует');
      return; // Завершаем выполнение
    }

    const response = await axiosInstance.post(
      `${apiUrl}/api/comments`, // Путь к эндпоинту создания комментария
      { articleId, commentContent },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(response.data.message);
  } catch (error) {
    // Проверяем, является ли ошибка от сервера (Axios)
    if (axios.isAxiosError(error) && error.response) {
      // Извлекаем сообщение об ошибке, возвращенное сервером
      const serverMessage = error.response.data?.message || 'Неизвестная ошибка';
      toast.error(serverMessage); // Показываем пользователю сообщение сервера
      return; // Завершаем выполнение
    }

    // Если ошибка не связана с Axios (например, сбой сети)
    console.error('Неизвестная ошибка:', error);
    toast.error('Ошибка при создании комментария. Пожалуйста, попробуйте еще раз.');
  }
};

// Функция для добавления/удаления из избранного
export const toggleFavorite = async (contentId: number): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Ошибка: Токен авторизации отсутствует');
      throw new Error('Токен авторизации отсутствует');
    }

    const response = await axios.post(
      `${apiUrl}/api/favorite`,  // Ваш эндпоинт
      { contentId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(response.data.message);  // Показываем уведомление об успешной операции
  } catch (error) {
    console.error('Ошибка при добавлении/удалении из избранного:', error);
    toast.error('Ошибка при добавлении/удалении из избранного');
  }
};

// Функция для удаления комментария
export const deleteComment = async (commentId: number): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Ошибка: Токен авторизации отсутствует');
      throw new Error('Токен авторизации отсутствует');
    }

    const response = await axiosInstance.delete(
      `${apiUrl}/api/comments/${commentId}`, // Путь к эндпоинту удаления комментария
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(response.data.message); // Выводим сообщение об успехе
  } catch (error) {
    console.error('Ошибка при удалении комментария:', error);
    toast.error('Ошибка при удалении комментария');
  }
};


export const fetchComments = async (articleId: number): Promise<any> => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/comments/${articleId}`
    );

    return response.data.comments;
  } catch (error) {
    console.error("Ошибка при получении комментариев:", error);
    throw new Error("Ошибка при получении комментариев");
  }
};


// Получение отзывов о партнёре
export const fetchReviews = async (partnerId: number): Promise<any> => {
  try {
    const response = await axios.get(`${apiUrl}/api/reviews/${partnerId}`);
    return response.data.reviews;
  } catch (error) {
    console.error("Ошибка при получении отзывов:", error);
    throw new Error("Ошибка при получении отзывов");
  }
};

// Создание отзыва о партнёре
export const createReview = async (partnerId: number, reviewText: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Ошибка: Токен авторизации отсутствует');
      return;
    }

    const response = await axios.post(
      `${apiUrl}/api/reviews`,
      { partnerId, reviewText },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(response.data.message);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const serverMessage = error.response.data?.message || 'Неизвестная ошибка';
      toast.error(serverMessage);
      return;
    }
    console.error('Неизвестная ошибка:', error);
    toast.error('Ошибка при создании отзыва. Пожалуйста, попробуйте еще раз.');
  }
};