import express from 'express';
import { createReview, getReviews } from '../controllers/reviewController';
import { authenticateToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.post('/', authenticateToken, createReview); // Создать отзыв
router.get('/:partnerId', getReviews); // Получить отзывы партнёра

export default router;
