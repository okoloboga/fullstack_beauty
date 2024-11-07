import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { Notification } from "../models/Notification";
import { User } from "../models/User";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

// Получить все уведомления пользователя
export const getUserNotifications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    console.log(`Запрос на получение уведомлений для пользователя с id: ${userId}`);

    try {
        const notificationRepository = AppDataSource.getRepository(Notification);
        const notifications = await notificationRepository.find({
            where: { recipient: { id: userId } },
            order: { id: "DESC" },
        });

        console.log(`Уведомления для пользователя с id: ${userId} успешно получены`);
        res.status(200).json(notifications);
    } catch (error) {
        console.error("Ошибка при получении уведомлений пользователя:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Пометить уведомление как прочитанное
export const markNotificationAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    console.log(`Запрос на пометку уведомления с id: ${id} как прочитанного`);

    try {
        const notificationRepository = AppDataSource.getRepository(Notification);
        const notification = await notificationRepository.findOneBy({ id: parseInt(id) });

        if (!notification) {
            console.warn(`Уведомление с id: ${id} не найдено`);
            res.status(404).json({ message: "Notification not found" });
            return;
        }

        notification.isRead = true;
        await notificationRepository.save(notification);

        console.log(`Уведомление с id: ${id} успешно помечено как прочитанное`);
        res.status(200).json({ message: "Notification marked as read", notification });
    } catch (error) {
        console.error("Ошибка при пометке уведомления как прочитанного:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
