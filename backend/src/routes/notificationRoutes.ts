import { Router } from "express";
import { getUserNotifications, markNotificationAsRead } from "../controllers/notificationController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

// Получить все уведомления пользователя
router.get("/", authenticateToken, getUserNotifications);

// Пометить уведомление как прочитанное
router.put("/:id", authenticateToken, markNotificationAsRead);

export default router;
