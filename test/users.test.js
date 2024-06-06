// test/users.test.js

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const request = require('supertest');
const { expect } = require('chai');
const app = require('../app'); // Adjust the path if necessary

describe('User Registration and Login', () => {
  before(async () => {
    // Optionally, setup database or environment
  });

  after(async () => {
    // Optionally, cleanup database or environment
  });

  describe('POST /api/users/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          phoneno: '1234567890'
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message', 'User registered successfully');
    });

    it('should not register a user with an existing email', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          phoneno: '1234567890'
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'User already exists');
    });
  });

  describe('POST /api/users/login', () => {
    it('should login an existing user', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('token');
      expect(res.body).to.have.property('username', 'testuser');
    });

    it('should not login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message', 'Invalid credentials');
    });

    it('should not login non-existent user', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message', 'Invalid credentials');
    });
  });
});
