import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { Comment } from "../models/Comment";
import { User } from "../models/User";
import { Article } from "../models/Article";
import { Notification } from "../models/Notification";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

// Создать комментарий
export const createComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { articleId, content } = req.body;
    const userId = req.user?.userId;

    try {
        const userRepository = AppDataSource.getRepository(User);
        const articleRepository = AppDataSource.getRepository(Article);

        const author = await userRepository.findOneBy({ id: userId });
        const article = await articleRepository.findOneBy({ id: articleId });

        if (!author || !article) {
            res.status(404).json({ message: "User or article not found" });
            return;
        }

        const comment = new Comment();
        comment.content = content;
        comment.author = author;
        comment.article = article;

        const commentRepository = AppDataSource.getRepository(Comment);
        await commentRepository.save(comment);

        // Создаем уведомление для автора статьи
        if (article.author.id !== userId) {
            const notification = new Notification();
            notification.type = "comment";
            notification.message = `${author.username} прокомментировал вашу статью "${article.title}"`;
            notification.recipient = article.author;
        
            const notificationRepository = AppDataSource.getRepository(Notification);
            await notificationRepository.save(notification);
        }

        res.status(201).json({ message: "Comment added successfully", comment });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// Удалить комментарий
export const deleteComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const commentRepository = AppDataSource.getRepository(Comment);
        const comment = await commentRepository.findOneBy({ id: parseInt(id) });

        if (!comment) {
            res.status(404).json({ message: "Comment not found" });
            return;
        }

        await commentRepository.remove(comment);
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
