import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    mealId: {
        type: mongoose.Types.ObjectId,
        ref: 'Meal'
    },
    reviewOwner: {
        name: String,
        picture: String,
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;