import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware"; // Импортируем интерфейс с типизацией для req
import { Favorite } from "../models/Favorite";
import { Content } from "../models/Content";
import { AppDataSource } from "../config/db"; // Импортируем DataSource

// Получаем репозиторий через DataSource
const favoriteRepository = AppDataSource.getRepository(Favorite);
const contentRepository = AppDataSource.getRepository(Content);

// Добавить или удалить статью или новость из избранного
export const toggleFavorite = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { contentId } = req.body;
    const user = req.user?.user;

    console.log('Добавляем статью', contentId, 'в избранное к пользователю', user);

    try {
        // Ищем запись в избранном для текущего пользователя
        const existingFavorite = await favoriteRepository.findOne({
            where: {
                user: user,
                contentId: contentId,
            },
        });

        if (existingFavorite) {
            // Если запись найдена, удаляем её из избранного и уменьшаем счетчик
            await favoriteRepository.remove(existingFavorite);

            // Уменьшаем счетчик favoritesCount для контента
            const content = await contentRepository.findOneBy({ id: contentId });
            if (content && content.favoritesCount > 0) {
                content.favoritesCount -= 1; // Уменьшаем счетчик
                await contentRepository.save(content); // Сохраняем обновленный контент
            

            res.status(200).json({ message: "Контент удален из избранного" });
        } else {

            // Если записи нет, добавляем её в избранное и увеличиваем счетчик
            const favorite = new Favorite();
            favorite.user = user;
            favorite.contentId = contentId;

            // Сохраняем запись в базе данных
            await favoriteRepository.save(favorite);

            const article = await contentRepository.findOneBy({ id: contentId });
            if (content) {
                content.favoritesCount = (content.favoritesCount || 0) + 1; // Увеличиваем счетчик
                await contentRepository.save(content); // Сохраняем обновленный контент
            }
            }

            res.status(201).json({ message: "Контент добавлен в избранное" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка при добавлении или удалении из избранного" });
    }
};

export const getUserFavorites = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const user = req.user?.user; // Получаем id пользователя из токена
    console.log('Получаем избранные статьи пользователя:', user);

    if (!user) {
        res.status(401).json({ message: "User not authenticated" });
        return;
    }

    try {
        // Получаем все избранные записи пользователя, ищем по user.id
        const favoritesRepository = AppDataSource.getRepository(Favorite);
        const favorites = await favoritesRepository.find({
            where: { user: { id: user } }
        });

        if (favorites.length === 0) {
            res.status(404).json({ message: "Нет избранных статей данного пользователя" });
            return;
        }

        // Извлекаем contentId и contentType из избранных записей
        const contentIds = favorites.map(favorite => ({
            contentId: favorite.contentId,
        }));
        
        // Получаем статьи на основе contentIds
        const contentRepository = AppDataSource.getRepository(Content);
        const content = await contentRepository.find({
            where: contentIds.map(content => ({
                id: content.contentId, // Находим статью по contentId
            })),
            relations: ["author"], // Загружаем связь с автором, если она нужна
        });

        // Если статьи не найдены
        if (content.length === 0) {
            res.status(404).json({ message: "Нет избранных статей" });
            return;
        }

        // Отправляем массив статей
        res.status(200).json(content);

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
