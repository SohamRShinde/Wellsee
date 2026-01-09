import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { announceNewEvent, getUserNotifications, notifyParticipants, sendInterviewReminder } from '../controllers/notifControllers.js';

const router = express.Router();

router.get('/', authenticate, getUserNotifications);
router.post('/event', authenticate, notifyParticipants);
router.post('/new-event', authenticate, announceNewEvent)
router.post('/interview', authenticate, sendInterviewReminder)

export default router;