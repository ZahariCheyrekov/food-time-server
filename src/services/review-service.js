import Review from '../models/Review.js';

import * as authService from './auth-service.js';
import * as mealService from './meal-service.js';


export const getMealReviews = (mealId) => {
    return Review.find({ mealId });
}

export const createReview = async (mealId, userId, name, picture, description) => {
    const review = await Review.create({
        description, mealId,
        reviewOwner: {
            name,
            picture,
            postedBy: userId
        }
    });
    const reviewId = review._id;

    await authService.createUserReview(userId, reviewId);
    await mealService.createMealReview(mealId, reviewId);

    return review;
}

export const removeReviews = (reviewIds) => {
    return Review.deleteMany({ _id: { $in: reviewIds } });
}