import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';

export const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    if (!user) {
      return next(
        new AppError(401, 'Expired session or non-existent user')
      );
    }
  } catch (error: any) {
    next(error);
  }
};
