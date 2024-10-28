import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { User } from "../models/User";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { Article } from "../models/Article";
import { Comment } from "../models/Comment";

// Получить всех пользователей
export const getAllUsers = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const users = await userRepository.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// Назначить пользователя партнёром
export const promoteToPartner = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: parseInt(id) });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        user.role = "partner";
        await userRepository.save(user);

        res.status(200).json({ message: "User promoted to partner successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// Блокировать пользователя
export const blockUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: parseInt(id) });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        user.role = "blocked"; // Устанавливаем статус "заблокирован"
        await userRepository.save(user);

        res.status(200).json({ message: "User blocked successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// Удалить пользователя
export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: parseInt(id) });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        await userRepository.remove(user);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateArticleAsAdmin = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const articleRepository = AppDataSource.getRepository(Article);
        const article = await articleRepository.findOneBy({ id: parseInt(id) });

        if (!article) {
            res.status(404).json({ message: "Article not found" });
            return;
        }

        article.title = title;
        article.content = content;
        await articleRepository.save(article);

        res.status(200).json({ message: "Article updated successfully", article });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteArticleAsAdmin = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const articleRepository = AppDataSource.getRepository(Article);
        const article = await articleRepository.findOneBy({ id: parseInt(id) });

        if (!article) {
            res.status(404).json({ message: "Article not found" });
            return;
        }

        await articleRepository.remove(article);
        res.status(200).json({ message: "Article deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteCommentAsAdmin = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

