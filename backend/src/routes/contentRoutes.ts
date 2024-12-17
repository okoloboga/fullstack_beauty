import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import { 
    createContent, getContent, getContentById, getContentByUser, updateContent, deleteContent, incrementContentViews
} from "../controllers/contentController";

const router = Router();

// Создание статьи (с обложкой, доступно только партнёрам)
router.post("/", authenticateToken, createContent);

// Получить все статьи (доступно всем)
router.get("/", getContent);

// Получить статьи пользователя (доступно всем)
router.get("/my-articles", getContentByUser);

// Получить статью по id (доступно всем)
router.get("/:id", getContentById);

// Обновить статью (с возможностью изменить обложку, доступно только авторизованным авторам)
router.put("/:id", authenticateToken, updateContent);

// Добавить 1 просмотр статье
router.post("/:id/views", incrementContentViews);

// Удалить статью (доступно только авторизованным авторам или админам)
router.delete("/:id", authenticateToken, deleteContent);

export default router;
