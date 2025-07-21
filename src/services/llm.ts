import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const explanationCache = new Map<string, string>();

export async function getRiskExplanation(score: number, reasons: string[]): Promise<string> {
  const prompt = `A payment was evaluated for fraud risk. The risk score is ${score}. The following reasons contributed: ${reasons.length ? reasons.join(', ') : 'none'}. Write a short, clear explanation for a non-technical user about why this payment was routed or blocked.`;

  // Check cache first
  if (explanationCache.has(prompt)) {
    return explanationCache.get(prompt)!;
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 60,
      temperature: 0.7,
    });
    const explanation = response.choices[0].message?.content?.trim() || 'No explanation available.';
    explanationCache.set(prompt, explanation);
    return explanation;
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error('API Error:', error.message);
      if (error.status === 429) {
        console.error('Rate limit exceeded. Trying to get it from mock...');
        if (score < 0.2) {
          return 'This payment was routed due to a low risk score.';
        } else if (score < 0.5) {
          return `This payment was routed due to a moderately low risk score${reasons.length ? ' based on ' + reasons.join(' and ') : ''}.`;
        } else {
          return `This payment was blocked due to a high risk score${reasons.length ? ' based on ' + reasons.join(' and ') : ''}.`;
        }
      }
    }
    return 'A risk explanation could not be generated at this time.';
  }
} 