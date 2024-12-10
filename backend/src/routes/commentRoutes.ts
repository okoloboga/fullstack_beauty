import { Router } from "express";
import { createComment, deleteComment } from "../controllers/commentController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

// Создать комментарий (к статье или новости)
router.post("/", authenticateToken, createComment);

// Удалить комментарий по id (доступно только автору комментария или администратору)
router.delete("/:id", authenticateToken, deleteComment);

export default router;
