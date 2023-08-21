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
const config_1 = __importDefault(require("config"));
const redis_1 = require("redis");
const redisMURL = config_1.default.get('redisURL');
const redisUrl = redisMURL;
const redisClient = (0, redis_1.createClient)({
    url: redisUrl,
});
const connectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redisClient.connect();
        console.log('Redis client connect successfully');
        redisClient.set('try', 'Hello Welcome to tusenti-backend-engineering-test, we are happy to see you');
    }
    catch (error) {
        console.log(error);
        console.log("Error connceting to reddis");
        console.log(`Error connceting to reddis ${redisUrl}`);
        setTimeout(connectRedis, 5000);
    }
});
connectRedis();
exports.default = redisClient;
