import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware"; // Импортируем интерфейс с типизацией для req
import { Favorite } from "../models/Favorite";
import { Article, News } from "../models/ContentEntity";
import { AppDataSource } from "../config/db"; // Импортируем DataSource

// Получаем репозиторий через DataSource
const favoriteRepository = AppDataSource.getRepository(Favorite);
const articleRepository = AppDataSource.getRepository(Article);
const newsRepository = AppDataSource.getRepository(News);

// Добавить статью или новость в избранное
export const addToFavorites = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { contentId, contentType } = req.body;

    try {
        let content;
        if (contentType === 'article') {
            content = await articleRepository.findOneBy({ id: contentId });
        } else if (contentType === 'news') {
            content = await newsRepository.findOneBy({ id: contentId });
        }

        if (!content) {
            res.status(404).json({ message: "Контент не найден" });
            return
        }

        // Создаем запись в избранном
        const favorite = new Favorite();
        favorite.user = req.user; // Привязываем пользователя из токена
        favorite.content = content;

        await favoriteRepository.save(favorite);
        res.status(201).json({ message: "Контент добавлен в избранное" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка при добавлении в избранное" });
    }
};

export const getUserFavorites = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId; // Получаем id пользователя из токена
  
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
  
    try {
      // Получаем все избранные записи пользователя
      const favoritesRepository = AppDataSource.getRepository(Favorite);
      const favorites = await favoritesRepository.find({
        where: { user: { id: userId } },
        relations: ["content"], // Подключаем связи с контентом (статья или новость)
      });
  
      // Извлекаем контент из избранных записей
      const contentItems = favorites.map(favorite => favorite.content);
  
      res.status(200).json({ favorites: contentItems }); // Отправляем контент в ответ
    } catch (error) {
      console.error("Error fetching user favorites:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

// Удалить статью или новость из избранного
export const removeFromFavorites = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const favorite = await favoriteRepository.findOneBy({ id: Number(id) });

        if (!favorite) {
            res.status(404).json({ message: "Избранное не найдено" });
            return
        }

        // Проверяем, что пользователь может удалить только свои избранные записи
        if (favorite.user.id !== req.user.id) {
            res.status(403).json({ message: "Вы не можете удалить чужое избранное" });
            return
        }

        await favoriteRepository.remove(favorite);
        res.status(204).json({ message: "Контент удален из избранного" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка при удалении из избранного" });
    }
};
