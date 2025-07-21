import { computeFraudScore } from '../src/services/fraud';

describe('Fraud scoring', () => {
  it('should score low for small amount and safe domain', () => {
    const result = computeFraudScore({
      amount: 10,
      currency: 'USD',
      source: 'tok_test',
      email: 'user@gmail.com',
    });
    expect(result.score).toBeLessThan(0.5);
  });

  it('should score high for large amount', () => {
    const result = computeFraudScore({
      amount: 1000,
      currency: 'USD',
      source: 'tok_test',
      email: 'user@gmail.com',
    });
    expect(result.score).toBeGreaterThanOrEqual(0.4);
  });

  it('should score high for suspicious domain', () => {
    const result = computeFraudScore({
      amount: 10,
      currency: 'USD',
      source: 'tok_test',
      email: 'user@test.com',
    });
    expect(result.score).toBeGreaterThanOrEqual(0.4);
  });

  it('should score very high for both large amount and suspicious domain', () => {
    const result = computeFraudScore({
      amount: 1000,
      currency: 'USD',
      source: 'tok_test',
      email: 'user@test.com',
    });
    expect(result.score).toBeGreaterThanOrEqual(0.8);
  });
}); 