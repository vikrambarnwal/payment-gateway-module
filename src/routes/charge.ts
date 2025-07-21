import { Router, Request, Response } from 'express';
import { ChargeRequest, ChargeResponse } from '../types';
import { computeFraudScore } from '../services/fraud';
import { getRiskExplanation } from '../services/llm';
import { addLog } from '../logger';
import { validateChargeRequest } from '../middleware/validateChargeRequest';

const router = Router();

/**
 * @swagger
 * /charge:
 *   post:
 *     summary: Simulate a payment charge
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *               source:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - amount
 *               - currency
 *               - source
 *               - email
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactionId:
 *                   type: string
 *                 provider:
 *                   type: string
 *                 status:
 *                   type: string
 *                 riskScore:
 *                   type: number
 *                 explanation:
 *                   type: string
 *       403:
 *         description: Payment blocked due to high risk
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactionId:
 *                   type: string
 *                 provider:
 *                   type: string
 *                 status:
 *                   type: string
 *                 riskScore:
 *                   type: number
 *                 explanation:
 *                   type: string
 *       400:
 *         description: Invalid request payload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/charge', validateChargeRequest, async (req: Request, res: Response) => {
  const { amount, currency, source, email } = req.body;
  const chargeRequest: ChargeRequest = { amount, currency, source, email };
  const { score, reasons } = computeFraudScore(chargeRequest);
  const explanation = await getRiskExplanation(score, reasons);

  let response: ChargeResponse;
  if (score < 0.5) {
    // Simulate provider selection
    const provider = Math.random() < 0.5 ? 'stripe' : 'paypal';
    response = {
      transactionId: `txn_${Math.random().toString(36).substr(2, 8)}`,
      provider,
      status: 'success',
      riskScore: score,
      explanation,
    };
  } else {
    response = {
      transactionId: '',
      provider: '',
      status: 'blocked',
      riskScore: score,
      explanation,
    };
  }

  addLog({
    timestamp: new Date().toISOString(),
    request: chargeRequest,
    response,
  });

  if (score < 0.5) {
    res.json(response);
  } else {
    res.status(403).json(response);
  }
});

export default router; 