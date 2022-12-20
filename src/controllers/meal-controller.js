import express from 'express';

import * as mealService from '../services/meal-service.js';
import * as authService from '../services/auth-service.js';


const router = express.Router();

router.get('/:id/meals/:mealId', async (req, res) => {
    const { mealId } = req.params;

    try {
        const meal = await mealService.getMeal(mealId);
        res.status(200).json(meal);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: Object.values(error.errors)[0].properties.message });
    }
});

router.post('/:id/meals/create', async (req, res) => {
    const {
        name,
        ingredients,
        price,
        description,
        preparationTime,
        picture,
        ownerId,
        cityId
    } = req.body;

    try {
        const meal = await mealService.createMeal({
            name, ingredients, price, description, preparationTime, picture, ownerId, cityId
        }, ownerId, cityId);
        res.status(201).json(meal);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: Object.values(error.errors)[0].properties.message });
    }
});

router.post('/:id/meals/:mealId/edit', async (req, res) => {
    const { mealId } = req.params;
    const {
        name,
        ingredients,
        price,
        description,
        preparationTime,
        picture
    } = req.body;

    try {
        const editedMeal = await mealService.editMeal(mealId, {
            name,
            ingredients,
            price,
            description,
            preparationTime,
            picture
        });
        res.status(200).json(editedMeal);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: Object.values(error.errors)[0].properties.message });
    }
});

router.post('/:id/meals/:mealId/like', async (req, res) => {
    const { mealId } = req.params;
    const { userId } = req.body;

    try {
        const meal = await mealService.getMeal(mealId);

        const isLiked = meal.likes.some(like => String(like) == userId);

        if (isLiked) {
            await mealService.removeLike(mealId, userId);
            res.status(200).json({ disliked: userId });

        } else {
            await mealService.likeMeal(mealId, userId);
            res.status(200).json({ liked: userId });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: Object.values(error.errors)[0].properties.message });
    }
});

router.post('/:id/meals/:mealId/buy', async (req, res) => {
    const { mealId } = req.params;
    const { userId } = req.body;

    try {
        await authService.buyMeal(userId, mealId);
        res.status(200).json({ purchased: mealId, by: userId });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: Object.values(error.errors)[0].properties.message });
    }
});

router.delete('/:id/meals/:mealId/remove/:userId', async (req, res) => {
    const { mealId, userId } = req.params;

    try {
        await authService.removeMeal(userId, mealId);
        res.status(200).json({ removed: mealId, by: userId });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: Object.values(error.errors)[0].properties.message });
    }
});

router.delete('/:id/meals/:mealId/delete', async (req, res) => {
    const { id: cityId, mealId } = req.params;

    try {
        await mealService.deleteMeal(mealId, cityId);
        res.status(200).json({ mealId: 'deleted' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: Object.values(error.errors)[0].properties.message });
    }
});

export default router;