"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transaction_controller_1 = require("../controllers/transaction.controller");
const deserializeUser_1 = require("../middleware/deserializeUser");
const requireUser_1 = require("../middleware/requireUser");
const validate_1 = require("../middleware/validate");
const transaction_schema_1 = require("../schemas/transaction.schema");
const router = express_1.default.Router();
router.use(deserializeUser_1.deserializeUser, requireUser_1.requireUser);
router
    .route('/')
    .post((0, validate_1.validate)(transaction_schema_1.createTransactionSchema), transaction_controller_1.createTransactionHandler)
    .get(transaction_controller_1.getTransactionsHandler);
router
    .route('/user/:userId')
    .get(transaction_controller_1.getUserTransactionsHandler);
router
    .route('/reports/monthly')
    .get(transaction_controller_1.getUsersMonthlyTransactionsHandler);
router
    .route('/:transactionId')
    .get((0, validate_1.validate)(transaction_schema_1.getTransactionSchema), transaction_controller_1.getTransactionHandler)
    .patch((0, validate_1.validate)(transaction_schema_1.updateTransactionSchema), transaction_controller_1.updateTransactionHandler)
    .delete((0, validate_1.validate)(transaction_schema_1.deleteTransactionSchema), transaction_controller_1.deleteTransactionHandler);
exports.default = router;
