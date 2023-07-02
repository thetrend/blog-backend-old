require('dotenv').config();
import express, { Response } from 'express';
import config from 'config';
import { PrismaClient } from '@prisma/client';
import validateEnv from './utils/validateEnv';
import redisClient from './utils/connectRedis';

validateEnv();

const app = express();
const prisma = new PrismaClient();

async function bootstrap() {
  // Testing
  app.get('/api/healthchecker', async (_, res: Response) => {
    const message = await redisClient.get('try');
    res.status(200).json({
      status: 'success',
      message,
    });
  });

  const port = config.get<number>('port');

  console.log(port);
  
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
