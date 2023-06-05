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
exports.logoutHandler = exports.refreshAccessTokenHandler = exports.loginUserHandler = exports.registerUserHandler = void 0;
const config_1 = __importDefault(require("config"));
const user_service_1 = require("../services/user.service");
const appError_1 = __importDefault(require("../utils/appError"));
const connectRedis_1 = __importDefault(require("../utils/connectRedis"));
const jwt_1 = require("../utils/jwt");
const user_entity_1 = require("../entities/user.entity");
const cookiesOptions = {
    httpOnly: true,
    sameSite: 'lax',
};
if (process.env.NODE_ENV === 'production')
    cookiesOptions.secure = true;
const accessTokenCookieOptions = Object.assign(Object.assign({}, cookiesOptions), { expires: new Date(Date.now() + config_1.default.get('accessTokenExpiresIn') * 60 * 1000), maxAge: config_1.default.get('accessTokenExpiresIn') * 60 * 1000 });
const refreshTokenCookieOptions = Object.assign(Object.assign({}, cookiesOptions), { expires: new Date(Date.now() + config_1.default.get('refreshTokenExpiresIn') * 60 * 1000), maxAge: config_1.default.get('refreshTokenExpiresIn') * 60 * 1000 });
const registerUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, password, email } = req.body;
        const admin = yield (0, user_service_1.findUserByEmail)({ email });
        if (admin) {
            return next(new appError_1.default(409, 'Oops, Email already exist'));
        }
        const newUser = yield (0, user_service_1.createUser)({
            name,
            email: email.toLowerCase(),
            password,
        });
        const { hashedVerificationCode, verificationCode } = user_entity_1.User.createVerificationCode();
        newUser.verificationCode = hashedVerificationCode;
        yield newUser.save();
        res.status(201).json({
            status: 'success',
            message: 'Your account has been created successfully. Proceed to login',
        });
    }
    catch (err) {
        if (err.code === '23505') {
            return res.status(500).json({
                status: 'fail',
                message: 'Error Creating User Account',
            });
        }
        next(err);
    }
});
exports.registerUserHandler = registerUserHandler;
const loginUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield (0, user_service_1.findUserByEmail)({ email });
        // 1. Check if user exist
        if (!user) {
            return next(new appError_1.default(401, 'Invalid email or password'));
        }
        //3. Check if password is valid
        if (!(yield user_entity_1.User.comparePasswords(password, user.password))) {
            return next(new appError_1.default(401, 'Invalid email or password'));
        }
        // 4. Sign Access and Refresh Tokens
        const { access_token, refresh_token } = yield (0, user_service_1.signTokens)(user);
        // 5. Add Cookies
        res.cookie('access_token', access_token, accessTokenCookieOptions);
        res.cookie('refresh_token', refresh_token, refreshTokenCookieOptions);
        res.cookie('logged_in', true, Object.assign(Object.assign({}, accessTokenCookieOptions), { httpOnly: false }));
        // 6. Send response
        res.status(200).json({
            status: 'success',
            message: 'User Logged in Successfully',
            access_token,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.loginUserHandler = loginUserHandler;
const refreshAccessTokenHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refresh_token = req.cookies.refresh_token;
        const message = 'Could not refresh access token';
        if (!refresh_token) {
            return next(new appError_1.default(403, message));
        }
        // Validate refresh token
        const decoded = (0, jwt_1.verifyJwt)(refresh_token, 'refreshTokenPublicKey');
        if (!decoded) {
            return next(new appError_1.default(403, message));
        }
        // Check if user has a valid session
        const session = yield connectRedis_1.default.get(decoded.sub);
        if (!session) {
            return next(new appError_1.default(403, message));
        }
        // Check if user still exist
        const user = yield (0, user_service_1.findUserById)(JSON.parse(session).id);
        if (!user) {
            return next(new appError_1.default(403, message));
        }
        // Sign new access token
        const access_token = (0, jwt_1.signJwt)({ sub: user.id }, 'accessTokenPrivateKey', {
            expiresIn: `${config_1.default.get('accessTokenExpiresIn')}m`,
        });
        // 4. Add Cookies
        res.cookie('access_token', access_token, accessTokenCookieOptions);
        res.cookie('logged_in', true, Object.assign(Object.assign({}, accessTokenCookieOptions), { httpOnly: false }));
        // 5. Send response
        res.status(200).json({
            status: 'success',
            access_token,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.refreshAccessTokenHandler = refreshAccessTokenHandler;
const logout = (res) => {
    res.cookie('access_token', '', { maxAge: 1 });
    res.cookie('refresh_token', '', { maxAge: 1 });
    res.cookie('logged_in', '', { maxAge: 1 });
};
const logoutHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = res.locals.user;
        yield connectRedis_1.default.del(user.id);
        logout(res);
        res.status(200).json({
            status: 'success',
            message: 'User Logged Out Successfully',
        });
    }
    catch (err) {
        next(err);
    }
});
exports.logoutHandler = logoutHandler;
