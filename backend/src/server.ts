import "reflect-metadata";
import express from "express";
import cors from "cors"; // Импортируем CORS
import userRoutes from "./routes/userRoutes";
import articleRoutes from "./routes/articleRoutes";
import commentRoutes from "./routes/commentRoutes";
import ratingRoutes from "./routes/ratingRoutes";
import adminRoutes from "./routes/adminRoutes";
import newsRoutes from "./routes/newsRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import { AppDataSource } from "./config/db";
import path from 'path';

const app = express();
const PORT = parseInt(process.env.PORT as string, 10) || 5000;

// Определяем параметры CORS
const corsOptions: cors.CorsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        console.log(`CORS Request from origin: ${origin}`); // Логируем запрос
        if (process.env.NODE_ENV === 'production' && origin && origin.includes('176.114.88.27')) {
            callback(null, true);
        } else if (process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
};

// Включаем CORS middleware с опциями
app.use(cors(corsOptions));

// Включаем CORS middleware с опциями
app.use(cors(corsOptions));

// Middleware для обработки JSON
app.use(express.json());

// Подключение папки uploads как статической
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Подключение к базе данных
AppDataSource.initialize()
    .then(() => {
        console.log("Connected to the database");

        // Роуты
        app.use("/api/users", userRoutes);
        app.use("/api/articles", articleRoutes);
        app.use("/api/comments", commentRoutes);
        app.use("/api/ratings", ratingRoutes);
        app.use("/api/admin", adminRoutes);
        app.use("/api/news", newsRoutes);
        app.use("/api/notifications", notificationRoutes);

        // Запуск сервера
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on http://${process.env.HOST || 'localhost'}:${PORT}`);
        });
    })
    .catch((error) => console.log("Database connection error:", error));
