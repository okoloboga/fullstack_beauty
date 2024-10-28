import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
    user?: any; // Добавляем свойство user в запрос
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: "Access denied" });
        return
    }

    jwt.verify(token, "secret_key", (err, user) => {
        if (err) {
            res.status(403).json({ message: "Invalid token" });
            return
        }

        req.user = user; // Добавляем данные о пользователе в запрос
        next();
    });
};
