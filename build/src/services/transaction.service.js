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
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTransactions = exports.getTransaction = exports.createTransaction = void 0;
const transaction_entity_1 = require("../entities/transaction.entity");
const data_source_1 = require("../utils/data-source");
const postRepository = data_source_1.AppDataSource.getRepository(transaction_entity_1.Transaction);
const createTransaction = (input, user) => __awaiter(void 0, void 0, void 0, function* () {
    return yield postRepository.save(postRepository.create(Object.assign(Object.assign({}, input), { user })));
});
exports.createTransaction = createTransaction;
const getTransaction = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield postRepository.findOneBy({ id: postId });
});
exports.getTransaction = getTransaction;
const findTransactions = (where = {}, select = {}, relations = {}) => __awaiter(void 0, void 0, void 0, function* () {
    return yield postRepository.find({
        where,
        select,
        relations,
    });
});
exports.findTransactions = findTransactions;
