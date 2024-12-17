import { Router } from "express";
import { 
    registerUser, loginUser, updateUserProfile, getUserProfile, confirmEmail, requestPasswordReset, resetPassword 
} from "../controllers/userController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/request-password-reset", requestPasswordReset);
router.post("/password-reset", resetPassword);
router.put("/profile/:id", authenticateToken, updateUserProfile);
router.get("/profile/:id", authenticateToken, getUserProfile);
router.get("/confirm-email", confirmEmail);

export default router;

