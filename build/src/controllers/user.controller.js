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
exports.getUsersHandler = exports.getMeHandler = void 0;
const user_service_1 = require("../services/user.service");
const getMeHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = res.locals.user;
        res.status(200).status(200).json({
            status: 'success',
            message: "User Details Fetched Successfully",
            data: {
                user,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getMeHandler = getMeHandler;
const getUsersHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, user_service_1.findUsers)({}, {}, { transaction: true });
        res.status(200).json({
            status: 'success',
            message: "Users Fetched Successfully",
            results: users.length,
            data: {
                users,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getUsersHandler = getUsersHandler;
