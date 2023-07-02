require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
import config from 'config';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import validateEnv from './utils/validateEnv';
import authRouter from './routes/auth';
import userRouter from './routes/user';
import AppError from './utils/appError';

validateEnv();

const app = express();
const prisma = new PrismaClient();

async function bootstrap() {
  // Template Enging
  app.set('view engine', 'pug');
  app.set('views', `${__dirname}/views`);

  // Middleware
  app.use(express.json({ limit: '10kb' }));
  app.use(cookieParser());
  app.use(cors({
    origin: [config.get<string>('origin')],
    credentials: true,
  }));
  if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

  // Routes
  app.use('/api/auth', authRouter);
  app.use('/api/users', userRouter);

  // Testing
  app.get('/api/healthchecker', async (_, res: Response) => {
    res.status(200).json({
      status: 'success',
      message: 'Welcome to Express with Prisma and Redis',
    });
  });

  // Unhandled routes
  app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(404, `Route ${req.originalUrl} not found`));
  });

  // Global error handler
  app.use((error: AppError, req: Request, res: Response, next: NextFunction) => {
    error.status = error.status || 'error';
    error.statusCode = error.statusCode || 500;

    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  });

  const port = config.get<number>('port');
  
  app.listen(port, () => {
    console.log(`Server on port: ${port}`);
  });
};

bootstrap()
  .catch((error) => {
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
