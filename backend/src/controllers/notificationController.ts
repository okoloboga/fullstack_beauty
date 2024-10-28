import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { Notification } from "../models/Notification";
import { User } from "../models/User";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

// Получить все уведомления пользователя
export const getUserNotifications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    try {
        const notificationRepository = AppDataSource.getRepository(Notification);
        const notifications = await notificationRepository.find({
            where: { recipient: { id: userId } },
            order: { id: "DESC" },
        });

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// Пометить уведомление как прочитанное
export const markNotificationAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const notificationRepository = AppDataSource.getRepository(Notification);
        const notification = await notificationRepository.findOneBy({ id: parseInt(id) });

        if (!notification) {
            res.status(404).json({ message: "Notification not found" });
            return;
        }

        notification.isRead = true;
        await notificationRepository.save(notification);

        res.status(200).json({ message: "Notification marked as read", notification });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
