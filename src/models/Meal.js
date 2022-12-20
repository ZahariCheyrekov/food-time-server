import mongoose from 'mongoose';

const mealSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: [2, 'Name must be at least 2 characters long'],
        required: [true, 'Name is required']
    },
    ingredients: {
        type: String,
        required: [true, 'Ingredients are required']
    },
    price: {
        type: Number,
        validate: (price) => {
            if (price <= 0) {
                throw new Error('Price must be a positive number');
            }
        },
        required: [true, 'Price is required']
    },
    description: {
        type: String,
        minLength: [10, 'Description must be at least 10 characters long'],
        required: [true, 'Description is required']
    },
    preparationTime: {
        type: String,
        minLength: [2, 'Preparation time must be at least 2 characters long'],
        required: [true, 'Preparation time is required']
    },
    picture: {
        type: String,
        required: [true, 'Meal picture is required']
    },
    cityId: {
        type: mongoose.Types.ObjectId,
        ref: 'City'
    },
    ownerId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    likes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    reviews: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ]
});

mealSchema.pre('findByIdAndUpdate', function (next) {
    setRunValidators();
    next();
});

function setRunValidators() {
    this.setOptions({ runValidators: true });
}

const Meal = mongoose.model('Meal', mealSchema);
export default Meal;