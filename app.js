import express from 'express';
import { config } from 'dotenv';
import { errorMiddleware } from './middlewares/error.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

config({
  path: './config/config.env',
});

export const app = express();

// Using Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

import user from './routes/User.js';

app.use('/api/v1/user', user);

app.get('/', (req, res, next) => {
  res.send('Working');
});

// Using Error Middleware
app.use(errorMiddleware);
