import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { Content } from "../models/Content";
import { User } from "../models/User";
import { ArticleViewsByIP } from "../models/ArticleViewsByIP";
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
export const createContent = [
    upload.fields([
        { name: 'coverImage', maxCount: 1 },
        { name: 'contentImages', maxCount: 10 },
      ]),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        console.log("Тело запроса:", req.body); // Логируем тело запроса
        console.log("Полученные файлы:", req.files); // Логируем файлы

        const { title, contentText, contentType } = req.body;
        const user = req.user?.user;

        console.log("Запрос на создание новой статьи");

        try {
            // Поиск пользователя (автора)
            const userRepository = AppDataSource.getRepository(User);
            const author = await userRepository.findOneBy({ id: user });
            const files = req.files as { [key: string]: Express.Multer.File[] } | undefined;

            if (!files) {
                console.warn("Нет файлов в запросе");
                res.status(400).json({ message: "No files uploaded" });
                return;
              }

            const coverImage = files.coverImage?.[0]
            ? `uploads/${files.coverImage[0].filename}`
            : null;


            if (!coverImage) {
                console.warn("Обложка не была предоставлена");
                res.status(400).json({ message: "Cover image is required" });
                return;
            }

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

            if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
                console.warn("Обложка не была предоставлена");
                res.status(400).json({ message: "Cover image is required" });
                return;
            }

            // Преобразование images в массив URL-ов (если переданы изображения)
            const contentImages: string[] = files.contentImages
                ? (files.contentImages as Express.Multer.File[]).map(file => `uploads/${file.filename}`)
                : [];

            console.log("URL-ы изображений:", );

            const content = new Content();
            content.title = title;
            content.content = contentText;
            content.author = author;
            content.coverImage = coverImage;
            content.contentImages = contentImages;
            content.type = contentType;

            const contentRepository = AppDataSource.getRepository(Content);
            await contentRepository.save(content);
            console.log("Статья успешно создана:", content);

            res.status(201).json({ message: "Статья успешно создана", content });
        } catch (error) {
            console.error("Ошибка при создании статьи:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
];

// Получить все статьи
export const getContent = async (req: Request, res: Response): Promise<void> => {
    console.log("Запрос на получение всех статей");
    const contentType = req.body;

    try {
        const contentRepository = AppDataSource.getRepository(Content);
        const content = await contentRepository.find({
            where: { type: contentType },
            relations: ["author"] });

        console.log("Статьи успешно получены");
        res.status(200).json(content);
    } catch (error) {
        console.error("Ошибка при получении статей:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Получить статью по ID
export const getContentById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    console.log(`Запрос на получение статьи с id: ${id}`);

    try {
        const contentRepository = AppDataSource.getRepository(Content);
        const content = await contentRepository.findOne({ 
            where: { id: parseInt(id) }, 
            relations: ["author"] });

        if (!content) {
            console.warn(`Статья с id: ${id} не найдена`);
            res.status(404).json({ message: "Article not found" });
            return;
        }

        res.status(200).json(content);
    } catch (error) {
        console.error("Ошибка при получении статьи:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Получить статьи, написанные пользователем
export const getContentByUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    // Получаем ID пользователя из токена
    const user = req.user; // Предположим, что ID пользователя находится в токене после авторизации

    try {
        const contentRepository = AppDataSource.getRepository(Content);
        
        // Находим статьи, где author соответствует пользователю с id = user
        const content = await contentRepository.find({
            where: { author: { id: user } }, // Используем связи для поиска по пользователю
            relations: ["author"], // Загружаем связь с автором
        });

        if (content.length === 0) {
            res.status(404).json({ message: "Нет статей от данного пользователя" });
            return;
        }

        res.status(200).json(content); // Отправляем статьи
    } catch (error) {
        console.error("Ошибка при получении статей пользователя:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Обновить статью с возможностью изменить обложку
export const updateContent = [
    upload.array("images"), // Обработка нескольких файлов
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const { id } = req.params;
        const { title, contentText, images } = req.body;
        const user = req.user?.user;

        console.log(`Запрос на обновление статьи с id: ${id}`);

        try {
            const contentRepository = AppDataSource.getRepository(Content);
            const content = await contentRepository.findOne({ where: { id: parseInt(id) }, relations: ["author"] });

            if (!content) {
                console.warn(`Статья с id: ${id} не найдена`);
                res.status(404).json({ message: "Article not found" });
                return;
            }

            if (content.author.id !== user) {
                console.warn(`Пользователь с id: ${user} не имеет прав на обновление статьи с id: ${id}`);
                res.status(403).json({ message: "Access denied" });
                return;
            }

            // Обновление данных статьи
            content.title = title;
            content.content = contentText;

            // Обработка файлов
            if (req.files && Array.isArray(req.files) && req.files.length > 0) {
                // Удаляем старую обложку, если есть
                if (content.coverImage) {
                    const oldCoverImagePath = path.join(__dirname, "../../uploads", content.coverImage);
                    fs.unlink(oldCoverImagePath, (err) => {
                        if (err) {
                            console.error("Не удалось удалить старую обложку:", err);
                        } else {
                            console.log("Старая обложка успешно удалена");
                        }
                    });
                }

                // Сохраняем новое изображение как coverImage
                content.coverImage = `uploads/${(req.files as Express.Multer.File[])[0].filename}`;

                // Добавляем новые изображения в массив images
                const imageUrls: string[] = (req.files as Express.Multer.File[]).map((file) => `uploads/${file.filename}`);
                const existingImages = images ? JSON.parse(images) : [];
                content.contentImages = [...existingImages, ...imageUrls];
            }

            await contentRepository.save(content);

            console.log(`Статья с id: ${id} успешно обновлена`);
            res.status(200).json({ message: "Article updated successfully", content });
        } catch (error) {
            console.error("Ошибка при обновлении статьи:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
];

export const incrementContentViews = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    let ipAddress = req.headers['x-forwarded-for'] || req.ip;  // Получаем IP-адрес пользователя

    if (!ipAddress) {
        res.status(400).json({ message: 'IP address is required' });
        return
    }

    if (Array.isArray(ipAddress)) {
        ipAddress = ipAddress[0]; // Если это массив, используем первый элемент
    }
    const user = req.user;

    console.log(`Запрос на увеличение просмотров статьи с id: ${id}, от пользователя с id: ${user}, IP: ${ipAddress}`);

    if (!user) {
        console.warn('Пользователь не авторизован');
        res.status(401).json({ message: 'Unauthorized' });
        return
    }

    try {
        const contentRepository = AppDataSource.getRepository(Content);
        const content = await contentRepository.findOne({ where: { id: parseInt(id) } });

        if (!content) {
            console.warn(`Статья с id: ${id} не найдена`);
            res.status(404).json({ message: 'Article not found' });
            return
        }

        // Проверяем, был ли уже увеличен счетчик для этого IP-адреса
        const contentViewsRepository = AppDataSource.getRepository(ArticleViewsByIP);
        const existingView = await contentViewsRepository.findOne({
            where: {
                content: { id: parseInt(id) },
                ipAddress,
            },
        });

        if (existingView) {
            const timeDifference = Date.now() - new Date(existingView.viewedAt).getTime();
            const twentyFourHours = 1000 * 60 * 60 * 24;

            // Если прошло меньше 24 часов, не увеличиваем счетчик просмотров
            if (timeDifference < twentyFourHours) {
                res.status(200).json({
                    message: 'View already recorded within the last 24 hours',
                    views: content.views,
                });
                return
            }
        }

        // Увеличиваем счетчик просмотров
        content.views += 1;
        await contentRepository.save(content);

        // Записываем IP-адрес в таблицу для отслеживания просмотров
        const newView = new ArticleViewsByIP();
        newView.ipAddress = ipAddress;
        newView.content = content;
        await contentViewsRepository.save(newView);

        console.log(`Просмотры статьи с id: ${id} увеличены до ${content.views}`);
        res.status(200).json({ message: 'View count incremented', views: content.views });
    } catch (error) {
        console.error('Ошибка при увеличении просмотров статьи:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Удалить статью
export const deleteContent = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    console.log(`Запрос на удаление статьи с id: ${id}`);

    try {
        const contentRepository = AppDataSource.getRepository(Content);
        const content = await contentRepository.findOneBy({ id: parseInt(id) });

        if (!content) {
            console.warn(`Статья с id: ${id} не найдена`);
            res.status(404).json({ message: "Article not found" });
            return;
        }

        await contentRepository.remove(content);
        console.log(`Статья с id: ${id} успешно удалена`);
        res.status(200).json({ message: "Article deleted successfully" });
    } catch (error) {
        console.error("Ошибка при удалении статьи:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
