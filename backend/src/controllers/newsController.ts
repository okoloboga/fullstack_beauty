import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { News } from "../models/ContentEntity";
import { User } from "../models/User";
import { Notification } from "../models/Notification";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import multer from "multer";
import path from 'path';
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
    upload.array("images"),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        console.log("Тело запроса:", req.body); // Логируем тело запроса
        console.log("Полученные файлы:", req.files); // Логируем файлы

        const { title, content, images } = req.body;
        const userId = req.user?.userId;

        console.log("Запрос на создание новости");

        try {
            const userRepository = AppDataSource.getRepository(User);
            const author = await userRepository.findOneBy({ id: userId });

            if (!author) {
                console.warn(`Пользователь с id: ${userId} не найден`);
                res.status(404).json({ message: "User not found" });
                return;
            }

            if (author.role !== "admin") {
                console.warn(`Пользователь с id: ${userId} не имеет прав для создания новостей`);
                res.status(403).json({ message: "Only admins can create news" });
                return;
            }

            if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
                console.warn("Обложка не была предоставлена");
                res.status(400).json({ message: "Cover image is required" });
                return;
            }

            // Преобразование images в массив URL-ов (если переданы изображения)
            const imageUrls: string[] = (req.files as Express.Multer.File[]).map((file) => `uploads/${file.filename}`);

            // Преобразуем images, если они переданы в запросе
            const articleImages = images ? JSON.parse(images) : [];

            const news = new News();
            news.title = title;
            news.content = content;
            news.author = author;
            news.coverImage = `uploads/${(req.files as Express.Multer.File[])[0].filename}`; // Первое изображение как coverImage
            news.images = [...articleImages, ...imageUrls]; // Объединяем переданные изображения с теми, что были загружены

            const newsRepository = AppDataSource.getRepository(News);
            await newsRepository.save(news);
            console.log("Новость успешно создана:", news);

            // Создание уведомлений для всех пользователей
            const allUsers = await userRepository.find();
            const notificationRepository = AppDataSource.getRepository(Notification);

            for (const user of allUsers) {
                const notification = new Notification();
                notification.type = "news";
                notification.message = `Новая новость: "${title}" была опубликована`;
                notification.recipient = user;

                await notificationRepository.save(notification);
                console.log(`Уведомление отправлено пользователю с id: ${user.id}`);
            }

            res.status(201).json({ message: "News created successfully", news });
        } catch (error) {
            console.error("Ошибка при создании новости:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
];

// Получить все новости
export const getAllNews = async (_req: Request, res: Response): Promise<void> => {
    console.log("Запрос на получение всех новостей");

    try {
        const newsRepository = AppDataSource.getRepository(News);
        const newsList = await newsRepository.find({ relations: ["author"] });
        console.log("Все новости успешно получены");
        res.status(200).json(newsList);
    } catch (error) {
        console.error("Ошибка при получении новостей:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Получить одну новость по ID
export const getNewsById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    console.log(`Запрос на получение новости с id: ${id}`);

    try {
        const newsRepository = AppDataSource.getRepository(News);
        const news = await newsRepository.findOne({ where: { id: parseInt(id) }, relations: ["author"] });

        if (!news) {
            console.warn(`Новость с id: ${id} не найдена`);
            res.status(404).json({ message: "News not found" });
            return;
        }

        console.log(`Новость с id: ${id} успешно получена`);
        res.status(200).json(news);
    } catch (error) {
        console.error("Ошибка при получении новости:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Обновить новость с возможностью изменить обложку
export const updateNews = [
    upload.array("images"),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const { id } = req.params;
        const { title, content, images } = req.body;
        const userId = req.user?.userId;

        console.log(`Запрос на обновление новости с id: ${id}`);

        try {
            const newsRepository = AppDataSource.getRepository(News);
            const news = await newsRepository.findOne({ where: { id: parseInt(id) }, relations: ["author"] });

            if (!news) {
                console.warn(`Новость с id: ${id} не найдена`);
                res.status(404).json({ message: "News not found" });
                return;
            }

            if (news.author.id !== userId) {
                console.warn(`Пользователь с id: ${userId} не имеет прав для обновления новости с id: ${id}`);
                res.status(403).json({ message: "Access denied" });
                return;
            }

            news.title = title;
            news.content = content;

            if (req.files && Array.isArray(req.files) && req.files.length > 0) {
                // Удаляем старую обложку, если есть
                if (news.coverImage) {
                    const oldCoverImagePath = path.join(__dirname, "../../uploads", news.coverImage);
                    fs.unlink(oldCoverImagePath, (err) => {
                        if (err) {
                            console.error("Не удалось удалить старую обложку:", err);
                        } else {
                            console.log("Старая обложка успешно удалена");
                        }
                    });
                }

                // Сохраняем новое изображение как coverImage
                news.coverImage = `uploads/${(req.files as Express.Multer.File[])[0].filename}`;

                // Добавляем новые изображения в массив images
                const imageUrls: string[] = (req.files as Express.Multer.File[]).map((file) => `uploads/${file.filename}`);
                const existingImages = images ? JSON.parse(images) : [];
                news.images = [...existingImages, ...imageUrls];
            }

            await newsRepository.save(news);
            console.log(`Новость с id: ${id} успешно обновлена`);
            res.status(200).json({ message: "News updated successfully", news });
        } catch (error) {
            console.error("Ошибка при обновлении новости:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
];

// Удалить новость
export const deleteNews = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.userId;

    console.log(`Запрос на удаление новости с id: ${id}`);

    try {
        const userRepository = AppDataSource.getRepository(User);
        const author = await userRepository.findOneBy({ id: userId });

        if (!author || author.role !== "admin") {
            console.warn(`Пользователь с id: ${userId} не имеет прав для удаления новостей`);
            res.status(403).json({ message: "Only admins can delete news" });
            return;
        }

        const newsRepository = AppDataSource.getRepository(News);
        const news = await newsRepository.findOneBy({ id: parseInt(id) });

        if (!news) {
            console.warn(`Новость с id: ${id} не найдена`);
            res.status(404).json({ message: "News not found" });
            return;
        }

        await newsRepository.remove(news);
        console.log(`Новость с id: ${id} успешно удалена`);
        res.status(200).json({ message: "News deleted successfully" });
    } catch (error) {
        console.error("Ошибка при удалении новости:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
