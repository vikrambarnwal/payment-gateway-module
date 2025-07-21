import { amountRule, domainRule, fraudRules } from '../src/services/fraudRules';
import { ChargeRequest } from '../src/types';

describe('Fraud Rules', () => {
  describe('amountRule', () => {
    it('returns score and reason for large amount', () => {
      const req: ChargeRequest = { amount: 1000, currency: 'USD', source: 'tok_test', email: 'user@gmail.com' };
      const result = amountRule(req);
      expect(result.score).toBe(0.4);
      expect(result.reason).toBe('Large amount');
    });
    it('returns 0 for small amount', () => {
      const req: ChargeRequest = { amount: 10, currency: 'USD', source: 'tok_test', email: 'user@gmail.com' };
      const result = amountRule(req);
      expect(result.score).toBe(0);
      expect(result.reason).toBeUndefined();
    });
  });

  describe('domainRule', () => {
    it('returns score and reason for suspicious domain', () => {
      const req: ChargeRequest = { amount: 10, currency: 'USD', source: 'tok_test', email: 'user@test.com' };
      const result = domainRule(req);
      expect(result.score).toBe(0.4);
      expect(result.reason).toBe('Suspicious email domain');
    });
    it('returns 0 for safe domain', () => {
      const req: ChargeRequest = { amount: 10, currency: 'USD', source: 'tok_test', email: 'user@gmail.com' };
      const result = domainRule(req);
      expect(result.score).toBe(0);
      expect(result.reason).toBeUndefined();
    });
  });

  describe('fraudRules array', () => {
    it('applies all rules and aggregates score/reasons', () => {
      const req: ChargeRequest = { amount: 1000, currency: 'USD', source: 'tok_test', email: 'user@test.com' };
      const results = fraudRules.map(rule => rule(req));
      const totalScore = results.reduce((sum, r) => sum + r.score, 0);
      const reasons = results.map(r => r.reason).filter(Boolean);
      expect(totalScore).toBe(0.8); // amountRule + domainRule
      expect(reasons).toContain('Large amount');
      expect(reasons).toContain('Suspicious email domain');
    });
  });
}); 