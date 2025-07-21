export interface ChargeRequest {
  amount: number;
  currency: string;
  source: string;
  email: string;
}

export interface ChargeResponse {
  transactionId: string;
  provider: string;
  status: 'success' | 'blocked';
  riskScore: number;
  explanation: string;
}

export interface TransactionLogEntry {
  timestamp: string;
  request: ChargeRequest;
  response: ChargeResponse;
}

export interface FraudScoreResult {
  score: number;
  reasons: string[];
} 