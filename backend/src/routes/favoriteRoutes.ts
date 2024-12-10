import { Router } from "express";
import { addToFavorites, removeFromFavorites, getUserFavorites } from "../controllers/favoriteController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authenticateToken, getUserFavorites);

// Добавить статью или новость в избранное
router.post("/", authenticateToken, addToFavorites);

// Удалить статью или новость из избранного
router.delete("/:id", authenticateToken, removeFromFavorites);

export default router;
