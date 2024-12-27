import { Router } from "express";
import { createComment, getComments } from "../controllers/commentController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

// Создать комментарий (к статье или новости)
router.post("/", authenticateToken, createComment);


// Получить комментарии для статьи
router.get("/:articleId", getComments);

// Удалить комментарий по id (доступно только автору комментария или администратору)
// router.delete("/:id", authenticateToken, deleteComment);

export default router;
