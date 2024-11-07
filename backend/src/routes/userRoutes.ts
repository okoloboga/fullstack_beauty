import { Router } from "express";
import { registerUser, loginUser, updateUserProfile, getUserProfile } from "../controllers/userController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/profile/:id", authenticateToken, updateUserProfile);
router.get("/profile/:id", authenticateToken, getUserProfile); // Новый маршрут для получения профиля

export default router;

