import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { User } from "../models/User";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { Article } from "../models/Article";
import { Comment } from "../models/Comment";

// Получить всех пользователей
export const getAllUsers = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
    console.log("Запрос на получение всех пользователей");
    try {
        const userRepository = AppDataSource.getRepository(User);
        const users = await userRepository.find();
        console.log("Пользователи успешно получены");
        res.status(200).json(users);
    } catch (error) {
        console.error("Ошибка при получении пользователей:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Назначить пользователя партнёром
export const promoteToPartner = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    console.log(`Запрос на повышение пользователя с id: ${id} до партнёра`);

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: parseInt(id) });

        if (!user) {
            console.warn(`Пользователь с id: ${id} не найден`);
            res.status(404).json({ message: "User not found" });
            return;
        }

        user.role = "partner";
        await userRepository.save(user);
        console.log(`Пользователь с id: ${id} успешно повышен до партнёра`);
        res.status(200).json({ message: "User promoted to partner successfully" });
    } catch (error) {
        console.error("Ошибка при повышении пользователя до партнёра:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Блокировать пользователя
export const blockUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    console.log(`Запрос на блокировку пользователя с id: ${id}`);

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: parseInt(id) });

        if (!user) {
            console.warn(`Пользователь с id: ${id} не найден`);
            res.status(404).json({ message: "User not found" });
            return;
        }

        user.role = "blocked"; // Устанавливаем статус "заблокирован"
        await userRepository.save(user);
        console.log(`Пользователь с id: ${id} успешно заблокирован`);
        res.status(200).json({ message: "User blocked successfully" });
    } catch (error) {
        console.error("Ошибка при блокировке пользователя:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Удалить пользователя
export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    console.log(`Запрос на удаление пользователя с id: ${id}`);

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: parseInt(id) });

        if (!user) {
            console.warn(`Пользователь с id: ${id} не найден`);
            res.status(404).json({ message: "User not found" });
            return;
        }

        await userRepository.remove(user);
        console.log(`Пользователь с id: ${id} успешно удалён`);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Ошибка при удалении пользователя:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Обновить статью как администратор
export const updateArticleAsAdmin = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { title, content } = req.body;
    console.log(`Запрос на обновление статьи с id: ${id}`);

    try {
        const articleRepository = AppDataSource.getRepository(Article);
        const article = await articleRepository.findOneBy({ id: parseInt(id) });

        if (!article) {
            console.warn(`Статья с id: ${id} не найдена`);
            res.status(404).json({ message: "Article not found" });
            return;
        }

        article.title = title;
        article.content = content;
        await articleRepository.save(article);
        console.log(`Статья с id: ${id} успешно обновлена`);
        res.status(200).json({ message: "Article updated successfully", article });
    } catch (error) {
        console.error("Ошибка при обновлении статьи:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Удалить статью как администратор
export const deleteArticleAsAdmin = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    console.log(`Запрос на удаление статьи с id: ${id}`);

    try {
        const articleRepository = AppDataSource.getRepository(Article);
        const article = await articleRepository.findOneBy({ id: parseInt(id) });

        if (!article) {
            console.warn(`Статья с id: ${id} не найдена`);
            res.status(404).json({ message: "Article not found" });
            return;
        }

        await articleRepository.remove(article);
        console.log(`Статья с id: ${id} успешно удалена`);
        res.status(200).json({ message: "Article deleted successfully" });
    } catch (error) {
        console.error("Ошибка при удалении статьи:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Удалить комментарий как администратор
export const deleteCommentAsAdmin = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
        console.log(`Комментарий с id: ${id} успешно удалён`);
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Ошибка при удалении комментария:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
