import express from 'express';
import { config } from 'dotenv';
import { errorMiddleware } from './middlewares/error.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';

config({
  path: './config/config.env',
});

export const app = express();



// Using Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  origin: "https://tunein-yourpodcast.onrender.com",
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.disable("x-powered-by");
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


import user from './routes/User.js';
import podcast from './routes/podcast.js';

app.use('/api/v1/user', user);
app.use('/api/v1/podcast', podcast);

app.get('/', (req, res, next) => {
  res.send('Working');
});

// Using Error Middleware
app.use(errorMiddleware);
