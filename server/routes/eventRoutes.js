import express from "express"
import { 
    createEventWithForm, 
    getEventParticipants, 
    pastEvents, 
    registerForEvent, 
    upcomingEvents 
} from "../controllers/eventControllers.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post('/create', authenticate, createEventWithForm);
router.get('/upcoming', upcomingEvents)
router.get('/past', pastEvents)
router.post('/register', authenticate, registerForEvent)
router.get('/:eventId/participants', authenticate, getEventParticipants)

export default router