import { Router } from "express";
import { rateArticle } from "../controllers/ratingController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authenticateToken, rateArticle);

export default router;
