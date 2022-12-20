import express from 'express';
import dotenv from 'dotenv';

import routes from './routes/routes.js';

import { configExpress } from './config/express-config.js';
import { configDatabase } from './config/database-config.js';
import { useDefaultRoute } from './routes/default-routes.js';

export const app = express();
dotenv.config();

configExpress();
configDatabase();

app.use(routes);
useDefaultRoute();