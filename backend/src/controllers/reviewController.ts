import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { AppDataSource } from "../config/db";
import { Review } from "../models/Review";
import { User } from "../models/User";

// Создать отзыв
export const createReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { partnerId, reviewText } = req.body;
  const userId = req.user?.user;

  console.log("Запрос на создание отзыва для партнёра:", partnerId, "Текст отзыва:", reviewText);

  try {
    const userRepository = AppDataSource.getRepository(User);
    const reviewRepository = AppDataSource.getRepository(Review);

    const author = await userRepository.findOneBy({ id: userId });
    const partner = await userRepository.findOneBy({ id: partnerId });

    if (!author) {
      console.warn(`Пользователь с id: ${userId} не найден`);
      res.status(404).json({ message: "Пользователь не найден" });
      return;
    }

    if (!partner) {
      console.warn(`Партнёр с id: ${partnerId} не найден`);
      res.status(404).json({ message: "Партнёр не найден" });
      return;
    }

    if (!reviewText) {
      console.warn(`Отсутствует текст отзыва: ${reviewText}`);
      res.status(400).json({ message: "Отсутствует текст отзыва" });
      return;
    }

    const review = new Review();
    review.user = author;
    review.userId = partnerId;
    review.reviewText = reviewText;

    await reviewRepository.save(review);

    // Увеличиваем счётчик отзывов у партнёра
    partnerId.reviews = (partnerId.reviews || 0) + 1;
    await userRepository.save(partnerId);

    console.log(`Отзыв успешно добавлен: ${review.reviewText}`);
    res.status(201).json({ message: "Отзыв успешно добавлен" });
  } catch (error) {
    console.error("Ошибка при создании отзыва:", error);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
};

// Получить отзывы
export const getReviews = async (req: Request, res: Response): Promise<void> => {
  const { partnerId } = req.params;

  console.log('Получение отзывов для партнёра:', partnerId);

  try {
    const reviewRepository = AppDataSource.getRepository(Review);

    const reviews = await reviewRepository.find({
      where: { userId: parseInt(partnerId) },
      relations: ["user"],
      order: { createdAt: "DESC" },
    });

    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Ошибка при получении отзывов:", error);
    res.status(500).json({ message: "Ошибка при получении отзывов" });
  }
};
