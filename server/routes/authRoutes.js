import express from "express"
import { emailVerifyToken, getMe, loginUser, logoutUser, refreshToken, registerUser } from "../controllers/authControllers.js"
import { authenticate } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/register", registerUser)
router.get("/verify/:token", emailVerifyToken)
router.post("/login", loginUser)
router.post("/logout", logoutUser)
router.get("/me", authenticate, getMe)
router.post("/refresh", refreshToken)

export default router