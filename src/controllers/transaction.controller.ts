import { NextFunction, Request, Response } from 'express';
import {
  CreateTransactionInput,
  DeleteTransactionInput,
  GetTransactionInput,
  UpdateTransactionInput,
} from '../schemas/transaction.schema';
import { createTransaction, findTransactions, getTransaction } from '../services/transaction.service';
import { findUserById } from '../services/user.service';
import AppError from '../utils/appError';
import { Between } from 'typeorm';
import { getMonthRange } from '../utils';


export const createTransactionHandler = async (
  req: Request<{}, {}, CreateTransactionInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findUserById(res.locals.user.id as string);
    const transaction = await createTransaction(req.body, user!);
    res.status(201).json({
      status: 'success',
      message: "Transaction Created Successfully",
      data: {
        transaction,
      },
    });

  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(500).json({
        status: 'fail',
        message: 'Failed to Create Transaction',
      });
    }
    next(err);
  }
};

export const getTransactionHandler = async (
  req: Request<GetTransactionInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const transaction = await getTransaction(req.params.transactionId);

    if (!transaction) {
      return next(new AppError(404, 'Transaction with that ID not found'));
    }

    res.status(200).json({
      status: 'success',
      message: "Fetched Transaction Successfully",
      data: {
        transaction,
      },

    });
  } catch (err: any) {
    next(err);
  }
};

export const getTransactionsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transactions = await findTransactions({}, {}, { user: true });
    res.status(200).json({
      status: 'success',
      message: "Fetched Transactions Successfully",
      results: transactions.length,
      data: {
        transactions,
      },
    });
  } catch (err: any) {
    next(err);
  }
};


export const getUserTransactionsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const user = await findUserById(req.params.userId);

    if (!user) {
      return next(new AppError(404, 'User with that ID does not exist'));
    }

    const transactions = await findTransactions({ user: { id: user.id } }, {}, {});

    res.status(200).json({
      status: 'success',
      message: "Fetched User's Transactions Successfully",
      results: transactions.length,
      data: {
        transactions,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getUsersMonthlyTransactionsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const user = res.locals.user;

    // Get the start and end date of this month
    const { startOfMonth, endOfMonth } = getMonthRange();

    // Call the findTransactions function with the appropriate parameters
    const transactions = await findTransactions({ created_at: Between(startOfMonth, endOfMonth), user: { id: user.id } }, {}, {});

    res.status(200).json({
      status: 'success',
      message: "Fetched User's Monthly Report successfully",
      results: transactions.length,
      data: {
        transactions,
      },
    });

  } catch (err: any) {
    next(err);
  }
};

export const updateTransactionHandler = async (
  req: Request<UpdateTransactionInput['params'], {}, UpdateTransactionInput['body']>,
  res: Response,
  next: NextFunction
) => {
  try {
    const transaction = await getTransaction(req.params.transactionId);
    if (!transaction) {
      return next(new AppError(404, 'Transaction with that ID not found'));
    }
    Object.assign(transaction, req.body);
    const updatedTransaction = await transaction.save();
    res.status(200).json({
      status: 'success',
      message: "User's Transaction Successfully Updated",
      data: {
        transaction: updatedTransaction,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const deleteTransactionHandler = async (
  req: Request<DeleteTransactionInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const transaction = await getTransaction(req.params.transactionId);

    if (!transaction) {
      return next(new AppError(404, 'Transaction with that ID not found'));
    }

    await transaction.remove();

    res.status(204).json({
      status: 'success',
      message: "User's Transaction Successfully Deleted",
      data: null,
    });
  } catch (err: any) {
    next(err);
  }
};
