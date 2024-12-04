export interface Article {
    id: number;
    title: string;
    coverImage: string;
    content: string;
  }

export interface NewsItem {
    id: number;
    title: string;
    content: string;
    description: string;
    coverImage: string;
    likes: number;
    date: string;
  }

export interface NewsProps {
    news: {
      id: number;
      title: string;
      description: string;
      coverImage: string;
      likes: number;
    };
  }

export interface FormData {
    title: string;
    content: string;
    coverImage: File;
  }

export interface ProfileData {
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
    portfolioImage?: string | null; // Изменено на одиночное изображение
  }

export interface ArticleDetail {
    id: number;
    coverImage: string;
    title: string;
    description: string;
    author: {
      name: string;
    };
    likes?: number;
    dislikes?: number;
    stars?: number;
    comments?: number;
    content: string;
  }

export interface ArticleCardProps {
    article: ArticleDetail;
  }

export interface ProtectedRouteProps {
    allowedRoles: string[]; // Список разрешенных ролей
  }

export interface ProfileNavigationProps {
    active: string; // Активная вкладка, например: 'edit-profile', 'my-articles', и т.д.
  }

export interface DecodedToken {
    role: string;
  }

export interface LoginFormData {
    username: string;
    password: string;
  }

export interface RegisterFormData {
    username: string;
    password: string;
    confirmPassword: string;
  }
  
export interface NewsListProps {
    type: 'newest' | 'best'; // Тип новостей: самые новые или лучшие
  }

export interface ContactFormData {
    email: string;
    message: string;
  }