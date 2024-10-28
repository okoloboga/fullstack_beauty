import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authMiddleware";

// Middleware для проверки прав администратора
export const checkAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (req.user?.role !== "admin") {
        res.status(403).json({ message: "Access denied. Admins only." });
        return;
    }
    next();
};
