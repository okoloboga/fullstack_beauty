// src/dto/article.dto.ts

export interface AuthorDTO {
    name: string | undefined;
}

export interface ArticleDTO {
    id: number;
    likes: number;
    dislikes: number;
    favoritesCount: number;
    comments: number;
    contentImages: string[];
    coverImage: string;
    title: string;
    content: string;
    category: string;
    views: number;
    createdAt: string;
    author: AuthorDTO;
}
