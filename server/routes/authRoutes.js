import express from "express"
import { emailVerifyToken, getMe, loginUser, logoutUser, refreshToken, registerUser } from "../controllers/authControllers.js"
import { authenticate } from "../middleware/authMiddleware.js"
import { strictLimiter } from "../middleware/rateLimiters.js"

const router = express.Router()

router.post("/register", strictLimiter, registerUser)
router.get("/verify/:token", emailVerifyToken)
router.post("/login", strictLimiter, loginUser)
router.post("/logout", logoutUser)
router.get("/me", authenticate, getMe)
router.post("/refresh", refreshToken)

export default router