import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { News } from "../models/News";
import { User } from "../models/User";
import { Notification } from "../models/Notification";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import multer from "multer";
import fs from "fs";

// Конфигурация хранения файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

const upload = multer({ storage });

// Создать новость с обязательной обложкой
export const createNews = [
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

            if (author.role !== "admin") {
                res.status(403).json({ message: "Only admins can create news" });
                return;
            }

            // Проверка на наличие файла обложки
            if (!req.file) {
                res.status(400).json({ message: "Cover image is required" });
                return;
            }

            const news = new News();
            news.title = title;
            news.content = content;
            news.author = author;
            news.coverImage = `uploads/${req.file.filename}`;

            const newsRepository = AppDataSource.getRepository(News);
            await newsRepository.save(news);

            // Создание уведомлений для всех пользователей
            const allUsers = await userRepository.find();
            const notificationRepository = AppDataSource.getRepository(Notification);

            for (const user of allUsers) {
                const notification = new Notification();
                notification.type = "news";
                notification.message = `Новая новость: "${title}" была опубликована`;
                notification.recipient = user;

                await notificationRepository.save(notification);
            }

            res.status(201).json({ message: "News created successfully", news });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    },
];


// Получить все новости
export const getAllNews = async (_req: Request, res: Response): Promise<void> => {
    try {
        const newsRepository = AppDataSource.getRepository(News);
        const newsList = await newsRepository.find({ relations: ["author"] });
        res.status(200).json(newsList);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// Получить одну новость по id
export const getNewsById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const newsRepository = AppDataSource.getRepository(News);
        const news = await newsRepository.findOne({ where: { id: parseInt(id) }, relations: ["author"] });

        if (!news) {
            res.status(404).json({ message: "News not found" });
            return;
        }

        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// Обновить новость с возможностью изменить обложку
export const updateNews = [
    upload.single("coverImage"),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const { id } = req.params;
        const { title, content } = req.body;
        const userId = req.user?.userId;

        try {
            const newsRepository = AppDataSource.getRepository(News);
            const news = await newsRepository.findOne({ where: { id: parseInt(id) }, relations: ["author"] });

            if (!news) {
                res.status(404).json({ message: "News not found" });
                return;
            }

            // Проверка на права доступа: только админ может редактировать новость
            if (news.author.id !== userId) {
                res.status(403).json({ message: "Access denied" });
                return;
            }

            // Обновление заголовка и содержимого новости
            news.title = title;
            news.content = content;

            // Обновление обложки новости, если загружен новый файл
            if (req.file) {
                // Удаление старого файла, если он существует
                if (news.coverImage) {
                    fs.unlink(news.coverImage, (err) => {
                        if (err) {
                            console.error("Failed to delete old cover image:", err);
                        }
                    });
                }
                news.coverImage = `uploads/${req.file.filename}`;
            }

            await newsRepository.save(news);
            res.status(200).json({ message: "News updated successfully", news });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    },
];


// Удалить новость
export const deleteNews = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.userId;

    try {
        const userRepository = AppDataSource.getRepository(User);
        const author = await userRepository.findOneBy({ id: userId });

        if (!author || author.role !== "admin") {
            res.status(403).json({ message: "Only admins can delete news" });
            return;
        }

        const newsRepository = AppDataSource.getRepository(News);
        const news = await newsRepository.findOneBy({ id: parseInt(id) });

        if (!news) {
            res.status(404).json({ message: "News not found" });
            return;
        }

        await newsRepository.remove(news);
        res.status(200).json({ message: "News deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};