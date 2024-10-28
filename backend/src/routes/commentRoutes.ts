import { Router } from "express";
import { createComment, deleteComment } from "../controllers/commentController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authenticateToken, createComment);
router.delete("/:id", authenticateToken, deleteComment);

export default router;
