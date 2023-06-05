import { number, object, string, TypeOf } from 'zod';
import { TransactionEnumType } from '../entities/transaction.entity';

export const createTransactionSchema = object({
  body: object({
    amount: number().nonnegative(),
    description: string().nonempty(),
  }),
});

const params = {
  params: object({
    transactionId: string(),
  }),
};

export const getTransactionSchema = object({
  ...params,
});

export const updateTransactionSchema = object({
  ...params,
  body: object({
    title: string(),
    content: string(),
    image: string(),
  }).partial(),
});

export const deleteTransactionSchema = object({
  ...params,
});

export type CreateTransactionInput = TypeOf<typeof createTransactionSchema>['body'];
export type GetTransactionInput = TypeOf<typeof getTransactionSchema>['params'];
export type UpdateTransactionInput = TypeOf<typeof updateTransactionSchema>;
export type DeleteTransactionInput = TypeOf<typeof deleteTransactionSchema>['params'];
