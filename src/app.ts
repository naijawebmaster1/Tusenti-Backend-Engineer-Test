import dotenv from 'dotenv';
dotenv.config();

import express, { NextFunction, Request, Response } from 'express';
import config from 'config';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import AppError from './utils/appError';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import transactionRouter from './routes/transaction.routes';
import { AppDataSource } from './utils/data-source';
import validateEnv from './utils/validateEnv';
import redisClient from './utils/connectRedis';

(async () =>
  await AppDataSource.initialize()
)()

validateEnv();

const app = express();

// TEMPLATE ENGINE
app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);

// MIDDLEWARE

// 1. Body parser
app.use(express.json({ limit: '10kb' }));

// 2. Logger
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// 3. Cookie Parser
app.use(cookieParser());

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// ROUTES
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/transactions', transactionRouter);

// HEALTH CHECKER
app.get('/health-check', async (req: Request, res: Response) => {
  const message = await redisClient.get('try');

  res.status(200).json({
    status: 'success',
    message,
  });
});

// UNHANDLED ROUTE
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(404, `Route ${req.originalUrl} not found`));
});

// GLOBAL ERROR HANDLER
app.use(
  (error: AppError, req: Request, res: Response, next: NextFunction) => {
    error.status = error.status || 'error';
    error.statusCode = error.statusCode || 500;

    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }
);

const port = config.get<number>('port');

app.listen(port);
console.log(`Server started with pid: ${process.pid} on port: ${port}`);


export default app;
