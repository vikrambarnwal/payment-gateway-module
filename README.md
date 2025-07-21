# Payment Gateway Proxy

## Overview
This project is a mini payment gateway proxy that simulates routing payment requests to Stripe or PayPal based on a simple fraud risk score. It uses an LLM (OpenAI GPT-3.5-turbo) to generate a human-readable explanation of each decision, with a fallback to a simple explanation if the LLM is unavailable.

## Features
- **POST /charge**: Simulates a payment charge, computes fraud risk, routes or blocks, and returns a risk explanation.
- **GET /transactions**: Returns all transaction logs.
- In-memory transaction logging.
- Configurable fraud rules.
- Unit tests for fraud logic and endpoints.
- Modern TypeScript structure.
- **Swagger UI** at `/api-docs` for API documentation.

## Setup Instructions
1. Install dependencies:
   ```
   npm install
   ```
2. Create a `.env` file in the project root with your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-...
   ```
3. Run the server:
   ```
   npm start
   ```
4. Run tests:
   ```
   npm test
   ```

## Docker Usage

You can use Docker to build, run, stop, and remove the application container:

1. **Build the Docker image:**
   ```sh
   docker build -t payment-gateway-module .
   ```

2. **Run the container:**
   ```sh
   docker run -d -p 3000:3000 --name payment-gateway-module payment-gateway-module
   ```
   This maps port 3000 of the container to port 3000 on your host.

3. **Stop the container:**
   ```sh
   docker stop payment-gateway-module
   ```

4. **Remove the container:**
   ```sh
   docker rm payment-gateway-module
   ```

## Fraud Logic
- **Large Amount**: If the amount is greater than or equal to the configured threshold, the risk score increases.
- **Suspicious Domain**: If the email domain matches a suspicious domain, the risk score increases.
- **Random Factor**: A small random value is added for unpredictability.
- If the risk score is 0.5 or higher, the payment is blocked.

## LLM Usage
- The LLM (OpenAI GPT-3.5-turbo) generates a natural-language explanation for the risk score and decision.
- If the API key is not set or the LLM call fails, a simple fallback explanation is used.
- The LLM prompt includes the risk score and reasons for transparency.

## Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key for LLM explanations. If not set, fallback explanations are used.

## Assumptions & Tradeoffs
- LLM is used for explanations if available, otherwise a fallback is used for reliability.
- All data is stored in memory (no persistence).
- Fraud rules are loaded from a JSON config file.
- No authentication or rate limiting is implemented.

## Stretch Goals
- [x] GET /transactions endpoint
- [x] LLM prompt caching
- [x] Dockerize the app
- [x] Configurable fraud rules
