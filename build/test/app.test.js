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
const supertest_1 = __importDefault(require("supertest"));
const chai_1 = require("chai");
const app_1 = __importDefault(require("../src/app")); // Import the server app
let request;
let validToken;
const transactionId = 'c9f0c187-8fbf-4497-be5c-00952c84010e';
const userId = '58df14d1-8012-484c-a408-2b66c05b8891';
before(() => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise((resolve) => setTimeout(resolve, 1000));
    request = (0, supertest_1.default)(app_1.default);
}));
describe('Server', () => {
    describe('POST /api/auth/login', () => {
        it('should log in a user and return an access token', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request.post('/api/auth/login')
                .set('Content-Type', 'application/json')
                .send({
                email: 'clement@mail.com',
                password: 'Pa$$w0rd!',
            });
            validToken = response.body.access_token;
            (0, chai_1.expect)(response.status).to.equal(200);
            (0, chai_1.expect)(response.body).to.have.property('status', 'success');
            (0, chai_1.expect)(response.body).to.have.property('message', 'User Logged in Successfully');
            (0, chai_1.expect)(response.body).to.have.property('access_token');
            // You can add further assertions to validate the access token format or decode it if needed
        }));
        it('should return an error if invalid credentials are provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request.post('/api/auth/login').send({
                email: 'invalid@mail.com',
                password: 'wrongpassword'
            });
            (0, chai_1.expect)(response.status).to.equal(401);
            (0, chai_1.expect)(response.body).to.have.property('status', 'fail');
            (0, chai_1.expect)(response.body).to.have.property('message', 'Invalid email or password');
        }));
    });
    //1. POST /transactions - Create a new financial transaction
    describe('POST /api/transactions', () => {
        it('should create a new transaction', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                amount: 5000,
                description: 'samile description',
                transaction_type: 'credit'
            };
            const response = yield request
                .post('/api/transactions')
                .set('Authorization', `Bearer ${validToken}`)
                .send(payload);
            (0, chai_1.expect)(response.status).to.equal(201);
            (0, chai_1.expect)(response.body).to.have.property('status', 'success');
            (0, chai_1.expect)(response.body).to.have.property('message', 'Transaction Created Successfully');
            (0, chai_1.expect)(response.body.data).to.have.property('transaction').that.is.an('object');
            // Add further assertions to validate the created transaction if needed
        }));
    });
    //2. GET /transactions/:id - Retrieve details of a specific transaction by ID
    describe('GET /api/transactions/:transactionId', () => {
        it('should fetch a transaction', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request
                .get(`/api/transactions/${transactionId}`)
                .set('Authorization', `Bearer ${validToken}`);
            (0, chai_1.expect)(response.status).to.equal(200);
            (0, chai_1.expect)(response.body).to.have.property('status', 'success');
            (0, chai_1.expect)(response.body).to.have.property('message', 'Fetched Transaction Successfully');
            (0, chai_1.expect)(response.body.data).to.have.property('transaction').that.is.an('object');
            // Add further assertions to validate the transaction data if needed
            (0, chai_1.expect)(response.body.data.transaction.id).to.equal(transactionId);
            (0, chai_1.expect)(response.body.data.transaction.created_at).to.be.a('string');
            (0, chai_1.expect)(response.body.data.transaction.updated_at).to.be.a('string');
            (0, chai_1.expect)(response.body.data.transaction.description).to.be.a('string');
            (0, chai_1.expect)(response.body.data.transaction.amount).to.be.a('number');
            (0, chai_1.expect)(response.body.data.transaction.transaction_type).to.be.a('string');
        }));
        it('should return an error for an unauthorized user', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request
                .get(`/api/transactions/${transactionId}`)
                .set('Authorization', 'Bearer <insert invalid token here>');
            (0, chai_1.expect)(response.status).to.equal(401);
            (0, chai_1.expect)(response.body).to.have.property('status', 'fail');
            (0, chai_1.expect)(response.body).to.have.property('message', 'Invalid token or user doesn\'t exist');
        }));
        it('should return an error if no token is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request.get(`/api/transactions/${transactionId}`);
            (0, chai_1.expect)(response.status).to.equal(401);
            (0, chai_1.expect)(response.body).to.have.property('status', 'fail');
            (0, chai_1.expect)(response.body).to.have.property('message', 'You are not logged in');
        }));
    });
    //3. GET /transactions/user/:userId - Retrieve all transactions associated with a specific user
    describe('GET /api/transactions/reports/monthly', () => {
        it('should return a monthly report for an authorized user', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request
                .get('/api/transactions/reports/monthly')
                .set('Authorization', `Bearer ${validToken}`);
            (0, chai_1.expect)(response.status).to.equal(200);
            (0, chai_1.expect)(response.body).to.have.property('status', 'success');
            (0, chai_1.expect)(response.body).to.have.property('message', 'Fetched User\'s Monthly Report successfully');
            (0, chai_1.expect)(response.body.data).to.have.property('transactions').that.is.an('array');
            // Add further assertions to validate the transaction data if needed
        }));
        it('should return an error for an unauthorized user', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request
                .get('/api/transactions/reports/monthly')
                .set('Authorization', 'Bearer invalidToken');
            (0, chai_1.expect)(response.status).to.equal(401);
            (0, chai_1.expect)(response.body).to.have.property('status', 'fail');
            (0, chai_1.expect)(response.body).to.have.property('message', 'Invalid token or user doesn\'t exist');
        }));
        it('should return an error if no token is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request.get('/api/transactions/reports/monthly');
            (0, chai_1.expect)(response.status).to.equal(401);
            (0, chai_1.expect)(response.body).to.have.property('status', 'fail');
            (0, chai_1.expect)(response.body).to.have.property('message', 'You are not logged in');
        }));
    });
    //4. GET /transactions/reports/monthly - Generate a monthly transaction report
    describe('GET /api/transactions/user/:userId', () => {
        it('should fetch all transaction for an authorized user', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request
                .get(`/api/transactions/user/${userId}`)
                .set('Authorization', `Bearer ${validToken}`);
            (0, chai_1.expect)(response.status).to.equal(200);
            (0, chai_1.expect)(response.body).to.have.property('status', 'success');
            (0, chai_1.expect)(response.body).to.have.property('message', 'Fetched User\'s Transactions Successfully');
            (0, chai_1.expect)(response.body.data).to.have.property('transactions').that.is.an('array');
        }));
        it('should return an error for an unauthorized user', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request
                .get(`/api/transactions/user/${userId}`)
                .set('Authorization', 'Bearer <insert invalid token here>');
            (0, chai_1.expect)(response.status).to.equal(401);
            (0, chai_1.expect)(response.body).to.have.property('status', 'fail');
            (0, chai_1.expect)(response.body).to.have.property('message', 'Invalid token or user doesn\'t exist');
        }));
        it('should return an error if no token is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request.get(`/api/transactions/user/${userId}`);
            (0, chai_1.expect)(response.status).to.equal(401);
            (0, chai_1.expect)(response.body).to.have.property('status', 'fail');
            (0, chai_1.expect)(response.body).to.have.property('message', 'You are not logged in');
        }));
    });
    describe('GET /api/users/', () => {
        it('should return a list of users for an authorized user', () => __awaiter(void 0, void 0, void 0, function* () {
            // Set the bearer token for an authorized user
            const response = yield request.get('/api/users/')
                .set('Authorization', `Bearer ${validToken}`);
            (0, chai_1.expect)(response.status).to.equal(200);
            (0, chai_1.expect)(response.body).to.have.property('status', 'success');
            (0, chai_1.expect)(response.body).to.have.property('message', 'Users Fetched Successfully');
            (0, chai_1.expect)(response.body.data).to.have.property('users').that.is.an('array');
        }));
        it('should return an error for an unauthorized user', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request.get('/api/users/')
                .set('Authorization', 'Bearer <insert invalid token here>');
            (0, chai_1.expect)(response.status).to.equal(401);
            (0, chai_1.expect)(response.body).to.have.property('status', 'fail');
            (0, chai_1.expect)(response.body).to.have.property('message', 'Invalid token or user doesn\'t exist');
        }));
        it('should return an error if no token is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request.get('/api/users/');
            (0, chai_1.expect)(response.status).to.equal(401);
            (0, chai_1.expect)(response.body).to.have.property('status', 'fail');
            (0, chai_1.expect)(response.body).to.have.property('message', 'You are not logged in');
        }));
    });
    describe('GET /api/transactions', () => {
        it('should return a list of transactions for an authorized user', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request
                .get('/api/transactions')
                .set('Authorization', `Bearer ${validToken}`);
            (0, chai_1.expect)(response.status).to.equal(200);
            (0, chai_1.expect)(response.body).to.have.property('status', 'success');
            (0, chai_1.expect)(response.body).to.have.property('message', 'Fetched Transactions Successfully');
            (0, chai_1.expect)(response.body.data).to.have.property('transactions').that.is.an('array');
            // Add further assertions to validate the transaction data if needed
        }));
        it('should return an error for an unauthorized user', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request
                .get('/api/transactions')
                .set('Authorization', 'Bearer <insert invalid token here>');
            (0, chai_1.expect)(response.status).to.equal(401);
            (0, chai_1.expect)(response.body).to.have.property('status', 'fail');
            (0, chai_1.expect)(response.body).to.have.property('message', 'Invalid token or user doesn\'t exist');
        }));
        it('should return an error if no token is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request.get('/api/users/');
            (0, chai_1.expect)(response.status).to.equal(401);
            (0, chai_1.expect)(response.body).to.have.property('status', 'fail');
            (0, chai_1.expect)(response.body).to.have.property('message', 'You are not logged in');
        }));
    });
    describe('GET /health-check', () => {
        it('should return a welcome message', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request.get('/health-check');
            (0, chai_1.expect)(response.status).to.equal(200);
            (0, chai_1.expect)(response.body).to.have.property('status', 'success');
            (0, chai_1.expect)(response.body).to.have.property('message', 'Welcome to tusenti-backend-engineering-test, we are happy to see you');
        }));
    });
    describe('GET /non-existent-route', () => {
        it('should return a 404 error', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request.get('/non-existent-route');
            (0, chai_1.expect)(response.status).to.equal(404);
            (0, chai_1.expect)(response.body).to.have.property('status', 'fail');
            (0, chai_1.expect)(response.body).to.have.property('message', 'Route /non-existent-route not found');
        }));
    });
});
