import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { Rating } from "../models/Rating";
import { User } from "../models/User";
import { Article } from "../models/Article";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

// Добавить или обновить оценку
export const rateArticle = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { articleId, value } = req.body;
    const userId = req.user?.userId;

    console.log(`Запрос на оценку статьи с id: ${articleId} пользователем с id: ${userId}`);

    // Проверка на корректность значения оценки
    if (value < 1 || value > 5) {
        console.warn(`Некорректное значение оценки: ${value}. Оценка должна быть в диапазоне от 1 до 5.`);
        res.status(400).json({ message: "Rating value must be between 1 and 5" });
        return;
    }

    try {
        const userRepository = AppDataSource.getRepository(User);
        const articleRepository = AppDataSource.getRepository(Article);

        const user = await userRepository.findOneBy({ id: userId });
        const article = await articleRepository.findOneBy({ id: articleId });

        if (!user) {
            console.warn(`Пользователь с id: ${userId} не найден`);
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (!article) {
            console.warn(`Статья с id: ${articleId} не найдена`);
            res.status(404).json({ message: "Article not found" });
            return;
        }

        const ratingRepository = AppDataSource.getRepository(Rating);
        let rating = await ratingRepository.findOne({
            where: { user: { id: userId }, article: { id: articleId } },
        });

        if (rating) {
            console.log(`Обновление существующей оценки для статьи с id: ${articleId} пользователем с id: ${userId}`);
            rating.value = value; // Обновляем существующую оценку
        } else {
            console.log(`Добавление новой оценки для статьи с id: ${articleId} пользователем с id: ${userId}`);
            rating = new Rating();
            rating.value = value;
            rating.user = user;
            rating.article = article;
        }

        await ratingRepository.save(rating);
        console.log(`Оценка для статьи с id: ${articleId} успешно добавлена/обновлена пользователем с id: ${userId}`);
        res.status(200).json({ message: "Rating added/updated successfully", rating });
    } catch (error) {
        console.error("Ошибка при добавлении/обновлении оценки:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
