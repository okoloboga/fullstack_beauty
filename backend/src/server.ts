import "reflect-metadata";
import express from "express";
import userRoutes from "./routes/userRoutes";
import articleRoutes from "./routes/articleRoutes";
import commentRoutes from "./routes/commentRoutes";
import ratingRoutes from "./routes/ratingRoutes";
import adminRoutes from "./routes/adminRoutes";
import newsRoutes from "./routes/newsRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import { AppDataSource } from "./config/db";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

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
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => console.log("Database connection error:", error));
