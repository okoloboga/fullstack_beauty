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

export interface ContentImage {
    file: File;
    previewUrl: string;
  }
  
export interface ContentFormData {
    title: string;
    contentText: string;
    coverImage: File | null;
    contentImages: ContentImage[];
    contentType: string;
  }
  
export interface ProfileData {
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

export interface ContentComment {
    id: number;
    user: {
      name: string;
      username: string;
    };
    contentText: string;
    createdAt: string; // Или тип Date, если хочется использовать даты в формате объекта
  }

export interface ArticleDetail {
    id: number;
    coverImage: string;
    contentImages: string[];
    title: string;
    content: string;
    author: {
      name: string;
      username: string;
    };
    likes: number;
    dislikes: number;
    favoritesCount: number;
    comments: number;
    createdAt: string;
    views: string;
  }

  export interface NewDetail {
    id: number;
    coverImage: string;
    contentImages: string[];
    title: string;
    content: string;
    createdAt: string;
  }

export interface ArticleCardProps {
    article: ArticleDetail;
  }

export interface NewCardProps {
  newContent: NewDetail;
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
    email: string;
    password: string;
  }

export interface RegisterFormData {
    email: string;
    password: string;
    confirmPassword: string;
  }

export interface RestoreFormData {
    email: string;
  }
  
export interface NewsListProps {
    type: 'newest' | 'best'; // Тип новостей: самые новые или лучшие
  }

export interface ContactFormData {
    email: string;
    message: string;
  }