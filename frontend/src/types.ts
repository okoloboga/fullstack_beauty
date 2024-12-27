import { isMapIterator } from "util/types";

export interface Content {
    id: number;
    title: string;
    coverImage: string;
    content: string;
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
    contentCategory: string;
  }

export interface PortfolioImage {
    file: File;
    previewUrl: string;
}
  
export interface ProfileData {
    password: string | null;
    name: string;
    city: string | null;
    activity: string | null;
    phone: string | null;
    instagram: string | null;
    vk: string | null;
    telegram: string | null;
    facebook: string | null;
    about: string | null;
    receiveNewsletter: boolean;
    rating: number;
    reviews: number;
    profileImage?: File | null;
    portfolioImages: PortfolioImage[]; // Изменено на одиночное изображение
    profileImageUrl?: string;
  }

export interface ContentComment {
    id: number;
    author: string;
    contentText: string;
    createdAt: string; // Или тип Date, если хочется использовать даты в формате объекта
  }

export interface ContentDetail {
    id: number;
    coverImage: string;
    contentImages: string[];
    title: string;
    content: string;
    author: {
      name: string;
    }
    likes: number;
    dislikes: number;
    favoritesCount: number;
    comments: number;
    createdAt: string;
    views: string;
    category: string;
  }

export interface ArticleFilters {
    sortBy: 'views' | 'likes' | 'author' | 'new' | 'old' | null;
  }

export interface NewFilters {
    sortBy: 'new' | 'best';
}

export interface PartnerDetail {
  id: number;
  name: string;
  city: string | null;
  activity: string | null;
  phone: string | null;
  instagram: string | null;
  vk: string | null;
  telegram: string | null;
  facebook: string | null;
  about: string | null;
  rating: number;
  articles: number;
  reviews: number;
  profileImage?: string | null;
  portfolioImages?: string[] | null; // Изменено на одиночное изображение
}

export interface PartnerReview {
    id: number;
    author: string;
    contentText: string;
    createdAt: string;
}

export interface PartnerFilters {
  sortBy: 'alphaUp' | 'alphaDown' | 'city' | 'articles' | 'rating' | null;
}

export interface ContentCardProps {
    content: ContentDetail;
  }

export interface PartnerCardProps {
    partner: PartnerDetail;
}

export interface ProtectedRouteProps {
    allowedRoles: string[]; // Список разрешенных ролей
  }

export interface ProfileNavigationProps {
    active: string; // Активная вкладка, например: 'edit-profile', 'my-articles', и т.д.
  }

export interface DecodedToken {
    role: string;
    name: string;
  }

export interface LoginFormData {
    email: string;
    password: string;
  }

export interface RegisterFormData {
    email: string;
    name: string;
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