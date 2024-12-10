import { Router } from "express";
import { addLike, addDislike, removeLikeDislike } from "../controllers/likeDislikeController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

// Добавить лайк
router.post("/like", authenticateToken, addLike);

// Добавить дизлайк
router.post("/dislike", authenticateToken, addDislike);

// Удалить лайк или дизлайк
router.delete("/:id", authenticateToken, removeLikeDislike);

export default router;
