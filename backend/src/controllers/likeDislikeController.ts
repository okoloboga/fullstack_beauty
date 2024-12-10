import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware"; // Импортируем интерфейс с типизацией для req
import { LikeDislike } from "../models/LikeDislike";
import { AppDataSource } from "../config/db"; // Импортируем DataSource
import { Article, News } from "../models/ContentEntity";

// Получаем репозиторий через DataSource
const likeDislikeRepository = AppDataSource.getRepository(LikeDislike);
const articleRepository = AppDataSource.getRepository(Article);
const newsRepository = AppDataSource.getRepository(News);

// Добавить лайк
export const addLike = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
            return;
        }

        // Проверяем, есть ли уже лайк или дизлайк от этого пользователя
        const existingLikeDislike = await likeDislikeRepository.findOne({
            where: {
                user: req.user, // Убедись, что `req.user` правильно типизирован
                content: content,
            },
        });

        if (existingLikeDislike) {
            if (existingLikeDislike.type === 'like') {
                res.status(400).json({ message: "Вы уже поставили лайк" });
                return;
            } else {
                // Если ранее был дизлайк, меняем его на лайк
                existingLikeDislike.type = 'like';
                await likeDislikeRepository.save(existingLikeDislike);
                res.status(200).json({ message: "Дизлайк изменен на лайк" });
                return;
            }
        }

        const like = new LikeDislike();
        like.user = req.user; // Привязываем пользователя
        like.content = content;
        like.type = 'like'; // Тип - лайк

        await likeDislikeRepository.save(like);
        res.status(201).json({ message: "Лайк добавлен" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка при добавлении лайка" });
    }
};

// Добавить дизлайк
export const addDislike = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
            return;
        }

        // Проверяем, есть ли уже лайк или дизлайк от этого пользователя
        const existingLikeDislike = await likeDislikeRepository.findOne({
            where: {
                user: req.user,
                content: content,
            },
        });

        if (existingLikeDislike) {
            if (existingLikeDislike.type === 'dislike') {
                res.status(400).json({ message: "Вы уже поставили дизлайк" });
                return;
            } else {
                // Если ранее был лайк, меняем его на дизлайк
                existingLikeDislike.type = 'dislike';
                await likeDislikeRepository.save(existingLikeDislike);
                res.status(200).json({ message: "Лайк изменен на дизлайк" });
                return;
            }
        }

        const dislike = new LikeDislike();
        dislike.user = req.user; // Привязываем пользователя
        dislike.content = content;
        dislike.type = 'dislike'; // Тип - дизлайк

        await likeDislikeRepository.save(dislike);
        res.status(201).json({ message: "Дизлайк добавлен" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка при добавлении дизлайка" });
    }
};

// Удалить лайк или дизлайк
export const removeLikeDislike = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { contentId, contentType } = req.body; // Получаем contentId и contentType (article или news)

    try {
        let content;
        if (contentType === 'article') {
            content = await articleRepository.findOneBy({ id: contentId });
        } else if (contentType === 'news') {
            content = await newsRepository.findOneBy({ id: contentId });
        }

        if (!content) {
            res.status(404).json({ message: "Контент не найден" });
            return;
        }

        // Ищем существующий лайк или дизлайк
        const likeDislike = await likeDislikeRepository.findOne({
            where: { 
                user: req.user, // Проверяем, что это тот же пользователь
                content: content, // И контент должен совпадать
            }
        });

        if (!likeDislike) {
            res.status(404).json({ message: "Лайк или дизлайк не найден" });
            return;
        }

        // Удаляем лайк или дизлайк
        await likeDislikeRepository.remove(likeDislike);
        res.status(204).json({ message: "Лайк или дизлайк удалён" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка при удалении лайка или дизлайка" });
    }
};
