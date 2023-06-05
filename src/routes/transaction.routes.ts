import express from 'express';
import {
  createTransactionHandler,
  deleteTransactionHandler,
  getTransactionHandler,
  getTransactionsHandler,
  getUserTransactionsHandler,
  getUsersMonthlyTransactionsHandler,
  updateTransactionHandler,
} from '../controllers/transaction.controller';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';
import { validate } from '../middleware/validate';
import {
  createTransactionSchema,
  deleteTransactionSchema,
  getTransactionSchema,
  updateTransactionSchema,
} from '../schemas/transaction.schema';

const router = express.Router();

router.use(deserializeUser, requireUser);
router
  .route('/')
  .post(
    validate(createTransactionSchema),
    createTransactionHandler
  )
  .get(getTransactionsHandler);

router
  .route('/user/:userId')
  .get(getUserTransactionsHandler);

router
  .route('/reports/monthly')
  .get(getUsersMonthlyTransactionsHandler);

router
  .route('/:transactionId')
  .get(validate(getTransactionSchema), getTransactionHandler)
  .patch(validate(updateTransactionSchema), updateTransactionHandler)
  .delete(validate(deleteTransactionSchema), deleteTransactionHandler);

export default router;
