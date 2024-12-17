import { Router } from "express";
import { addLikeDislike } from "../controllers/likeDislikeController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

// Добавить лайк или дизлайк
router.post("/", authenticateToken, addLikeDislike);

export default router;
