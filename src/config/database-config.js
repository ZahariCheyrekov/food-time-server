import mongoose from 'mongoose';

import { app } from '../index.js';
import { DEFAULT_PORT } from '../constants/app-constants.js';

export const configDatabase = () => {
    mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => app.listen(DEFAULT_PORT, () =>
            console.log(`Server is listening on: http://localhost:${DEFAULT_PORT}`)
        ))
        .catch((error) => console.log(error));
}