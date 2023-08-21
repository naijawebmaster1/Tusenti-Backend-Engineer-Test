"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransactionSchema = exports.updateTransactionSchema = exports.getTransactionSchema = exports.createTransactionSchema = void 0;
const zod_1 = require("zod");
exports.createTransactionSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        amount: (0, zod_1.number)().nonnegative(),
        description: (0, zod_1.string)().nonempty(),
    }),
});
const params = {
    params: (0, zod_1.object)({
        transactionId: (0, zod_1.string)(),
    }),
};
exports.getTransactionSchema = (0, zod_1.object)(Object.assign({}, params));
exports.updateTransactionSchema = (0, zod_1.object)(Object.assign(Object.assign({}, params), { body: (0, zod_1.object)({
        title: (0, zod_1.string)(),
        content: (0, zod_1.string)(),
        image: (0, zod_1.string)(),
    }).partial() }));
exports.deleteTransactionSchema = (0, zod_1.object)(Object.assign({}, params));
