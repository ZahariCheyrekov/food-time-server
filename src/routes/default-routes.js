import { app } from '../index.js';

export const useDefaultRoute = () => app.get('/', (req, res) => {
    res.send('Application is running correctly.');
});