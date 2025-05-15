import request from 'supertest';
import app from '../index.js';

describe('Calculator API Tests', () => {
  describe('Add', () => {
    it('should add two numbers correctly', async () => {
      const response = await request(app)
        .post('/api/add')
        .send({ a: 5, b: 3 });
      expect(response.statusCode).toBe(200);
      expect(response.body.result).toBe(8);
    });

    it('should handle negative numbers', async () => {
      const response = await request(app)
        .post('/api/add')
        .send({ a: -5, b: 3 });
      expect(response.statusCode).toBe(200);
      expect(response.body.result).toBe(-2);
    });
  });

  describe('Subtract', () => {
    it('should subtract two numbers correctly', async () => {
      const response = await request(app)
        .post('/api/subtract')
        .send({ a: 5, b: 3 });
      expect(response.statusCode).toBe(200);
      expect(response.body.result).toBe(2);
    });

    it('should handle negative numbers', async () => {
      const response = await request(app)
        .post('/api/subtract')
        .send({ a: 5, b: -3 });
      expect(response.statusCode).toBe(200);
      expect(response.body.result).toBe(8);
    });
  });

  describe('Multiply', () => {
    it('should multiply two numbers correctly', async () => {
      const response = await request(app)
        .post('/api/multiply')
        .send({ a: 5, b: 3 });
      expect(response.statusCode).toBe(200);
      expect(response.body.result).toBe(15);
    });

    it('should handle multiplication with zero', async () => {
      const response = await request(app)
        .post('/api/multiply')
        .send({ a: 5, b: 0 });
      expect(response.statusCode).toBe(200);
      expect(response.body.result).toBe(0);
    });
  });

  describe('Divide', () => {
    it('should divide two numbers correctly', async () => {
      const response = await request(app)
        .post('/api/divide')
        .send({ a: 6, b: 3 });
      expect(response.statusCode).toBe(200);
      expect(response.body.result).toBe(2);
    });

    it('should handle division by zero', async () => {
      const response = await request(app)
        .post('/api/divide')
        .send({ a: 6, b: 0 });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Divide by zero');
    });
  });

  describe('Modulus', () => {
    it('should calculate modulus correctly', async () => {
      const response = await request(app)
        .post('/api/mod')
        .send({ a: 5, b: 3 });
      expect(response.statusCode).toBe(200);
      expect(response.body.result).toBe(2);
    });

    it('should handle modulus with zero divisor', async () => {
      const response = await request(app)
        .post('/api/mod')
        .send({ a: 5, b: 0 });
      expect(response.statusCode).toBe(200);
      expect(response.body.result).toBe("NaN");
    });
  });

  describe('Power', () => {
    it('should calculate power correctly', async () => {
      const response = await request(app)
        .post('/api/power')
        .send({ a: 2, b: 3 });
      expect(response.statusCode).toBe(200);
      expect(response.body.result).toBe(8);
    });

    it('should handle power of zero', async () => {
      const response = await request(app)
        .post('/api/power')
        .send({ a: 2, b: 0 });
      expect(response.statusCode).toBe(200);
      expect(response.body.result).toBe(1);
    });
  });

  describe('Square Root', () => {
    it('should calculate square root correctly', async () => {
      const response = await request(app)
        .post('/api/sqrt')
        .send({ a: 9 });
      expect(response.statusCode).toBe(200);
      expect(response.body.result).toBe(3);
    });

    it('should handle square root of zero', async () => {
      const response = await request(app)
        .post('/api/sqrt')
        .send({ a: 0 });
      expect(response.statusCode).toBe(200);
      expect(response.body.result).toBe(0);
    });

    it('should handle negative square root', async () => {
      const response = await request(app)
        .post('/api/sqrt')
        .send({ a: -9 });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Cannot compute square root of negative number');
    });
  });

  describe('Absolute', () => {
    it('should calculate absolute value correctly', async () => {
      const response = await request(app)
        .post('/api/absolute')
        .send({ a: -5 });
      expect(response.statusCode).toBe(200);
      expect(response.body.result).toBe(5);
    });

    it('should handle absolute value of positive number', async () => {
      const response = await request(app)
        .post('/api/absolute')
        .send({ a: 5 });
      expect(response.statusCode).toBe(200);
      expect(response.body.result).toBe(5);
    });
  });

  describe('Factorial', () => {
    it('should calculate factorial correctly', async () => {
      const response = await request(app)
        .post('/api/factorial')
        .send({ a: 5 });
      expect(response.statusCode).toBe(200);
      expect(response.body.result).toBe(120);
    });

    it('should handle factorial of 0', async () => {
      const response = await request(app)
        .post('/api/factorial')
        .send({ a: 0 });
      expect(response.statusCode).toBe(200);
      expect(response.body.result).toBe(1);
    });

    it('should throw error for negative input', async () => {
      const response = await request(app)
        .post('/api/factorial')
        .send({ a: -1 });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Cannot compute factorial of negative number');
    });
  });

  describe('Square', () => {
    it('should calculate square correctly', async () => {
      const response = await request(app)
        .post('/api/square')
        .send({ a: 4 });
      expect(response.statusCode).toBe(200);
      expect(response.body.result).toBe(16);
    });

    it('should calculate square of negative number correctly', async () => {
      const response = await request(app)
        .post('/api/square')
        .send({ a: -4 });
      expect(response.statusCode).toBe(200);
      expect(response.body.result).toBe(16);
    });
  });
});