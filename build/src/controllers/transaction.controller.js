"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransactionHandler = exports.updateTransactionHandler = exports.getUsersMonthlyTransactionsHandler = exports.getUserTransactionsHandler = exports.getTransactionsHandler = exports.getTransactionHandler = exports.createTransactionHandler = void 0;
const transaction_service_1 = require("../services/transaction.service");
const user_service_1 = require("../services/user.service");
const appError_1 = __importDefault(require("../utils/appError"));
const typeorm_1 = require("typeorm");
const utils_1 = require("../utils");
const createTransactionHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, user_service_1.findUserById)(res.locals.user.id);
        const transaction = yield (0, transaction_service_1.createTransaction)(req.body, user);
        res.status(201).json({
            status: 'success',
            message: "Transaction Created Successfully",
            data: {
                transaction,
            },
        });
    }
    catch (err) {
        if (err.code === '23505') {
            return res.status(500).json({
                status: 'fail',
                message: 'Failed to Create Transaction',
            });
        }
        next(err);
    }
});
exports.createTransactionHandler = createTransactionHandler;
const getTransactionHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield (0, transaction_service_1.getTransaction)(req.params.transactionId);
        if (!transaction) {
            return next(new appError_1.default(404, 'Transaction with that ID not found'));
        }
        res.status(200).json({
            status: 'success',
            message: "Fetched Transaction Successfully",
            data: {
                transaction,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getTransactionHandler = getTransactionHandler;
const getTransactionsHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield (0, transaction_service_1.findTransactions)({}, {}, { user: true });
        res.status(200).json({
            status: 'success',
            message: "Fetched Transactions Successfully",
            results: transactions.length,
            data: {
                transactions,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getTransactionsHandler = getTransactionsHandler;
const getUserTransactionsHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, user_service_1.findUserById)(req.params.userId);
        if (!user) {
            return next(new appError_1.default(404, 'User with that ID does not exist'));
        }
        const transactions = yield (0, transaction_service_1.findTransactions)({ user: { id: user.id } }, {}, {});
        res.status(200).json({
            status: 'success',
            message: "Fetched User's Transactions Successfully",
            results: transactions.length,
            data: {
                transactions,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getUserTransactionsHandler = getUserTransactionsHandler;
const getUsersMonthlyTransactionsHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = res.locals.user;
        // Get the start and end date of this month
        const { startOfMonth, endOfMonth } = (0, utils_1.getMonthRange)();
        // Call the findTransactions function with the appropriate parameters
        const transactions = yield (0, transaction_service_1.findTransactions)({ created_at: (0, typeorm_1.Between)(startOfMonth, endOfMonth), user: { id: user.id } }, {}, {});
        res.status(200).json({
            status: 'success',
            message: "Fetched User's Monthly Report successfully",
            results: transactions.length,
            data: {
                transactions,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getUsersMonthlyTransactionsHandler = getUsersMonthlyTransactionsHandler;
const updateTransactionHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield (0, transaction_service_1.getTransaction)(req.params.transactionId);
        if (!transaction) {
            return next(new appError_1.default(404, 'Transaction with that ID not found'));
        }
        Object.assign(transaction, req.body);
        const updatedTransaction = yield transaction.save();
        res.status(200).json({
            status: 'success',
            message: "User's Transaction Successfully Updated",
            data: {
                transaction: updatedTransaction,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateTransactionHandler = updateTransactionHandler;
const deleteTransactionHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield (0, transaction_service_1.getTransaction)(req.params.transactionId);
        if (!transaction) {
            return next(new appError_1.default(404, 'Transaction with that ID not found'));
        }
        yield transaction.remove();
        res.status(204).json({
            status: 'success',
            message: "User's Transaction Successfully Deleted",
            data: null,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteTransactionHandler = deleteTransactionHandler;
