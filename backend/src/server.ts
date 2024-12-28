import "reflect-metadata";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import contentRoutes from "./routes/contentRoutes";
import commentRoutes from "./routes/commentRoutes";
import favoriteRoutes from "./routes/favoriteRoutes";
import likeDislokeRoutes from "./routes/likeDislikeRoutes";
import adminRoutes from "./routes/adminRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import testRouter from "./controllers/testController";
import { AppDataSource } from "./config/db";
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT as string, 10);

// Определяем параметры CORS
const allowedOrigins = [
  'http://localhost:3000', // Локальная среда разработки
  'http://176.114.88.27',  // Ваш удаленный сервер в продакшн
];

const corsOptions: cors.CorsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin) {
            // Разрешаем запросы без заголовка Origin (например, Postman или внутренние запросы)
            callback(null, true);
        } else if (allowedOrigins.includes(origin)) {
            // Разрешаем запросы с источников, которые в списке
            callback(null, true);
        } else if (process.env.NODE_ENV !== 'production') {
            // В режиме разработки разрешаем все источники
            callback(null, true);
        } else {
            // Все остальные отклоняются
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

// Включаем CORS middleware с опциями
app.use(cors(corsOptions));

// Middleware для обработки JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Подключение папки uploads как статической
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Подключение к базе данных
AppDataSource.initialize()
    .then(() => {
        console.log("Connected to the database");

        // Роуты
        app.use("/api/test", testRouter);
        app.use("/api/users", userRoutes);
        app.use("/api/content", contentRoutes);
        app.use("/api/comments", commentRoutes);
        app.use("/api/reviews", reviewRoutes);
        app.use("/api/favorite", favoriteRoutes);
        app.use("/api/likedislike", likeDislokeRoutes);
        app.use("/api/admin", adminRoutes);
        app.use("/api/notifications", notificationRoutes);

        // Запуск сервера
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on http://${process.env.HOST}:${PORT}`);
        });
    })
    .catch((error) => console.log("Database connection error:", error));
