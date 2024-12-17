import axiosInstance from './axiosInstance'; // Импортируем экземпляр axios
import axios from 'axios';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { NewsItem, ArticleDetail, LoginFormData, ContactFormData } from '../types';
const apiUrl = process.env.REACT_APP_API_URL; // Получаем URL из переменных окружения

// Функция для получения статьи
export const fetchContent = async (id: string): Promise<ArticleDetail> => {
  try {
    const response = await axiosInstance.get<ArticleDetail>(`${apiUrl}/api/content/${id}`);
    return response.data; // Возвращаем данные статьи
  } catch (error) {
    throw new Error('Ошибка при загрузке статьи');
  }
};

// Функция для получения статей
export const fetchArticles = async (): Promise<ArticleDetail[]> => {
    try {
      const response = await axiosInstance.get<ArticleDetail[]>(`${apiUrl}/api/content/articles`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при загрузке статей:', error);
      throw error; // Прокидываем ошибку, чтобы её можно было обработать в компоненте
    }
  };

  // Функция для увеличения количества просмотров статьи
export const incrementArticleViews = async (id: string): Promise<void> => {
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
export const fetchNews = async (id: string): Promise<NewsItem> => {
  try {
    const response = await axiosInstance.get<NewsItem>(`${apiUrl}/api/content/news`);
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
export const fetchFilteredNews = async (type: string): Promise<NewsItem[]> => {
    try {
      const response = await axiosInstance.get<NewsItem[]>(`${apiUrl}/api/content`);
  
      let newsData = response.data;
  
      // Фильтруем новости в зависимости от типа
      if (type === 'newest') {
        newsData = newsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      } else if (type === 'best') {
        newsData = newsData.sort((a, b) => b.likes - a.likes);
      }
  
      return newsData;
    } catch (error) {
      console.error('Ошибка при загрузке новостей:', error);
      throw error; // Прокидываем ошибку для обработки в вызывающем коде
    }
  };

// Функция для получения свежих новостей
export const fetchLatestNews = async (limit: number = 6): Promise<NewsItem[]> => {
    try {
      const response = await axiosInstance.get<NewsItem[]>(`${apiUrl}/api/content`, {
        params: { sort: 'newest', limit },
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при загрузке новостей:', error);
      throw error; // Прокидываем ошибку для обработки в вызывающем коде
    }
  };

// Функция для получения популярных статей
export const fetchPopularArticles = async (limit: number = 3): Promise<ArticleDetail[]> => {
    try {
      const response = await axiosInstance.get<ArticleDetail[]>(`${apiUrl}/api/content`, {
        params: { sort: 'popular', limit },
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при загрузке популярных статей:', error);
      throw error; // Прокидываем ошибку для обработки в вызывающем коде
    }
  };

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

// Функция для загрузки данных профиля
export const fetchUserProfile = async (user: string): Promise<any> => {
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
    user: string,
    formData: any,
    profileImage: File | null,
    portfolioImage: File | null
  ): Promise<any> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Ошибка: Токен авторизации отсутствует');
        throw new Error('Токен авторизации отсутствует');
      }
  
      const formDataToSend = new FormData();
      // Добавляем данные профиля
      Object.keys(formData).forEach((key) => {
        const value = formData[key as keyof typeof formData];
        if (value !== undefined && value !== null) {
          formDataToSend.append(key, typeof value === 'boolean' ? String(value) : value);
        }
      });
  
      // Добавляем изображения, если они есть
      if (profileImage) {
        formDataToSend.append('profileImage', profileImage);
      }
  
      if (portfolioImage) {
        formDataToSend.append('portfolioImage', portfolioImage);
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
export const registerUser = async (email: string, password: string): Promise<void> => {
    try {
      const response = await axiosInstance.post(`${apiUrl}/api/users/register`, {
        email,
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
export const requestPasswordReset = async (formData: FormData): Promise<string> => {
  try {
    const response = await axios.post(`${apiUrl}/api/users/request-password-reset`, formData);
    console.log(response.data.message);
    // Если сервер вернул успешный ответ
    return 'Письмо с инструкциями отправлено на ваш email';
  } catch (error) {
    console.error('Ошибка при запросе на восстановление пароля:', error);
    
    // В случае ошибки возвращаем стандартное сообщение
    return 'Произошла ошибка при запросе восстановления пароля';
  }
};

// Функция для обновления пароля
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  try {
    const response = await axios.post(`${apiUrl}/api/users/reset-password`, {
      token,
      newPassword,
    });
    console.log(response.data.message);
  } catch (error) {
    console.error('Ошибка при обновлении пароля:', error);
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
export const createComment = async (articleId: number, content: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Ошибка: Токен авторизации отсутствует');
      throw new Error('Токен авторизации отсутствует');
    }

    const response = await axiosInstance.post(
      `${apiUrl}/api/comments`, // Путь к эндпоинту создания комментария
      { articleId, content }, // Отправляем тело запроса с ID статьи и текстом комментария
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(response.data.message); // Выводим сообщение об успехе
  } catch (error) {
    console.error('Ошибка при создании комментария:', error);
    toast.error('Ошибка при создании комментария');
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


