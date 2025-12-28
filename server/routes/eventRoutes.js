import express from "express"
import { createEvent, pastEvents, saveForm, upcomingEvents } from "../controllers/eventControllers.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post('/create', authenticate, createEvent);
router.get('/upcoming', upcomingEvents)
router.get('/past', pastEvents)
router.post('/saveForm', saveForm)

export default router