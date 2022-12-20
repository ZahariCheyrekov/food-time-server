import mongoose from 'mongoose';

const citySchema = mongoose.Schema({
    city: {
        type: String,
        minLength: [2, 'City must be at least 2 characters long'],
        maxLength: [50, 'City must be maximum 50 characters long'],
        required: [true, 'City is required']
    },
    country: {
        type: String,
        minLength: [2, 'Country must be at least 2 characters long'],
        maxLength: [50, 'Country must be maximum 50 characters long'],
        required: [true, 'Country is required']
    },
    picture: {
        type: String,
        validate: [/^https?:\/\//, 'Picture url must start with "http://" or "https://"'],
        required: [true, 'Picture is required']
    },
    meals: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Meal'
        }
    ]
});

citySchema.pre('findByIdAndUpdate', function (next) {
    setRunValidators();
    next();
});

function setRunValidators() {
    this.setOptions({ runValidators: true });
}

const City = mongoose.model('City', citySchema);
export default City;