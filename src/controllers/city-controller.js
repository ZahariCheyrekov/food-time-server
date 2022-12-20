import express from 'express';

import * as cityService from '../services/city-service.js';
import * as mealService from '../services/meal-service.js';

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const cities = await cityService.getCities();
        res.status(200).json(cities);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: Object.values(error.errors)[0].properties.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const city = await cityService.getCity(id);
        const meals = await mealService.getCityMeals(city.meals);

        res.status(200).json({ city, meals });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: Object.values(error.errors)[0].properties.message });
    }
});

router.post('/', async (req, res) => {
    const { city, country, picture } = req.body;

    try {
        await cityService.createCity({ city, country, picture });
        res.status(201).json({ city, country, picture });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: Object.values(error.errors)[0].properties.message });
    }
});


export default router;