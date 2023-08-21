"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthRange = void 0;
const getMonthRange = () => {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    return { startOfMonth, endOfMonth };
};
exports.getMonthRange = getMonthRange;
