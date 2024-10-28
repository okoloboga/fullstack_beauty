import { Router } from "express";
import { getAllUsers, promoteToPartner, blockUser, deleteUser } from "../controllers/adminController";
import { updateArticleAsAdmin, deleteArticleAsAdmin, deleteCommentAsAdmin } from "../controllers/adminController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { checkAdmin } from "../middlewares/roleMiddleware";

const router = Router();

// Получить всех пользователей (только админ)
router.get("/users", authenticateToken, checkAdmin, getAllUsers);

// Назначить пользователя партнёром (только админ)
router.put("/users/:id/promote", authenticateToken, checkAdmin, promoteToPartner);

// Блокировать пользователя (только админ)
router.put("/users/:id/block", authenticateToken, checkAdmin, blockUser);

// Удалить пользователя (только админ)
router.delete("/users/:id", authenticateToken, checkAdmin, deleteUser);

// Обновить статью (только админ)
router.put("/articles/:id", authenticateToken, checkAdmin, updateArticleAsAdmin);

// Удалить статью (только админ)
router.delete("/articles/:id", authenticateToken, checkAdmin, deleteArticleAsAdmin);

// Удалить комментарий (только админ)
router.delete("/comments/:id", authenticateToken, checkAdmin, deleteCommentAsAdmin);

export default router;
