import express from 'express';

import authController from '../controllers/auth-controller.js';
import cityController from '../controllers/city-controller.js';
import mealController from '../controllers/meal-controller.js';
import reviewController from '../controllers/review-controller.js';


const router = express.Router();

router.use('/auth', authController);
router.use('/cities', cityController);
router.use('/cities', mealController);
router.use('/cities', reviewController);
router.use('/profile', authController);

export default router;
