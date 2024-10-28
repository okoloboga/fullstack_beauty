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

    if (value < 1 || value > 5) {
        res.status(400).json({ message: "Rating value must be between 1 and 5" });
        return;
    }

    try {
        const userRepository = AppDataSource.getRepository(User);
        const articleRepository = AppDataSource.getRepository(Article);

        const user = await userRepository.findOneBy({ id: userId });
        const article = await articleRepository.findOneBy({ id: articleId });

        if (!user || !article) {
            res.status(404).json({ message: "User or article not found" });
            return;
        }

        const ratingRepository = AppDataSource.getRepository(Rating);
        let rating = await ratingRepository.findOne({ where: { user: { id: userId }, article: { id: articleId } } });

        if (rating) {
            rating.value = value; // Обновляем существующую оценку
        } else {
            rating = new Rating();
            rating.value = value;
            rating.user = user;
            rating.article = article;
        }

        await ratingRepository.save(rating);
        res.status(200).json({ message: "Rating added/updated successfully", rating });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
