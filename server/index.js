import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/authRoutes.js"
import eventRoutes from "./routes/eventRoutes.js"

dotenv.config()
const app = express()

//middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to Database"))
.catch((err) => console.error("Failed to Connect to Database\n", err))

app.use("/", authRoutes)
app.use("/api/events", eventRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))