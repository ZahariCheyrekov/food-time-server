import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import * as authService from '../services/auth-service.js';
import * as mealService from '../services/meal-service.js';
import { SALT, TOKEN_EXPIRATION_TIME } from '../constants/app-constants.js';


const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await authService.getUserByEmail(email);

        if (!existingUser) {
            return res.status(404).json({ message: 'User doesn\'t exist.' });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.SECRET, { expiresIn: TOKEN_EXPIRATION_TIME });

        const user = {
            _id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            picture: existingUser.picture
        }

        res.status(200).json({ user, token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: Object.values(error.errors)[0].properties.message });
    }
});

router.post('/register', async (req, res) => {
    const { name, email, password, repeatPassword, picture } = req.body;

    try {
        const existingUser = await authService.getUserByEmail(email);

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password should be at least 6 characters long' });
        }

        if (password !== repeatPassword) {
            return res.status(400).json({ message: 'Passwords don\'t match.' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT);

        const result = await authService.createUser({ name, email, password: hashedPassword, picture });

        const token = jwt.sign({ email: result.email, id: result._id }, process.env.SECRET, { expiresIn: TOKEN_EXPIRATION_TIME });

        const user = {
            _id: result._id,
            name: result.name,
            email: result.email,
            picture: result.picture
        }

        res.status(200).json({ user, token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: Object.values(error.errors)[0].properties.message });
    }
});

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await authService.getUserById(userId);
        const meals = await mealService.getUserMeals(userId);
        const likedMeals = await mealService.getUserLikedMeals(userId);

        res.status(200).json({ user, meals, likedMeals });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: Object.values(error.errors)[0].properties.message });
    }
});

router.get('/:userId/meals', async (req, res) => {
    const { userId } = req.params;

    try {
        const meals = await mealService.getUserMeals(userId);
        res.status(200).json(meals);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: Object.values(error.errors)[0].properties.message });
    }
});

router.get('/:userId/cart', async (req, res) => {
    const { userId } = req.params;

    try {
        const { cart } = await authService.getUserById(userId);

        const mealIds = cart.map(item => item.mealId);
        const cartMeals = await mealService.getCartMeals(mealIds);

        res.status(200).json({ cart, cartMeals });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: Object.values(error.errors)[0].properties.message });
    }
});

router.delete('/:userId/cart/empty', async (req, res) => {
    const { userId } = req.params;

    try {
        await authService.clearCart(userId);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: Object.values(error.errors)[0].properties.message });
    }
});

export default router;