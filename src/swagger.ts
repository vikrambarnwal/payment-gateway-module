import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Payment Gateway Proxy API',
      version: '1.0.0',
      description: 'API documentation for the mini payment gateway proxy.'
    },
  },
  apis: [path.resolve(process.cwd(), 'src/routes/*.ts')],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec; 