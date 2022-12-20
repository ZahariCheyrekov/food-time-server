import City from '../models/City.js';


export const getCity = (id) => {
    return City.findById(id);
}

export const getCities = () => {
    return City.find();
}

export const createCity = (data) => {
    return City.create(data);
}

export const createCityMeal = (cityId, mealId) => {
    return City.findByIdAndUpdate(
        { _id: cityId },
        { $push: { meals: mealId } },
    );
}

export const removeCityMeal = (cityId, mealId) => {
    return City.findByIdAndUpdate(
        { _id: cityId },
        { $pull: { meals: mealId } },
    );
}