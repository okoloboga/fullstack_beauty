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
const PORT = process.env.PORT || 5000;

// Определяем параметры CORS для разных окружений
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? 'http://176.114.88.27'  // Разрешаем запросы только с вашего домена в production
        : 'http://localhost:3000', // Разрешаем запросы с localhost в локальной разработке
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true // Если используются куки, разрешаем их включение в запросы
};

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
        app.listen(PORT, () => {
            if (process.env.NODE_ENV === 'production') {
                console.log(`Server is running on http://${process.env.HOST || 'your-server-domain-or-ip'}:${PORT}`);
            } else {
                console.log(`Server is running on http://localhost:${PORT}`);
            }
        });

    })
    .catch((error) => console.log("Database connection error:", error));
