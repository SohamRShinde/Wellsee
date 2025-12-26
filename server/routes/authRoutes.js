import express from "express"
import { emailVerifyToken, getMe, loginUser, logoutUser, refreshToken, registerUser } from "../controllers/authControllers.js"

const router = express.Router()

router.post("/api/auth/register", registerUser)
router.get("/api/auth/verify/:token", emailVerifyToken)
router.post("/api/auth/login", loginUser)
router.post("/api/auth/logout", logoutUser)
router.get("/me", getMe)
router.post("/refresh", refreshToken)

export default router