import 'dotenv/config';
import express from 'express';
import chargeRouter from './routes/charge';
import transactionsRouter from './routes/transactions';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';

const app = express();
app.use(express.json());

app.use(chargeRouter);
app.use(transactionsRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 