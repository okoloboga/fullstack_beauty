import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { Article } from "../models/Article";
import { User } from "../models/User";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

export const createArticle = [
    upload.single("coverImage"),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const { title, content } = req.body;
        const userId = req.user?.userId;

        try {
            const userRepository = AppDataSource.getRepository(User);
            const author = await userRepository.findOneBy({ id: userId });

            if (!author) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            if (author.role !== "partner") {
                res.status(403).json({ message: "Only partners can create articles" });
                return;
            }

            // Проверка на наличие файла обложки
            if (!req.file) {
                res.status(400).json({ message: "Cover image is required" });
                return;
            }

            const article = new Article();
            article.title = title;
            article.content = content;
            article.author = author;
            article.coverImage = req.file.path;

            const articleRepository = AppDataSource.getRepository(Article);
            await articleRepository.save(article);

            res.status(201).json({ message: "Article created successfully", article });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    },
];


// Получить все статьи
export const getArticles = async (_req: Request, res: Response): Promise<void> => {
    try {
        const articleRepository = AppDataSource.getRepository(Article);
        const articles = await articleRepository.find({ relations: ["author"] });
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// Получить одну статью по id
export const getArticleById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const articleRepository = AppDataSource.getRepository(Article);
        const article = await articleRepository.findOne({ where: { id: parseInt(id) }, relations: ["author"] });

        if (!article) {
            res.status(404).json({ message: "Article not found" });
            return;
        }

        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// Обновить статью с возможностью изменить обложку
export const updateArticle = [
    upload.single("coverImage"),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const { id } = req.params;
        const { title, content } = req.body;
        const userId = req.user?.userId;

        try {
            const articleRepository = AppDataSource.getRepository(Article);
            const article = await articleRepository.findOne({ where: { id: parseInt(id) }, relations: ["author"] });

            if (!article) {
                res.status(404).json({ message: "Article not found" });
                return;
            }

            // Проверка на права доступа: только автор статьи может её редактировать
            if (article.author.id !== userId) {
                res.status(403).json({ message: "Access denied" });
                return;
            }

            // Обновление заголовка и содержимого статьи
            article.title = title;
            article.content = content;

            // Обновление обложки статьи, если загружен новый файл
            if (req.file) {
                // Удаление старого файла, если он существует
                if (article.coverImage) {
                    fs.unlink(article.coverImage, (err) => {
                        if (err) {
                            console.error("Failed to delete old cover image:", err);
                        }
                    });
                }
                article.coverImage = req.file.path;
            }

            await articleRepository.save(article);
            res.status(200).json({ message: "Article updated successfully", article });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    },
];


// Удалить статью
export const deleteArticle = async (req: Request, res: Response): Promise<void> => {
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
