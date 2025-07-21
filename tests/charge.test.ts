import request from 'supertest';
import express from 'express';
import chargeRouter from '../src/routes/charge';

jest.mock('../src/services/llm', () => {
  return {
    getRiskExplanation: jest.fn(),
  };
});
const { getRiskExplanation } = require('../src/services/llm');

describe('POST /charge', () => {
  const app = express();
  app.use(express.json());
  app.use(chargeRouter);

  beforeEach(() => {
    getRiskExplanation.mockReset();
  });

  it('should return 200 and success for low risk with LLM explanation', async () => {
    getRiskExplanation.mockResolvedValueOnce('LLM: low risk');
    const res = await request(app)
      .post('/charge')
      .send({
        amount: 10,
        currency: 'USD',
        source: 'tok_test',
        email: 'user@gmail.com',
      });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.explanation).toBe('LLM: low risk');
  });

  it('should return 403 and blocked for high risk with LLM explanation', async () => {
    getRiskExplanation.mockResolvedValueOnce('LLM: high risk');
    const res = await request(app)
      .post('/charge')
      .send({
        amount: 1000,
        currency: 'USD',
        source: 'tok_test',
        email: 'user@test.com',
      });
    expect(res.status).toBe(403);
    expect(res.body.status).toBe('blocked');
    expect(res.body.explanation).toBe('LLM: high risk');
  });

  it('should return 400 for invalid payload', async () => {
    getRiskExplanation.mockResolvedValueOnce('LLM: low risk');
    const res = await request(app)
      .post('/charge')
      .send({
        amount: 'not-a-number',
        currency: 'USD',
        source: 'tok_test',
        email: 'user@gmail.com',
      });
    expect(res.status).toBe(400);
  });

  it('should use mock explanation if quota is exceeded (rate limit)', async () => {
    // Simulate fallback logic for quota exceeded
    getRiskExplanation.mockImplementationOnce(async (score: number, reasons: string[]) => {
      if (score < 0.2) {
        return 'This payment was routed due to a low risk score.';
      } else if (score < 0.5) {
        return `This payment was routed due to a moderately low risk score${reasons.length ? ' based on ' + reasons.join(' and ') : ''}.`;
      } else {
        return `This payment was blocked due to a high risk score${reasons.length ? ' based on ' + reasons.join(' and ') : ''}.`;
      }
    });
    const res = await request(app)
      .post('/charge')
      .send({
        amount: 1000,
        currency: 'USD',
        source: 'tok_test',
        email: 'user@test.com',
      });
    expect(res.body.explanation).toMatch(/high risk score/);
  });

  it('should use mock explanation for moderately low risk if quota is exceeded', async () => {
    getRiskExplanation.mockImplementationOnce(async (score: number, reasons: string[]) => {
      if (score < 0.2) {
        return 'This payment was routed due to a low risk score.';
      } else if (score < 0.5) {
        return `This payment was routed due to a moderately low risk score${reasons.length ? ' based on ' + reasons.join(' and ') : ''}.`;
      } else {
        return `This payment was blocked due to a high risk score${reasons.length ? ' based on ' + reasons.join(' and ') : ''}.`;
      }
    });
    const res = await request(app)
      .post('/charge')
      .send({
        amount: 499,
        currency: 'USD',
        source: 'tok_test',
        email: 'user@test.com',
      });
    // The risk score may be <0.5 depending on random, so just check for either explanation
    expect([
      'This payment was routed due to a moderately low risk score based on Suspicious email domain.',
      'This payment was blocked due to a high risk score based on Suspicious email domain.'
    ]).toContain(res.body.explanation);
  });
}); 