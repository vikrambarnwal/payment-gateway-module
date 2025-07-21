import { Router, Response } from 'express';
import { getLogs } from '../logger';

const router = Router();

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transaction logs
 *     responses:
 *       200:
 *         description: List of all transaction logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   timestamp:
 *                     type: string
 *                   request:
 *                     type: object
 *                     properties:
 *                       amount:
 *                         type: number
 *                       currency:
 *                         type: string
 *                       source:
 *                         type: string
 *                       email:
 *                         type: string
 *                   response:
 *                     type: object
 *                     properties:
 *                       transactionId:
 *                         type: string
 *                       provider:
 *                         type: string
 *                       status:
 *                         type: string
 *                       riskScore:
 *                         type: number
 *                       explanation:
 *                         type: string
 */
router.get('/transactions', (_, res: Response) => {
  res.json(getLogs());
});

export default router; 