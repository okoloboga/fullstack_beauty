import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { Article } from "../models/ContentEntity";
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
export const createArticle = [
    upload.fields([
        { name: 'coverImage', maxCount: 1 },
        { name: 'contentImages', maxCount: 10 },
      ]),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        console.log("Тело запроса:", req.body); // Логируем тело запроса
        console.log("Полученные файлы:", req.files); // Логируем файлы

        const { title, content } = req.body;
        const userId = req.user?.userId;

        console.log("Запрос на создание новой статьи");

        try {
            // Поиск пользователя (автора)
            const userRepository = AppDataSource.getRepository(User);
            const author = await userRepository.findOneBy({ id: userId });
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

            const article = new Article();
            article.title = title;
            article.content = content;
            article.author = author;
            article.coverImage = coverImage
            article.images = contentImages

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
        const article = await articleRepository.findOne({ 
            where: { id: parseInt(id) }, 
            relations: ["author", "comments"] });

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

// Получить статьи, написанные пользователем
export const getArticlesByUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    // Получаем ID пользователя из токена
    const user = req.user; // Предположим, что ID пользователя находится в токене после авторизации

    try {
        const articleRepository = AppDataSource.getRepository(Article);
        
        // Находим статьи, где author соответствует пользователю с id = userId
        const articles = await articleRepository.find({
            where: { author: { id: user } }, // Используем связи для поиска по пользователю
            relations: ["author"], // Загружаем связь с автором
        });

        if (articles.length === 0) {
            res.status(404).json({ message: "Нет статей от данного пользователя" });
            return;
        }

        res.status(200).json(articles); // Отправляем статьи
    } catch (error) {
        console.error("Ошибка при получении статей пользователя:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Обновить статью с возможностью изменить обложку
export const updateArticle = [
    upload.array("images"), // Обработка нескольких файлов
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const { id } = req.params;
        const { title, content, images } = req.body;
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

            // Обновление данных статьи
            article.title = title;
            article.content = content;

            // Обработка файлов
            if (req.files && Array.isArray(req.files) && req.files.length > 0) {
                // Удаляем старую обложку, если есть
                if (article.coverImage) {
                    const oldCoverImagePath = path.join(__dirname, "../../uploads", article.coverImage);
                    fs.unlink(oldCoverImagePath, (err) => {
                        if (err) {
                            console.error("Не удалось удалить старую обложку:", err);
                        } else {
                            console.log("Старая обложка успешно удалена");
                        }
                    });
                }

                // Сохраняем новое изображение как coverImage
                article.coverImage = `uploads/${(req.files as Express.Multer.File[])[0].filename}`;

                // Добавляем новые изображения в массив images
                const imageUrls: string[] = (req.files as Express.Multer.File[]).map((file) => `uploads/${file.filename}`);
                const existingImages = images ? JSON.parse(images) : [];
                article.images = [...existingImages, ...imageUrls];
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

export const incrementArticleViews = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
        const articleRepository = AppDataSource.getRepository(Article);
        const article = await articleRepository.findOne({ where: { id: parseInt(id) } });

        if (!article) {
            console.warn(`Статья с id: ${id} не найдена`);
            res.status(404).json({ message: 'Article not found' });
            return
        }

        // Проверяем, был ли уже увеличен счетчик для этого IP-адреса
        const articleViewsRepository = AppDataSource.getRepository(ArticleViewsByIP);
        const existingView = await articleViewsRepository.findOne({
            where: {
                article: { id: parseInt(id) },
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
                    views: article.views,
                });
                return
            }
        }

        // Увеличиваем счетчик просмотров
        article.views += 1;
        await articleRepository.save(article);

        // Записываем IP-адрес в таблицу для отслеживания просмотров
        const newView = new ArticleViewsByIP();
        newView.ipAddress = ipAddress;
        newView.article = article;
        await articleViewsRepository.save(newView);

        console.log(`Просмотры статьи с id: ${id} увеличены до ${article.views}`);
        res.status(200).json({ message: 'View count incremented', views: article.views });
    } catch (error) {
        console.error('Ошибка при увеличении просмотров статьи:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

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
