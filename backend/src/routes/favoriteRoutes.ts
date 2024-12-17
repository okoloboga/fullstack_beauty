import { Router } from "express";
import { toggleFavorite, removeFromFavorites, getUserFavorites } from "../controllers/favoriteController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authenticateToken, getUserFavorites);

// Добавить статью или новость в избранное
router.post("/", authenticateToken, toggleFavorite);

// Удалить статью или новость из избранного
router.delete("/:id", authenticateToken, removeFromFavorites);

export default router;
