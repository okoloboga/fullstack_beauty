import { Router } from "express";
import { registerUser, loginUser, updateUserProfile } from "../controllers/userController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/profile/:id", authenticateToken, updateUserProfile);

export default router;
