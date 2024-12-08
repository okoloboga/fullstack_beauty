import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { Article } from "../models/Article";
import { User } from "../models/User";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import multer from "multer";
import path from 'path';
import fs from "fs";

const uploadDir = path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Создать новую статью
export const createArticle = [
    upload.single("coverImage"),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {

        console.log("Тело запроса:", req.body); // Логируем тело запроса
        console.log("Полученный файл:", req.file); // Логируем файл
        
        const { title, content } = req.body;
        const userId = req.user?.userId;

        console.log("Запрос на создание новой статьи");

        try {
            const userRepository = AppDataSource.getRepository(User);
            const author = await userRepository.findOneBy({ id: userId });

            if (!author) {
                console.warn("Пользователь не найден");
                res.status(404).json({ message: "User not found" });
                return;
            }

            if (author.role == "user") {
                console.warn("Попытка создания статьи пользователем без прав");
                res.status(403).json({ message: "Only partners and admins can create articles" });
                return;
            }

            if (!req.file) {
                console.warn("Обложка не была предоставлена");
                res.status(400).json({ message: "Cover image is required" });
                return;
            }

            const article = new Article();
            article.title = title;
            article.content = content;
            article.author = author;
            article.coverImage = `uploads/${req.file.filename}`;

            const articleRepository = AppDataSource.getRepository(Article);
            await articleRepository.save(article);

            console.log("Статья успешно создана:", article);
            res.status(201).json({ message: "Article created successfully", article });
        } catch (error) {
            console.error("Ошибка при создании статьи:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
];

// Получить все статьи
export const getArticles = async (_req: Request, res: Response): Promise<void> => {
    console.log("Запрос на получение всех статей");

    try {
        const articleRepository = AppDataSource.getRepository(Article);
        const articles = await articleRepository.find({ relations: ["author"] });
        console.log("Статьи успешно получены");
        res.status(200).json(articles);
    } catch (error) {
        console.error("Ошибка при получении статей:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Получить статью по ID
export const getArticleById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    console.log(`Запрос на получение статьи с id: ${id}`);

    try {
        const articleRepository = AppDataSource.getRepository(Article);
        const article = await articleRepository.findOne({ where: { id: parseInt(id) }, relations: ["author"] });

        if (!article) {
            console.warn(`Статья с id: ${id} не найдена`);
            res.status(404).json({ message: "Article not found" });
            return;
        }

        console.log(`Статья с id: ${id} успешно получена`);
        res.status(200).json(article);
    } catch (error) {
        console.error("Ошибка при получении статьи:", error);
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

        console.log(`Запрос на обновление статьи с id: ${id}`);

        try {
            const articleRepository = AppDataSource.getRepository(Article);
            const article = await articleRepository.findOne({ where: { id: parseInt(id) }, relations: ["author"] });

            if (!article) {
                console.warn(`Статья с id: ${id} не найдена`);
                res.status(404).json({ message: "Article not found" });
                return;
            }

            if (article.author.id !== userId) {
                console.warn(`Пользователь с id: ${userId} не имеет прав на обновление статьи с id: ${id}`);
                res.status(403).json({ message: "Access denied" });
                return;
            }

            article.title = title;
            article.content = content;

            if (req.file) {
                if (article.coverImage) {
                    fs.unlink(article.coverImage, (err) => {
                        if (err) {
                            console.error("Не удалось удалить старую обложку:", err);
                        } else {
                            console.log("Старая обложка успешно удалена");
                        }
                    });
                }
                article.coverImage = `uploads/${req.file.filename}`;
            }

            await articleRepository.save(article);
            console.log(`Статья с id: ${id} успешно обновлена`);
            res.status(200).json({ message: "Article updated successfully", article });
        } catch (error) {
            console.error("Ошибка при обновлении статьи:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
];

// Удалить статью
export const deleteArticle = async (req: Request, res: Response): Promise<void> => {
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
