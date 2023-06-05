import { NextFunction, Request, Response } from 'express';
import { findUsers } from '../services/user.service';

export const getMeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    res.status(200).status(200).json({
      status: 'success',
      message: "User Details Fetched Successfully",
      data: {
        user,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getUsersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await findUsers({}, {}, { transaction: true });

    res.status(200).json({
      status: 'success',
      message: "Users Fetched Successfully",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err: any) {
    next(err);
  }
};
