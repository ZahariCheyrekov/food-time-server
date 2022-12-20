import Meal from '../models/Meal.js';

import * as authService from './auth-service.js';
import * as cityService from './city-service.js';
import * as reviewService from './review-service.js';


export const getMeal = (mealId) => {
    return Meal.findById(mealId);
}

export const getUserMeals = (userId) => {
    return Meal.find({ userId });
}

export const getUserLikedMeals = (userId) => {
    return Meal.find({ likes: userId });
}

export const getCartMeals = async (mealIds) => {
    const meals = [];

    for (const id of mealIds) {
        const meal = await getMeal(id);
        meals.push(meal);
    }

    return meals;
}

export const getCityMeals = (mealIds) => {
    return Meal.find({ _id: { $in: mealIds } });
}

export const createMeal = async (mealData, ownerId, cityId) => {
    const meal = await Meal.create(mealData);
    const mealId = meal._id;

    await authService.createUserMeal(ownerId, mealId);
    await cityService.createCityMeal(cityId, mealId);

    return meal;
}

export const editMeal = (mealId, mealData) => {
    return Meal.findByIdAndUpdate(mealId, mealData);
}

export const likeMeal = (mealId, userId) => {
    return Meal.findByIdAndUpdate(
        { _id: mealId },
        { $push: { likes: userId } }
    );
}

export const removeLike = (mealId, userId) => {
    return Meal.findByIdAndUpdate(
        { _id: mealId },
        { $pull: { likes: userId } }
    );
}

export const createMealReview = (mealId, reviewId) => {
    return Meal.findByIdAndUpdate(
        { _id: mealId },
        { $push: { reviews: reviewId } }
    );
}

export const deleteMeal = async (mealId, cityId) => {
    const { ownerId, reviews } = await Meal.findByIdAndDelete(mealId);

    await authService.removeUserMeal(ownerId, mealId);
    await cityService.removeCityMeal(cityId, mealId);
    await reviewService.removeReviews(reviews);
}