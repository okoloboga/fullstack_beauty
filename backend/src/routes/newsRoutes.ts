import { Router } from "express";
import { createNews, getAllNews, getNewsById, updateNews, deleteNews } from "../controllers/newsController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { checkAdmin } from "../middlewares/roleMiddleware";

const router = Router();

// Создание новости (с обязательной обложкой, доступно только админам)
router.post("/", authenticateToken, checkAdmin, createNews);

// Получить все новости (доступно всем)
router.get("/", getAllNews);

// Получить новость по id (доступно всем)
router.get("/:id", getNewsById);

// Обновить новость (с возможностью изменить обложку, доступно только авторизованным админам)
router.put("/:id", authenticateToken, checkAdmin, updateNews);

// Удалить новость (доступно только авторизованным админам)
router.delete("/:id", authenticateToken, checkAdmin, deleteNews);

export default router;
