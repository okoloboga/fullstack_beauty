import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware"; // Импортируем интерфейс с типизацией для req
import { LikeDislike } from "../models/LikeDislike";
import { AppDataSource } from "../config/db"; // Импортируем DataSource
import { Content } from "../models/Content";

// Получаем репозиторий через DataSource
const likeDislikeRepository = AppDataSource.getRepository(LikeDislike);
const contentRepository = AppDataSource.getRepository(Content);

// Добавить лайк или дизлайк
export const addLikeDislike = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { contentId, type } = req.body; // Получаем contentId и type (like/dislike)
    const user = req.user?.user;

    if (type !== 'like' && type !== 'dislike') {
        res.status(400).json({ message: "Invalid type, must be 'like' or 'dislike'" });
        return;
    }

    try {
        const content = await contentRepository.findOneBy({ id: contentId });

        console.log(`Ставим ${type} пользователем:`, req.user, 'для контента:', req.body);

        if (!content) {
            res.status(404).json({ message: "Контент не найден" });
            return;
        }

        // Проверяем, есть ли уже лайк или дизлайк от этого пользователя
        const existingLikeDislike = await likeDislikeRepository.findOne({
            where: {
                user: req.user.id,
                contentId: content.id,       // id контента
            },
        });

        if (existingLikeDislike) {
            if (existingLikeDislike.type === type) {
                res.status(400).json({ message: `Вы уже поставили ${type}` });
                return;
            } else {
                // Если был лайк и мы получаем дизлайк или наоборот
                existingLikeDislike.type = type;
                await likeDislikeRepository.save(existingLikeDislike);

                // Обновляем количество лайков и дизлайков
                if (type === 'like') {
                    await contentRepository.update(content.id, {
                        likes: (content.likes || 0) + 1,
                        dislikes: (content.dislikes || 0) - 1
                    });
                    res.status(200).json({ message: "Дизлайк изменен на лайк" });
                } else {
                    await contentRepository.update(content.id, {
                        likes: (content.likes || 0) - 1,
                        dislikes: (content.dislikes || 0) + 1
                    });
                    res.status(200).json({ message: "Лайк изменен на дизлайк" });
                }
                return;
            }
        }

        // Записываем новый лайк или дизлайк
        const likeDislike = new LikeDislike();
        likeDislike.user = user; // Привязываем пользователя
        likeDislike.contentId = content.id;
        likeDislike.type = type; // Устанавливаем тип

        await likeDislikeRepository.save(likeDislike);

        // Обновляем счетчики лайков и дизлайков
        if (type === 'like') {
            await contentRepository.update(content.id, { likes: (content.likes || 0) + 1 });
            res.status(201).json({ message: "Лайк добавлен" });
        } else {
            await contentRepository.update(content.id, { dislikes: (content.dislikes || 0) + 1 });
            res.status(201).json({ message: "Дизлайк добавлен" });
        }
    } catch (error) {
        console.error("Ошибка при добавлении лайка или дизлайка:", error);
        res.status(500).json({ message: "Ошибка при добавлении лайка или дизлайка" });
    }
};


