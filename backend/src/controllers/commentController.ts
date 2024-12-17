import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { Comment } from "../models/Comment";
import { User } from "../models/User";
import { Content } from "../models/Content";
import { Notification } from "../models/Notification";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

// Создать комментарий
export const createComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { contentId, commentContent } = req.body;
    const user = req.user?.user;

    console.log("Запрос на создание комментария");

    try {
        const userRepository = AppDataSource.getRepository(User);
        const contentRepository = AppDataSource.getRepository(Content);

        const author = await userRepository.findOneBy({ id: user });
        const content = await contentRepository.findOneBy({ id: contentId });

        if (!author) {
            console.warn(`Пользователь с id: ${user} не найден`);
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (!content) {
            console.warn(`Статья или новость с id: ${contentId} не найдена`);
            res.status(404).json({ message: "Article or news not found" });
            return;
        }

        const comment = new Comment();
        comment.contentText = commentContent; // Присваиваем текст комментария
        comment.user = author;

        comment.contentId = content.id;

        const commentRepository = AppDataSource.getRepository(Comment);
        await commentRepository.save(comment);

        console.log(`Комментарий успешно добавлен: ${comment.contentText}`);

        content.comments += 1;  // Увеличиваем счётчик комментариев для статьи
        await contentRepository.save(content);

        // Создаем уведомление для автора статьи или новости
        const contentAuthor = content.author;
        if (contentAuthor && contentAuthor.id !== user) {
            const notification = new Notification();
            notification.type = "comment";
            notification.message = `${author.name} прокомментировал вашу статью ${content?.title}`;
            notification.recipient = contentAuthor;

            const notificationRepository = AppDataSource.getRepository(Notification);
            await notificationRepository.save(notification);

            console.log(`Уведомление отправлено автору контента с id: ${contentAuthor.id}`);
        }

        res.status(201).json({ message: "Comment added successfully", comment });
    } catch (error) {
        console.error("Ошибка при создании комментария:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getComments = async (req: Request, res: Response): Promise<void> => {
    const { contentId } = req.params;

    try {
        const commentRepository = AppDataSource.getRepository(Comment);

        // Получаем все комментарии, относящиеся к статье (articleId)
        const comments = await commentRepository.find({
            where: { contentId: parseInt(contentId) },
            relations: ["user"],  // Для того чтобы получить информацию о пользователе (например, имя)
            order: {
                createdAt: "DESC",  // Сортируем по дате создания (от новых к старым)
            },
        });

        res.status(200).json({ comments });
    } catch (error) {
        console.error("Ошибка при получении комментариев:", error);
        res.status(500).json({ message: "Ошибка при получении комментариев" });
    }
};


// Удалить комментарий
export const deleteComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    console.log(`Запрос на удаление комментария с id: ${id}`);

    try {
        const commentRepository = AppDataSource.getRepository(Comment);
        const comment = await commentRepository.findOneBy({ id: parseInt(id) });

        if (!comment) {
            console.warn(`Комментарий с id: ${id} не найден`);
            res.status(404).json({ message: "Comment not found" });
            return;
        }

        await commentRepository.remove(comment);
        console.log(`Комментарий с id: ${id} успешно удален`);
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Ошибка при удалении комментария:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
