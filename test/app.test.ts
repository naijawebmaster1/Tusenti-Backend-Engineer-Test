import { str } from 'envalid';
import supertest from 'supertest';
import { expect } from 'chai';
import app from '../src/app'; // Import the server app

let request: supertest.SuperTest<supertest.Test>;
let validToken: string
const transactionId = 'c9f0c187-8fbf-4497-be5c-00952c84010e';
const userId = '58df14d1-8012-484c-a408-2b66c05b8891';

before(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  request = supertest(app);
});


describe('Server', () => {

  describe('POST /api/auth/login', () => {
    it('should log in a user and return an access token', async () => {
      const response = await request.post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'clement@mail.com',
          password: 'Pa$$w0rd!',
        });

      validToken = response.body.access_token

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('status', 'success');
      expect(response.body).to.have.property('message', 'User Logged in Successfully');
      expect(response.body).to.have.property('access_token');

      // You can add further assertions to validate the access token format or decode it if needed
    });

    it('should return an error if invalid credentials are provided', async () => {
      const response = await request.post('/api/auth/login').send({
        email: 'invalid@mail.com',
        password: 'wrongpassword'
      });

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('status', 'fail');
      expect(response.body).to.have.property('message', 'Invalid email or password');
    });

  });

  //1. POST /transactions - Create a new financial transaction

  describe('POST /api/transactions', () => {
    it('should create a new transaction', async () => {
      const payload = {
        amount: 5000,
        description: 'samile description',
        transaction_type: 'credit'
      };

      const response = await request
        .post('/api/transactions')
        .set('Authorization', `Bearer ${validToken}`)
        .send(payload);

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('status', 'success');
      expect(response.body).to.have.property('message', 'Transaction Created Successfully');
      expect(response.body.data).to.have.property('transaction').that.is.an('object');
      // Add further assertions to validate the created transaction if needed
    });
  });

  //2. GET /transactions/:id - Retrieve details of a specific transaction by ID

  describe('GET /api/transactions/:transactionId', () => {
    it('should fetch a transaction', async () => {
      const response = await request
        .get(`/api/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('status', 'success');
      expect(response.body).to.have.property('message', 'Fetched Transaction Successfully');
      expect(response.body.data).to.have.property('transaction').that.is.an('object');
      // Add further assertions to validate the transaction data if needed
      expect(response.body.data.transaction.id).to.equal(transactionId);
      expect(response.body.data.transaction.created_at).to.be.a('string');
      expect(response.body.data.transaction.updated_at).to.be.a('string');
      expect(response.body.data.transaction.description).to.be.a('string');
      expect(response.body.data.transaction.amount).to.be.a('number');
      expect(response.body.data.transaction.transaction_type).to.be.a('string');
    });

    it('should return an error for an unauthorized user', async () => {
      const response = await request
        .get(`/api/transactions/${transactionId}`)
        .set('Authorization', 'Bearer <insert invalid token here>');

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('status', 'fail');
      expect(response.body).to.have.property('message', 'Invalid token or user doesn\'t exist');
    });

    it('should return an error if no token is provided', async () => {
      const response = await request.get(`/api/transactions/${transactionId}`);

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('status', 'fail');
      expect(response.body).to.have.property('message', 'You are not logged in');
    });
  });

  //3. GET /transactions/user/:userId - Retrieve all transactions associated with a specific user

  describe('GET /api/transactions/reports/monthly', () => {
    it('should return a monthly report for an authorized user', async () => {
      const response = await request
        .get('/api/transactions/reports/monthly')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('status', 'success');
      expect(response.body).to.have.property('message', 'Fetched User\'s Monthly Report successfully');
      expect(response.body.data).to.have.property('transactions').that.is.an('array');
      // Add further assertions to validate the transaction data if needed
    });

    it('should return an error for an unauthorized user', async () => {
      const response = await request
        .get('/api/transactions/reports/monthly')
        .set('Authorization', 'Bearer invalidToken');

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('status', 'fail');
      expect(response.body).to.have.property('message', 'Invalid token or user doesn\'t exist');
    });

    it('should return an error if no token is provided', async () => {
      const response = await request.get('/api/transactions/reports/monthly');

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('status', 'fail');
      expect(response.body).to.have.property('message', 'You are not logged in');
    });
  });

  //4. GET /transactions/reports/monthly - Generate a monthly transaction report

  describe('GET /api/transactions/user/:userId', () => {
    it('should fetch all transaction for an authorized user', async () => {
      const response = await request
        .get(`/api/transactions/user/${userId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('status', 'success');
      expect(response.body).to.have.property('message', 'Fetched User\'s Transactions Successfully');
      expect(response.body.data).to.have.property('transactions').that.is.an('array');
    });

    it('should return an error for an unauthorized user', async () => {
      const response = await request
        .get(`/api/transactions/user/${userId}`)
        .set('Authorization', 'Bearer <insert invalid token here>');

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('status', 'fail');
      expect(response.body).to.have.property('message', 'Invalid token or user doesn\'t exist');
    });

    it('should return an error if no token is provided', async () => {
      const response = await request.get(`/api/transactions/user/${userId}`);

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('status', 'fail');
      expect(response.body).to.have.property('message', 'You are not logged in');
    });
  });


  describe('GET /api/users/', () => {
    it('should return a list of users for an authorized user', async () => {
      // Set the bearer token for an authorized user

      const response = await request.get('/api/users/')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('status', 'success');
      expect(response.body).to.have.property('message', 'Users Fetched Successfully');
      expect(response.body.data).to.have.property('users').that.is.an('array');
    });

    it('should return an error for an unauthorized user', async () => {
      const response = await request.get('/api/users/')
        .set('Authorization', 'Bearer <insert invalid token here>');
      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('status', 'fail');
      expect(response.body).to.have.property('message', 'Invalid token or user doesn\'t exist');
    });


    it('should return an error if no token is provided', async () => {
      const response = await request.get('/api/users/')

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('status', 'fail');
      expect(response.body).to.have.property('message', 'You are not logged in');
    });

  });


  describe('GET /api/transactions', () => {
    it('should return a list of transactions for an authorized user', async () => {
      const response = await request
        .get('/api/transactions')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('status', 'success');
      expect(response.body).to.have.property('message', 'Fetched Transactions Successfully');
      expect(response.body.data).to.have.property('transactions').that.is.an('array');
      // Add further assertions to validate the transaction data if needed
    });

    it('should return an error for an unauthorized user', async () => {
      const response = await request
        .get('/api/transactions')
        .set('Authorization', 'Bearer <insert invalid token here>');

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('status', 'fail');
      expect(response.body).to.have.property('message', 'Invalid token or user doesn\'t exist');
    });

    it('should return an error if no token is provided', async () => {
      const response = await request.get('/api/users/')

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('status', 'fail');
      expect(response.body).to.have.property('message', 'You are not logged in');
    });
  });


  describe('GET /health-check', () => {
    it('should return a welcome message', async () => {
      const response = await request.get('/health-check');

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('status', 'success');
      expect(response.body).to.have.property(
        'message',
        'Welcome to tusenti-backend-engineering-test, we are happy to see you'
      );
    });
  });


  describe('GET /non-existent-route', () => {
    it('should return a 404 error', async () => {
      const response = await request.get('/non-existent-route');

      expect(response.status).to.equal(404);
      expect(response.body).to.have.property('status', 'fail');
      expect(response.body).to.have.property(
        'message',
        'Route /non-existent-route not found'
      );
    });
  });


});
