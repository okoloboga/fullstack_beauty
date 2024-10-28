import { Router } from "express";
import { createArticle, getArticles, getArticleById, updateArticle, deleteArticle } from "../controllers/articleController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

// Создание статьи (с обложкой, доступно только партнёрам)
router.post("/", authenticateToken, createArticle);

// Получить все статьи (доступно всем)
router.get("/", getArticles);

// Получить статью по id (доступно всем)
router.get("/:id", getArticleById);

// Обновить статью (с возможностью изменить обложку, доступно только авторизованным авторам)
router.put("/:id", authenticateToken, updateArticle);

// Удалить статью (доступно только авторизованным авторам или админам)
router.delete("/:id", authenticateToken, deleteArticle);

export default router;
