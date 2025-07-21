import { ChargeRequest, FraudScoreResult } from '../types';
import { fraudRules } from './fraudRules';

export function computeFraudScore(request: ChargeRequest): FraudScoreResult {
  let score = 0;
  const reasons: string[] = [];

  for (const rule of fraudRules) {
    const result = rule(request);
    score += result.score;
    if (result.reason) reasons.push(result.reason);
  }

  score = Math.min(1, parseFloat(score.toFixed(2)));
  return { score, reasons };
} 