import { ChargeRequest } from '../types';
import fraudRulesConfig from '../config/fraudRules.json';

export type FraudRule = (req: ChargeRequest) => { score: number; reason?: string };

export const amountRule: FraudRule = (req) => {
  if (req.amount >= fraudRulesConfig.amountThreshold) {
    return { score: 0.4, reason: 'Large amount' };
  }
  return { score: 0 };
};

export const domainRule: FraudRule = (req) => {
  const domain = req.email.split('@')[1] || '';
  if (fraudRulesConfig.suspiciousDomains.some((d: string) => domain.endsWith(d))) {
    return { score: 0.4, reason: 'Suspicious email domain' };
  }
  return { score: 0 };
};

export const fraudRules: FraudRule[] = [amountRule, domainRule]; 