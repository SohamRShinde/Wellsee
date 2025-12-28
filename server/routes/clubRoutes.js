import express from 'express'
import { createClub, getClubs, updateClub } from '../controllers/clubControllers.js'

import { authenticate  } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
    .get(getClubs)
    .post(authenticate, createClub);

router.route('/:id')
    .put(authenticate, updateClub)

export default router