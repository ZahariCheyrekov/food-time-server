import cors from 'cors';
import express from 'express';

import { app } from '../index.js';

export const configExpress = () => {
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
}