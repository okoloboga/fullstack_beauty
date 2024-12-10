import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import { 
    createArticle, getArticles, getArticleById, getArticlesByUser, updateArticle, deleteArticle , incrementArticleViews
} from "../controllers/articleController";

const router = Router();

// Создание статьи (с обложкой, доступно только партнёрам)
router.post("/", authenticateToken, createArticle);

// Получить все статьи (доступно всем)
router.get("/", getArticles);

// Получить статьи пользователя (доступно всем)
router.get("/my-articles", getArticlesByUser);

// Получить статью по id (доступно всем)
router.get("/:id", getArticleById);

// Обновить статью (с возможностью изменить обложку, доступно только авторизованным авторам)
router.put("/:id", authenticateToken, updateArticle);

// Добавить 1 просмотр статье
router.post("/:id/views", incrementArticleViews);

// Удалить статью (доступно только авторизованным авторам или админам)
router.delete("/:id", authenticateToken, deleteArticle);

export default router;
