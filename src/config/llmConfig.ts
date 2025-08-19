// LLM Configuration File
// Update this file to connect to your preferred AI provider

import { LLMConfig } from '../services/llmService';

// OpenAI Configuration
export const openAIConfig: LLMConfig = {
  provider: 'openai',
  apiKey: process.env.REACT_APP_OPENAI_API_KEY || '', // Add your OpenAI API key to .env file
  model: 'gpt-4', // or 'gpt-3.5-turbo' for cost optimization
  temperature: 0.7,
  maxTokens: 1500
};

// Anthropic Configuration
export const anthropicConfig: LLMConfig = {
  provider: 'anthropic',
  apiKey: process.env.REACT_APP_ANTHROPIC_API_KEY || '', // Add your Anthropic API key to .env file
  model: 'claude-3-sonnet-20240229', // or 'claude-3-haiku-20240307' for cost optimization
  temperature: 0.7,
  maxTokens: 1500
};

// Local/Development Configuration
export const localConfig: LLMConfig = {
  provider: 'mock', // Uses mock service for development
  temperature: 0.7,
  maxTokens: 1500
};

// Production Configuration - Choose your preferred provider
export const productionConfig: LLMConfig = openAIConfig; // Change to anthropicConfig if preferred

// Development Configuration
export const developmentConfig: LLMConfig = localConfig;

// Current Configuration - Automatically selects based on environment
export const currentLLMConfig: LLMConfig = 
  process.env.NODE_ENV === 'production' ? productionConfig : developmentConfig;

// Environment Variables Template (.env file)
export const envTemplate = `
# LLM API Keys - Add these to your .env file
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
REACT_APP_ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional: Override default configuration
REACT_APP_LLM_PROVIDER=openai
REACT_APP_LLM_MODEL=gpt-4
REACT_APP_LLM_TEMPERATURE=0.7
REACT_APP_LLM_MAX_TOKENS=1500
`;

// Usage Instructions
export const setupInstructions = `
## LLM Setup Instructions

### 1. Choose Your AI Provider

**OpenAI (GPT-4)**
- Pros: Most advanced reasoning, excellent fitness knowledge
- Cons: Higher cost per request
- Best for: Production use, complex fitness questions

**Anthropic (Claude)**
- Pros: Excellent reasoning, safety-focused, good value
- Cons: Slightly less fitness-specific training
- Best for: Production use, balanced approach

**Mock Service (Development)**
- Pros: Free, instant responses, good for testing
- Cons: Limited intelligence, repetitive responses
- Best for: Development, testing, offline use

### 2. Get API Keys

**OpenAI:**
1. Visit https://platform.openai.com/
2. Create account and add billing
3. Generate API key in API Keys section
4. Add to .env file: REACT_APP_OPENAI_API_KEY=your_key

**Anthropic:**
1. Visit https://console.anthropic.com/
2. Create account and add billing
3. Generate API key in API Keys section
4. Add to .env file: REACT_APP_ANTHROPIC_API_KEY=your_key

### 3. Update Configuration

1. Copy .env.example to .env
2. Add your API keys
3. Choose your preferred provider
4. Restart the development server

### 4. Test the Integration

1. Complete your profile setup
2. Navigate to AI Coach
3. Ask a fitness question
4. Verify you get intelligent, contextual responses

### 5. Monitor Usage

- OpenAI: Check usage at https://platform.openai.com/usage
- Anthropic: Check usage at https://console.anthropic.com/
- Set up billing alerts to avoid unexpected charges

### 6. Customize Responses

Edit the system prompts in llmService.ts to:
- Adjust tone and style
- Add specific fitness principles
- Include your preferred citations
- Customize response length and detail
`;

// Cost Estimation
export const costEstimates = {
  openai: {
    'gpt-4': {
      input: 0.03, // per 1K tokens
      output: 0.06  // per 1K tokens
    },
    'gpt-3.5-turbo': {
      input: 0.0015, // per 1K tokens
      output: 0.002  // per 1K tokens
    }
  },
  anthropic: {
    'claude-3-sonnet': {
      input: 0.003,  // per 1K tokens
      output: 0.015  // per 1K tokens
    },
    'claude-3-haiku': {
      input: 0.00025, // per 1K tokens
      output: 0.00125 // per 1K tokens
    }
  }
};

// Example cost calculation
export const calculateCost = (provider: string, model: string, inputTokens: number, outputTokens: number) => {
  const costs = costEstimates[provider as keyof typeof costEstimates];
  if (!costs || !costs[model as keyof typeof costs]) return 'Unknown model';
  
  const modelCosts = costs[model as keyof typeof costs] as { input: number; output: number };
  const inputCost = (inputTokens / 1000) * modelCosts.input;
  const outputCost = (outputTokens / 1000) * modelCosts.output;
  const totalCost = inputCost + outputCost;
  
  return {
    inputCost: inputCost.toFixed(4),
    outputCost: outputCost.toFixed(4),
    totalCost: totalCost.toFixed(4),
    estimatedMonthly: (totalCost * 100).toFixed(2) // Assuming 100 requests per month
  };
};
